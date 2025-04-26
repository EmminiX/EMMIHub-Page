import errorLogger from '../core/error-logging.js';

/**
 * ButtonGlow class for creating a subtle traveling light effect on buttons
 */
class ButtonGlow {
    constructor(options) {
        // Default options
        this.defaults = {
            selector: '.cta-button',
            glowSize: 10,
            glowOpacity: 0.6,
            glowColor: null, // Will use theme color if null
            speed: 2500, // Time in ms for one complete cycle
            responsive: true,
            trailLength: 0 // Number of trail segments (0 = no trail)
        };
        
        this.options = { ...this.defaults, ...options };
        
        // Find all matching buttons
        this.buttons = document.querySelectorAll(this.options.selector);
        
        if (this.buttons.length === 0) {
            errorLogger.error('No buttons found for glow effect', 'button-glow', 'low');
            return;
        }
        
        this.buttonStates = new Map();
        
        this.init();
    }
    
    init() {
        try {
            this.setupButtons();
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize button glow: ${error.message}`,
                'button-glow',
                'low',
                { stack: error.stack }
            );
        }
    }
    
    setupButtons() {
        this.buttons.forEach((button, index) => {
            // Create canvas for each button
            const canvas = document.createElement('canvas');
            canvas.classList.add('button-glow-canvas');
            
            // Position the canvas absolutely over the button
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
            canvas.style.zIndex = '1'; // Above the button but below any text
            
            // Make sure the button has position relative for proper positioning
            const buttonPosition = window.getComputedStyle(button).position;
            if (buttonPosition === 'static') {
                button.style.position = 'relative';
            }
            
            // Insert the canvas as the first child of the button
            button.insertBefore(canvas, button.firstChild);
            
            // Set canvas dimensions
            this.updateCanvasDimensions(button, canvas);
            
            // Get the 2D context
            const ctx = canvas.getContext('2d');
            
            // Store button state
            this.buttonStates.set(button, {
                canvas,
                ctx,
                width: canvas.width,
                height: canvas.height,
                progress: Math.random(), // Random starting position
                animationFrame: null,
                trail: [] // Array to store trail positions
            });
        });
        
        // Setup resize event listener
        if (this.options.responsive) {
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        }
    }
    
    updateCanvasDimensions(button, canvas) {
        const rect = button.getBoundingClientRect();
        
        // Set the canvas dimensions to match the button
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Update stored dimensions if button state exists
        const state = this.buttonStates.get(button);
        if (state) {
            state.width = canvas.width;
            state.height = canvas.height;
        }
    }
    
    handleResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        this.resizeTimeout = setTimeout(() => {
            this.buttons.forEach(button => {
                const state = this.buttonStates.get(button);
                if (state) {
                    this.updateCanvasDimensions(button, state.canvas);
                }
            });
            this.resizeTimeout = null;
        }, 200);
    }
    
    start() {
        this.buttons.forEach(button => {
            const state = this.buttonStates.get(button);
            if (state && !state.animationFrame) {
                this.animate(button);
            }
        });
        return this;
    }
    
    stop() {
        this.buttons.forEach(button => {
            const state = this.buttonStates.get(button);
            if (state && state.animationFrame) {
                cancelAnimationFrame(state.animationFrame);
                state.animationFrame = null;
            }
        });
        return this;
    }
    
    animate(button) {
        const state = this.buttonStates.get(button);
        if (!state) return;
        
        // Clear the canvas
        state.ctx.clearRect(0, 0, state.width, state.height);
        
        // Calculate the current position
        const width = state.width;
        const height = state.height;
        const progress = state.progress;
        
        // Calculate the perimeter of the button
        const perimeter = 2 * (width + height);
        
        // Calculate the current position along the perimeter
        const position = perimeter * progress;
        
        // Determine which side of the button we're on
        let x, y;
        
        if (position < width) {
            // Top edge
            x = position;
            y = 0;
        } else if (position < width + height) {
            // Right edge
            x = width;
            y = position - width;
        } else if (position < 2 * width + height) {
            // Bottom edge
            x = width - (position - (width + height));
            y = height;
        } else {
            // Left edge
            x = 0;
            y = height - (position - (2 * width + height));
        }
        
        // Add current position to trail if trail is enabled
        if (this.options.trailLength > 0) {
            state.trail.unshift({ x, y });
            
            // Limit trail length
            if (state.trail.length > this.options.trailLength) {
                state.trail.pop();
            }
        }
        
        // Draw the glow effect
        this.drawGlowEffect(button, state, x, y);
        
        // Update progress
        state.progress += 1 / (this.options.speed / 16.67); // Approximately 60fps
        if (state.progress > 1) {
            state.progress = 0;
        }
        
        // Request next frame
        state.animationFrame = requestAnimationFrame(() => this.animate(button));
    }
    
    drawGlowEffect(button, state, x, y) {
        const ctx = state.ctx;
        const width = state.width;
        const height = state.height;
        
        // Get glow color from theme or options
        let glowColor = this.options.glowColor;
        if (!glowColor) {
            const computedStyle = getComputedStyle(document.documentElement);
            glowColor = computedStyle.getPropertyValue('--color-primary').trim() || '#00f0ff';
        }
        
        // Parse the color to get RGB values
        const rgbaColor = this.hexToRgba(glowColor, this.options.glowOpacity);
        const brighterColor = this.hexToRgba(glowColor, 1.0);
        
        // Draw trail if enabled
        if (this.options.trailLength > 0 && state.trail.length > 1) {
            // Draw trail segments with glow effect
            ctx.shadowColor = rgbaColor;
            ctx.shadowBlur = this.options.glowSize / 3;
            
            // Draw trail segments
            for (let i = 1; i < state.trail.length; i++) {
                const point = state.trail[i];
                const prevPoint = state.trail[i - 1];
                
                // Calculate fade based on position in trail
                const fadeProgress = i / state.trail.length;
                const opacity = this.options.glowOpacity * (1 - fadeProgress) * 1.2; // Increased opacity
                const size = this.options.glowSize * 0.7 * (1 - fadeProgress * 0.7); // Larger trail
                
                // Draw trail segment
                ctx.beginPath();
                ctx.moveTo(prevPoint.x, prevPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = this.hexToRgba(glowColor, opacity);
                ctx.lineWidth = size;
                ctx.stroke();
                
                // Draw glow dots at each trail point for more visible trail
                ctx.beginPath();
                ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2);
                ctx.fillStyle = this.hexToRgba(glowColor, opacity * 0.8);
                ctx.fill();
            }
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
        
        // Draw a glow dot
        ctx.beginPath();
        ctx.arc(x, y, this.options.glowSize / 2, 0, Math.PI * 2);
        
        // Create a radial gradient for the glow
        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, this.options.glowSize
        );
        
        gradient.addColorStop(0, brighterColor);
        gradient.addColorStop(0.5, rgbaColor);
        gradient.addColorStop(1, rgbaColor.replace(/[\d\.]+\)$/, '0)')); // Fully transparent
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add a glow effect to the dot
        ctx.shadowColor = rgbaColor;
        ctx.shadowBlur = this.options.glowSize / 2;
        ctx.fill();
        
        // Reset shadow for the border
        ctx.shadowBlur = 0;
        
        // Add a subtle glow along the button border
        ctx.beginPath();
        ctx.strokeStyle = rgbaColor.replace(/[\d\.]+\)$/, '0.3)');
        ctx.lineWidth = 3;
        
        // Check if roundRect is supported, otherwise use a fallback
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, width, height, 4); // Rounded rectangle with 4px radius
        } else {
            // Fallback for browsers that don't support roundRect
            this.drawRoundedRect(ctx, 0, 0, width, height, 4);
        }
        
        ctx.stroke();
    }
    
    // Helper function to convert hex color to rgba
    hexToRgba(hex, alpha) {
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
            return `rgba(0, 240, 255, ${alpha})`;
        }
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    // Fallback method for drawing rounded rectangles
    drawRoundedRect(ctx, x, y, width, height, radius) {
        if (typeof radius === 'undefined') {
            radius = 4;
        }
        
        // Draw the rounded rectangle path
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    updateColors() {
        // Get theme color
        const computedStyle = getComputedStyle(document.documentElement);
        const glowColor = this.options.glowColor || computedStyle.getPropertyValue('--color-primary').trim() || '#00f0ff';
        
        // Update stored color
        this.options.glowColor = glowColor;
        
        return this;
    }
    
    destroy() {
        this.stop();
        
        this.buttons.forEach(button => {
            const state = this.buttonStates.get(button);
            if (state && state.canvas && state.canvas.parentNode) {
                state.canvas.parentNode.removeChild(state.canvas);
            }
        });
        
        this.buttonStates.clear();
        
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}

function initButtonGlow(options = {}) {
    return new ButtonGlow(options);
}

export { ButtonGlow, initButtonGlow };
export default ButtonGlow;
