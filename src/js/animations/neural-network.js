/**
 * EMMIHUB - Neural-Organic Network Visualization
 * 
 * This module provides a canvas-based visualization of a neural network that
 * gradually transforms into organic structures resembling tree branches,
 * river deltas, or constellation maps.
 * 
 * @author Emmi C.
 * @version 1.0
 */

import errorLogger from '../core/error-logging.js';
import { createCanvas, setupContext, drawGlowingCircle, drawGlowingLine } from '../utils/canvas-utils.js';

/**
 * NeuralOrganicNetwork class for creating and controlling the neural-organic network visualization
 */
class NeuralOrganicNetwork {
    /**
     * Create a new neural-organic network visualization
     * @param {Object} options - Configuration options
     * @param {HTMLElement|string} options.container - Container element or selector
     * @param {number} [options.nodeCount=100] - Number of nodes to create
     * @param {number} [options.connectionDistance=150] - Maximum distance for node connections
     * @param {number} [options.nodeSize=[2,5]] - Min and max node size in pixels
     * @param {number} [options.lineWidth=0.5] - Line width for connections
     * @param {string} [options.nodeColor='#f9c74f'] - Color for nodes
     * @param {string} [options.lineColor='rgba(249, 199, 79, 0.3)'] - Color for connection lines
     * @param {number} [options.transformSpeed=0.0001] - Speed of transformation from neural to organic
     * @param {boolean} [options.responsive=true] - Whether to adjust for window resize
     */
    constructor(options) {
        // Default options
        this.defaults = {
            container: null,
            nodeCount: 100,
            connectionDistance: 150,
            nodeSize: [2, 5],
            lineWidth: 0.5,
            nodeColor: '#f9c74f',
            lineColor: 'rgba(249, 199, 79, 0.3)',
            transformSpeed: 0.0001,
            responsive: true
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
            errorLogger.error('Neural network container not found', 'neural-network', 'high');
            return;
        }
        
        // System state
        this.state = {
            isRunning: false,
            nodes: [],
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,
            animationFrame: null,
            transformPhase: 0, // 0 to 1, neural to organic
            lastTimestamp: 0
        };
        
        // Impulse state for neuron communication effect
        this.impulses = [];
        this.lastImpulseTime = 0;
        this.impulseInterval = 250; // ms between impulses
        
        // Initialize
        this.init();
        
        // Start animation automatically
        this.start();
    }
    
