document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Sidebar Collapse & Active States
    // ==========================================
    const sidebar = document.getElementById('scene-outliner');
    const toggleSidebarBtn = document.getElementById('toggle-outliner-btn');
    const outlinerItems = document.querySelectorAll('.outliner-item');
    const navLinksArray = document.querySelectorAll('.nav-links li a');

    // Sidebar Toggler
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            // Toggle label styling
            if (sidebar.classList.contains('closed')) {
                toggleSidebarBtn.textContent = '[Show Outliner]';
                toggleSidebarBtn.style.color = 'var(--text-dark)';
            } else {
                toggleSidebarBtn.textContent = '[Hide Outliner]';
                toggleSidebarBtn.style.color = 'var(--orange-active)';
            }
            // Trigger resize of viewport canvas on layout changes
            setTimeout(resizeCanvas, 310);
        });
    }

    // Outliner Scrolling & Highlight Sync
    outlinerItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all outliner items
            outlinerItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Sync with gallery cards specifically
            const itemTarget = item.getAttribute('data-item');
            if (itemTarget) {
                // Clear existing highlights
                document.querySelectorAll('.gallery-card').forEach(card => card.classList.remove('active-target'));
                
                let targetCard = null;
                if (itemTarget === 'island') targetCard = document.getElementById('card-island');
                if (itemTarget === 'chest') targetCard = document.getElementById('card-chest');
                if (itemTarget === 'dungeon') targetCard = document.getElementById('card-dungeon');

                if (targetCard) {
                    setTimeout(() => {
                        targetCard.classList.add('active-target');
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 500);
                }
            }
        });
    });

    // Mobile Navbar burger
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    navLinksArray.forEach(link => {
        link.addEventListener('click', () => {
            navLinksArray.forEach(lnk => lnk.classList.remove('active'));
            link.classList.add('active');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // ==========================================
    // 2. Navigation Active State Track on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 250)) {
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

            // Update outliner sidebar selection as well
            outlinerItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-target') === currentSection && !item.getAttribute('data-item')) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ==========================================
    // 3. Showcase Grid Filter Logic
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.gallery-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
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

    // ==========================================
    // 4. Modifier Skill Value Bar Animation
    // ==========================================
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

    // ==========================================
    // 5. Real-Time Transform Modification
    // ==========================================
    const transformInputs = document.querySelectorAll('.transform-input');

    transformInputs.forEach(input => {
        input.addEventListener('input', () => {
            const card = input.closest('.gallery-card');
            const targetImg = card.querySelector('.transform-target');
            
            // Gather all transform properties for this card
            const rotateXInput = card.querySelector('[data-transform="rotateX"]');
            const rotateYInput = card.querySelector('[data-transform="rotateY"]');
            const scaleInput = card.querySelector('[data-transform="scale"]');
            
            const rX = rotateXInput ? rotateXInput.value || 0 : 0;
            const rY = rotateYInput ? rotateYInput.value || 0 : 0;
            const sc = scaleInput ? scaleInput.value || 1.0 : 1.0;
            
            // Apply 3D transform to card image
            targetImg.style.transform = `perspective(500px) rotateX(${rX}deg) rotateY(${rY}deg) scale(${sc})`;
    });

    // ==========================================
    // 5.5. Image Carousel for Forest Clearing card
    // ==========================================
    const forestImg = document.getElementById('forest-img');
    const forestPrev = document.getElementById('btn-forest-prev');
    const forestNext = document.getElementById('btn-forest-next');
    const forestCounter = document.getElementById('forest-counter');

    const forestImages = [
        'gallery_assets/user_forest_2.png',
        'gallery_assets/user_forest_1.jpg',
        'gallery_assets/user_forest_3.jpg',
        'gallery_assets/user_forest_4.jpg'
    ];
    let currentForestIndex = 0;

    function updateForestCarousel() {
        if (forestImg && forestCounter) {
            // Apply a quick fade transition
            forestImg.style.opacity = '0.3';
            setTimeout(() => {
                forestImg.src = forestImages[currentForestIndex];
                forestCounter.textContent = `${currentForestIndex + 1} / ${forestImages.length}`;
                forestImg.style.opacity = '1';
            }, 150);
        }
    }

    if (forestPrev) {
        forestPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering selection highlight
            currentForestIndex = (currentForestIndex - 1 + forestImages.length) % forestImages.length;
            updateForestCarousel();
        });
    }

    if (forestNext) {
        forestNext.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering selection highlight
            currentForestIndex = (currentForestIndex + 1) % forestImages.length;
            updateForestCarousel();
        });
    }

    // ==========================================
    // 6. Interactive 3D Wireframe Canvas Engine
    // ==========================================
    const canvas = document.getElementById('viewport-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    function resizeCanvas() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resizeCanvas);

    // Dynamic 3D low-poly wireframe sphere generation
    const verts = [];
    const edges = [];
    const rings = 7;
    const sectors = 10;
    const sphereRadius = 130;

    // Generate 3D Vertices
    for (let r = 0; r <= rings; r++) {
        const phi = (Math.PI * r) / rings;
        for (let s = 0; s < sectors; s++) {
            const theta = (2 * Math.PI * s) / sectors;
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);
            verts.push({ x: x * sphereRadius, y: y * sphereRadius, z: z * sphereRadius });
        }
    }

    // Generate Edges
    for (let r = 0; r < rings; r++) {
        for (let s = 0; s < sectors; s++) {
            const i1 = r * sectors + s;
            const i2 = r * sectors + ((s + 1) % sectors);
            const i3 = (r + 1) * sectors + s;
            edges.push([i1, i2]); // Horizontal rings
            edges.push([i1, i3]); // Vertical arches
        }
    }

    // 3D Engine Variables
    let angleX = 0.2; // Radians
    let angleY = 0.5;
    let zoomScale = 1.0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    // Orbit Rotation Functions
    function rotateX(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const y = point.y * cos - point.z * sin;
        const z = point.y * sin + point.z * cos;
        return { x: point.x, y, z };
    }

    function rotateY(point, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = point.x * cos + point.z * sin;
        const z = -point.x * sin + point.z * cos;
        return { x, y: point.y, z };
    }

    // Drag to Orbit listeners
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        
        angleY += deltaX * 0.007; // Yaw
        angleX += deltaY * 0.007; // Pitch
        
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Zooming Orbit listener
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        zoomScale -= e.deltaY * 0.001;
        zoomScale = Math.max(0.4, Math.min(zoomScale, 2.5)); // boundary checks
    });

    // Rendering Loop
    function render3D() {
        ctx.clearRect(0, 0, width, height);

        // Auto rotation when not dragging
        if (!isDragging) {
            angleY += 0.002;
            angleX += 0.0005;
        }

        // Draw perspective grid floor reference in canvas
        ctx.strokeStyle = '#2d2d2d';
        ctx.lineWidth = 1;
        
        // Render 3D Wireframe Object
        const projectedPoints = [];
        const cameraDistance = 350;

        verts.forEach(p => {
            // Apply rotations
            let rotated = rotateX(p, angleX);
            rotated = rotateY(rotated, angleY);

            // Apply Zoom
            rotated.x *= zoomScale;
            rotated.y *= zoomScale;
            rotated.z *= zoomScale;

            // Simple Perspective Projection Formula
            const zOff = rotated.z + cameraDistance;
            const xProjected = (rotated.x * 300) / zOff + width / 2;
            const yProjected = (rotated.y * 300) / zOff + height / 2;

            projectedPoints.push({
                x: xProjected,
                y: yProjected,
                z: rotated.z // Save depth info for shading/fading
            });
        });

        // Draw wireframe edges
        edges.forEach(edge => {
            const p1 = projectedPoints[edge[0]];
            const p2 = projectedPoints[edge[1]];

            // Draw line
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Depth cues: Fade lines further away from camera (negative Z is closer, positive Z is further)
            const averageDepth = (p1.z + p2.z) / 2;
            // Map depth to opacity
            const opacity = Math.max(0.08, Math.min(1.0 - (averageDepth + sphereRadius) / (sphereRadius * 2.5), 0.75));
            
            // Highlight color for active viewport grid
            ctx.strokeStyle = `rgba(232, 123, 53, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });

        // Draw small vertices nodes
        projectedPoints.forEach(p => {
            if (p.z < 20) { // Render nodes closer to camera
                ctx.fillStyle = '#e87b35';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.8, 0, 2 * Math.PI);
                ctx.fill();
            }
        });

        requestAnimationFrame(render3D);
    }

    // Start 3D Viewport Loop
    render3D();

    // ==========================================
    // 7. Form submission handling
    // ==========================================
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
