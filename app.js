document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li a');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Close menu when clicking link
    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                burger.classList.remove('toggle');
            }
        });
    });

    // 2. Sticky Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Showcase Grid Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to current button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade out animation first
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });

    // 4. Skills Bar Animation on Scroll/Intersection
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.skill-bar-fill');

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const widthVal = bar.getAttribute('data-width');
                    bar.style.width = widthVal;
                });
                // Once animated, we don't need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        root: null, // Viewport
        threshold: 0.15 // Trigger when 15% of section is visible
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 5. Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Transmission Sending...';
            submitBtn.style.background = 'var(--secondary)';
            
            setTimeout(() => {
                submitBtn.textContent = 'Transmission Successful!';
                submitBtn.style.background = '#4cd137';
                submitBtn.style.boxShadow = '0 0 25px rgba(76, 209, 55, 0.4)';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'var(--primary)';
                    submitBtn.style.boxShadow = '0 0 20px var(--primary-glow)';
                }, 3000);
            }, 1500);
        });
    }
});
