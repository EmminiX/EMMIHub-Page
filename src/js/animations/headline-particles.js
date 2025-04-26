import errorLogger from '../core/error-logging.js';

/**
 * HeadlineParticles class for creating animated particles around the headline
 * that leave trails and change colors as they move
 */
class HeadlineParticles {
    constructor(options) {
        // Default options
        this.defaults = {
            headlineSelector: '.headline',
            particleCount: 12,
            particleSize: [1.5, 2.5],
            trailLength: 10,
            maxSpeed: 1.2,
            orbitDistance: [30, 80],
            colorTransitionSpeed: 0.01,
            fadeRate: 0.05,
            responsive: true
        };
        
        this.options = { ...this.defaults, ...options };
        
        // Find the headline element
        this.headline = document.querySelector(this.options.headlineSelector);
        
        if (!this.headline) {
            errorLogger.error('Headline element not found', 'headline-particles', 'medium');
            return;
        }
        
        this.state = {
            isRunning: false,
            particles: [],
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,
            animationFrame: null,
            headlineBounds: null
        };
        
        this.init();
    }
    
    init() {
        try {
            this.createCanvas();
            this.updateHeadlineBounds();
            this.createParticles();
            this.setupEventListeners();
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize headline particles: ${error.message}`,
                'headline-particles',
                'medium',
                { stack: error.stack }
            );
        }
    }
    
    createCanvas() {
        // Create a canvas that covers the headline area with some padding
        this.state.canvas = document.createElement('canvas');
        this.state.canvas.classList.add('headline-particles-canvas');
        
        // Position the canvas absolutely relative to the headline
        this.state.canvas.style.position = 'absolute';
        this.state.canvas.style.top = '0';
        this.state.canvas.style.left = '0';
        this.state.canvas.style.width = '100%';
        this.state.canvas.style.height = '100%';
        this.state.canvas.style.pointerEvents = 'none';
        this.state.canvas.style.zIndex = '-1'; // Set to -1 to position behind the text
        
        // Make sure the headline has position relative for proper positioning
        const headlinePosition = window.getComputedStyle(this.headline).position;
        if (headlinePosition === 'static') {
            this.headline.style.position = 'relative';
        }
        
        // Insert the canvas as a child of the headline's parent, right before the headline
        this.headline.parentNode.insertBefore(this.state.canvas, this.headline);
        
        // Set canvas dimensions
        this.updateCanvasDimensions();
        
        // Get the 2D context
        this.state.ctx = this.state.canvas.getContext('2d');
    }
    
    updateCanvasDimensions() {
        // Get the headline's dimensions and position
        const headlineRect = this.headline.getBoundingClientRect();
        const parentRect = this.headline.parentNode.getBoundingClientRect();
        
        // Calculate the canvas dimensions with padding
        const padding = 50; // Padding around the headline
        this.state.width = headlineRect.width + padding * 2;
        this.state.height = headlineRect.height + padding * 2;
        
        // Set the canvas dimensions
        this.state.canvas.width = this.state.width;
        this.state.canvas.height = this.state.height;
        
        // Position the canvas to center around the headline
        const offsetX = headlineRect.left - parentRect.left - padding;
        const offsetY = headlineRect.top - parentRect.top - padding;
        
        this.state.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    
    updateHeadlineBounds() {
        // Get the headline's dimensions relative to the canvas
        const headlineRect = this.headline.getBoundingClientRect();
        const canvasRect = this.state.canvas.getBoundingClientRect();
        
        this.state.headlineBounds = {
            left: headlineRect.left - canvasRect.left,
            top: headlineRect.top - canvasRect.top,
            right: headlineRect.right - canvasRect.left,
            bottom: headlineRect.bottom - canvasRect.top,
            width: headlineRect.width,
            height: headlineRect.height,
            centerX: headlineRect.left - canvasRect.left + headlineRect.width / 2,
            centerY: headlineRect.top - canvasRect.top + headlineRect.height / 2
        };
    }
    
    createParticles() {
        this.state.particles = [];
        
        // Get theme colors from CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
        const secondaryColor = computedStyle.getPropertyValue('--color-secondary').trim();
        const highlightColor = computedStyle.getPropertyValue('--color-highlight').trim();
        
        // Convert colors to RGB for easier interpolation
        const primaryRGB = this.hexToRgb(primaryColor) || { r: 0, g: 240, b: 255 };
        const secondaryRGB = this.hexToRgb(secondaryColor) || { r: 114, g: 9, b: 183 };
        const highlightRGB = this.hexToRgb(highlightColor) || { r: 255, g: 214, b: 10 };
        
        // Create color palette for particles
        const colorPalette = [primaryRGB, secondaryRGB, highlightRGB];
        
        // Create multiple orbit centers along the headline text
        const numOrbitCenters = 5; // More centers for better distribution
        const orbitCenters = [];
        
        // Calculate orbit centers distributed across the headline width
        for (let i = 0; i < numOrbitCenters; i++) {
            const progress = i / (numOrbitCenters - 1); // 0 to 1
            const x = this.state.headlineBounds.left + this.state.headlineBounds.width * progress;
            const y = this.state.headlineBounds.centerY;
            orbitCenters.push({ x, y });
        }
        
        // Store animation start time
        this.animationStartTime = performance.now();
        
        // Distribute particles among the orbit centers
        for (let i = 0; i < this.options.particleCount; i++) {
            // Select a random orbit center
            const orbitCenter = orbitCenters[Math.floor(Math.random() * orbitCenters.length)];
            
            // Random angle around the selected orbit center
            const angle = Math.random() * Math.PI * 2;
            
            // Random distance from the orbit center within the orbit range
            const minOrbit = this.options.orbitDistance[0];
            const maxOrbit = this.options.orbitDistance[1];
            const orbitDistance = minOrbit + Math.random() * (maxOrbit - minOrbit);
            
            // Calculate target position (where the particle will end up)
            const targetX = orbitCenter.x + Math.cos(angle) * orbitDistance;
            const targetY = orbitCenter.y + Math.sin(angle) * orbitDistance;
            
            // For entrance animation, start particles from random positions outside the visible area
            // or from the center of the headline with a delay
            const entranceType = Math.floor(Math.random() * 3); // 0, 1, or 2
            let startX, startY;
            
            if (entranceType === 0) {
                // Start from center of headline
                startX = this.state.headlineBounds.centerX;
                startY = this.state.headlineBounds.centerY;
            } else if (entranceType === 1) {
                // Start from random position outside the canvas (top/bottom)
                startX = targetX;
                startY = Math.random() > 0.5 ? -50 : this.state.height + 50;
            } else {
                // Start from random position outside the canvas (left/right)
                startX = Math.random() > 0.5 ? -50 : this.state.width + 50;
                startY = targetY;
            }
            
            // Random orbit speed (some clockwise, some counter-clockwise)
            const orbitSpeed = (Math.random() * 0.5 + 0.5) * this.options.maxSpeed * (Math.random() > 0.5 ? 1 : -1);
            
            // Random size within the specified range
            const size = this.options.particleSize[0] + Math.random() * (this.options.particleSize[1] - this.options.particleSize[0]);
            
            // Random starting color from the palette
            const startColorIndex = Math.floor(Math.random() * colorPalette.length);
            const targetColorIndex = (startColorIndex + 1) % colorPalette.length;
            
            // Random delay for staggered entrance (0-1500ms)
            const entranceDelay = Math.random() * 1500;
            
            const particle = {
                // Current position (starting position for entrance animation)
                x: startX,
                y: startY,
                // Target position (final orbit position)
                targetX,
                targetY,
                size,
                angle,
                orbitDistance,
                orbitSpeed,
                orbitCenter, // Store the orbit center for this particle
                // Entrance animation properties
                entranceProgress: 0,
                entranceDelay,
                entranceDuration: 1000 + Math.random() * 500, // 1000-1500ms
                // Color transition properties
                currentColor: { ...colorPalette[startColorIndex] },
                targetColor: { ...colorPalette[targetColorIndex] },
                colorProgress: 0,
                // Trail properties
                trail: [],
                trailMaxLength: this.options.trailLength,
                // Opacity for fade-in effect
                opacity: 0
            };
            
            this.state.particles.push(particle);
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
            this.updateHeadlineBounds();
            this.redistributeParticles();
            this.resizeTimeout = null;
        }, 200);
    }
    
    redistributeParticles() {
        // Create new orbit centers based on updated headline bounds
        const numOrbitCenters = 5;
        const orbitCenters = [];
        
        // Calculate orbit centers distributed across the headline width
        for (let i = 0; i < numOrbitCenters; i++) {
            const progress = i / (numOrbitCenters - 1); // 0 to 1
            const x = this.state.headlineBounds.left + this.state.headlineBounds.width * progress;
            const y = this.state.headlineBounds.centerY;
            orbitCenters.push({ x, y });
        }
        
        this.state.particles.forEach((particle, index) => {
            // Assign a new orbit center
            particle.orbitCenter = orbitCenters[index % orbitCenters.length];
            
            // Recalculate position based on angle and orbit distance
            particle.x = particle.orbitCenter.x + Math.cos(particle.angle) * particle.orbitDistance;
            particle.y = particle.orbitCenter.y + Math.sin(particle.angle) * particle.orbitDistance;
            
            // Clear the trail when redistributing
            particle.trail = [];
        });
    }
    
    start() {
        if (this.state.isRunning) return this;
        this.state.isRunning = true;
        this.animate();
        return this;
    }
    
    stop() {
        this.state.isRunning = false;
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
            this.state.animationFrame = null;
        }
        return this;
    }
    
    animate() {
        if (!this.state.isRunning) return;
        
        // Clear the canvas completely
        this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Request next frame
        this.state.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.state.particles.forEach(particle => {
            // Update angle based on orbit speed
            particle.angle += particle.orbitSpeed / 100;
            
            // Calculate new position using the particle's orbit center
            particle.x = particle.orbitCenter.x + Math.cos(particle.angle) * particle.orbitDistance;
            particle.y = particle.orbitCenter.y + Math.sin(particle.angle) * particle.orbitDistance;
            
            // Set full opacity
            particle.opacity = 1;
            
            // Add current position to trail
            particle.trail.unshift({ x: particle.x, y: particle.y });
            
            // Limit trail length
            if (particle.trail.length > particle.trailMaxLength) {
                particle.trail.pop();
            }
            
            // Update color transition
            particle.colorProgress += this.options.colorTransitionSpeed;
            if (particle.colorProgress >= 1) {
                // Reset progress and set new target color
                particle.colorProgress = 0;
                particle.currentColor = { ...particle.targetColor };
                
                // Get next color in the palette
                const computedStyle = getComputedStyle(document.documentElement);
                const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
                const secondaryColor = computedStyle.getPropertyValue('--color-secondary').trim();
                const highlightColor = computedStyle.getPropertyValue('--color-highlight').trim();
                
                // Convert colors to RGB
                const primaryRGB = this.hexToRgb(primaryColor) || { r: 0, g: 240, b: 255 };
                const secondaryRGB = this.hexToRgb(secondaryColor) || { r: 114, g: 9, b: 183 };
                const highlightRGB = this.hexToRgb(highlightColor) || { r: 255, g: 214, b: 10 };
                
                // Create color palette and pick next color
                const colorPalette = [primaryRGB, secondaryRGB, highlightRGB];
                const currentIndex = this.findClosestColorIndex(particle.currentColor, colorPalette);
                const nextIndex = (currentIndex + 1) % colorPalette.length;
                
                particle.targetColor = { ...colorPalette[nextIndex] };
            }
        });
    }
    
    // Easing function for smoother animations
    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    
    drawParticles() {
        const ctx = this.state.ctx;
        const now = performance.now();
        
        // First pass: Draw trails
        this.state.particles.forEach(particle => {
            // Only draw trails if particle is visible (opacity > 0)
            if (particle.trail.length > 1 && particle.opacity > 0) {
                // Use quadratic curves for smoother trails
                ctx.beginPath();
                ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                
                for (let i = 1; i < particle.trail.length; i++) {
                    // If we have enough points, use quadratic curves
                    if (i < particle.trail.length - 1) {
                        // Calculate control point (midpoint of this point and next point)
                        const cpX = (particle.trail[i].x + particle.trail[i+1].x) / 2;
                        const cpY = (particle.trail[i].y + particle.trail[i+1].y) / 2;
                        
                        // Draw quadratic curve to midpoint using current point as control
                        ctx.quadraticCurveTo(
                            particle.trail[i].x, 
                            particle.trail[i].y,
                            cpX, cpY
                        );
                    } else {
                        // For the last segment, just draw a line
                        ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                    }
                    
                    // Calculate improved fade based on position in trail with easing
                    const normalizedPos = i / particle.trail.length;
                    const fadeFactor = 1 - Math.pow(normalizedPos, 1.5); // Easing function for smoother fade
                    
                    // Interpolate between current and target color
                    const r = Math.round(this.lerp(particle.currentColor.r, particle.targetColor.r, particle.colorProgress));
                    const g = Math.round(this.lerp(particle.currentColor.g, particle.targetColor.g, particle.colorProgress));
                    const b = Math.round(this.lerp(particle.currentColor.b, particle.targetColor.b, particle.colorProgress));
                    
                    // Set stroke style with improved fade and respect particle opacity
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${fadeFactor * 0.8 * particle.opacity})`;
                    ctx.lineWidth = particle.size * fadeFactor * 0.9;
                    ctx.stroke();
                    
                    // Start a new path segment for gradient effect
                    if (i < particle.trail.length - 1) {
                        ctx.beginPath();
                        ctx.moveTo(cpX, cpY);
                    }
                }
            }
        });
        
        // Second pass: Draw particles and interaction effects
        this.state.particles.forEach(particle => {
            // Skip drawing if particle is not visible yet
            if (particle.opacity <= 0) return;
            
            // Calculate pulse effect based on time
            const pulseFrequency = 0.002; // Adjust for faster/slower pulse
            const pulseAmount = 0.15; // Adjust for stronger/weaker pulse
            const pulseFactor = 1 + Math.sin(now * pulseFrequency) * pulseAmount;
            
            // Draw particle with pulse effect
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * pulseFactor, 0, Math.PI * 2);
            
            // Interpolate between current and target color
            const r = Math.round(this.lerp(particle.currentColor.r, particle.targetColor.r, particle.colorProgress));
            const g = Math.round(this.lerp(particle.currentColor.g, particle.targetColor.g, particle.colorProgress));
            const b = Math.round(this.lerp(particle.currentColor.b, particle.targetColor.b, particle.colorProgress));
            
            // Set fill style with opacity
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
            
            // Add enhanced glow effect
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
            ctx.shadowBlur = 6 * pulseFactor * particle.opacity;
            
            ctx.fill();
            
            // Only draw interaction effects if particle is fully visible
            if (particle.opacity > 0.7) {
                // Draw interaction effects with nearby particles
                this.state.particles.forEach(otherParticle => {
                    if (particle === otherParticle || otherParticle.opacity <= 0.7) return;
                    
                    // Calculate distance between particles
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // If particles are close, draw interaction effect
                    const interactionDistance = 40;
                    if (distance < interactionDistance) {
                        // Calculate opacity based on distance and particle opacity
                        const opacity = 0.2 * (1 - distance / interactionDistance) * 
                                       Math.min(particle.opacity, otherParticle.opacity);
                        
                        // Draw connection line
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            }
            
            // Reset shadow for next particle
            ctx.shadowBlur = 0;
        });
    }
    
    // Helper function to interpolate between two values
    lerp(start, end, progress) {
        return start + (end - start) * progress;
    }
    
    // Helper function to convert hex color to RGB
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Handle shorthand hex
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Check if parsing was successful
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return null;
        }
        
        return { r, g, b };
    }
    
    // Helper function to find the closest color in a palette
    findClosestColorIndex(color, palette) {
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        palette.forEach((paletteColor, index) => {
            const distance = Math.sqrt(
                Math.pow(color.r - paletteColor.r, 2) +
                Math.pow(color.g - paletteColor.g, 2) +
                Math.pow(color.b - paletteColor.b, 2)
            );
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });
        
        return closestIndex;
    }
    
    // Update colors based on theme
    updateColors() {
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
        const secondaryColor = computedStyle.getPropertyValue('--color-secondary').trim();
        const highlightColor = computedStyle.getPropertyValue('--color-highlight').trim();
        
        // Convert colors to RGB
        const primaryRGB = this.hexToRgb(primaryColor) || { r: 0, g: 240, b: 255 };
        const secondaryRGB = this.hexToRgb(secondaryColor) || { r: 114, g: 9, b: 183 };
        const highlightRGB = this.hexToRgb(highlightColor) || { r: 255, g: 214, b: 10 };
        
        // Create color palette
        const colorPalette = [primaryRGB, secondaryRGB, highlightRGB];
        
        // Update particle colors
        this.state.particles.forEach(particle => {
            const currentIndex = this.findClosestColorIndex(particle.currentColor, colorPalette);
            const targetIndex = this.findClosestColorIndex(particle.targetColor, colorPalette);
            
            particle.currentColor = { ...colorPalette[currentIndex] };
            particle.targetColor = { ...colorPalette[targetIndex] };
        });
        
        return this;
    }
    
    destroy() {
        this.stop();
        if (this.state.canvas && this.state.canvas.parentNode) {
            this.state.canvas.parentNode.removeChild(this.state.canvas);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        window.removeEventListener('resize', this.handleResize);
    }
}

function initHeadlineParticles(options = {}) {
    const instance = new HeadlineParticles(options);
    return instance;
}

export { HeadlineParticles, initHeadlineParticles };
export default HeadlineParticles;
