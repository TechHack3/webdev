const canvas = document.getElementById('fireworksCanvas');
        const ctx = canvas.getContext('2d');
        
        // Arrays to hold our fireworks and particles
        let fireworks = [];
        let particles = [];

        // Set canvas dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // --- Configuration ---
        const LAUNCH_INTERVAL = 2000; // Automatic launch interval in ms
        const PARTICLE_COUNT = 500;   // Particles per explosion
        const GRAVITY = 0.05;
        const FRICTION = 0.99;

        // Function to get a random HSL color string
        function getRandomColor() {
            const hue = Math.random() * 360;
            return `hsl(${hue}, 100%, 50%)`;
        }
        
        // Resize canvas when the window is resized
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        // --- Particle Class ---
        // Represents a single spark from an explosion
        class Particle {
            constructor(x, y, color, velocity) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = velocity;
                this.alpha = 1; // Lifespan/opacity
                this.size = Math.random() * 2 + 1;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.restore();
            }

            update() {
                // Apply friction to slow down
                this.velocity.x *= FRICTION;
                this.velocity.y *= FRICTION;
                
                // Apply gravity
                this.velocity.y += GRAVITY;
                
                // Update position
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                
                // Fade out over time
                this.alpha -= 0.015;
                
                this.draw();
            }
        }

        // --- Firework Class ---
        // Represents the initial rocket launch
        class Firework {
            constructor(startX, startY, endX, endY) {
                this.x = startX;
                this.y = startY;
                this.startX = startX;
                this.startY = startY;
                this.endX = endX;
                this.endY = endY;
                this.color = getRandomColor();
                this.distanceToEnd = Math.hypot(endX - startX, endY - startY);
                this.distanceTraveled = 0;
                
                // Calculate the angle for movement
                this.angle = Math.atan2(endY - startY, endX - startX);
                this.speed = 4;
                this.acceleration = 1.05;
                this.velocity = {
                    x: Math.cos(this.angle) * this.speed,
                    y: Math.sin(this.angle) * this.speed
                };
                this.trail = [];
                this.trailLength = 3;
            }

            draw() {
                ctx.beginPath();
                // Move to the position behind the current point for the trail
                const trailX = this.x - this.velocity.x * 2;
                const trailY = this.y - this.velocity.y * 2;
                ctx.moveTo(trailX, trailY);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 3;
                ctx.stroke();
            }

            update() {
                this.speed *= this.acceleration;
                this.velocity = {
                    x: Math.cos(this.angle) * this.speed,
                    y: Math.sin(this.angle) * this.speed
                };

                const traveledX = this.startX - this.x;
                const traveledY = this.startY - this.y;
                this.distanceTraveled = Math.hypot(traveledX, traveledY);

                // If the firework has reached its destination, create an explosion
                if (this.distanceTraveled >= this.distanceToEnd) {
                    this.explode();
                    // Mark for removal by returning true
                    return true;
                } else {
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    this.draw();
                    // Mark for keeping by returning false
                    return false;
                }
            }
            
            explode() {
                // Create particles for the explosion
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 6;
                    const velocity = {
                        x: Math.cos(angle) * speed,
                        y: Math.sin(angle) * speed
                    };
                    particles.push(new Particle(this.x, this.y, this.color, velocity));
                }
            }
        }
        
        // --- Animation Loop ---
        function animate() {
            // Use requestAnimationFrame for smooth animation
            requestAnimationFrame(animate);

            // Create a semi-transparent background to create a trail effect
            ctx.fillStyle = 'rgba(10, 10, 26, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw fireworks
            fireworks.forEach((firework, index) => {
                // If update() returns true, the firework is done and should be removed
                if (firework.update()) {
                    fireworks.splice(index, 1);
                }
            });
            
            // Update and draw particles
            particles.forEach((particle, index) => {
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                } else {
                    particle.update();
                }
            });
        }
        
        // --- Event Listeners and Launchers ---
        function launchFirework(targetX, targetY) {
            const startX = canvas.width / 2;
            const startY = canvas.height;
            fireworks.push(new Firework(startX, startY, targetX, targetY));
        }

        // Launch on click/tap
        canvas.addEventListener('click', (e) => {
            launchFirework(e.clientX, e.clientY);
        });
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            const touch = e.touches[0];
            launchFirework(touch.clientX, touch.clientY);
        });

        // Launch automatically
        function autoLaunch() {
            const targetX = Math.random() * canvas.width;
            // Target the top half of the screen for better visuals
            const targetY = Math.random() * canvas.height / 2;
            launchFirework(targetX, targetY);
        }

        // Start the automatic launching and the animation loop
        setInterval(autoLaunch, LAUNCH_INTERVAL);
        animate();
        autoLaunch(); // Launch one immediately on start
