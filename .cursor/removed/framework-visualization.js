/**
 * FrameworkVisualization - Advanced visualization for the PromptSage™ framework
 * Features:
 * - Hierarchical node structure with distinct node types
 * - Dynamic connections showing information flow
 * - Interactive highlighting and animations
 * - Theme integration with multi-color support
 * - Responsive design with high DPI support
 * - Accessibility features including reduced motion
 */
export class FrameworkVisualization {
    /**
     * @param {Object} config - Configuration object
     * @param {HTMLElement} config.container - Container element for the canvas
     * @param {string} [config.type='promptsage'] - Visualization type ('promptsage' or 'traditional')
     * @param {Object} config.colors - Color configuration for different node types
     * @param {Object} config.nodes - Node configuration for different types
     * @param {number} [config.connectionDistance=150] - Maximum distance for node connections
     * @param {boolean} [config.responsive=true] - Enable responsive resizing
     * @param {boolean} [config.reducedMotion=false] - Enable reduced motion mode
     */
    constructor(config) {
        // Default configuration
        this.config = {
            type: 'promptsage',
            colors: {
                hierarchical: '#4A90E2',
                cognitive: '#F7B731',
                ethical: '#FC5C65',
                connection: '#4A90E280'
            },
            nodes: {
                hierarchical: {
                    count: 8,
                    size: [4, 6],
                    speed: 0.5
                },
                cognitive: {
                    count: 6,
                    size: [3, 5],
                    speed: 0.7
                },
                ethical: {
                    count: 4,
                    size: [5, 7],
                    speed: 0.3
                }
            },
            connectionDistance: 150,
            responsive: true,
            reducedMotion: false,
            ...config
        };

        this.container = config.container;
        this.nodes = {
            hierarchical: [],
            cognitive: [],
            ethical: []
        };
        this.connections = [];
        this.animationFrame = null;
        this.resizeObserver = null;
        this.mousePosition = { x: null, y: null };
        this.highlightedType = null;
        
        this.initCanvas();
        this.initNodes();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Initialize the canvas with proper DPI scaling and theme integration
     * @private
     */
    initCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.dpr = window.devicePixelRatio || 1;
        this.updateCanvasSize();
    }

    /**
     * Initialize nodes based on framework type
     * @private
     */
    initNodes() {
        if (this.config.type === 'traditional') {
            this.initTraditionalNodes();
        } else {
            this.initPromptSageNodes();
        }
    }

