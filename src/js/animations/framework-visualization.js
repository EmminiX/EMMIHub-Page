/**
 * FrameworkVisualization - Interactive visualization of AI framework components
 * Features:
 * - Physics-based node movement with smooth animations
 * - Dynamic connections between nearby nodes
 * - Mouse interaction with hover effects
 * - Responsive canvas sizing
 * - Theme integration with color updates
 * - Reduced motion support
 * - High DPI display support
 */
export class FrameworkVisualization {
    /**
     * @param {Object} config - Configuration object
     * @param {HTMLElement} config.container - Container element for the canvas
     * @param {number} [config.nodeCount=12] - Number of nodes to create
     * @param {string} [config.nodeColor='#4A90E2'] - Color of nodes
     * @param {string} [config.lineColor='#4A90E280'] - Color of connection lines
     * @param {number} [config.nodeSize=6] - Base size of nodes in pixels
     * @param {number} [config.lineWidth=1] - Width of connection lines
     * @param {number} [config.connectionDistance=120] - Maximum distance for node connections
     * @param {number} [config.transformSpeed=1] - Animation speed multiplier
     * @param {boolean} [config.responsive=true] - Enable responsive resizing
     * @param {boolean} [config.reducedMotion=false] - Enable reduced motion mode
     */
    constructor(config) {
        this.config = {
            nodeCount: 12,
            nodeColor: '#4A90E2',
            lineColor: '#4A90E280',
            nodeSize: 6,
            lineWidth: 1,
            connectionDistance: 120,
            transformSpeed: 1,
            responsive: true,
            reducedMotion: false,
            ...config
        };

        this.container = config.container;
        this.nodes = [];
        this.animationFrame = null;
        this.resizeObserver = null;
        this.mousePosition = { x: null, y: null };
        
        this.initCanvas();
        this.initNodes();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Initialize the canvas with proper DPI scaling
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
     * Initialize nodes with random positions and velocities
     * @private
     */
    initNodes() {
        for (let i = 0; i < this.config.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: this.config.nodeSize,
                highlighted: false
            });
        }
    }

    /**
     * Set up event listeners for interaction and resizing
     * @private
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        if (this.config.responsive) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateCanvasSize();
            });
            this.resizeObserver.observe(this.container);
        }
    }

    /**
     * Update canvas size and scale for proper DPI handling
     * @private
     */
    updateCanvasSize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    /**
     * Handle mouse movement for node highlighting
     * @private
     * @param {MouseEvent} event
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    /**
     * Handle mouse leave event
     * @private
     */
    handleMouseLeave() {
        this.mousePosition = { x: null, y: null };
    }

    /**
     * Update node positions and handle interactions
     * @private
     */
    updateNodes() {
        const speed = this.config.reducedMotion ? 0.3 : 1;
        const maxSpeed = 2 * speed;

        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx * this.config.transformSpeed * speed;
            node.y += node.vy * this.config.transformSpeed * speed;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width / this.dpr) {
                node.vx *= -1;
            }
            if (node.y < 0 || node.y > this.canvas.height / this.dpr) {
                node.vy *= -1;
            }

            // Limit velocity
            const velocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (velocity > maxSpeed) {
                node.vx = (node.vx / velocity) * maxSpeed;
                node.vy = (node.vy / velocity) * maxSpeed;
            }

            // Handle mouse interaction
            if (this.mousePosition.x !== null) {
                const dx = this.mousePosition.x - node.x;
                const dy = this.mousePosition.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                node.highlighted = distance < 50;
                node.size = this.config.nodeSize * (node.highlighted ? 1.5 : 1);
            } else {
                node.highlighted = false;
                node.size = this.config.nodeSize;
            }
        });
    }

    /**
     * Draw the visualization
     * @private
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.config.lineColor;
        this.ctx.lineWidth = this.config.lineWidth;

        for (let i = 0; i < this.nodes.length; i++) {
            const nodeA = this.nodes[i];
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeB = this.nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = 1 - (distance / this.config.connectionDistance);
                    this.ctx.globalAlpha = opacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodeA.x, nodeA.y);
                    this.ctx.lineTo(nodeB.x, nodeB.y);
                    this.ctx.stroke();
                }
            }
        }

        // Reset global alpha for nodes
        this.ctx.globalAlpha = 1;

        // Draw nodes
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.fillStyle = node.highlighted ? this.config.nodeColor : this.config.lineColor;
            this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    /**
     * Animation loop
     * @private
     */
    animate() {
        this.updateNodes();
        this.draw();
        this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Update visualization colors
     * @param {string} nodeColor - New node color
     * @param {string} lineColor - New line color
     */
    updateColors(nodeColor, lineColor) {
        this.config.nodeColor = nodeColor;
        this.config.lineColor = lineColor;
    }

    /**
     * Clean up resources
     */
    cleanup() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.canvas.remove();
    }
} 