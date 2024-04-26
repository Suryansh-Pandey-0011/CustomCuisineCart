const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');
const User = require('../models/Users');
const CartItem = require('../models/CartItem');


const exprssSession = require('express-session');
router.use(exprssSession({
    secret:'key',
    resave: true,
    saveUninitialized: true
}))

//Session Authentication
const auth = function(req, res, next){
    console.log(req.session.user)
    if(req.session.user){
        next()
    }
    else{
        res.redirect('/')
    }
}

//Logout button functionality
router.get('/logout', function(req, res){
    req.session.destroy()
    res.redirect('/')
    })

// Add route handler for FrontPage interface
router.get('/', (req, res) => {
    res.render('index');
});

// Add route handler for Sign-Up interface
router.get('/sign-up', (req, res) => {
    res.render('sign_up');
});

// Handle user signup
router.post('/signup', async (req, res) => {
    const { firstName, lastName, username, password, email, phone } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.render('sign_up',{error : "Username Already Exists"})
    }

    // Create a new user
    const newUser = new User({
        firstName,
        lastName,
        username,
        password,
        email,
        phone
    });

    await newUser.save();
    res.redirect('/');
});

// Add route handler for Sign-Up interface
router.get('/admin-login', (req, res) => {
    res.render('admin-login');
});

// Handle admin login
router.post('/adminlogin', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = "admin";
    if (!user) {
        return res.render('admin-login',{error : "Invalid username or password"})
    }

    // Check password
    if (password !== "suryansh@123") {
        return res.render('admin-login',{error : "Invalid password"})
    }

    req.session.user = username;

    // Redirect to  dashboard successful login
    res.redirect(`/admin`);
});

// Handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.render('index',{error : "Invalid username or password"})
    }

    // Check password
    if (password !== user.password) {
        return res.render('index',{error : "Invalid password"})
    }

    req.session.user = username;

    // Redirect to  dashboard successful login
    res.redirect(`/dashboard`);
});

// Define routes
router.get('/dashboard', auth, async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        const user = req.session.user;
        const existingUser = await User.findOne({ username: user });
        res.render('dashboard', { foodItems, existingUser });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Route to add item to cart
router.post('/addtocart', auth , async (req, res) => {
    const { name, quantity } = req.body;

    try {
        // Check if the user is authenticated
        if (!req.session.user) {
            return res.status(401).send('Unauthorized');
        }

        // Find the food item by name
        const foodItem = await FoodItem.findOne({ name });

        if (!foodItem) {
            return res.status(404).send('Food item not found');
        }

        // Check if the item is already in the user's cart
        const existingCartItem = await CartItem.findOne({ name, user: req.session.user });

        if (existingCartItem) {
            // If the item is already in the cart, update its quantity
            existingCartItem.quantity += parseInt(quantity);
            await existingCartItem.save();
        } else {
            // If the item is not in the cart, create a new cart item
            const cartItem = new CartItem({
                name: foodItem.name,
                quantity: parseInt(quantity),
                price: foodItem.price,
                user: req.session.user // Set the user field to the username
            });
            await cartItem.save();
        }

        // res.status(200).send('Item added to cart successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});// Add route handler for Add To Cart interface


//logic for searching items from database
router.get('/search', auth , async (req, res) => {
    try {
        const query = req.query.q; // Get the search query from the request query parameters
        
        // Find items in the database that match the search query or have matching tags
        const foodItems = await FoodItem.find({ $or: [{ name: { $regex: query, $options: 'i' } }, { tags: { $regex: query, $options: 'i' } }] });

        const user = req.session.user;
        const existingUser = await User.findOne({ username: user });
        res.render('dashboard', { foodItems, existingUser })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Route to render the cart page
router.get('/cart', auth , async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.session.user) {
            return res.status(401).send('Unauthorized');
        }
        
        // Find cart items associated with the authenticated user's username
        const cartItems = await CartItem.find({ user: req.session.user });
        let totalPrice = 0;
        cartItems.forEach(item => {
            totalPrice += item.quantity * item.price;
        });
        res.render('cart', { cartItems , totalPrice });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Add route handler for admin interface
router.get('/admin', auth , async (req, res) => {
    const foodItems = await FoodItem.find();
    res.render('admin' , { foodItems });
});

// Add route handler for adding a new food item
router.post('/admin/add', async (req, res) => {
    try {
        const { name, image, price, tags, category } = req.body;
        const newFoodItem = new FoodItem({ name, image, price, tags: tags.split(','), category });
        await newFoodItem.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to remove item from cart
router.get('/deletefromcart', async (req, res) => {
    const itemName = req.query.name;
    const username = req.session.user;

    try {
        // Find the cart item by its name and the username of the cart owner
        const removedItem = await CartItem.findOneAndDelete({ name: itemName, user: username });


        if (!removedItem) {
            res.redirect('/cart');
        }

        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Add more routes as needed

module.exports = router;