    /**
     * Initialize the visualization
     * @private
     */
    init() {
        try {
            this.createCanvas();
            this.createNodes();
            this.setupEventListeners();
            console.log('Neural network initialized successfully');
        } catch (error) {
            errorLogger.error(
                `Failed to initialize neural network: ${error.message}`,
                'neural-network',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Create canvas element
     * @private
     */
    createCanvas() {
        // Create canvas using utility function
        this.state.canvas = createCanvas(this.container, 'neural-network-canvas');
        this.state.ctx = setupContext(this.state.canvas);
        
        // Store dimensions
        const rect = this.container.getBoundingClientRect();
        this.state.width = rect.width;
        this.state.height = rect.height;
    }
    
    /**
     * Create initial nodes
     * @private
     */
    createNodes() {
        const { width, height } = this.state;
        const { nodeCount, nodeSize } = this.options;
        
        // Create nodes in a brain/circuit shape
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2;
            const radius = Math.min(width, height) * 0.3;
            const variance = Math.random() * radius * 0.2;
            
            // Calculate position with some randomness
            const x = width / 2 + Math.cos(angle) * (radius + variance);
            const y = height / 2 + Math.sin(angle) * (radius + variance);
            
            // Create node
            this.state.nodes.push({
                x,
                y,
                targetX: x,
                targetY: y,
                size: Array.isArray(nodeSize) ? 
                      nodeSize[0] + Math.random() * (nodeSize[1] - nodeSize[0]) :
                      nodeSize,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                connections: [],
                lastActive: 0,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
        if (this.options.responsive) {
            // Throttled resize handler
            let resizeTimeout;
            window.addEventListener('resize', () => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const rect = this.container.getBoundingClientRect();
                    this.state.width = rect.width;
                    this.state.height = rect.height;
                    this.state.canvas.width = rect.width * window.devicePixelRatio;
                    this.state.canvas.height = rect.height * window.devicePixelRatio;
                    this.state.canvas.style.width = `${rect.width}px`;
                    this.state.canvas.style.height = `${rect.height}px`;
                    this.state.ctx = setupContext(this.state.canvas);
                }, 250);
            });
        }
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
    
    /**
     * Start the animation
     * @returns {NeuralOrganicNetwork} This instance for chaining
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
     * @returns {NeuralOrganicNetwork} This instance for chaining
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

        // Safari performance optimization - skip frames if needed
        if (this.isSafari() && delta < 16) {  // Aim for ~60fps in Safari
            this.state.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
            return;
        }

        // Clear canvas - use more efficient clearing for Safari
        if (this.isSafari()) {
            this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        } else {
            this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
        }

        // Impulse logic: periodically add a new impulse
        if (!this.lastImpulseTime || timestamp - this.lastImpulseTime > this.impulseInterval) {
            this.addImpulse();
            this.lastImpulseTime = timestamp;
        }

        // Update impulses (fade out)
        this.impulses = this.impulses.filter(impulse => {
            impulse.age += delta;
            return impulse.age < impulse.duration;
        });

        // Update node positions
        this.updateNodes(delta);

        // Find connections between nodes - reduce connections in Safari
        if (this.isSafari()) {
            if (timestamp % 3 === 0) { // Only update connections every 3rd frame in Safari
                this.findConnections();
            }
        } else {
            this.findConnections();
        }

        // Draw connections first (behind nodes)
        this.drawConnections();

        // Draw impulses (electric communication lines)
        this.drawImpulses();

        // Draw nodes
        this.drawNodes(timestamp);

        // Continue animation
        this.state.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }
    
    /**
     * Detect Safari browser for optimizations
     * @private
     * @returns {boolean} Whether the browser is Safari
     */
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    
    /**
     * Update node positions
     * @param {number} delta - Time delta in milliseconds
     * @private
     */
    updateNodes(delta) {
        const transformPhaseChange = this.options.transformSpeed * delta;
        this.state.transformPhase = (this.state.transformPhase + transformPhaseChange) % 1;
        
        this.state.nodes.forEach(node => {
            // Apply movement
            node.x += node.speedX;
            node.y += node.speedY;
            
            // Wrap around edges with smooth transition
            const margin = node.size * 2;
            if (node.x < -margin) node.x = this.state.width + margin;
            if (node.x > this.state.width + margin) node.x = -margin;
            if (node.y < -margin) node.y = this.state.height + margin;
            if (node.y > this.state.height + margin) node.y = -margin;
            
            // Occasionally change direction
            if (Math.random() < 0.01) {
                node.speedX = (Math.random() - 0.5) * 0.5;
                node.speedY = (Math.random() - 0.5) * 0.5;
            }
            
            // Update target position based on transform phase
            const angle = Math.atan2(node.y - this.state.height / 2, node.x - this.state.width / 2);
            const distance = Math.sqrt(
                Math.pow(node.x - this.state.width / 2, 2) +
                Math.pow(node.y - this.state.height / 2, 2)
            );
            
            // Organic transformation
            const organicOffset = Math.sin(angle * 3 + this.state.transformPhase * Math.PI * 2) * 
                                (distance * 0.2);
            
            node.targetX = node.x + Math.cos(angle) * organicOffset;
            node.targetY = node.y + Math.sin(angle) * organicOffset;
            
            // Smooth movement towards target
            node.x += (node.targetX - node.x) * 0.1;
            node.y += (node.targetY - node.y) * 0.1;
        });
    }
    
    /**
     * Find connections between nodes
     * @private
     */
    findConnections() {
        const { nodes } = this.state;
        const { connectionDistance } = this.options;
        
        // Clear existing connections
        nodes.forEach(node => node.connections = []);
        
        // Find new connections
        for (let i = 0; i < nodes.length; i++) {
            const nodeA = nodes[i];
            
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeB = nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    nodeA.connections.push({
                        node: nodeB,
                        distance,
                        strength: 1 - (distance / connectionDistance)
                    });
                    nodeB.connections.push({
                        node: nodeA,
                        distance,
                        strength: 1 - (distance / connectionDistance)
                    });
                }
            }
        }
    }
    
    /**
     * Draw connections between nodes
     * @private
     */
    drawConnections() {
        const ctx = this.state.ctx;
        const { lineColor, lineWidth } = this.options;
        
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        
        this.state.nodes.forEach(node => {
            node.connections.forEach(connection => {
                if (node.index < connection.node.index) {
                    drawGlowingLine(
                        ctx,
                        node.x,
                        node.y,
                        connection.node.x,
                        connection.node.y,
                        lineColor,
                        lineWidth * connection.strength,
                        5 * connection.strength
                    );
                }
            });
        });
    }
    
    /**
     * Draw impulses (firing) lines
     * @private
     */
    drawImpulses() {
        const ctx = this.state.ctx;
        this.impulses.forEach(impulse => {
            const { from, to, age, duration } = impulse;
            const progress = age / duration;
            const opacity = 1 - progress;
            
            drawGlowingLine(
                ctx,
                from.x,
                from.y,
                to.x,
                to.y,
                this.options.nodeColor,
                this.options.lineWidth * 2,
                10 * opacity
            );
        });
    }
    
    /**
     * Draw nodes
     * @param {number} timestamp - Current animation timestamp
     * @private
     */
    drawNodes(timestamp) {
        const ctx = this.state.ctx;
        const { nodeColor } = this.options;
        
        this.state.nodes.forEach(node => {
            // Calculate pulse effect
            const pulse = 0.8 + 0.2 * Math.sin(timestamp * 0.001 * node.pulseSpeed + node.pulsePhase);
            
            // Draw node with glow
            drawGlowingCircle(
                ctx,
                node.x,
                node.y,
                node.size * pulse,
                nodeColor,
                pulse
            );
        });
    }
    
    /**
     * Add a new impulse between random connected nodes
     * @private
     */
    addImpulse() {
        const nodes = this.state.nodes.filter(node => node.connections.length > 0);
        if (nodes.length === 0) return;
        
        const fromNode = nodes[Math.floor(Math.random() * nodes.length)];
        const toConnection = fromNode.connections[
            Math.floor(Math.random() * fromNode.connections.length)
        ];
        
        this.impulses.push({
            from: fromNode,
            to: toConnection.node,
            age: 0,
            duration: 1000 + Math.random() * 500
        });
    }
    
    /**
     * Update colors of the visualization
     * @param {string} nodeColor - New color for nodes
     * @param {string} lineColor - New color for lines
     */
    updateColors(nodeColor, lineColor) {
        this.options.nodeColor = nodeColor;
        this.options.lineColor = lineColor;
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
        document.removeEventListener('visibilitychange', this.handleVisibility);
    }
}

/**
 * Initialize neural-organic network visualizations on elements with the 'neural-organic-network' class
 * @param {Object} [options] - Default options for all visualizations
 * @returns {Array<NeuralOrganicNetwork>} Array of visualization instances
 */
function initNeuralNetworks(options = {}) {
    const containers = document.querySelectorAll('.neural-organic-network');
    const instances = [];
    
    containers.forEach(container => {
        // Get container-specific options from data attributes
        const containerOptions = {
            container,
            nodeCount: container.dataset.nodeCount ? 
                      parseInt(container.dataset.nodeCount, 10) : 
                      options.nodeCount,
            nodeColor: container.dataset.nodeColor || 
                      options.nodeColor,
            lineColor: container.dataset.lineColor || 
                      options.lineColor
        };
        
        // Create visualization instance with merged options
        const instance = new NeuralOrganicNetwork({
            ...options,
            ...containerOptions
        });
        
        instances.push(instance);
    });
    
    return instances;
}

// Export the NeuralOrganicNetwork class and initialization function
export { NeuralOrganicNetwork, initNeuralNetworks };
export default NeuralOrganicNetwork;
