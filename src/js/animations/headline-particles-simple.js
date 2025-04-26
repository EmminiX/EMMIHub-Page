import errorLogger from '../core/error-logging.js';

/**
 * Simple HeadlineParticles class for creating animated particles around the headline
 */
class HeadlineParticlesSimple {
    constructor(options) {
        // Default options
        this.defaults = {
            headlineSelector: '.headline',
            particleCount: 20,
            particleSize: [1.8, 3.5],
            maxSpeed: 1.5,
            orbitDistance: [30, 100],
            responsive: true
        };
        
        this.options = { ...this.defaults, ...options };
        
        // Find the headline element
        this.headline = document.querySelector(this.options.headlineSelector);
        
        if (!this.headline) {
            errorLogger.error('Headline element not found', 'headline-particles-simple', 'medium');
            return;
        }
        
        this.canvas = null;
        this.ctx = null;
        this.width = 0;
        this.height = 0;
        this.particles = [];
        this.animationFrame = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        try {
            this.createCanvas();
            this.createParticles();
            this.setupEventListeners();
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize headline particles: ${error.message}`,
                'headline-particles-simple',
                'medium',
                { stack: error.stack }
            );
        }
    }
    
    createCanvas() {
        // Create a canvas that covers the headline area with some padding
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('headline-particles-canvas');
        
        // Position the canvas absolutely relative to the headline
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Set to -1 to position behind the text
        
        // Make sure the headline has position relative for proper positioning
        const headlinePosition = window.getComputedStyle(this.headline).position;
        if (headlinePosition === 'static') {
            this.headline.style.position = 'relative';
        }
        
        // Insert the canvas as a child of the headline's parent, right before the headline
        this.headline.parentNode.insertBefore(this.canvas, this.headline);
        
        // Set canvas dimensions
        this.updateCanvasDimensions();
        
        // Get the 2D context
        this.ctx = this.canvas.getContext('2d');
    }
    
    updateCanvasDimensions() {
        // Get the headline's dimensions and position
        const headlineRect = this.headline.getBoundingClientRect();
        const parentRect = this.headline.parentNode.getBoundingClientRect();
        
        // Calculate the canvas dimensions with padding
        const padding = 50; // Padding around the headline
        this.width = headlineRect.width + padding * 2;
        this.height = headlineRect.height + padding * 2;
        
        // Set the canvas dimensions
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Position the canvas to center around the headline
        const offsetX = headlineRect.left - parentRect.left - padding;
        const offsetY = headlineRect.top - parentRect.top - padding;
        
        this.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    
    createParticles() {
        this.particles = [];
        
        // Get theme colors from CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--color-primary').trim() || '#00f0ff';
        const secondaryColor = computedStyle.getPropertyValue('--color-secondary').trim() || '#7209b7';
        const highlightColor = computedStyle.getPropertyValue('--color-highlight').trim() || '#ffd60a';
        
        // Create color array
        const colors = [primaryColor, secondaryColor, highlightColor];
        
        // Get headline bounds
        const headlineRect = this.headline.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const headlineBounds = {
            left: headlineRect.left - canvasRect.left,
            top: headlineRect.top - canvasRect.top,
            width: headlineRect.width,
            height: headlineRect.height,
            centerX: headlineRect.left - canvasRect.left + headlineRect.width / 2,
            centerY: headlineRect.top - canvasRect.top + headlineRect.height / 2
        };
        
        // Create orbit centers along the headline width
        const numOrbitCenters = 5;
        const orbitCenters = [];
        
        for (let i = 0; i < numOrbitCenters; i++) {
            const progress = i / (numOrbitCenters - 1); // 0 to 1
            const x = headlineBounds.left + headlineBounds.width * progress;
            const y = headlineBounds.centerY;
            orbitCenters.push({ x, y });
        }
        
        // Create particles
        for (let i = 0; i < this.options.particleCount; i++) {
            // Select a random orbit center
            const orbitCenter = orbitCenters[Math.floor(Math.random() * orbitCenters.length)];
            
            // Random angle around the orbit center
            const angle = Math.random() * Math.PI * 2;
            
            // Random distance from the orbit center
            const minOrbit = this.options.orbitDistance[0];
            const maxOrbit = this.options.orbitDistance[1];
            const orbitDistance = minOrbit + Math.random() * (maxOrbit - minOrbit);
            
            // Calculate position
            const x = orbitCenter.x + Math.cos(angle) * orbitDistance;
            const y = orbitCenter.y + Math.sin(angle) * orbitDistance;
            
            // Random orbit speed (some clockwise, some counter-clockwise)
            const orbitSpeed = (Math.random() * 0.5 + 0.5) * this.options.maxSpeed * (Math.random() > 0.5 ? 1 : -1);
            
            // Random size
            const size = this.options.particleSize[0] + Math.random() * (this.options.particleSize[1] - this.options.particleSize[0]);
            
            // Random color
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x,
                y,
                size,
                color,
                angle,
                orbitSpeed,
                orbitDistance,
                orbitCenter
            });
        }
    }
    
    setupEventListeners() {
        if (this.options.responsive) {
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        }
    }
    
    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.updateCanvasDimensions();
            this.redistributeParticles();
            this.resizeTimeout = null;
        }, 200);
    }
    
    redistributeParticles() {
        // Get headline bounds
        const headlineRect = this.headline.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const headlineBounds = {
            left: headlineRect.left - canvasRect.left,
            top: headlineRect.top - canvasRect.top,
            width: headlineRect.width,
            height: headlineRect.height,
            centerX: headlineRect.left - canvasRect.left + headlineRect.width / 2,
            centerY: headlineRect.top - canvasRect.top + headlineRect.height / 2
        };
        
        // Create orbit centers along the headline width
        const numOrbitCenters = 5;
        const orbitCenters = [];
        
        for (let i = 0; i < numOrbitCenters; i++) {
            const progress = i / (numOrbitCenters - 1); // 0 to 1
            const x = headlineBounds.left + headlineBounds.width * progress;
            const y = headlineBounds.centerY;
            orbitCenters.push({ x, y });
        }
        
        // Redistribute particles
        this.particles.forEach((particle, index) => {
            // Assign a new orbit center
            particle.orbitCenter = orbitCenters[index % orbitCenters.length];
            
            // Recalculate position
            particle.x = particle.orbitCenter.x + Math.cos(particle.angle) * particle.orbitDistance;
            particle.y = particle.orbitCenter.y + Math.sin(particle.angle) * particle.orbitDistance;
        });
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Request next frame
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update angle
            particle.angle += particle.orbitSpeed / 100;
            
            // Update position
            particle.x = particle.orbitCenter.x + Math.cos(particle.angle) * particle.orbitDistance;
            particle.y = particle.orbitCenter.y + Math.sin(particle.angle) * particle.orbitDistance;
        });
    }
    
    drawParticles() {
        const ctx = this.ctx;
        
        this.particles.forEach(particle => {
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            
            // Add glow effect
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 5;
            
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        });
    }
    
    updateColors() {
        // Get theme colors from CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--color-primary').trim() || '#00f0ff';
        const secondaryColor = computedStyle.getPropertyValue('--color-secondary').trim() || '#7209b7';
        const highlightColor = computedStyle.getPropertyValue('--color-highlight').trim() || '#ffd60a';
        
        // Create color array
        const colors = [primaryColor, secondaryColor, highlightColor];
        
        // Update particle colors
        this.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
        
        return this;
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        window.removeEventListener('resize', this.handleResize);
    }
}

function initHeadlineParticlesSimple(options = {}) {
    return new HeadlineParticlesSimple(options);
}

export { HeadlineParticlesSimple, initHeadlineParticlesSimple };
export default HeadlineParticlesSimple;
