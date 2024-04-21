const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FoodItem = require('../models/FoodItem');
const User = require('../models/Users');


const exprssSession = require('express-session');
router.use(exprssSession({
    secret:'key',
    resave: true,
    saveUninitialized: true
}))
const auth = function(req, res, next){
    console.log(req.session.user)
    if(req.session.user){
        next()
    }
    else{
        res.send('Please login to check your profile')
    }
}

router.get('/logout', function(req, res){
    req.session.destroy()
    res.send("Logged out")
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
        return res.status(400).send("Username already exists" );
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

// Handle user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    // Check password
    if (password !== user.password) {
        return res.status(401).send('Invalid password');
    }

    req.session.user = username;

    // Redirect to  dashboard successful login
    res.redirect(`/dashboard`);
});

// Define routes
router.get('/dashboard', auth , async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.render('dashboard', { foodItems });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add route handler for admin interface
router.get('/admin', (req, res) => {
    res.render('admin');
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


// Add more routes as needed

module.exports = router;
