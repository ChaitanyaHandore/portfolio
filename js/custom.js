$(document).ready(function() {
			$('#fullpage').fullpage({
				'verticalCentered': false,
				'scrollingSpeed': 600,
				'autoScrolling': false,
				'css3': true,
				'navigation': true,
				'navigationPosition': 'right',
			});

    // Enhanced text rotation
    $(".rotate").textrotator({
        animation: "dissolve", // you can use "dissolve", "fade", "flip", "flipUp", "flipCube", "flipCubeUp" or "spin"
        separator: ",",
        speed: 3000 // How many milliseconds until the next word shows
    });

    // Initialize WOW.js with custom options
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,        // distance to the element when triggering the animation
        mobile: true,       // trigger animations on mobile devices
        live: true,         // act on asynchronously loaded content
        callback: function(box) {
            // the callback is fired every time an animation is started
            // the argument that is passed in is the DOM node being animated
        },
        scrollContainer: null // optional scroll container selector
    }).init();

    // Add animation classes to elements
    $('.media').addClass('wow fadeInUp');
    $('.portfolio-thumb').addClass('wow fadeIn');
    $('.progress').addClass('wow slideInLeft');
    
    // Smooth scroll for internal links
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        var target = $(this.getAttribute('href'));
        if(target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });

    // Portfolio filtering system
    const $portfolioContainer = $('.portfolio-container');
    const $filterButtons = $('.filter-btn');

    $filterButtons.on('click', function() {
        const filterValue = $(this).attr('data-filter');
        
        // Update active button state
        $filterButtons.removeClass('active');
        $(this).addClass('active');

        // Filter items
        if (filterValue === 'all') {
            $('.portfolio-item').fadeIn(300);
        } else {
            $('.portfolio-item').hide();
            $(`.portfolio-item[data-category="${filterValue}"]`).fadeIn(300);
        }
    });

    // Portfolio item hover effect
    $('.portfolio-item').hover(
        function() {
            $(this).find('.portfolio-overlay').fadeIn(300);
        },
        function() {
            $(this).find('.portfolio-overlay').fadeOut(300);
        }
    );

    // Portfolio modal
    $('.portfolio-item').click(function() {
        const title = $(this).data('title');
        const category = $(this).data('category');
        const image = $(this).find('img').attr('src');
        const description = $(this).data('description');
        const link = $(this).data('link');

        // Populate modal with project data
        $('#portfolioModal .modal-title').text(title);
        $('#portfolioModal .modal-category').text(category);
        $('#portfolioModal .modal-image').attr('src', image);
        $('#portfolioModal .modal-description').text(description);
        $('#portfolioModal .modal-link').attr('href', link);

        // Show modal
        $('#portfolioModal').fadeIn(300);
    });

    // Close modal
    $('.modal-close, .modal-backdrop').click(function() {
        $('#portfolioModal').fadeOut(300);
    });

    // Prevent modal close when clicking inside modal content
    $('.modal-content').click(function(e) {
        e.stopPropagation();
    });

    // Initialize portfolio masonry layout
    $portfolioContainer.imagesLoaded(function() {
        $portfolioContainer.masonry({
            itemSelector: '.portfolio-item',
            columnWidth: '.portfolio-item',
            percentPosition: true
        });
    });

    // Skills Animation
    function animateSkills() {
        $('.progress-bar').each(function() {
            const bar = $(this);
            const percentage = bar.data('progress');
            
            bar.css('width', '0%')
               .animate({
                   width: percentage + '%'
               }, {
                   duration: 1000,
                   easing: 'easeInOutQuart',
                   complete: function() {
                       bar.find('.progress-value').fadeIn(400);
                   }
               });
        });
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element[0].getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Initialize progress bars when scrolled into view
    let skillsAnimated = false;
    $(window).on('scroll resize', function() {
        const $skills = $('#skills .progress');
        if (!skillsAnimated && $skills.length && isInViewport($skills)) {
            animateSkills();
            skillsAnimated = true;
        }
    });

    // Add skill bar styles
    const skillStyles = $('<style>', {
        text: `
            .progress {
                height: 6px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 3px;
                margin-bottom: 30px;
                position: relative;
                overflow: visible;
            }

            .progress-bar {
                background: #D43F52;
                height: 100%;
                width: 0;
                border-radius: 3px;
                transition: width 1s ease;
                position: relative;
            }

            .progress-title {
                position: absolute;
                top: -25px;
                left: 0;
                color: #fff;
                font-size: 14px;
            }

            .progress-value {
                position: absolute;
                right: 0;
                top: -25px;
                color: #D43F52;
                font-weight: bold;
                display: none;
            }

            .progress-bar::after {
                content: '';
                position: absolute;
                right: -4px;
                top: -2px;
                width: 10px;
                height: 10px;
                background: #D43F52;
                border-radius: 50%;
                border: 2px solid #fff;
            }

            @keyframes skillPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            .progress:hover .progress-bar::after {
                animation: skillPulse 1s infinite;
            }
        `
    }).appendTo('head');

    // Reset animation when leaving section (optional)
    $('#fullpage').on('onLeave', function(index, nextIndex, direction) {
        if (index == 3 && direction == 'up') { // Assuming skills section is index 3
            skillsAnimated = false;
        }
    });

    // Add hover effect to skill bars
    $('.progress').hover(
        function() {
            $(this).find('.progress-bar').addClass('progress-bar-hover');
        },
        function() {
            $(this).find('.progress-bar').removeClass('progress-bar-hover');
        }
    );

    // Contact Form Validation and Submission
    const contactForm = $('#contactForm');
    const submitBtn = $('#submitBtn');

    // Form validation
    contactForm.on('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();
        
        // Reset previous errors
        $('.error-message').remove();
        $('.form-control').removeClass('error');
        
        // Validate inputs
        let isValid = true;
        
        if (!name) {
            showError('#name', 'Please enter your name');
            isValid = false;
        }
        
        if (!email) {
            showError('#email', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('#email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!message) {
            showError('#message', 'Please enter your message');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            submitBtn.prop('disabled', true)
                    .html('<i class="fas fa-spinner fa-spin"></i> Sending...');
            
            // Simulate form submission (replace with actual AJAX call)
            setTimeout(function() {
                // Success message
                contactForm.html(`
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you for your message!</h3>
                        <p>I'll get back to you soon.</p>
                    </div>
                `);
                
                // Reset form after 5 seconds
                setTimeout(function() {
                    contactForm[0].reset();
                    submitBtn.prop('disabled', false)
                            .html('Send Message');
                    $('.success-message').fadeOut(300, function() {
                        $(this).remove();
                    });
                }, 5000);
                
            }, 1500);
        }
    });
    
    // Helper functions
    function showError(field, message) {
        $(field).addClass('error')
                .after(`<div class="error-message">${message}</div>`);
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Real-time validation
    $('.form-control').on('input', function() {
        $(this).removeClass('error');
        $(this).next('.error-message').remove();
    });
    
    // Character counter for message
    $('#message').on('input', function() {
        const maxLength = 500;
        const remaining = maxLength - $(this).val().length;
        
        if (!$('#char-counter').length) {
            $(this).after(`<div id="char-counter" class="char-counter"></div>`);
        }
        
        $('#char-counter').html(`${remaining} characters remaining`);
        
        if (remaining < 50) {
            $('#char-counter').addClass('warning');
        } else {
            $('#char-counter').removeClass('warning');
        }
    });

    // Create scroll-to-top button
    const scrollTopBtn = $('<button>', {
        class: 'scroll-top-btn',
        html: '<i class="fas fa-arrow-up"></i>'
    }).appendTo('body');

    // Show/hide scroll-to-top button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollTopBtn.addClass('show');
        } else {
            scrollTopBtn.removeClass('show');
        }
    });

    // Smooth scroll to top
    scrollTopBtn.click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Add CSS for scroll-to-top button
    const style = $('<style>', {
        text: `
            .scroll-top-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #D43F52;
                color: white;
                border: none;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            .scroll-top-btn:hover {
                background: #c63648;
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            .scroll-top-btn.show {
                opacity: 1;
                visibility: visible;
            }

            .scroll-top-btn i {
                font-size: 20px;
            }
        `
    }).appendTo('head');

    // Preloader
    const preloader = $('<div>', {
        class: 'preloader',
        html: `
            <div class="loader">
                <svg viewBox="0 0 80 80">
                    <circle id="test" cx="40" cy="40" r="32"></circle>
                </svg>
            </div>
            <div class="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                </svg>
            </div>
            <div class="loader">
                <svg viewBox="0 0 80 80">
                    <rect x="8" y="8" width="64" height="64"></rect>
                </svg>
            </div>
        `
    }).prependTo('body');

    // Add preloader styles
    const preloaderStyles = $('<style>', {
        text: `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }

            .preloader.fade-out {
                opacity: 0;
            }

            .loader {
                --path: #D43F52;
                --dot: #D43F52;
                --duration: 3s;
                width: 44px;
                height: 44px;
                position: relative;
                margin: 0 16px;
            }

            .loader:before {
                content: '';
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                display: block;
                background: var(--dot);
                top: 37px;
                left: 19px;
                transform: translate(-18px, -18px);
                animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
            }

            .loader svg {
                display: block;
                width: 100%;
                height: 100%;
            }

            .loader svg rect,
            .loader svg polygon,
            .loader svg circle {
                fill: none;
                stroke: var(--path);
                stroke-width: 10px;
                stroke-linejoin: round;
                stroke-linecap: round;
            }

            .loader svg polygon {
                stroke-dasharray: 145 76 145 76;
                stroke-dashoffset: 0;
                animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
            }

            .loader svg rect {
                stroke-dasharray: 192 64 192 64;
                stroke-dashoffset: 0;
                animation: pathRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
            }

            .loader svg circle {
                stroke-dasharray: 150 50 150 50;
                stroke-dashoffset: 75;
                animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
            }

            @keyframes pathTriangle {
                33% {
                    stroke-dashoffset: 74;
                }
                66% {
                    stroke-dashoffset: 147;
                }
                100% {
                    stroke-dashoffset: 221;
                }
            }

            @keyframes pathRect {
                33% {
                    stroke-dashoffset: 64;
                }
                66% {
                    stroke-dashoffset: 128;
                }
                100% {
                    stroke-dashoffset: 192;
                }
            }

            @keyframes pathCircle {
                33% {
                    stroke-dashoffset: 25;
                }
                66% {
                    stroke-dashoffset: 125;
                }
                100% {
                    stroke-dashoffset: 125;
                }
            }

            @keyframes dotRect {
                33% {
                    transform: translate(0, 0);
                }
                66% {
                    transform: translate(18px, -18px);
                }
                100% {
                    transform: translate(-18px, -18px);
                }
            }
        `
    }).appendTo('head');

    // Hide preloader when page is loaded
    $(window).on('load', function() {
        setTimeout(function() {
            preloader.addClass('fade-out');
            setTimeout(function() {
                preloader.remove();
            }, 500);
        }, 1000);
    });

    // Add particles container
    $('<div id="particles-js"></div>').prependTo('body');

    // Add particles styling
    const particleStyles = $('<style>', {
        text: `
            #particles-js {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                pointer-events: none;
            }
        `
    }).appendTo('head');

    // Initialize particles
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#D43F52"
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5,
                random: false,
                animation: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                animation: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#D43F52",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Ensure particles canvas is behind content
    $('section, .navbar, .preloader').css('position', 'relative');
    $('section, .navbar, .preloader').css('z-index', '1');

    // Image Loading Animation
    function initImageLoading() {
        // Add loading placeholder to all images
        $('img').each(function() {
            const img = $(this);
            const wrapper = $('<div class="image-wrapper loading"></div>');
            img.wrap(wrapper);
            
            // Create loading animation
            const loader = $('<div class="image-loader"><div class="loader-spinner"></div></div>');
            img.before(loader);
            
            // Remove loading state when image loads
            img.on('load', function() {
                const wrapper = $(this).parent('.image-wrapper');
                wrapper.removeClass('loading');
                wrapper.find('.image-loader').fadeOut(300, function() {
                    $(this).remove();
                });
            });
        });
    }

    // Add required styles
    const loaderStyles = $('<style>', {
        text: `
            .image-wrapper {
                position: relative;
                overflow: hidden;
            }

            .image-wrapper.loading img {
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .image-wrapper img {
                opacity: 1;
            }

            .image-loader {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.1);
            }

            .loader-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #D43F52;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `
    }).appendTo('head');

    // Initialize image loading
    initImageLoading();

    // Handle dynamically added images
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                $(mutation.addedNodes).find('img').each(function() {
                    if (!$(this).parent('.image-wrapper').length) {
                        const wrapper = $('<div class="image-wrapper loading"></div>');
                        $(this).wrap(wrapper);
                        const loader = $('<div class="image-loader"><div class="loader-spinner"></div></div>');
                        $(this).before(loader);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Create custom cursor elements with simpler initial styling
    const cursor = $('<div class="custom-cursor"></div>');
    const cursorDot = $('<div class="cursor-dot"></div>');
    $('body').append(cursor).append(cursorDot);

    // Add basic cursor styles
    const cursorStyles = $('<style>', {
        text: `
            * {
                cursor: none !important;
            }
            
            .custom-cursor {
                width: 20px;
                height: 20px;
                background-color: rgba(212, 63, 82, 0.5);
                border: 2px solid #D43F52;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s, background-color 0.3s;
            }

            .cursor-dot {
                width: 4px;
                height: 4px;
                background-color: #D43F52;
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
            }

            .custom-cursor.hover {
                width: 40px;
                height: 40px;
                background-color: rgba(212, 63, 82, 0.2);
            }
        `
    }).appendTo('head');

    // Update cursor position
    $(document).mousemove(function(e) {
        requestAnimationFrame(() => {
            cursor.css({
                'left': e.clientX + 'px',
                'top': e.clientY + 'px'
            });
            cursorDot.css({
                'left': e.clientX + 'px',
                'top': e.clientY + 'px'
            });
        });
    });

    // Add hover effect to interactive elements
    $('a, button, .portfolio-item, input, textarea').hover(
        function() {
            cursor.addClass('hover');
        },
        function() {
            cursor.removeClass('hover');
        }
    );

    // Hide cursor when leaving window
    $(window).on('mouseleave', function() {
        cursor.hide();
        cursorDot.hide();
    });

    // Show cursor when entering window
    $(window).on('mouseenter', function() {
        cursor.show();
        cursorDot.show();
    });

    // Create loading overlay
    const loadingOverlay = $('<div class="page-loading">' +
        '<div class="loading-content">' +
            '<div class="loading-spinner"></div>' +
            '<div class="loading-progress">' +
                '<div class="progress-bar"></div>' +
            '</div>' +
            '<div class="loading-text">Loading...</div>' +
        '</div>' +
    '</div>');

    // Add loading overlay styles
    const loadingStyles = $('<style>', {
        text: `
            .page-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .loading-content {
                text-align: center;
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid #333;
                border-top: 3px solid #D43F52;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
            }

            .loading-progress {
                width: 200px;
                height: 3px;
                background: #333;
                margin: 20px auto;
                position: relative;
                overflow: hidden;
            }

            .progress-bar {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 0%;
                background: #D43F52;
                transition: width 0.3s ease;
            }

            .loading-text {
                color: #fff;
                font-size: 16px;
                margin-top: 10px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `
    }).appendTo('head');

    // Add loading overlay to body
    $('body').prepend(loadingOverlay);

    // Track loading progress
    let progress = 0;
    const progressBar = loadingOverlay.find('.progress-bar');
    const loadingText = loadingOverlay.find('.loading-text');

    // Simulate loading progress
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        progressBar.css('width', progress + '%');
        loadingText.text(`Loading... ${Math.round(progress)}%`);

        if (progress === 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                loadingOverlay.fadeOut(500, function() {
                    $(this).remove();
                });
            }, 500);
        }
    }, 500);

    // Ensure overlay is removed if loading takes too long
    setTimeout(() => {
        clearInterval(progressInterval);
        loadingOverlay.fadeOut(500, function() {
            $(this).remove();
        });
    }, 5000);

    // Track actual page load
    $(window).on('load', function() {
        progress = 100;
        progressBar.css('width', '100%');
        loadingText.text('Loading... 100%');
        
        setTimeout(() => {
            loadingOverlay.fadeOut(500, function() {
                $(this).remove();
            });
        }, 500);
    });

    // Smooth scroll and nav highlight
    const sections = $('section');
    const navLinks = $('.navbar-nav a');
    
    // Smooth scroll to section
    navLinks.on('click', function(e) {
        e.preventDefault();
        
        const targetId = $(this).attr('href');
        const targetSection = $(targetId);
        
        if (targetSection.length) {
            // Add loading animation to clicked link
            $(this).append('<span class="nav-loading"></span>');
            
            $('html, body').animate({
                scrollTop: targetSection.offset().top - 70 // Adjust for navbar height
            }, {
                duration: 1000,
                easing: 'easeInOutCubic',
                complete: function() {
                    // Remove loading animation
                    $('.nav-loading').remove();
                }
            });
        }
    });
    
    // Add nav highlight styles
    const navStyles = $('<style>', {
        text: `
            .navbar-nav a {
                position: relative;
                transition: color 0.3s ease;
            }
            
            .navbar-nav a::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 0;
                height: 2px;
                background: #D43F52;
                transition: width 0.3s ease;
            }
            
            .navbar-nav a.active::after {
                width: 100%;
            }
            
            .nav-loading {
                position: absolute;
                top: 50%;
                right: -20px;
                width: 10px;
                height: 10px;
                border: 2px solid #D43F52;
                border-top-color: transparent;
                border-radius: 50%;
                animation: navSpin 0.6s linear infinite;
            }
            
            @keyframes navSpin {
                to { transform: rotate(360deg); }
            }
        `
    }).appendTo('head');
    
    // Update active nav link on scroll
    $(window).on('scroll', function() {
        let currentSection = '';
        
        sections.each(function() {
            const sectionTop = $(this).offset().top - 100; // Adjust threshold
            const sectionBottom = sectionTop + $(this).height();
            
            if ($(window).scrollTop() >= sectionTop && $(window).scrollTop() < sectionBottom) {
                currentSection = '#' + $(this).attr('id');
            }
        });
        
        navLinks.removeClass('active');
        $(`.navbar-nav a[href="${currentSection}"]`).addClass('active');
    });
    
    // Trigger scroll event on page load
    $(window).trigger('scroll');
    
    // Add scroll progress indicator
    const progressIndicator = $('<div class="scroll-progress"></div>');
    $('body').append(progressIndicator);
    
    // Add progress indicator styles
    const progressStyles = $('<style>', {
        text: `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0;
                height: 3px;
                background: #D43F52;
                z-index: 1000;
                transition: width 0.1s ease;
            }
        `
    }).appendTo('head');
    
    // Update progress bar on scroll
    $(window).on('scroll', function() {
        const windowHeight = $(document).height() - $(window).height();
        const progress = ($(window).scrollTop() / windowHeight) * 100;
        progressIndicator.css('width', progress + '%');
    });

    // Create mobile menu button
    const menuBtn = $('<button>', {
        class: 'mobile-menu-btn',
        html: '<span></span><span></span><span></span>'
    }).prependTo('.navbar');

    // Add navigation styles
    const navStyles = $('<style>', {
        text: `
            .navbar {
                transition: background 0.3s ease;
            }

            .navbar.scrolled {
                background: rgba(0, 0, 0, 0.95);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                padding: 15px;
                cursor: pointer;
                position: relative;
                z-index: 1000;
            }

            .mobile-menu-btn span {
                display: block;
                width: 25px;
                height: 2px;
                background: #fff;
                margin: 5px 0;
                transition: all 0.3s ease;
            }

            .mobile-menu-btn.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }

            .mobile-menu-btn.active span:nth-child(2) {
                opacity: 0;
            }

            .mobile-menu-btn.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -7px);
            }

            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }

                .navbar-nav {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 250px;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    padding: 80px 20px 20px;
                    transition: right 0.3s ease;
                    z-index: 999;
                }

                .navbar-nav.active {
                    right: 0;
                }

                .navbar-nav a {
                    display: block;
                    padding: 15px 0;
                    text-align: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
            }
        `
    }).appendTo('head');

    // Toggle mobile menu
    menuBtn.click(function() {
        $(this).toggleClass('active');
        $('.navbar-nav').toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.navbar').length) {
            menuBtn.removeClass('active');
            $('.navbar-nav').removeClass('active');
        }
    });

    // Add scrolled class to navbar
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // Close mobile menu when clicking nav links
    $('.navbar-nav a').click(function() {
        menuBtn.removeClass('active');
        $('.navbar-nav').removeClass('active');
    });

    // Add nav items animation
    $('.navbar-nav a').each(function(i) {
        $(this).css({
            'animation-delay': (i * 0.1) + 's'
        });
    });

    // Add resize handler
    $(window).resize(function() {
        if ($(window).width() > 768) {
            menuBtn.removeClass('active');
            $('.navbar-nav').removeClass('active');
        }
    });

    // Create testimonial slider
    const testimonialSlider = $('<div class="testimonial-slider"></div>');
    const testimonialWrapper = $('<div class="testimonial-wrapper"></div>');
    const testimonialControls = $(`
        <div class="testimonial-controls">
            <button class="prev-testimonial"><i class="fas fa-chevron-left"></i></button>
            <div class="testimonial-dots"></div>
            <button class="next-testimonial"><i class="fas fa-chevron-right"></i></button>
        </div>
    `);

    // Sample testimonials (replace with your actual testimonials)
    const testimonials = [
        {
            text: "Working with this team was an absolute pleasure. They delivered exactly what we needed.",
            author: "John Doe",
            position: "CEO, Tech Corp",
            image: "path/to/image1.jpg"
        },
        {
            text: "Exceptional service and outstanding results. Highly recommended!",
            author: "Jane Smith",
            position: "Marketing Director",
            image: "path/to/image2.jpg"
        },
        {
            text: "The attention to detail and professional approach was impressive.",
            author: "Mike Johnson",
            position: "Project Manager",
            image: "path/to/image3.jpg"
        }
    ];

    // Add testimonial styles
    const testimonialStyles = $('<style>', {
        text: `
            .testimonial-slider {
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 0;
            }

            .testimonial-wrapper {
                position: relative;
                overflow: hidden;
                height: 300px;
            }

            .testimonial-item {
                position: absolute;
                width: 100%;
                top: 0;
                left: 0;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.5s ease;
                text-align: center;
                padding: 20px;
            }

            .testimonial-item.active {
                opacity: 1;
                transform: translateX(0);
            }

            .testimonial-item.prev {
                transform: translateX(-100%);
            }

            .testimonial-text {
                font-size: 18px;
                line-height: 1.6;
                color: #fff;
                margin-bottom: 20px;
            }

            .testimonial-author {
                margin-top: 20px;
            }

            .testimonial-author-img {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                margin: 0 auto 10px;
                border: 3px solid #D43F52;
            }

            .testimonial-author-name {
                font-size: 18px;
                color: #D43F52;
                margin-bottom: 5px;
            }

            .testimonial-author-position {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
            }

            .testimonial-controls {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 30px;
            }

            .prev-testimonial,
            .next-testimonial {
                background: none;
                border: 2px solid #D43F52;
                color: #D43F52;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .prev-testimonial:hover,
            .next-testimonial:hover {
                background: #D43F52;
                color: #fff;
            }

            .testimonial-dots {
                display: flex;
                justify-content: center;
                margin: 0 20px;
            }

            .dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(212, 63, 82, 0.3);
                margin: 0 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .dot.active {
                background: #D43F52;
            }
        `
    }).appendTo('head');

    // Build testimonial slider
    testimonials.forEach((testimonial, index) => {
        const testimonialItem = $(`
            <div class="testimonial-item ${index === 0 ? 'active' : ''}">
                <div class="testimonial-text">${testimonial.text}</div>
                <div class="testimonial-author">
                    <div class="testimonial-author-img" style="background-image: url(${testimonial.image})"></div>
                    <div class="testimonial-author-name">${testimonial.author}</div>
                    <div class="testimonial-author-position">${testimonial.position}</div>
                </div>
            </div>
        `);
        testimonialWrapper.append(testimonialItem);

        // Add dot
        $('.testimonial-dots').append(`<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`);
    });

    testimonialSlider.append(testimonialWrapper).append(testimonialControls);
    $('#testimonials .container').append(testimonialSlider);

    // Slider functionality
    let currentSlide = 0;
    const slideCount = testimonials.length;

    function goToSlide(index) {
        if (index < 0) index = slideCount - 1;
        if (index >= slideCount) index = 0;

        $('.testimonial-item').removeClass('active prev');
        $('.testimonial-item').eq(currentSlide).addClass('prev');
        $('.testimonial-item').eq(index).addClass('active');
        
        $('.dot').removeClass('active');
        $('.dot').eq(index).addClass('active');

        currentSlide = index;
    }

    // Event listeners
    $('.next-testimonial').click(() => goToSlide(currentSlide + 1));
    $('.prev-testimonial').click(() => goToSlide(currentSlide - 1));
    $('.dot').click(function() {
        goToSlide($(this).data('index'));
    });

    // Auto-advance slides
    let slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

    // Pause auto-advance on hover
    testimonialSlider.hover(
        () => clearInterval(slideInterval),
        () => slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000)
    );
});

// wow
$(function()
{
    new WOW().init();
    $(".rotate").textrotator();
})