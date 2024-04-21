document.addEventListener('DOMContentLoaded', function() {
    const togglebtn = document.querySelector('.toggle-btn');
    const togglebtnIcon = document.querySelector('.toggle-btn i');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    togglebtn.onclick = function(){
        dropdownMenu.classList.toggle('open');
        const isOpen = dropdownMenu.classList.contains('open');
    
        togglebtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    };
    
    let items = document.querySelectorAll(".slider-side .list .item");
    let next = document.getElementById('next');
    let ps = document.getElementById('ps');
    let prev = document.getElementById('prev');
    let thumbnails = document.querySelectorAll('.thumbnail .item');
    
    //config param
    
    let countItem = items.length;
    let itemsActive = 0;
    //event next click
    next.onclick = function(){
        itemsActive = itemsActive + 1;
        if(itemsActive >=  countItem){
            itemsActive=0;
        }
        showSlider();
    }
    //event prevous click
    prev.onclick = function(){
        itemsActive = itemsActive - 1;
        if(itemsActive <  0){
            itemsActive=countItem-1;
        }
        showSlider();
    }
    //auto slide
    let refreshInterval = setInterval(()=> {
        next.click();
    },5000)
    function showSlider(){
        //remove item active old
        let itemActiveOld = document.querySelector('.slider-side .list .item.active');
        let thumbActiveOld = document.querySelector('.thumbnail .item.active');
        itemActiveOld.classList.remove('active');
        thumbActiveOld.classList.remove('active');

        //active new item

        items[itemsActive].classList.add('active');
        thumbnails[itemsActive].classList.add('active');

        //clear auto sliding
        clearInterval(refreshInterval);
        refreshInterval = setInterval(()=> {
            next.click();
        },5000)
    }
    ps.onclick = function() {
        if (ps.innerHTML === "Stop") {
            ps.innerHTML = "Play";
            clearInterval(refreshInterval); // Stop auto sliding
        } else {
            ps.innerHTML = "Stop";
            // Start auto sliding
            refreshInterval = setInterval(() => {
                next.click();
            }, 5000);
        }
    };


    //click thumbnail
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', ()=>{
            itemsActive = index;
            showSlider();
        })
    })

    let items2 =document.querySelectorAll('.review_section .customer_slider .item2');
        let next2 = document.getElementById('next2');
        let prev2 = document.getElementById('prev2');

        let active = 3;
        function loadShow(){
            let stt = 0;

            items2[active].style.transform = `translate(-50%,-50%)`;
            items2[active].style.zIndex = 1;
            items2[active].style.filter = 'blur(0px)';
            items2[active].style.opacity = 1;

            //inside modification
            let itemContents = items2[active].querySelectorAll('.user_side, .review_side'); // Select both user_side and review_side
            itemContents.forEach(content => {
                content.style.filter = 'blur(0px)';
            });

            for(var i = active + 1; i < items2.length; i++){
                stt++;
                items2[i].style.transform = `translateX(${60 * stt}px) translateY(${-50}%) scaleX(${0.5*stt}) scale(${1 - 0.2*stt}) perspective(60px) rotateY(${-1*stt}deg)`;
                items2[i].style.zIndex = -stt;
                items2[i].style.filter = 'blur(5px)';
                items2[i].style.opacity = stt > 2 ? 0 : 0.5;

                //inside modification
                let itemContents = items2[i].querySelectorAll('.user_side, .review_side'); // Select both user_side and review_side
                itemContents.forEach(content => {
                    content.style.filter = 'blur(50px)';
                });
            }
            stt = 0;
            for(var i = active - 1; i >= 0; i--){
                stt++;
                items2[i].style.transform = `translateX(${(-60 * stt)-600}px) translateY(${-50}%) scaleX(${0.5*stt}) scale(${1 - 0.2*stt}) perspective(60px) rotateY(${1*stt}deg)`;
                items2[i].style.zIndex = -stt;
                items2[i].style.filter = 'blur(5px)';
                items2[i].style.opacity = stt > 2 ? 0 : 0.5;

                //inside modification
                let itemContents = items2[i].querySelectorAll('.user_side, .review_side'); // Select both user_side and review_side
                itemContents.forEach(content => {
                    content.style.filter = 'blur(50px)';
                });
            }
        }
        loadShow();
        next2.onclick = function(){
            active = active + 1 < items2.length ? active + 1 : active;
            loadShow();
        }
        prev2.onclick = function(){
            active = active - 1 >= 0 ? active - 1 : active;
            loadShow();
        }

        let login = document.getElementById('Login_from_slider');
        let slider = document.getElementById('Login_from_login');
        var slider_side = document.querySelector('.slider-side');
        var login_side = document.querySelector('.login-side');
        login.addEventListener("click",()=>{
            login_side.style.width = `${100}%`;
            login_side.style.display = 'flex';
            slider_side.style.width = `${0}%`;
        })
        slider.addEventListener("click",()=>{
            login_side.style.width = `${0}%`;
            slider_side.style.display = 'flex';
            slider_side.style.width = `${100}%`;
        })

        let reason_image = document.querySelectorAll('.reason_img');
        let reason_details = document.querySelectorAll('.Details');
        let reason_side = document.querySelectorAll('.reason-side'); // Corrected class name

        for (var i = 0; i < reason_image.length; i++) {
            (function(index) {
                reason_image[index].addEventListener("click", function() {
                    this.style.display = 'none';
                    reason_details[index].style.display = 'none';
                    reason_side[index].style.display = 'flex';
                    reason_side[index].style.flexDirection = 'column';
                });
            })(i);
        }


});
