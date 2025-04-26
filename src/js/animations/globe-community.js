/**
 * EMMIHUB - Globe Community Visualization
 * 
 * This module provides a canvas-based visualization of a 3D globe with
 * connection lines forming between supporter locations.
 * 
 * @author Emmi C.
 * @version 1.0
 */

import errorLogger from '../core/error-logging.js';

/**
 * GlobeCommunity class for creating and controlling the globe visualization
 */
class GlobeCommunity {
    /**
     * Create a new globe community visualization
     * @param {Object} options - Configuration options
     * @param {HTMLElement|string} options.container - Container element or selector
     * @param {number} [options.radius=150] - Globe radius in pixels
     * @param {number} [options.rotationSpeed=0.0005] - Rotation speed in radians per millisecond
     * @param {string} [options.globeColor='rgba(0, 240, 255, 0.2)'] - Color for globe surface
     * @param {string} [options.landColor='rgba(0, 240, 255, 0.5)'] - Color for land masses
     * @param {string} [options.connectionColor='rgba(255, 255, 255, 0.6)'] - Color for connection lines
     * @param {number} [options.nodeCount=30] - Number of community nodes to display
     * @param {boolean} [options.responsive=true] - Whether to adjust for window resize
     * @param {boolean} [options.interactive=true] - Whether to enable mouse interaction
     */
    constructor(options) {
        // Default options
        this.defaults = {
            container: null,
            radius: 150,
            rotationSpeed: 0.0005,
            globeColor: 'rgba(0, 240, 255, 0.2)',
            landColor: 'rgba(0, 240, 255, 0.5)',
            connectionColor: 'rgba(255, 255, 255, 0.6)',
            nodeCount: 30,
            responsive: true,
            interactive: true
        };
        
        // Merge options with defaults
        this.options = { ...this.defaults, ...options };
        
        // Get container element
        if (typeof this.options.container === 'string') {
            this.container = document.querySelector(this.options.container);
        } else {
            this.container = this.options.container;
        }
        
        // Validate container
        if (!this.container) {
            errorLogger.error('Globe container not found', 'globe-community', 'high');
            return;
        }
        
        // System state
        this.state = {
            isRunning: false,
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,
            animationFrame: null,
            rotation: 0,
            lastTimestamp: 0,
            nodes: [],
            connections: [],
            mousePosition: { x: null, y: null },
            targetRotation: 0,
            currentRotation: 0
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the globe visualization
     * @private
     */
    init() {
        try {
            // Create canvas
            this.createCanvas();
            
            // Create globe data
            this.createGlobeData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start animation
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize globe: ${error.message}`,
                'globe-community',
                'medium',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Create canvas element
     * @private
     */
    createCanvas() {
        // Create canvas element
        this.state.canvas = document.createElement('canvas');
        this.state.canvas.classList.add('globe-canvas');
        
        // Set canvas size to container size
        this.state.width = this.container.offsetWidth;
        this.state.height = this.container.offsetHeight;
        this.state.canvas.width = this.state.width;
        this.state.canvas.height = this.state.height;
        
        // Style canvas
        this.state.canvas.style.position = 'absolute';
        this.state.canvas.style.top = '0';
        this.state.canvas.style.left = '0';
        this.state.canvas.style.width = '100%';
        this.state.canvas.style.height = '100%';
        
        // Get context
        this.state.ctx = this.state.canvas.getContext('2d');
        
        // Add canvas to container
        this.container.appendChild(this.state.canvas);
        
        // Make sure container has position relative if static
        const containerPosition = window.getComputedStyle(this.container).position;
        if (containerPosition === 'static') {
            this.container.style.position = 'relative';
        }
    }
    
    /**
     * Create globe data
     * @private
     */
    createGlobeData() {
        // Create community nodes (random locations on the globe)
        this.state.nodes = [];
        
        for (let i = 0; i < this.options.nodeCount; i++) {
            // Generate random spherical coordinates
            const lat = (Math.random() * 180 - 90) * (Math.PI / 180); // Convert to radians
            const lng = (Math.random() * 360 - 180) * (Math.PI / 180); // Convert to radians
            
            // Create node
            const node = {
                lat,
                lng,
                size: 2 + Math.random() * 3,
                color: this.options.landColor,
                pulseSpeed: 0.5 + Math.random() * 1.5,
                pulsePhase: Math.random() * Math.PI * 2,
                connections: []
            };
            
            this.state.nodes.push(node);
        }
        
        // Create connections between nodes
        this.state.connections = [];
        
        // Each node connects to 1-3 other nodes
        this.state.nodes.forEach((node, index) => {
            const connectionCount = 1 + Math.floor(Math.random() * 3);
            
            for (let i = 0; i < connectionCount; i++) {
                // Find a random node to connect to (not self)
                let targetIndex;
                do {
                    targetIndex = Math.floor(Math.random() * this.state.nodes.length);
                } while (targetIndex === index);
                
                // Create connection
                const connection = {
                    source: index,
                    target: targetIndex,
                    strength: 0.1 + Math.random() * 0.9,
                    pulseSpeed: 0.5 + Math.random() * 1.5,
                    pulsePhase: Math.random() * Math.PI * 2
                };
                
                this.state.connections.push(connection);
                
                // Add to node's connections
                node.connections.push(this.state.connections.length - 1);
            }
        });
    }
    
    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
        // Window resize event
        if (this.options.responsive) {
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        }
        
        // Mouse interaction
        if (this.options.interactive) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.state.canvas.getBoundingClientRect();
                this.state.mousePosition = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                
                // Calculate target rotation based on mouse position
                const centerX = this.state.width / 2;
                const relativeX = (this.state.mousePosition.x - centerX) / centerX;
                this.state.targetRotation = relativeX * Math.PI * 0.5;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.state.mousePosition = { x: null, y: null };
                this.state.targetRotation = 0;
            });
        }
    }
    
    /**
     * Handle window resize
     * @private
     */
    handleResize() {
        // Clear any existing resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        
        // Set a timeout to avoid excessive resizing
        this.resizeTimeout = setTimeout(() => {
            // Update canvas size
            this.state.width = this.container.offsetWidth;
            this.state.height = this.container.offsetHeight;
            this.state.canvas.width = this.state.width;
            this.state.canvas.height = this.state.height;
            
            // Clear timeout
            this.resizeTimeout = null;
        }, 200);
    }
    
    /**
     * Start the animation
     * @returns {GlobeCommunity} This instance for chaining
     */
    start() {
        if (this.state.isRunning) return this;
        
        this.state.isRunning = true;
        this.state.lastTimestamp = performance.now();
        this.animate();
        
        return this;
    }
    
    /**
     * Stop the animation
     * @returns {GlobeCommunity} This instance for chaining
     */
    stop() {
        this.state.isRunning = false;
        
        if (this.state.animationFrame) {
            cancelAnimationFrame(this.state.animationFrame);
            this.state.animationFrame = null;
        }
        
        return this;
    }
    
    /**
     * Animation loop
     * @private
     */
    animate(timestamp = performance.now()) {
        if (!this.state.isRunning) return;
        
        // Calculate time delta
        const delta = timestamp - this.state.lastTimestamp;
        this.state.lastTimestamp = timestamp;
        
        // Update rotation
        if (this.options.interactive && this.state.mousePosition.x !== null) {
            // Smoothly interpolate to target rotation
            this.state.currentRotation += (this.state.targetRotation - this.state.currentRotation) * 0.05;
        } else {
            // Auto-rotate when not interacting
            this.state.rotation += this.options.rotationSpeed * delta;
            
            // Normalize rotation
            if (this.state.rotation > Math.PI * 2) {
                this.state.rotation -= Math.PI * 2;
            }
            
            this.state.currentRotation = this.state.rotation;
        }
        
        // Clear canvas
        this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
        
        // Draw globe
        this.drawGlobe();
        
        // Continue animation
        this.state.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }
    
    /**
     * Draw the globe
     * @private
     */
    drawGlobe() {
        const ctx = this.state.ctx;
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const radius = this.options.radius;
        
        // Draw globe background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = this.options.globeColor;
        ctx.fill();
        
        // Draw longitude lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            
            ctx.beginPath();
            
            // Calculate points along the longitude line
            for (let j = 0; j <= 36; j++) {
                const lat = (j / 36) * Math.PI - Math.PI / 2;
                const point = this.projectToScreen(lat, angle + this.state.currentRotation, centerX, centerY, radius);
                
                if (j === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            
            ctx.stroke();
        }
        
        // Draw latitude lines
        for (let i = 1; i < 6; i++) {
            const lat = (i / 6) * Math.PI / 2;
            
            // Northern hemisphere
            ctx.beginPath();
            for (let j = 0; j <= 36; j++) {
                const lng = (j / 36) * Math.PI * 2;
                const point = this.projectToScreen(lat, lng + this.state.currentRotation, centerX, centerY, radius);
                
                if (j === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
            
            // Southern hemisphere
            ctx.beginPath();
            for (let j = 0; j <= 36; j++) {
                const lng = (j / 36) * Math.PI * 2;
                const point = this.projectToScreen(-lat, lng + this.state.currentRotation, centerX, centerY, radius);
                
                if (j === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            }
            ctx.stroke();
        }
        
        // Draw connections
        this.drawConnections(ctx, centerX, centerY, radius);
        
        // Draw nodes
        this.drawNodes(ctx, centerX, centerY, radius);
    }
    
    /**
     * Draw community nodes
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Globe radius
     * @private
     */
    drawNodes(ctx, centerX, centerY, radius) {
        const time = performance.now() / 1000;
        
        this.state.nodes.forEach((node, index) => {
            // Project node position to screen
            const point = this.projectToScreen(node.lat, node.lng + this.state.currentRotation, centerX, centerY, radius);
            
            // Calculate z-coordinate to determine if node is visible (on front side of globe)
            const z = Math.cos(node.lat) * Math.cos(node.lng + this.state.currentRotation);
            
            // Only draw nodes on the front side of the globe
            if (z >= 0) {
                // Calculate pulse effect
                const pulse = 0.8 + 0.2 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
                
                // Draw node
                ctx.beginPath();
                ctx.arc(point.x, point.y, node.size * pulse, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // Draw glow
                const gradient = ctx.createRadialGradient(
                    point.x, point.y, node.size * pulse,
                    point.x, point.y, node.size * pulse * 3
                );
                gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, node.size * pulse * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
    }
    
    /**
     * Draw connections between nodes
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Globe radius
     * @private
     */
    drawConnections(ctx, centerX, centerY, radius) {
        const time = performance.now() / 1000;
        
        this.state.connections.forEach(connection => {
            const sourceNode = this.state.nodes[connection.source];
            const targetNode = this.state.nodes[connection.target];
            
            // Project node positions to screen
            const sourcePoint = this.projectToScreen(sourceNode.lat, sourceNode.lng + this.state.currentRotation, centerX, centerY, radius);
            const targetPoint = this.projectToScreen(targetNode.lat, targetNode.lng + this.state.currentRotation, centerX, centerY, radius);
            
            // Calculate z-coordinates to determine if connection is visible
            const sourceZ = Math.cos(sourceNode.lat) * Math.cos(sourceNode.lng + this.state.currentRotation);
            const targetZ = Math.cos(targetNode.lat) * Math.cos(targetNode.lng + this.state.currentRotation);
            
            // Only draw connections where at least one end is on the front side of the globe
            if (sourceZ >= 0 || targetZ >= 0) {
                // Calculate pulse effect
                const pulse = 0.5 + 0.5 * Math.sin(time * connection.pulseSpeed + connection.pulsePhase);
                
                // Draw connection line
                ctx.beginPath();
                ctx.moveTo(sourcePoint.x, sourcePoint.y);
                
                // Calculate control point for curved line
                const midX = (sourcePoint.x + targetPoint.x) / 2;
                const midY = (sourcePoint.y + targetPoint.y) / 2;
                
                // Curve the line outward from the globe center
                const dx = targetPoint.x - sourcePoint.x;
                const dy = targetPoint.y - sourcePoint.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate control point offset
                const offsetX = -dy / distance * distance * 0.3;
                const offsetY = dx / distance * distance * 0.3;
                
                // Draw curved line
                ctx.quadraticCurveTo(
                    midX + offsetX,
                    midY + offsetY,
                    targetPoint.x,
                    targetPoint.y
                );
                
                // Set line style with pulse effect
                ctx.strokeStyle = this.options.connectionColor;
                ctx.lineWidth = 1 * pulse * connection.strength;
                ctx.stroke();
                
                // Draw energy pulse along the connection
                this.drawEnergyPulse(ctx, sourcePoint, targetPoint, midX + offsetX, midY + offsetY, time, connection);
            }
        });
    }
    
    /**
     * Draw energy pulse along a connection
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} sourcePoint - Source point coordinates
     * @param {Object} targetPoint - Target point coordinates
     * @param {number} controlX - Control point X coordinate
     * @param {number} controlY - Control point Y coordinate
     * @param {number} time - Current time
     * @param {Object} connection - Connection data
     * @private
     */
    drawEnergyPulse(ctx, sourcePoint, targetPoint, controlX, controlY, time, connection) {
        // Calculate pulse position (0 to 1)
        const pulsePos = (time * 0.5 + connection.pulsePhase) % 1;
        
        // Calculate point along the quadratic curve
        const t = pulsePos;
        const x = (1 - t) * (1 - t) * sourcePoint.x + 2 * (1 - t) * t * controlX + t * t * targetPoint.x;
        const y = (1 - t) * (1 - t) * sourcePoint.y + 2 * (1 - t) * t * controlY + t * t * targetPoint.y;
        
        // Draw pulse
        const pulseSize = 2 * connection.strength;
        
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Draw glow
        const gradient = ctx.createRadialGradient(
            x, y, pulseSize,
            x, y, pulseSize * 3
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    /**
     * Project spherical coordinates to screen coordinates
     * @param {number} lat - Latitude in radians
     * @param {number} lng - Longitude in radians
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Globe radius
     * @returns {Object} Screen coordinates {x, y}
     * @private
     */
    projectToScreen(lat, lng, centerX, centerY, radius) {
        // Convert spherical to Cartesian coordinates
        const x = Math.cos(lat) * Math.sin(lng);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lng);
        
        // Project to 2D
        return {
            x: centerX + radius * x,
            y: centerY - radius * y // Negate y for screen coordinates
        };
    }
    
    /**
     * Update colors based on theme
     * @param {string} globeColor - Color for globe surface
     * @param {string} landColor - Color for land masses
     * @param {string} connectionColor - Color for connection lines
     * @returns {GlobeCommunity} This instance for chaining
     */
    updateColors(globeColor, landColor, connectionColor) {
        this.options.globeColor = globeColor;
        this.options.landColor = landColor;
        this.options.connectionColor = connectionColor;
        
        // Update node colors
        this.state.nodes.forEach(node => {
            node.color = landColor;
        });
        
        return this;
    }
    
    /**
     * Destroy the visualization and clean up
     */
    destroy() {
        // Stop animation
        this.stop();
        
        // Remove canvas
        if (this.state.canvas && this.state.canvas.parentNode) {
            this.state.canvas.parentNode.removeChild(this.state.canvas);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        if (this.options.interactive) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
            this.container.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }
}

/**
 * Initialize globe community visualizations on elements with the 'globe' class
 * @param {Object} [options] - Default options for all visualizations
 * @returns {Array<GlobeCommunity>} Array of visualization instances
 */
function initGlobeCommunities(options = {}) {
    const containers = document.querySelectorAll('.globe');
    const instances = [];
    
    containers.forEach(container => {
        // Get container-specific options from data attributes
        const containerOptions = {
            container,
            radius: container.dataset.radius ? 
                   parseInt(container.dataset.radius, 10) : 
                   options.radius,
            nodeCount: container.dataset.nodeCount ? 
                      parseInt(container.dataset.nodeCount, 10) : 
                      options.nodeCount
        };
        
        // Create visualization instance with merged options
        const instance = new GlobeCommunity({
            ...options,
            ...containerOptions
        });
        
        instances.push(instance);
    });
    
    return instances;
}

// Export the GlobeCommunity class and initialization function
export { GlobeCommunity, initGlobeCommunities };
export default GlobeCommunity;
