/**
 * EMMIHUB - Community Tiers Animation
 * Handles the animations for the community section including:
 * - Tier platform effects
 * - Aura animations
 * - Energy flow visualization
 * - Particle effects
 */

import { hexToRgb, interpolateColors, createGradient, pulseValue, generateColorPalette } from '../utils/color-utils.js';

export class CommunityTiersAnimation {
    constructor(options = {}) {
        // Find the community section instead of tier container
        this.container = document.querySelector('.community-section') || document.querySelector('.tier-container').parentElement;
        if (!this.container) {
            console.error('No container found for CommunityTiersAnimation');
            return;
        }
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredTier = null;
        this.time = 0;
        this.isVisible = false;
        this.animationFrame = null;
        
        // Increased particle count and adjusted settings
        this.particleCount = options.particleCount || 200; // Increased from 100
        this.flowSpeed = options.flowSpeed || 0.4; // Slightly increased for more movement
        this.hoverFlowSpeed = options.hoverFlowSpeed || 1.2;
        this.mouseForce = options.mouseForce || 60;
        this.mouseRadius = options.mouseRadius || 100;
        
        // Color settings with increased opacity
        this.colors = {
            default: 'rgba(26, 46, 59, 0.8)', // Doubled opacity for background color
            explorer: 'rgba(16, 185, 129, 0.9)', // Changed to a vibrant emerald green
            scholar: 'rgba(114, 9, 183, 0.9)',
            visionary: 'rgba(255, 215, 0, 0.9)',
            innovator: 'rgba(0, 240, 255, 0.9)'
        };
        
        // Initialize
        this.init();
        
        // Set up visibility observer
        this.setupVisibilityObserver();
    }
    
    setupVisibilityObserver() {
        // Create intersection observer to only animate when visible
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isVisible = entry.isIntersecting;
                if (this.isVisible) {
                    this.startAnimation();
                } else {
                    this.stopAnimation();
                }
            });
        }, {
            threshold: 0.1
        });
        
        this.observer.observe(this.container);
    }
    
    init() {
        try {
            // Create and setup canvas
            this.canvas = document.createElement('canvas');
            this.canvas.classList.add('community-section-canvas');
            this.ctx = this.canvas.getContext('2d', {
                alpha: true,
                desynchronized: true
            });
            
            // Position the canvas
            this.container.style.position = 'relative';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '0'; // Behind the tier cards
            
            // Insert canvas as first child of container
            this.container.insertBefore(this.canvas, this.container.firstChild);
            
            // Initial setup
            this.resize();
            this.createParticles();
            this.bindEvents();
            
            // Start animation immediately
            this.startAnimation();
        } catch (error) {
            console.error('Error initializing CommunityTiersAnimation:', error);
        }
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size accounting for device pixel ratio
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // Scale context to match device pixel ratio
        this.ctx.scale(dpr, dpr);
        
        // Update particle positions
        this.particles.forEach(particle => {
            particle.x = Math.min(particle.x, rect.width);
            particle.y = Math.min(particle.y, rect.height);
        });
    }
    
    createParticles() {
        this.particles = [];
        const rect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                size: Math.random() * 3 + 2,
                speedX: (Math.random() - 0.5) * this.flowSpeed,
                speedY: (Math.random() - 0.5) * this.flowSpeed,
                color: this.colors.default,
                alpha: Math.random() * 0.3 + 0.7 // Increased base opacity range (0.7-1.0)
            });
        }
    }
    
    bindEvents() {
        // Throttled mouse move handler
        let ticking = false;
        this.container.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouseX = e.clientX - rect.left;
                    this.mouseY = e.clientY - rect.top;
                    
                    // Check for tier hover
                    const hoveredTier = this.checkTierHover(e.clientX, e.clientY);
                    if (this.hoveredTier !== hoveredTier) {
                        this.hoveredTier = hoveredTier;
                        this.updateParticleColors();
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Mouse leave handler
        this.container.addEventListener('mouseleave', () => {
            this.hoveredTier = null;
            this.updateParticleColors();
        });
        
        // Throttled resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        });
    }
    
    checkTierHover(mouseX, mouseY) {
        const tiers = this.container.querySelectorAll('.tier');
        for (const tier of tiers) {
            const rect = tier.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right &&
                mouseY >= rect.top && mouseY <= rect.bottom) {
                return tier.dataset.tier || null;
            }
        }
        return null;
    }
    
    updateParticleColors() {
        const targetColor = this.hoveredTier ? this.colors[this.hoveredTier] : this.colors.default;
        
        const rect = this.canvas.getBoundingClientRect();
        this.particles.forEach(particle => {
            if (this.hoveredTier) {
                const dx = particle.x - this.mouseX;
                const dy = particle.y - this.mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 500) { // Increased radius to 500px for a much larger effect area
                    // Create a gradient effect based on distance
                    const intensity = 1 - (distance / 500); // Closer particles are more intense
                    particle.color = targetColor;
                    particle.alpha = 0.7 + (intensity * 0.3); // Opacity ranges from 0.7 to 1.0 based on distance
                } else if (particle.color !== this.colors.default) {
                    particle.color = this.colors.default;
                    particle.alpha = Math.random() * 0.3 + 0.7;
                }
            } else if (particle.color !== this.colors.default) {
                particle.color = this.colors.default;
                particle.alpha = Math.random() * 0.3 + 0.7;
            }
        });
    }
    
    updateParticle(particle) {
        if (this.mouseX && this.mouseY) {
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouseRadius) {
                const force = (1 - distance / this.mouseRadius) * this.mouseForce;
                particle.speedX += (dx / distance) * force * 0.01;
                particle.speedY += (dy / distance) * force * 0.01;
            }
        }
        
        // Simple speed limiting
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > this.hoverFlowSpeed) {
            const scale = this.hoverFlowSpeed / speed;
            particle.speedX *= scale;
            particle.speedY *= scale;
        }
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary checking
        const rect = this.container.getBoundingClientRect();
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
    }
    
    draw() {
        const rect = this.container.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            
            // Enhanced glow effect
            this.ctx.shadowBlur = particle.size * 3;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
        });
        
        // Reset shadow effect
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    startAnimation() {
        if (!this.animationFrame) {
            const animate = () => {
                if (!this.isVisible) return;
                
                this.particles.forEach(particle => this.updateParticle(particle));
                this.draw();
                
                this.animationFrame = requestAnimationFrame(animate);
            };
            animate();
        }
    }
    
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

export function initCommunityTiers(options = {}) {
    const containers = document.querySelectorAll('.tier-container');
    const instances = [];
    
    containers.forEach(container => {
        const instance = new CommunityTiersAnimation({
            container,
            ...options
        });
        instances.push(instance);
    });
    
    return instances;
}

export default CommunityTiersAnimation; 