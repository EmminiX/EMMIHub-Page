// Philosophy Section Animations
import { createCanvas, setupContext } from '../utils/canvas-utils.js';

export class PhilosophyAnimations {
    constructor(sectionId = 'philosophy') {
        this.section = document.getElementById(sectionId);
        this.initialized = false;
        this.setupAnimations();
    }

    setupAnimations() {
        if (!this.section || this.initialized) return;
        
        // Setup cosmic environment
        this.setupCosmicEnvironment();
        
        // Setup title animation
        this.setupTitleAnimation();
        
        // Setup list animations
        this.setupListAnimations();
        
        this.initialized = true;
    }

    setupCosmicEnvironment() {
        const cosmic = this.section.querySelector('.cosmic-environment');
        if (!cosmic) return;

        // Create star field canvas
        const starCanvas = createCanvas(cosmic, 'star-field');
        const ctx = setupContext(starCanvas);

        // Star layers with different parallax rates
        const starLayers = [
            { size: 1, count: 100, speed: 0.1 }, // Distant stars
            { size: 2, count: 50, speed: 0.25 }, // Mid-field stars
            { size: 3, count: 25, speed: 0.4 }   // Close stars
        ];

        // Initialize star positions
        const stars = starLayers.flatMap(layer => {
            return Array.from({ length: layer.count }, () => ({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                size: layer.size,
                speed: layer.speed,
                opacity: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 1 + Math.random() * 2
            }));
        });

        // Animation loop for star field
        let lastTime = 0;
        const animate = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);

            // Update and draw stars
            stars.forEach(star => {
                // Update star twinkle
                star.opacity = 0.3 + (Math.sin(currentTime * 0.001 * star.twinkleSpeed) + 1) * 0.35;
                
                // Draw star
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    setupTitleAnimation() {
        const title = this.section.querySelector('.section-title');
        if (!title) return;

        // Create glowing trail effect
        const text = title.textContent;
        title.innerHTML = '';
        
        // Create wrapper for glowing effect
        const wrapper = document.createElement('span');
        wrapper.classList.add('title-glow-wrapper');
        
        // Add characters with individual animation
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.setProperty('--char-index', index);
            wrapper.appendChild(span);
        });
        
        title.appendChild(wrapper);

        // Add intersection observer for animation trigger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    title.classList.add('animate-title');
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(title);
    }

    setupListAnimations() {
        const list = this.section.querySelector('.philosophy-list');
        if (!list) return;

        // Add animation classes to list items
        list.querySelectorAll('li').forEach((item, index) => {
            item.classList.add('philosophy-item');
            item.style.setProperty('--item-index', index);
            
            // Create line element for animation
            const line = document.createElement('div');
            line.classList.add('item-line');
            item.prepend(line);
        });

        // Add intersection observer for animation trigger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-item');
                }
            });
        }, { threshold: 0.2 });

        list.querySelectorAll('.philosophy-item').forEach(item => {
            observer.observe(item);
        });
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhilosophyAnimations();
}); 