    /**
     * Initialize nodes for traditional visualization
     * @private
     */
    initTraditionalNodes() {
        const nodeCount = 6;
        const spacing = this.canvas.width / (nodeCount + 1);
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.hierarchical.push({
                x: spacing * (i + 1),
                y: this.canvas.height / 2,
                vx: 0,
                vy: (Math.random() - 0.5) * 0.5,
                size: 4,
                highlighted: false,
                connections: []
            });
        }
    }

    /**
     * Initialize nodes for PromptSage visualization
     * @private
     */
    initPromptSageNodes() {
        // Create hierarchical nodes in a tree structure
        const createNodes = (type, centerX, centerY, radius) => {
            const config = this.config.nodes[type];
            const angleStep = (Math.PI * 2) / config.count;
            
            for (let i = 0; i < config.count; i++) {
                const angle = angleStep * i;
                const variance = Math.random() * radius * 0.2;
                
                this.nodes[type].push({
                    x: centerX + Math.cos(angle) * (radius + variance),
                    y: centerY + Math.sin(angle) * (radius + variance),
                    vx: (Math.random() - 0.5) * config.speed,
                    vy: (Math.random() - 0.5) * config.speed,
                    size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
                    highlighted: false,
                    type: type,
                    connections: []
                });
            }
        };

        // Create nodes for each type
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        createNodes('hierarchical', centerX, centerY, 120);
        createNodes('cognitive', centerX, centerY, 80);
        createNodes('ethical', centerX, centerY, 40);
    }

    /**
     * Set up event listeners for interaction and responsiveness
     * @private
     */
    setupEventListeners() {
        // Mouse interaction
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        // Responsive resizing
        if (this.config.responsive) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateCanvasSize();
                this.repositionNodes();
            });
            this.resizeObserver.observe(this.container);
        }

        // Keyboard navigation for accessibility
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    /**
     * Handle keyboard navigation
     * @private
     * @param {KeyboardEvent} event
     */
    handleKeyDown(event) {
        if (event.key === 'Tab' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            this.cycleNodeHighlight(event.key === 'ArrowLeft' ? -1 : 1);
        }
    }

    /**
     * Cycle through node highlighting for keyboard navigation
     * @private
     * @param {number} direction - Direction to cycle (1 for forward, -1 for backward)
     */
    cycleNodeHighlight(direction) {
        const types = ['hierarchical', 'cognitive', 'ethical'];
        const currentIndex = types.indexOf(this.highlightedType);
        let newIndex = currentIndex + direction;
        
        if (newIndex >= types.length) newIndex = 0;
        if (newIndex < 0) newIndex = types.length - 1;
        
        this.highlightNodes(types[newIndex]);
    }

    /**
     * Update canvas size and reposition nodes
     * @private
     */
    updateCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = width * this.dpr;
        this.canvas.height = height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    /**
     * Reposition nodes after canvas resize
     * @private
     */
    repositionNodes() {
        if (this.config.type === 'traditional') {
            this.repositionTraditionalNodes();
        } else {
            this.repositionPromptSageNodes();
        }
    }

    /**
     * Reposition nodes for traditional visualization
     * @private
     */
    repositionTraditionalNodes() {
        const spacing = this.canvas.width / (this.nodes.hierarchical.length + 1);
        this.nodes.hierarchical.forEach((node, i) => {
            node.x = spacing * (i + 1);
            node.y = this.canvas.height / 2;
        });
    }

    /**
     * Reposition nodes for PromptSage visualization
     * @private
     */
    repositionPromptSageNodes() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        const repositionType = (nodes, radius) => {
            const angleStep = (Math.PI * 2) / nodes.length;
            nodes.forEach((node, i) => {
                const angle = angleStep * i;
                const variance = Math.random() * radius * 0.2;
                node.x = centerX + Math.cos(angle) * (radius + variance);
                node.y = centerY + Math.sin(angle) * (radius + variance);
            });
        };

        repositionType(this.nodes.hierarchical, 120);
        repositionType(this.nodes.cognitive, 80);
        repositionType(this.nodes.ethical, 40);
    }

    /**
     * Handle mouse movement for node interaction
     * @private
     * @param {MouseEvent} event
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        // Check for node hover
        Object.entries(this.nodes).forEach(([type, nodes]) => {
            nodes.forEach(node => {
                const dx = this.mousePosition.x - node.x;
                const dy = this.mousePosition.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < node.size * 2) {
                    this.highlightNodes(type);
                }
            });
        });
    }

    /**
     * Handle mouse leave event
     * @private
     */
    handleMouseLeave() {
        this.mousePosition = { x: null, y: null };
        this.resetHighlights();
    }

    /**
     * Highlight nodes of a specific type
     * @public
     * @param {string} type - Node type to highlight
     */
    highlightNodes(type) {
        this.highlightedType = type;
        
        Object.entries(this.nodes).forEach(([nodeType, nodes]) => {
            nodes.forEach(node => {
                node.highlighted = nodeType === type;
                node.size = node.highlighted ? 
                    this.config.nodes[nodeType].size[1] : 
                    this.config.nodes[nodeType].size[0];
            });
        });
    }

    /**
     * Reset all node highlights
     * @public
     */
    resetHighlights() {
        this.highlightedType = null;
        
        Object.entries(this.nodes).forEach(([type, nodes]) => {
            nodes.forEach(node => {
                node.highlighted = false;
                node.size = this.config.nodes[type].size[0];
            });
        });
    }

    /**
     * Update node positions and connections
     * @private
     */
    updateNodes() {
        if (this.config.type === 'traditional') {
            this.updateTraditionalNodes();
        } else {
            this.updatePromptSageNodes();
        }
        
        this.updateConnections();
    }

    /**
     * Update nodes for traditional visualization
     * @private
     */
    updateTraditionalNodes() {
        const speed = this.config.reducedMotion ? 0.3 : 1;
        
        this.nodes.hierarchical.forEach(node => {
            node.y += node.vy * speed;
            
            if (Math.abs(node.y - this.canvas.height / 2) > 20) {
                node.vy *= -0.95;
            }
        });
    }

    /**
     * Update nodes for PromptSage visualization
     * @private
     */
    updatePromptSageNodes() {
        const speed = this.config.reducedMotion ? 0.3 : 1;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        Object.entries(this.nodes).forEach(([type, nodes]) => {
            const config = this.config.nodes[type];
            
            nodes.forEach(node => {
                // Update position
                node.x += node.vx * config.speed * speed;
                node.y += node.vy * config.speed * speed;
                
                // Apply orbital force
                const dx = node.x - centerX;
                const dy = node.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const targetDistance = type === 'hierarchical' ? 120 : 
                                     type === 'cognitive' ? 80 : 40;
                
                const force = (distance - targetDistance) * 0.001;
                node.vx -= (dx / distance) * force;
                node.vy -= (dy / distance) * force;
                
                // Apply damping
                node.vx *= 0.99;
                node.vy *= 0.99;
            });
        });
    }

    /**
     * Update connections between nodes
     * @private
     */
    updateConnections() {
        this.connections = [];
        
        if (this.config.type === 'traditional') {
            this.updateTraditionalConnections();
        } else {
            this.updatePromptSageConnections();
        }
    }

    /**
     * Update connections for traditional visualization
     * @private
     */
    updateTraditionalConnections() {
        for (let i = 0; i < this.nodes.hierarchical.length - 1; i++) {
            const nodeA = this.nodes.hierarchical[i];
            const nodeB = this.nodes.hierarchical[i + 1];
            
            this.connections.push({
                from: nodeA,
                to: nodeB,
                type: 'hierarchical',
                strength: 1
            });
        }
    }

    /**
     * Update connections for PromptSage visualization
     * @private
     */
    updatePromptSageConnections() {
        // Connect hierarchical nodes to cognitive nodes
        this.nodes.hierarchical.forEach(nodeA => {
            this.nodes.cognitive.forEach(nodeB => {
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    this.connections.push({
                        from: nodeA,
                        to: nodeB,
                        type: 'hierarchical-cognitive',
                        strength: 1 - (distance / this.config.connectionDistance)
                    });
                }
            });
        });
        
        // Connect cognitive nodes to ethical nodes
        this.nodes.cognitive.forEach(nodeA => {
            this.nodes.ethical.forEach(nodeB => {
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance * 0.8) {
                    this.connections.push({
                        from: nodeA,
                        to: nodeB,
                        type: 'cognitive-ethical',
                        strength: 1 - (distance / (this.config.connectionDistance * 0.8))
                    });
                }
            });
        });
    }

    /**
     * Draw the visualization
     * @private
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
    }

    /**
     * Draw connections between nodes
     * @private
     */
    drawConnections() {
        this.connections.forEach(connection => {
            const color = this.getConnectionColor(connection);
            const width = this.getConnectionWidth(connection);
            
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = width;
            this.ctx.globalAlpha = connection.strength;
            
            // Draw connection line
            this.ctx.moveTo(connection.from.x, connection.from.y);
            this.ctx.lineTo(connection.to.x, connection.to.y);
            this.ctx.stroke();
            
            // Draw flow particles if highlighted
            if (this.highlightedType && 
                (connection.from.highlighted || connection.to.highlighted)) {
                this.drawFlowParticles(connection);
            }
        });
        
        this.ctx.globalAlpha = 1;
    }

    /**
     * Draw animated flow particles along connections
     * @private
     * @param {Object} connection - Connection object
     */
    drawFlowParticles(connection) {
        const dx = connection.to.x - connection.from.x;
        const dy = connection.to.y - connection.from.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const particleCount = Math.floor(distance / 20);
        const time = performance.now() * 0.001;
        
        for (let i = 0; i < particleCount; i++) {
            const t = ((time * 2 + i / particleCount) % 1);
            const x = connection.from.x + dx * t;
            const y = connection.from.y + dy * t;
            
            this.ctx.beginPath();
            this.ctx.fillStyle = this.config.colors[this.highlightedType];
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    /**
     * Draw all nodes
     * @private
     */
    drawNodes() {
        Object.entries(this.nodes).forEach(([type, nodes]) => {
            nodes.forEach(node => {
                this.drawNode(node, type);
            });
        });
    }

    /**
     * Draw a single node
     * @private
     * @param {Object} node - Node object
     * @param {string} type - Node type
     */
    drawNode(node, type) {
        // Draw glow effect for highlighted nodes
        if (node.highlighted) {
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.size * 2
            );
            
            gradient.addColorStop(0, `${this.config.colors[type]}66`);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.fillStyle = gradient;
            this.ctx.arc(node.x, node.y, node.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw node
        this.ctx.beginPath();
        this.ctx.fillStyle = this.config.colors[type];
        this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Get connection color based on connection type
     * @private
     * @param {Object} connection - Connection object
     * @returns {string} Connection color
     */
    getConnectionColor(connection) {
        if (this.config.type === 'traditional') {
            return this.config.colors.node;
        }
        
        if (connection.from.highlighted || connection.to.highlighted) {
            return this.config.colors[this.highlightedType];
        }
        
        return this.config.colors.connection;
    }

    /**
     * Get connection width based on connection type and state
     * @private
     * @param {Object} connection - Connection object
     * @returns {number} Connection width
     */
    getConnectionWidth(connection) {
        const baseWidth = 1;
        
        if (connection.from.highlighted || connection.to.highlighted) {
            return baseWidth * 2;
        }
        
        return baseWidth;
    }

    /**
     * Animation loop with performance optimization
     * @private
     */
    animate() {
        if (!this.config.reducedMotion) {
            this.updateNodes();
        }
        this.draw();
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Update visualization colors
     * @param {Object} colors - New color configuration
     */
    updateColors(colors) {
        Object.assign(this.config.colors, colors);
    }

    /**
     * Handle window resize
     * @public
     */
    handleResize() {
        this.updateCanvasSize();
        this.repositionNodes();
    }

    /**
     * Clean up resources and event listeners
     * @public
     */
    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        this.canvas.removeEventListener('keydown', this.handleKeyDown);
        
        this.canvas.remove();
        
        this.nodes = null;
        this.connections = null;
    }
}
