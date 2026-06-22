document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksArray = document.querySelectorAll('.nav-links li a');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Handle Active Navigation Tabs on Click
    navLinksArray.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active from all links
            navLinksArray.forEach(lnk => lnk.classList.remove('active'));
            // Add active to clicked link
            link.classList.add('active');

            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // 2. Navigation Active State Track on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 3. Showcase Grid Filter Logic (Blender scene outliner)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animating cards out and filtering
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
                }, 250);
            });
        });
    });

    // 4. Modifier Skill Value Bar Animation
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.modifier-value-fill');

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const widthVal = bar.getAttribute('data-width');
                    bar.style.width = widthVal;
                });
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        root: null,
        threshold: 0.15
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // 5. Render/Export Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Initiating Export...';
            submitBtn.style.background = '#444';
            submitBtn.style.color = 'var(--orange-active)';
            
            setTimeout(() => {
                submitBtn.textContent = 'Render Successfully Exported!';
                submitBtn.style.background = '#2eb85c';
                submitBtn.style.color = '#fff';
                submitBtn.style.boxShadow = '0 0 15px rgba(46, 184, 92, 0.3)';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = 'var(--orange-active)';
                    submitBtn.style.color = 'var(--bg-darker)';
                    submitBtn.style.boxShadow = 'none';
                }, 3000);
            }, 1500);
        });
    }
});
