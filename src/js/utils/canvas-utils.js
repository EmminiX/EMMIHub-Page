// Canvas Utility Functions

/**
 * Creates a canvas element with the specified class name and adds it to the parent element
 * @param {HTMLElement} parent - Parent element to append canvas to
 * @param {string} className - Class name for the canvas element
 * @returns {HTMLCanvasElement} The created canvas element
 */
export function createCanvas(parent, className) {
    const canvas = document.createElement('canvas');
    canvas.classList.add(className);
    
    // Set canvas size to match parent
    const resize = () => {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    };
    
    // Initial size
    resize();
    
    // Update size on window resize
    window.addEventListener('resize', resize);
    
    // Add canvas to parent
    parent.appendChild(canvas);
    
    return canvas;
}

/**
 * Sets up the canvas context with common properties
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {CanvasRenderingContext2D} The configured context
 */
export function setupContext(canvas) {
    const ctx = canvas.getContext('2d', {
        alpha: true,
        desynchronized: true,
        willReadFrequently: false
    });
    
    // Enable alpha blending
    ctx.globalCompositeOperation = 'source-over';
    
    // Set default text properties
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Scale context for retina displays
    const dpr = window.devicePixelRatio;
    if (dpr > 1) {
        ctx.scale(dpr, dpr);
    }
    
    return ctx;
}

/**
 * Clears the entire canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
export function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width / window.devicePixelRatio, ctx.canvas.height / window.devicePixelRatio);
}

/**
 * Draws a glowing circle
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} radius - Circle radius
 * @param {string} color - Color of the glow
 * @param {number} intensity - Glow intensity (0-1)
 */
export function drawGlowingCircle(ctx, x, y, radius, color, intensity = 1) {
    ctx.save();
    
    // Create glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = radius * 2;
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, `${color}${Math.floor(intensity * 80).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${color}00`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw core
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

/**
 * Creates a particle system
 * @param {Object} options - Configuration options
 * @returns {Object} Particle system methods
 */
export function createParticleSystem(options = {}) {
    const particles = [];
    const defaults = {
        count: 100,
        size: [1, 3],
        speed: [0.5, 2],
        color: '#ffffff',
        opacity: [0.3, 0.7],
        lifetime: [2000, 5000],
        direction: [-Math.PI, Math.PI],
        spread: Math.PI * 2,
        gravity: 0,
        friction: 0.98,
        wind: 0,
        turbulence: 0.1,
        bounce: 0.6,
        glow: true
    };
    
    const config = { ...defaults, ...options };
    
    const randomRange = (min, max) => Math.random() * (max - min) + min;
    const randomFromArray = arr => Array.isArray(arr) ? randomRange(arr[0], arr[1]) : arr;
    
    return {
        addParticle(x, y, overrides = {}) {
            const angle = randomRange(0, config.spread) + (overrides.direction || config.direction);
            const speed = randomFromArray(overrides.speed || config.speed);
            
            particles.push({
                x,
                y,
                size: randomFromArray(overrides.size || config.size),
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                color: overrides.color || config.color,
                opacity: randomFromArray(overrides.opacity || config.opacity),
                lifetime: randomFromArray(overrides.lifetime || config.lifetime),
                created: Date.now(),
                turbulence: overrides.turbulence || config.turbulence,
                friction: overrides.friction || config.friction,
                gravity: overrides.gravity || config.gravity,
                wind: overrides.wind || config.wind,
                glow: overrides.glow ?? config.glow
            });
        },
        
        update(ctx, deltaTime) {
            const now = Date.now();
            
            // Update and draw particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const particle = particles[i];
                const age = now - particle.created;
                
                // Remove expired particles
                if (age >= particle.lifetime) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // Update position
                particle.x += particle.speedX + particle.wind;
                particle.y += particle.speedY + particle.gravity;
                
                // Apply friction
                particle.speedX *= particle.friction;
                particle.speedY *= particle.friction;
                
                // Apply turbulence
                if (particle.turbulence) {
                    const turbulence = particle.turbulence * (Math.random() - 0.5);
                    particle.speedX += turbulence;
                    particle.speedY += turbulence;
                }
                
                // Update opacity based on age
                const lifePercent = age / particle.lifetime;
                particle.opacity = particle.opacity * (1 - lifePercent);
                
                // Draw particle
                if (particle.glow) {
                    drawGlowingCircle(
                        ctx,
                        particle.x,
                        particle.y,
                        particle.size,
                        particle.color,
                        particle.opacity
                    );
                } else {
                    ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        },
        
        getParticles() {
            return particles;
        },
        
        clear() {
            particles.length = 0;
        }
    };
}

/**
 * Converts a hex color to RGBA
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export function hexToRGBA(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Creates a glowing line between two points
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {number} x1 - Start X coordinate
 * @param {number} y1 - Start Y coordinate
 * @param {number} x2 - End X coordinate
 * @param {number} y2 - End Y coordinate
 * @param {string} color - Line color
 * @param {number} width - Line width
 * @param {number} glow - Glow amount
 */
export function drawGlowingLine(ctx, x1, y1, x2, y2, color, width = 1, glow = 10) {
    ctx.save();
    
    // Draw glow
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Draw core line
    ctx.shadowBlur = 0;
    ctx.lineWidth = width * 0.5;
    ctx.stroke();
    
    ctx.restore();
}

/**
 * Creates a gradient that can be animated
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Array<string>} colors - Array of colors
 * @param {number} speed - Animation speed
 * @returns {function} Update function for the gradient
 */
export function createAnimatedGradient(ctx, colors, speed = 0.001) {
    let offset = 0;
    
    return (x, y, width, height) => {
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        
        colors.forEach((color, i) => {
            const stop = (i / (colors.length - 1) + offset) % 1;
            gradient.addColorStop(stop, color);
        });
        
        offset = (offset + speed) % 1;
        return gradient;
    };
} 