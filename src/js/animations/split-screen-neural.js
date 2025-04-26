/**
 * EMMIHUB - Split-Screen Neural Visualization
 * 
 * This module provides a visualization for the Introduction section that shows
 * human brain neural pathways on the left side and AI neural network on the right side,
 * with animated connections between them.
 * 
 * @author Emmi C.
 * @version 1.0
 */

import errorLogger from '../core/error-logging.js';

/**
 * SplitScreenNeural class for creating and controlling the split-screen neural visualization
 */
class SplitScreenNeural {
    /**
     * Create a new split-screen neural visualization
     * @param {Object} options - Configuration options
     * @param {HTMLElement|string} options.humanSide - Human side container element or selector
     * @param {HTMLElement|string} options.aiSide - AI side container element or selector
     * @param {HTMLElement|string} options.connectionZone - Connection zone container element or selector
     * @param {string} [options.humanColor='#00b4d8'] - Base color for human side
     * @param {string} [options.humanGradient='#90e0ef'] - Secondary color for human side gradient
     * @param {string} [options.aiColor='#7209b7'] - Base color for AI side
     * @param {string} [options.aiGradient='#f72585'] - Secondary color for AI side gradient
     * @param {number} [options.nodeCount=50] - Number of nodes per side
     * @param {number} [options.connectionCount=10] - Number of connections between sides
     * @param {number} [options.pulseFrequency=3] - Seconds between pulses
     * @param {boolean} [options.responsive=true] - Whether to adjust for window resize
     */
    constructor(options) {
        // Default options
        this.defaults = {
            humanSide: null,
            aiSide: null,
            connectionZone: null,
            humanColor: '#00b4d8',
            humanGradient: '#90e0ef',
            aiColor: '#7209b7',
            aiGradient: '#f72585',
            nodeCount: 50,
            connectionCount: 10,
            pulseFrequency: 0.5, // Reduced from 1 to 0.5 seconds for even more frequent pulses (2x more often)
            responsive: true
        };
        
        // Merge options with defaults
        this.options = { ...this.defaults, ...options };
        
        // Get container elements
        if (typeof this.options.humanSide === 'string') {
            this.humanSide = document.querySelector(this.options.humanSide);
        } else {
            this.humanSide = this.options.humanSide;
        }
        
        if (typeof this.options.aiSide === 'string') {
            this.aiSide = document.querySelector(this.options.aiSide);
        } else {
            this.aiSide = this.options.aiSide;
        }
        
        if (typeof this.options.connectionZone === 'string') {
            this.connectionZone = document.querySelector(this.options.connectionZone);
        } else {
            this.connectionZone = this.options.connectionZone;
        }
        
        // Validate containers
        if (!this.humanSide || !this.aiSide || !this.connectionZone) {
            errorLogger.error('Split-screen neural visualization containers not found', 'split-screen-neural', 'high');
            return;
        }
        
        // System state
        this.state = {
            isRunning: false,
            humanCanvas: null,
            humanCtx: null,
            aiCanvas: null,
            aiCtx: null,
            connectionCanvas: null,
            connectionCtx: null,
            humanWidth: 0,
            humanHeight: 0,
            aiWidth: 0,
            aiHeight: 0,
            connectionWidth: 0,
            connectionHeight: 0,
            humanNodes: [],
            aiNodes: [],
            connections: [],
            pulses: [],
            animationFrame: null,
            lastTimestamp: 0,
            lastPulseTime: 0
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the split-screen neural visualization
     * @private
     */
    init() {
        try {
            // Create canvases
            this.createCanvases();
            
            // Create nodes and connections
            this.createNodes();
            this.createConnections();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start animation
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize split-screen neural visualization: ${error.message}`,
                'split-screen-neural',
                'medium',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Create canvas elements
     * @private
     */
    createCanvases() {
        // Human side canvas
        this.state.humanCanvas = document.createElement('canvas');
        this.state.humanCanvas.classList.add('human-neural-canvas');
        this.state.humanWidth = this.humanSide.offsetWidth;
        this.state.humanHeight = this.humanSide.offsetHeight;
        this.state.humanCanvas.width = this.state.humanWidth;
        this.state.humanCanvas.height = this.state.humanHeight;
        this.state.humanCanvas.style.position = 'absolute';
        this.state.humanCanvas.style.top = '0';
        this.state.humanCanvas.style.left = '0';
        this.state.humanCanvas.style.width = '100%';
        this.state.humanCanvas.style.height = '100%';
        this.state.humanCanvas.style.pointerEvents = 'none';
        this.state.humanCtx = this.state.humanCanvas.getContext('2d');
        this.humanSide.appendChild(this.state.humanCanvas);
        
        // AI side canvas
        this.state.aiCanvas = document.createElement('canvas');
        this.state.aiCanvas.classList.add('ai-neural-canvas');
        this.state.aiWidth = this.aiSide.offsetWidth;
        this.state.aiHeight = this.aiSide.offsetHeight;
        this.state.aiCanvas.width = this.state.aiWidth;
        this.state.aiCanvas.height = this.state.aiHeight;
        this.state.aiCanvas.style.position = 'absolute';
        this.state.aiCanvas.style.top = '0';
        this.state.aiCanvas.style.left = '0';
        this.state.aiCanvas.style.width = '100%';
        this.state.aiCanvas.style.height = '100%';
        this.state.aiCanvas.style.pointerEvents = 'none';
        this.state.aiCtx = this.state.aiCanvas.getContext('2d');
        this.aiSide.appendChild(this.state.aiCanvas);
        
        // Connection zone canvas
        this.state.connectionCanvas = document.createElement('canvas');
        this.state.connectionCanvas.classList.add('connection-neural-canvas');
        this.state.connectionWidth = this.connectionZone.offsetWidth;
        this.state.connectionHeight = this.connectionZone.offsetHeight;
        this.state.connectionCanvas.width = this.state.connectionWidth;
        this.state.connectionCanvas.height = this.state.connectionHeight;
        this.state.connectionCanvas.style.position = 'absolute';
        this.state.connectionCanvas.style.top = '0';
        this.state.connectionCanvas.style.left = '0';
        this.state.connectionCanvas.style.width = '100%';
        this.state.connectionCanvas.style.height = '100%';
        this.state.connectionCanvas.style.pointerEvents = 'none';
        this.state.connectionCtx = this.state.connectionCanvas.getContext('2d');
        this.connectionZone.appendChild(this.state.connectionCanvas);
        
        // Make sure containers have position relative if static
        const humanPosition = window.getComputedStyle(this.humanSide).position;
        if (humanPosition === 'static') {
            this.humanSide.style.position = 'relative';
        }
        
        const aiPosition = window.getComputedStyle(this.aiSide).position;
        if (aiPosition === 'static') {
            this.aiSide.style.position = 'relative';
        }
        
        const connectionPosition = window.getComputedStyle(this.connectionZone).position;
        if (connectionPosition === 'static') {
            this.connectionZone.style.position = 'relative';
        }
    }
    
    /**
     * Create nodes for both sides
     * @private
     */
    createNodes() {
        // Define layers for a neural network structure (same for both sides)
        const layers = [
            { count: 5, yPos: 0.2 },    // Input layer - 5 nodes
            { count: 8, yPos: 0.35 },   // Hidden layer 1 - 8 nodes
            { count: 12, yPos: 0.5 },   // Hidden layer 2 - 12 nodes
            { count: 8, yPos: 0.65 },   // Hidden layer 3 - 8 nodes
            { count: 3, yPos: 0.8 }     // Output layer - 3 nodes
        ];
        
        // Create human side nodes with layered structure
        this.state.humanNodes = [];
        
        // Create nodes for each layer on human side
        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < layer.count; i++) {
                // Calculate position with minimal randomness to maintain clean structure
                // Distribute nodes evenly across the width based on their count
                const xPos = 0.1 + 0.8 * (i / (layer.count - 1 || 1)); // 10% padding on each side
                const yPos = layer.yPos;
                
                // Add very slight randomness for natural look but maintain clear layer structure
                const xRandom = (Math.random() - 0.5) * 0.02; // Minimal horizontal randomness
                const yRandom = (Math.random() - 0.5) * 0.02; // Minimal vertical randomness
                
                const node = {
                    x: (xPos + xRandom) * this.state.humanWidth,
                    y: (yPos + yRandom) * this.state.humanHeight,
                    size: 2 + Math.random(), // Slightly larger nodes for visibility
                    connections: [],
                    pulseSpeed: 0.5 + Math.random() * 0.5,
                    pulsePhase: Math.random() * Math.PI * 2,
                    isActive: Math.random() < 0.4, // 40% of nodes are active (glowing)
                    layer: layerIndex
                };
                
                this.state.humanNodes.push(node);
            }
        });
        
        // Create AI side nodes with identical layered structure
        this.state.aiNodes = [];
        
        // Create nodes for each layer on AI side
        layers.forEach((layer, layerIndex) => {
            for (let i = 0; i < layer.count; i++) {
                // Calculate position with minimal randomness to maintain clean structure
                // Distribute nodes evenly across the width based on their count
                const xPos = 0.1 + 0.8 * (i / (layer.count - 1 || 1)); // 10% padding on each side
                const yPos = layer.yPos;
                
                // Add very slight randomness for natural look but maintain clear layer structure
                const xRandom = (Math.random() - 0.5) * 0.02; // Minimal horizontal randomness
                const yRandom = (Math.random() - 0.5) * 0.02; // Minimal vertical randomness
                
                const node = {
                    x: (xPos + xRandom) * this.state.aiWidth,
                    y: (yPos + yRandom) * this.state.aiHeight,
                    size: 2 + Math.random(), // Slightly larger nodes for visibility
                    connections: [],
                    pulseSpeed: 0.5 + Math.random() * 0.5,
                    pulsePhase: Math.random() * Math.PI * 2,
                    isActive: Math.random() < 0.4, // 40% of nodes are active (glowing)
                    layer: layerIndex
                };
                
                this.state.aiNodes.push(node);
            }
        });
        
        // Create internal connections for both sides using the same pattern
        // This creates the neural network connection pattern shown in the image
        
        // Function to create connections for a side
        const createLayeredConnections = (nodes) => {
            // Group nodes by layer
            const nodesByLayer = {};
            nodes.forEach((node, index) => {
                if (!nodesByLayer[node.layer]) {
                    nodesByLayer[node.layer] = [];
                }
                nodesByLayer[node.layer].push({ node, index });
            });
            
            // For each layer except the last one
            for (let layer = 0; layer < 4; layer++) {
                const currentLayerNodes = nodesByLayer[layer] || [];
                const nextLayerNodes = nodesByLayer[layer + 1] || [];
                
                // Connect each node in current layer to multiple nodes in next layer
                currentLayerNodes.forEach(({ node, index }) => {
                    // Connect to multiple nodes in next layer (similar to image)
                    // Each node connects to about 60% of nodes in next layer
                    const connectionsCount = Math.ceil(nextLayerNodes.length * 0.6);
                    
                    // Create an array of indices to choose from
                    const availableTargets = [...Array(nextLayerNodes.length).keys()];
                    
                    // Select random targets from next layer
                    for (let i = 0; i < connectionsCount; i++) {
                        if (availableTargets.length === 0) break;
                        
                        // Select a random target
                        const randomIndex = Math.floor(Math.random() * availableTargets.length);
                        const targetNodeInfo = nextLayerNodes[availableTargets[randomIndex]];
                        
                        // Remove selected target to avoid duplicate connections
                        availableTargets.splice(randomIndex, 1);
                        
                        // Add connection
                        node.connections.push({
                            target: targetNodeInfo.index,
                            strength: 0.4 + Math.random() * 0.6 // Strong connections
                        });
                    }
                });
            }
        };
        
        // Create connections for both sides
        createLayeredConnections(this.state.humanNodes);
        createLayeredConnections(this.state.aiNodes);
    }
    
    /**
     * Create connections between human and AI sides
     * @private
     */
    createConnections() {
        this.state.connections = [];
        
        // Create connections between human and AI sides
        // Use more connections than the default to create a richer network
        const connectionCount = this.options.connectionCount * 2;
        
        for (let i = 0; i < connectionCount; i++) {
            // Select nodes from each side with some bias towards active nodes
            let humanIndex, aiIndex;
            
            // Try to select active nodes with higher probability
            if (Math.random() < 0.7) {
                // Get active nodes
                const activeHumanNodes = this.state.humanNodes
                    .map((node, index) => ({ node, index }))
                    .filter(item => item.node.isActive);
                
                const activeAINodes = this.state.aiNodes
                    .map((node, index) => ({ node, index }))
                    .filter(item => item.node.isActive);
                
                // Select from active nodes if available
                if (activeHumanNodes.length > 0) {
                    humanIndex = activeHumanNodes[Math.floor(Math.random() * activeHumanNodes.length)].index;
                } else {
                    humanIndex = Math.floor(Math.random() * this.state.humanNodes.length);
                }
                
                if (activeAINodes.length > 0) {
                    aiIndex = activeAINodes[Math.floor(Math.random() * activeAINodes.length)].index;
                } else {
                    aiIndex = Math.floor(Math.random() * this.state.aiNodes.length);
                }
            } else {
                // Random selection
                humanIndex = Math.floor(Math.random() * this.state.humanNodes.length);
                aiIndex = Math.floor(Math.random() * this.state.aiNodes.length);
            }
            
            // Create connection with varying strength
            const connection = {
                humanNode: humanIndex,
                aiNode: aiIndex,
                strength: 0.3 + Math.random() * 0.7,
                pulseSpeed: 0.5 + Math.random() * 1.5,
                pulsePhase: Math.random() * Math.PI * 2
            };
            
            this.state.connections.push(connection);
        }
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
            // Update canvas sizes
            this.state.humanWidth = this.humanSide.offsetWidth;
            this.state.humanHeight = this.humanSide.offsetHeight;
            this.state.humanCanvas.width = this.state.humanWidth;
            this.state.humanCanvas.height = this.state.humanHeight;
            
            this.state.aiWidth = this.aiSide.offsetWidth;
            this.state.aiHeight = this.aiSide.offsetHeight;
            this.state.aiCanvas.width = this.state.aiWidth;
            this.state.aiCanvas.height = this.state.aiHeight;
            
            this.state.connectionWidth = this.connectionZone.offsetWidth;
            this.state.connectionHeight = this.connectionZone.offsetHeight;
            this.state.connectionCanvas.width = this.state.connectionWidth;
            this.state.connectionCanvas.height = this.state.connectionHeight;
            
            // Redistribute nodes
            this.redistributeNodes();
            
            // Clear timeout
            this.resizeTimeout = null;
        }, 200);
    }
    
    /**
     * Redistribute nodes after resize
     * @private
     */
    redistributeNodes() {
        // Redistribute human nodes
        this.state.humanNodes.forEach(node => {
            // Scale position to new dimensions
            node.x = (node.x / this.state.humanWidth) * this.humanSide.offsetWidth;
            node.y = (node.y / this.state.humanHeight) * this.humanSide.offsetHeight;
        });
        
        // Redistribute AI nodes
        this.state.aiNodes.forEach(node => {
            // Scale position to new dimensions
            node.x = (node.x / this.state.aiWidth) * this.aiSide.offsetWidth;
            node.y = (node.y / this.state.aiHeight) * this.aiSide.offsetHeight;
        });
        
        // Update dimensions
        this.state.humanWidth = this.humanSide.offsetWidth;
        this.state.humanHeight = this.humanSide.offsetHeight;
        this.state.aiWidth = this.aiSide.offsetWidth;
        this.state.aiHeight = this.aiSide.offsetHeight;
        this.state.connectionWidth = this.connectionZone.offsetWidth;
        this.state.connectionHeight = this.connectionZone.offsetHeight;
    }
    
    /**
     * Start the animation
     * @returns {SplitScreenNeural} This instance for chaining
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
     * @returns {SplitScreenNeural} This instance for chaining
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
        
        // Clear canvases
        this.state.humanCtx.clearRect(0, 0, this.state.humanWidth, this.state.humanHeight);
        this.state.aiCtx.clearRect(0, 0, this.state.aiWidth, this.state.aiHeight);
        this.state.connectionCtx.clearRect(0, 0, this.state.connectionWidth, this.state.connectionHeight);
        
        // Draw human side
        this.drawHumanSide(delta);
        
        // Draw AI side
        this.drawAISide(delta);
        
        // Draw connections
        this.drawConnections(delta);
        
        // Generate new pulse if needed
        if (timestamp - this.state.lastPulseTime > this.options.pulseFrequency * 1000) {
            this.generatePulse();
            this.state.lastPulseTime = timestamp;
        }
        
        // Update pulses
        this.updatePulses(delta);
        
        // Continue animation
        this.state.animationFrame = requestAnimationFrame((ts) => this.animate(ts));
    }
    
    /**
     * Draw human side neural network
     * @param {number} delta - Time delta in milliseconds
     * @private
     */
    drawHumanSide(delta) {
        const ctx = this.state.humanCtx;
        const time = performance.now() / 1000;
        
        // Draw connections first (behind nodes)
        ctx.strokeStyle = this.options.humanColor;
        ctx.lineWidth = 0.5;
        
        this.state.humanNodes.forEach((node, index) => {
            node.connections.forEach(connection => {
                const targetNode = this.state.humanNodes[connection.target];
                
                // Calculate opacity based on connection strength and time
                const opacity = 0.1 + connection.strength * 0.3 + 
                               Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.1;
                
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(targetNode.x, targetNode.y);
                ctx.strokeStyle = `rgba(${this.hexToRgb(this.options.humanColor)}, ${opacity})`;
                ctx.stroke();
            });
        });
        
        // Draw nodes
        this.state.humanNodes.forEach(node => {
            // Calculate pulse effect
            const pulse = 0.8 + 0.2 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
            
            if (node.isActive) {
                // Active nodes have glow effect
                ctx.fillStyle = this.options.humanGradient;
                
                // Add glow
                const gradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, node.size * 3
                );
                gradient.addColorStop(0, this.options.humanGradient);
                gradient.addColorStop(1, `rgba(${this.hexToRgb(this.options.humanColor)}, 0)`);
                
                ctx.shadowColor = this.options.humanGradient;
                ctx.shadowBlur = 5;
            } else {
                // Regular nodes
                ctx.fillStyle = this.options.humanColor;
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for next drawing
        });
    }
    
    /**
     * Draw AI side neural network
     * @param {number} delta - Time delta in milliseconds
     * @private
     */
    drawAISide(delta) {
        const ctx = this.state.aiCtx;
        const time = performance.now() / 1000;
        
        // Draw connections first (behind nodes)
        ctx.strokeStyle = this.options.aiColor;
        ctx.lineWidth = 0.5;
        
        this.state.aiNodes.forEach((node, index) => {
            node.connections.forEach(connection => {
                const targetNode = this.state.aiNodes[connection.target];
                
                // Calculate opacity based on connection strength and time
                const opacity = 0.1 + connection.strength * 0.3 + 
                               Math.sin(time * node.pulseSpeed + node.pulsePhase) * 0.1;
                
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(targetNode.x, targetNode.y);
                ctx.strokeStyle = `rgba(${this.hexToRgb(this.options.aiColor)}, ${opacity})`;
                ctx.stroke();
            });
        });
        
        // Draw nodes
        this.state.aiNodes.forEach(node => {
            // Calculate pulse effect
            const pulse = 0.8 + 0.2 * Math.sin(time * node.pulseSpeed + node.pulsePhase);
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
            
            if (node.isActive) {
                // Active nodes have glow effect
                ctx.fillStyle = this.options.aiGradient;
                
                // Add glow
                const gradient = ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, node.size * 3
                );
                gradient.addColorStop(0, this.options.aiGradient);
                gradient.addColorStop(1, `rgba(${this.hexToRgb(this.options.aiColor)}, 0)`);
                
                ctx.shadowColor = this.options.aiGradient;
                ctx.shadowBlur = 5;
            } else {
                // Regular nodes
                ctx.fillStyle = this.options.aiColor;
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow for next drawing
        });
    }
    
    /**
     * Draw connections between human and AI sides
     * @param {number} delta - Time delta in milliseconds
     * @private
     */
    drawConnections(delta) {
        const ctx = this.state.connectionCtx;
        const time = performance.now() / 1000;
        
        // Get connection zone position relative to human and AI sides
        const humanRect = this.humanSide.getBoundingClientRect();
        const aiRect = this.aiSide.getBoundingClientRect();
        const connectionRect = this.connectionZone.getBoundingClientRect();
        
        // Draw connections
        this.state.connections.forEach(connection => {
            const humanNode = this.state.humanNodes[connection.humanNode];
            const aiNode = this.state.aiNodes[connection.aiNode];
            
            // Calculate connection points
            const humanX = humanNode.x;
            const humanY = humanNode.y;
            const aiX = aiNode.x;
            const aiY = aiNode.y;
            
            // Calculate entry and exit points for connection zone
            const entryX = 0;
            const entryY = (humanY / this.state.humanHeight) * this.state.connectionHeight;
            const exitX = this.state.connectionWidth;
            const exitY = (aiY / this.state.aiHeight) * this.state.connectionHeight;
            
            // Calculate opacity based on connection strength and time
            const opacity = 0.3 + connection.strength * 0.4 + 
                           Math.sin(time * connection.pulseSpeed + connection.pulsePhase) * 0.2;
            
            // Draw connection line through connection zone
            ctx.beginPath();
            ctx.moveTo(entryX, entryY);
            ctx.lineTo(exitX, exitY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1 * connection.strength;
            ctx.stroke();
            
            // Also draw connection lines on human and AI sides
            // Human side connection line
            this.state.humanCtx.beginPath();
            this.state.humanCtx.moveTo(humanX, humanY);
            this.state.humanCtx.lineTo(this.state.humanWidth, humanY);
            this.state.humanCtx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
            this.state.humanCtx.lineWidth = 0.8 * connection.strength;
            this.state.humanCtx.stroke();
            
            // AI side connection line
            this.state.aiCtx.beginPath();
            this.state.aiCtx.moveTo(0, aiY);
            this.state.aiCtx.lineTo(aiX, aiY);
            this.state.aiCtx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
            this.state.aiCtx.lineWidth = 0.8 * connection.strength;
            this.state.aiCtx.stroke();
        });
    }
    
    /**
     * Generate new pulses
     * @private
     */
    generatePulse() {
        // Generate multiple pulses at once for more activity
        const pulseCount = 3 + Math.floor(Math.random() * 6); // Generate 3-9 pulses at once (3x more)
        
        for (let i = 0; i < pulseCount; i++) {
            // Determine pulse type
            const pulseType = Math.random();
            
            if (pulseType < 0.3) {
                // 30% chance: Cross-side pulse (human to AI or AI to human)
                const connectionIndex = Math.floor(Math.random() * this.state.connections.length);
                const connection = this.state.connections[connectionIndex];
                
                // Create cross-side pulse
                const pulse = {
                    type: 'cross-side',
                    connection: connectionIndex,
                    progress: 0,
                    duration: 800 + Math.random() * 1200, // 0.8-2 seconds
                    direction: Math.random() < 0.5 ? 'human-to-ai' : 'ai-to-human'
                };
                
                this.state.pulses.push(pulse);
            } 
            else if (pulseType < 0.65) {
                // 35% chance: Internal human side pulse (increased from 25%)
                if (this.state.humanNodes.length > 0) {
                    // Find a node with connections
                    let attempts = 0;
                    let sourceNodeIndex;
                    let sourceNode;
                    
                    do {
                        sourceNodeIndex = Math.floor(Math.random() * this.state.humanNodes.length);
                        sourceNode = this.state.humanNodes[sourceNodeIndex];
                        attempts++;
                    } while (sourceNode.connections.length === 0 && attempts < 10);
                    
                    if (sourceNode.connections.length > 0) {
                        // Select a random connection
                        const connectionIndex = Math.floor(Math.random() * sourceNode.connections.length);
                        const connection = sourceNode.connections[connectionIndex];
                        
                        // Create internal human pulse
                        const pulse = {
                            type: 'human-internal',
                            sourceNodeIndex: sourceNodeIndex,
                            targetNodeIndex: connection.target,
                            progress: 0,
                            duration: 600 + Math.random() * 800, // 0.6-1.4 seconds (faster than cross-side)
                            color: this.options.humanColor
                        };
                        
                        this.state.pulses.push(pulse);
                    }
                }
            } 
            else {
                // 35% chance: Internal AI side pulse (increased from 25%)
                if (this.state.aiNodes.length > 0) {
                    // Find a node with connections
                    let attempts = 0;
                    let sourceNodeIndex;
                    let sourceNode;
                    
                    do {
                        sourceNodeIndex = Math.floor(Math.random() * this.state.aiNodes.length);
                        sourceNode = this.state.aiNodes[sourceNodeIndex];
                        attempts++;
                    } while (sourceNode.connections.length === 0 && attempts < 10);
                    
                    if (sourceNode.connections.length > 0) {
                        // Select a random connection
                        const connectionIndex = Math.floor(Math.random() * sourceNode.connections.length);
                        const connection = sourceNode.connections[connectionIndex];
                        
                        // Create internal AI pulse
                        const pulse = {
                            type: 'ai-internal',
                            sourceNodeIndex: sourceNodeIndex,
                            targetNodeIndex: connection.target,
                            progress: 0,
                            duration: 600 + Math.random() * 800, // 0.6-1.4 seconds (faster than cross-side)
                            color: this.options.aiColor
                        };
                        
                        this.state.pulses.push(pulse);
                    }
                }
            }
        }
    }
    
    /**
     * Update pulses
     * @param {number} delta - Time delta in milliseconds
     * @private
     */
    updatePulses(delta) {
        const connectionCtx = this.state.connectionCtx;
        const humanCtx = this.state.humanCtx;
        const aiCtx = this.state.aiCtx;
        
        // Update each pulse
        this.state.pulses = this.state.pulses.filter(pulse => {
            // Update progress
            pulse.progress += delta / pulse.duration;
            
            // Remove completed pulses
            if (pulse.progress >= 1) {
                return false;
            }
            
            // Handle different pulse types
            if (pulse.type === 'cross-side') {
                // Cross-side pulse (human to AI or AI to human)
                const connection = this.state.connections[pulse.connection];
                const humanNode = this.state.humanNodes[connection.humanNode];
                const aiNode = this.state.aiNodes[connection.aiNode];
                
                // Calculate entry and exit points for connection zone
                const entryX = 0;
                const entryY = (humanNode.y / this.state.humanHeight) * this.state.connectionHeight;
                const exitX = this.state.connectionWidth;
                const exitY = (aiNode.y / this.state.aiHeight) * this.state.connectionHeight;
                
                // Draw pulse based on direction and progress
                if (pulse.direction === 'human-to-ai') {
                    // Human to AI direction
                    if (pulse.progress < 0.3) {
                        // First third: Human node to human side edge
                        const segmentProgress = pulse.progress / 0.3;
                        const x = humanNode.x + (this.state.humanWidth - humanNode.x) * segmentProgress;
                        const y = humanNode.y;
                        
                        // Draw on human side
                        this.drawPulse(humanCtx, x, y);
                    } 
                    else if (pulse.progress < 0.7) {
                        // Middle: Connection zone
                        const segmentProgress = (pulse.progress - 0.3) / 0.4;
                        const pulseX = entryX + (exitX - entryX) * segmentProgress;
                        const pulseY = entryY + (exitY - entryY) * segmentProgress;
                        
                        // Draw in connection zone
                        this.drawPulse(connectionCtx, pulseX, pulseY);
                    } 
                    else {
                        // Last third: AI side edge to AI node
                        const segmentProgress = (pulse.progress - 0.7) / 0.3;
                        const x = segmentProgress * aiNode.x;
                        const y = aiNode.y;
                        
                        // Draw on AI side
                        this.drawPulse(aiCtx, x, y);
                    }
                } 
                else {
                    // AI to Human direction
                    if (pulse.progress < 0.3) {
                        // First third: AI node to AI side edge
                        const segmentProgress = pulse.progress / 0.3;
                        const x = aiNode.x - aiNode.x * segmentProgress;
                        const y = aiNode.y;
                        
                        // Draw on AI side
                        this.drawPulse(aiCtx, x, y);
                    } 
                    else if (pulse.progress < 0.7) {
                        // Middle: Connection zone
                        const segmentProgress = (pulse.progress - 0.3) / 0.4;
                        const pulseX = exitX - (exitX - entryX) * segmentProgress;
                        const pulseY = exitY - (exitY - entryY) * segmentProgress;
                        
                        // Draw in connection zone
                        this.drawPulse(connectionCtx, pulseX, pulseY);
                    } 
                    else {
                        // Last third: Human side edge to Human node
                        const segmentProgress = (pulse.progress - 0.7) / 0.3;
                        const x = this.state.humanWidth - (this.state.humanWidth - humanNode.x) * segmentProgress;
                        const y = humanNode.y;
                        
                        // Draw on human side
                        this.drawPulse(humanCtx, x, y);
                    }
                }
            } 
            else if (pulse.type === 'human-internal') {
                // Internal human side pulse
                const sourceNode = this.state.humanNodes[pulse.sourceNodeIndex];
                const targetNode = this.state.humanNodes[pulse.targetNodeIndex];
                
                // Calculate position along the connection path
                const x = sourceNode.x + (targetNode.x - sourceNode.x) * pulse.progress;
                const y = sourceNode.y + (targetNode.y - sourceNode.y) * pulse.progress;
                
                // Draw pulse with human side color
                this.drawColoredPulse(humanCtx, x, y, this.options.humanColor);
            } 
            else if (pulse.type === 'ai-internal') {
                // Internal AI side pulse
                const sourceNode = this.state.aiNodes[pulse.sourceNodeIndex];
                const targetNode = this.state.aiNodes[pulse.targetNodeIndex];
                
                // Calculate position along the connection path
                const x = sourceNode.x + (targetNode.x - sourceNode.x) * pulse.progress;
                const y = sourceNode.y + (targetNode.y - sourceNode.y) * pulse.progress;
                
                // Draw pulse with AI side color
                this.drawColoredPulse(aiCtx, x, y, this.options.aiColor);
            }
            
            return true;
        });
    }
    
    /**
     * Draw a white pulse at the specified coordinates
     * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @private
     */
    drawPulse(ctx, x, y) {
        // Draw pulse
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Add glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, 6
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    /**
     * Draw a colored pulse at the specified coordinates
     * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Hex color string
     * @private
     */
    drawColoredPulse(ctx, x, y, color) {
        const rgbColor = this.hexToRgb(color);
        
        // Draw pulse (slightly smaller and more faded than cross-side pulses)
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgbColor}, 0.6)`;
        ctx.fill();
        
        // Add glow
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, 4
        );
        gradient.addColorStop(0, `rgba(${rgbColor}, 0.4)`);
        gradient.addColorStop(1, `rgba(${rgbColor}, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    /**
     * Convert hex color to RGB
     * @param {string} hex - Hex color string
     * @returns {string} RGB color string
     * @private
     */
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `${r}, ${g}, ${b}`;
    }
    
    /**
     * Update colors based on theme
     * @param {string} humanColor - Base color for human side
     * @param {string} humanGradient - Secondary color for human side gradient
     * @param {string} aiColor - Base color for AI side
     * @param {string} aiGradient - Secondary color for AI side gradient
     * @returns {SplitScreenNeural} This instance for chaining
     */
    updateColors(humanColor, humanGradient, aiColor, aiGradient) {
        this.options.humanColor = humanColor;
        this.options.humanGradient = humanGradient;
        this.options.aiColor = aiColor;
        this.options.aiGradient = aiGradient;
        
        return this;
    }
    
    /**
     * Destroy the visualization and clean up
     */
    destroy() {
        // Stop animation
        this.stop();
        
        // Remove canvases
        if (this.state.humanCanvas && this.state.humanCanvas.parentNode) {
            this.state.humanCanvas.parentNode.removeChild(this.state.humanCanvas);
        }
        
        if (this.state.aiCanvas && this.state.aiCanvas.parentNode) {
            this.state.aiCanvas.parentNode.removeChild(this.state.aiCanvas);
        }
        
        if (this.state.connectionCanvas && this.state.connectionCanvas.parentNode) {
            this.state.connectionCanvas.parentNode.removeChild(this.state.connectionCanvas);
        }
        
        // Remove event listeners
        if (this.options.responsive) {
            window.removeEventListener('resize', this.handleResize);
        }
    }
}

/**
 * Initialize split-screen neural visualizations on elements with the appropriate classes
 * @param {Object} [options] - Default options for all visualizations
 * @returns {Array<SplitScreenNeural>} Array of visualization instances
 */
function initSplitScreenNeural(options = {}) {
    const humanSides = document.querySelectorAll('.human-side');
    const aiSides = document.querySelectorAll('.ai-side');
    const connectionZones = document.querySelectorAll('.connection-zone');
    
    const instances = [];
    
    // Check if we have matching sets of containers
    if (humanSides.length === aiSides.length && humanSides.length === connectionZones.length) {
        for (let i = 0; i < humanSides.length; i++) {
            // Create visualization instance
            const instance = new SplitScreenNeural({
                ...options,
                humanSide: humanSides[i],
                aiSide: aiSides[i],
                connectionZone: connectionZones[i]
            });
            
            instances.push(instance);
        }
    } else {
        console.error('Mismatched container counts for split-screen neural visualization');
    }
    
    return instances;
}

// Export the SplitScreenNeural class and initialization function
export { SplitScreenNeural, initSplitScreenNeural };
export default SplitScreenNeural;
