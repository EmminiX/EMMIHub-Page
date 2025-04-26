/**
 * EMMIHUB - Sacred Geometry Backdrop
 * 
 * This module provides a canvas-based visualization of sacred geometry patterns
 * that rotate and transform in the background.
 * 
 * @author Emmi C.
 * @version 1.0
 */

import errorLogger from '../core/error-logging.js';

/**
 * SacredGeometryBackdrop class for creating and controlling sacred geometry visualizations
 */
class SacredGeometryBackdrop {
    /**
     * Create a new sacred geometry backdrop
     * @param {Object} options - Configuration options
     * @param {HTMLElement|string} options.container - Container element or selector
     * @param {string} [options.pattern='all'] - Pattern to display ('platonic', 'flower-of-life', 'metatron', 'fibonacci', 'vesica-piscis', 'all')
     * @param {number} [options.opacity=0.1] - Opacity of the patterns
     * @param {number} [options.rotationSpeed=0.0005] - Rotation speed in radians per millisecond
     * @param {string} [options.lineColor='rgba(255, 255, 255, 0.3)'] - Color for pattern lines
     * @param {number} [options.lineWidth=0.5] - Line width for patterns
     * @param {boolean} [options.responsive=true] - Whether to adjust for window resize
     */
    constructor(options) {
        // Default options
        this.defaults = {
            container: null,
            pattern: 'all',
            opacity: 0.1,
            rotationSpeed: 0.0005,
            lineColor: 'rgba(255, 255, 255, 0.)',
            lineWidth: 0.5,
            responsive: true,
            patternSequence: ['flower-of-life', 'metatron-cube', 'fibonacci-spiral', 'platonic-solid', 'vesica-piscis']
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
            errorLogger.error('Sacred geometry container not found', 'sacred-geometry', 'high');
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
            patterns: [],
            currentPatternIndex: 0
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the sacred geometry backdrop
     * @private
     */
    init() {
        try {
            // Create canvas
            this.createCanvas();
            
            // Create patterns
            this.createPatterns();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start animation
            this.start();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize sacred geometry: ${error.message}`,
                'sacred-geometry',
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
        this.state.canvas.classList.add('sacred-geometry-canvas');
        
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
        this.state.canvas.style.pointerEvents = 'none';
        this.state.canvas.style.opacity = this.options.opacity;
        
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
     * Create sacred geometry patterns
     * @private
     */
    createPatterns() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const radius = Math.min(this.state.width, this.state.height) * 0.4;
        
        // Clear patterns
        this.state.patterns = [];

        // Reduce pattern count and complexity for Safari
        const isSafari = this.isSafari();
        const patternScale = isSafari ? 0.7 : 1.0; // Scale down patterns in Safari
        const finalRadius = radius * patternScale;
        
        // Create patterns based on option
        if (this.options.pattern === 'all' || this.options.pattern === 'platonic') {
            this.state.patterns.push({
                type: 'platonic',
                draw: (ctx, rotation) => this.drawPlatonicSolids(ctx, centerX, centerY, finalRadius, rotation),
                rotation: 0,
                rotationSpeed: this.options.rotationSpeed * 0.7
            });
        }
        
        if (this.options.pattern === 'all' || this.options.pattern === 'flower-of-life') {
            this.state.patterns.push({
                type: 'flower-of-life',
                draw: (ctx, rotation) => this.drawFlowerOfLife(ctx, centerX, centerY, finalRadius * 0.8, rotation),
                rotation: 0,
                rotationSpeed: this.options.rotationSpeed * 0.5
            });
        }
        
        if (this.options.pattern === 'all' || this.options.pattern === 'metatron') {
            this.state.patterns.push({
                type: 'metatron',
                draw: (ctx, rotation) => this.drawMetatronsCube(ctx, centerX, centerY, finalRadius * 0.6, rotation),
                rotation: 0,
                rotationSpeed: this.options.rotationSpeed * 0.8
            });
        }
        
        if (this.options.pattern === 'all' || this.options.pattern === 'fibonacci') {
            this.state.patterns.push({
                type: 'fibonacci',
                draw: (ctx, rotation) => this.drawFibonacciSpiral(ctx, centerX, centerY, finalRadius * 0.9, rotation),
                rotation: 0,
                rotationSpeed: this.options.rotationSpeed * 0.3
            });
        }

        if (this.options.pattern === 'all' || this.options.pattern === 'vesica-piscis') {
            this.state.patterns.push({
                type: 'vesica-piscis',
                draw: (ctx, rotation) => this.drawVesicaPiscis(ctx, rotation),
                rotation: 0,
                rotationSpeed: this.options.rotationSpeed * 0.4
            });
        }
        
        // For Safari, start with a random pattern and reduce total patterns
        if (isSafari) {
            // Limit to only two patterns for better performance
            if (this.state.patterns.length > 2) {
                this.state.patterns = this.state.patterns.slice(0, 2);
            }
            // Start with a random pattern
            this.state.currentPatternIndex = Math.floor(Math.random() * this.state.patterns.length);
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
            // Update canvas size
            this.state.width = this.container.offsetWidth;
            this.state.height = this.container.offsetHeight;
            this.state.canvas.width = this.state.width;
            this.state.canvas.height = this.state.height;
            
            // Recreate patterns
            this.createPatterns();
            
            // Clear timeout
            this.resizeTimeout = null;
        }, 200);
    }
    
    /**
     * Start the animation
     * @returns {SacredGeometryBackdrop} This instance for chaining
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
     * @returns {SacredGeometryBackdrop} This instance for chaining
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
     * Cycle to the next pattern in the sequence
     */
    cyclePattern() {
        this.state.currentPatternIndex = (this.state.currentPatternIndex + 1) % this.options.patternSequence.length;
        const nextPattern = this.options.patternSequence[this.state.currentPatternIndex];
        this.options.pattern = nextPattern;
        this.createPatterns();
    }
    
    /**
     * Animation loop
     * @param {number} timestamp - Current timestamp
     */
    animate(timestamp) {
        if (!this.state.isRunning) return;
        
        // Calculate delta time
        const deltaTime = timestamp - (this.state.lastTimestamp || timestamp);
        this.state.lastTimestamp = timestamp;
        
        // Safari performance optimization - reduce quality and processing
        const isSafari = this.isSafari();
        
        // Reduce frame rate on Safari
        if (isSafari && deltaTime < 32) { // ~30fps on Safari instead of 60fps
            this.state.animationFrame = requestAnimationFrame(this.animate.bind(this));
            return;
        }
        
        // Clear canvas - use more direct access for Safari
        if (isSafari) {
            this.state.ctx.clearRect(0, 0, this.state.canvas.width, this.state.canvas.height);
        } else {
            this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
        }
        
        // Update and draw patterns
        // For Safari, only draw a subset of patterns to improve performance
        if (isSafari) {
            // In Safari, just draw one pattern at a time (the current one)
            if (this.state.patterns.length > 0) {
                const currentPattern = this.state.patterns[this.state.currentPatternIndex % this.state.patterns.length];
                currentPattern.rotation += currentPattern.rotationSpeed * deltaTime;
                currentPattern.draw(this.state.ctx, currentPattern.rotation);
            }
        } else {
            // For other browsers, draw all patterns
            this.state.patterns.forEach(pattern => {
                pattern.rotation += pattern.rotationSpeed * deltaTime;
                pattern.draw(this.state.ctx, pattern.rotation);
            });
        }
        
        // Cycle pattern if needed (every 10 seconds)
        if (timestamp % 10000 < deltaTime) {
            this.cyclePattern();
        }
        
        // Request next frame
        this.state.animationFrame = requestAnimationFrame(this.animate.bind(this));
    }
    
    /**
     * Draw all patterns
     * @private
     */
    drawPatterns() {
        const ctx = this.state.ctx;
        
        // Set line style
        ctx.lineWidth = this.options.lineWidth;
        ctx.strokeStyle = this.options.lineColor;
        
        // Draw each pattern
        this.state.patterns.forEach(pattern => {
            pattern.draw(ctx, pattern.rotation);
        });
    }
    
    /**
     * Draw platonic solids
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawPlatonicSolids(ctx, centerX, centerY, radius, rotation) {
        // Choose which solid to draw based on time
        const solidIndex = Math.floor(Date.now() / 10000) % 5;
        
        switch (solidIndex) {
            case 0:
                this.drawTetrahedron(ctx, centerX, centerY, radius, rotation);
                break;
            case 1:
                this.drawCube(ctx, centerX, centerY, radius, rotation);
                break;
            case 2:
                this.drawOctahedron(ctx, centerX, centerY, radius, rotation);
                break;
            case 3:
                this.drawDodecahedron(ctx, centerX, centerY, radius, rotation);
                break;
            case 4:
                this.drawIcosahedron(ctx, centerX, centerY, radius, rotation);
                break;
        }
    }
    
    /**
     * Draw tetrahedron
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawTetrahedron(ctx, centerX, centerY, radius, rotation) {
        // Define vertices
        const vertices = [
            { x: 0, y: -radius, z: 0 },
            { x: -radius * 0.866, y: radius * 0.5, z: 0 },
            { x: radius * 0.866, y: radius * 0.5, z: 0 },
            { x: 0, y: 0, z: radius }
        ];
        
        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => this.rotatePoint3D(vertex, rotation, rotation * 0.7));
        
        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(vertex => ({
            x: centerX + vertex.x,
            y: centerY + vertex.y
        }));
        
        // Draw edges
        ctx.beginPath();
        
        // Connect all vertices to each other
        for (let i = 0; i < projectedVertices.length; i++) {
            for (let j = i + 1; j < projectedVertices.length; j++) {
                ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
                ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
            }
        }
        
        ctx.stroke();
    }
    
    /**
     * Draw cube
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawCube(ctx, centerX, centerY, radius, rotation) {
        const size = radius * 0.8;
        
        // Define vertices
        const vertices = [
            { x: -size, y: -size, z: -size }, // 0: back-top-left
            { x: size, y: -size, z: -size },  // 1: back-top-right
            { x: size, y: size, z: -size },   // 2: back-bottom-right
            { x: -size, y: size, z: -size },  // 3: back-bottom-left
            { x: -size, y: -size, z: size },  // 4: front-top-left
            { x: size, y: -size, z: size },   // 5: front-top-right
            { x: size, y: size, z: size },    // 6: front-bottom-right
            { x: -size, y: size, z: size }    // 7: front-bottom-left
        ];
        
        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => this.rotatePoint3D(vertex, rotation, rotation * 0.8));
        
        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(vertex => ({
            x: centerX + vertex.x,
            y: centerY + vertex.y
        }));
        
        // Define edges
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // back face
            [4, 5], [5, 6], [6, 7], [7, 4], // front face
            [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];
        
        // Draw edges
        ctx.beginPath();
        
        edges.forEach(edge => {
            ctx.moveTo(projectedVertices[edge[0]].x, projectedVertices[edge[0]].y);
            ctx.lineTo(projectedVertices[edge[1]].x, projectedVertices[edge[1]].y);
        });
        
        ctx.stroke();
    }
    
    /**
     * Draw octahedron
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawOctahedron(ctx, centerX, centerY, radius, rotation) {
        // Define vertices
        const vertices = [
            { x: 0, y: -radius, z: 0 },  // top
            { x: radius, y: 0, z: 0 },   // right
            { x: 0, y: radius, z: 0 },   // bottom
            { x: -radius, y: 0, z: 0 },  // left
            { x: 0, y: 0, z: radius },   // front
            { x: 0, y: 0, z: -radius }   // back
        ];
        
        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => this.rotatePoint3D(vertex, rotation, rotation * 0.9));
        
        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(vertex => ({
            x: centerX + vertex.x,
            y: centerY + vertex.y
        }));
        
        // Define edges
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0], // middle square
            [0, 4], [1, 4], [2, 4], [3, 4], // front pyramid
            [0, 5], [1, 5], [2, 5], [3, 5]  // back pyramid
        ];
        
        // Draw edges
        ctx.beginPath();
        
        edges.forEach(edge => {
            ctx.moveTo(projectedVertices[edge[0]].x, projectedVertices[edge[0]].y);
            ctx.lineTo(projectedVertices[edge[1]].x, projectedVertices[edge[1]].y);
        });
        
        ctx.stroke();
    }
    
    /**
     * Draw dodecahedron (simplified)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawDodecahedron(ctx, centerX, centerY, radius, rotation) {
        // Golden ratio
        const phi = (1 + Math.sqrt(5)) / 2;
        const invPhi = 1 / phi;
        
        // Define vertices (20 vertices of a dodecahedron)
        const vertices = [
            // Vertices based on the golden ratio
            { x: radius, y: radius, z: radius },
            { x: radius, y: radius, z: -radius },
            { x: radius, y: -radius, z: radius },
            { x: radius, y: -radius, z: -radius },
            { x: -radius, y: radius, z: radius },
            { x: -radius, y: radius, z: -radius },
            { x: -radius, y: -radius, z: radius },
            { x: -radius, y: -radius, z: -radius },
            
            { x: 0, y: radius * invPhi, z: radius * phi },
            { x: 0, y: radius * invPhi, z: -radius * phi },
            { x: 0, y: -radius * invPhi, z: radius * phi },
            { x: 0, y: -radius * invPhi, z: -radius * phi },
            
            { x: radius * phi, y: 0, z: radius * invPhi },
            { x: radius * phi, y: 0, z: -radius * invPhi },
            { x: -radius * phi, y: 0, z: radius * invPhi },
            { x: -radius * phi, y: 0, z: -radius * invPhi },
            
            { x: radius * invPhi, y: radius * phi, z: 0 },
            { x: radius * invPhi, y: -radius * phi, z: 0 },
            { x: -radius * invPhi, y: radius * phi, z: 0 },
            { x: -radius * invPhi, y: -radius * phi, z: 0 }
        ];
        
        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => this.rotatePoint3D(vertex, rotation, rotation * 0.6));
        
        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(vertex => ({
            x: centerX + vertex.x * 0.5, // Scale down for better fit
            y: centerY + vertex.y * 0.5  // Scale down for better fit
        }));
        
        // Draw edges (simplified - just connecting nearby vertices)
        ctx.beginPath();
        
        // Connect vertices that are close to each other
        for (let i = 0; i < projectedVertices.length; i++) {
            for (let j = i + 1; j < projectedVertices.length; j++) {
                const dx = rotatedVertices[i].x - rotatedVertices[j].x;
                const dy = rotatedVertices[i].y - rotatedVertices[j].y;
                const dz = rotatedVertices[i].z - rotatedVertices[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Connect if vertices are close enough
                if (distance < radius * 0.8) {
                    ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
                    ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
                }
            }
        }
        
        ctx.stroke();
    }
    
    /**
     * Draw icosahedron
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawIcosahedron(ctx, centerX, centerY, radius, rotation) {
        // Golden ratio
        const phi = (1 + Math.sqrt(5)) / 2;
        
        // Define vertices (12 vertices of an icosahedron)
        const vertices = [
            { x: 0, y: radius, z: radius * phi },
            { x: 0, y: radius, z: -radius * phi },
            { x: 0, y: -radius, z: radius * phi },
            { x: 0, y: -radius, z: -radius * phi },
            
            { x: radius, y: radius * phi, z: 0 },
            { x: radius, y: -radius * phi, z: 0 },
            { x: -radius, y: radius * phi, z: 0 },
            { x: -radius, y: -radius * phi, z: 0 },
            
            { x: radius * phi, y: 0, z: radius },
            { x: radius * phi, y: 0, z: -radius },
            { x: -radius * phi, y: 0, z: radius },
            { x: -radius * phi, y: 0, z: -radius }
        ];
        
        // Rotate vertices
        const rotatedVertices = vertices.map(vertex => this.rotatePoint3D(vertex, rotation, rotation * 0.7));
        
        // Project vertices to 2D
        const projectedVertices = rotatedVertices.map(vertex => ({
            x: centerX + vertex.x * 0.5, // Scale down for better fit
            y: centerY + vertex.y * 0.5  // Scale down for better fit
        }));
        
        // Draw edges (simplified - just connecting nearby vertices)
        ctx.beginPath();
        
        // Connect vertices that are close to each other
        for (let i = 0; i < projectedVertices.length; i++) {
            for (let j = i + 1; j < projectedVertices.length; j++) {
                const dx = rotatedVertices[i].x - rotatedVertices[j].x;
                const dy = rotatedVertices[i].y - rotatedVertices[j].y;
                const dz = rotatedVertices[i].z - rotatedVertices[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // Connect if vertices are close enough
                if (distance < radius * 1.2) {
                    ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
                    ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
                }
            }
        }
        
        ctx.stroke();
    }
    
    /**
     * Draw Flower of Life pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawFlowerOfLife(ctx, centerX, centerY, radius, rotation) {
        const circleRadius = radius / 6;
        
        // Draw center circle
        this.drawRotatedCircle(ctx, centerX, centerY, circleRadius, rotation);
        
        // Draw first ring (6 circles)
        for (let i = 0; i < 6; i++) {
            const angle = rotation + (Math.PI / 3) * i;
            const x = centerX + circleRadius * 2 * Math.cos(angle);
            const y = centerY + circleRadius * 2 * Math.sin(angle);
            
            this.drawRotatedCircle(ctx, x, y, circleRadius, rotation);
        }
        
        // Draw second ring (12 circles)
        for (let i = 0; i < 12; i++) {
            const angle = rotation + (Math.PI / 6) * i;
            const x = centerX + circleRadius * 4 * Math.cos(angle);
            const y = centerY + circleRadius * 4 * Math.sin(angle);
            
            this.drawRotatedCircle(ctx, x, y, circleRadius, rotation);
        }
    }
    
    /**
     * Draw Metatron's Cube pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawMetatronsCube(ctx, centerX, centerY, radius, rotation) {
        // Define vertices
        const vertices = [];
        
        // Center point
        vertices.push({ x: 0, y: 0 });
        
        // First ring (6 points)
        for (let i = 0; i < 6; i++) {
            const angle = rotation + (Math.PI / 3) * i;
            vertices.push({
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            });
        }
        
        // Second ring (6 points)
        for (let i = 0; i < 6; i++) {
            const angle = rotation + (Math.PI / 3) * i + (Math.PI / 6);
            vertices.push({
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            });
        }
        
        // Translate vertices to center
        const translatedVertices = vertices.map(vertex => ({
            x: centerX + vertex.x,
            y: centerY + vertex.y
        }));
        
        // Draw connections
        ctx.beginPath();
        
        // Connect all vertices to each other
        for (let i = 0; i < translatedVertices.length; i++) {
            for (let j = i + 1; j < translatedVertices.length; j++) {
                ctx.moveTo(translatedVertices[i].x, translatedVertices[i].y);
                ctx.lineTo(translatedVertices[j].x, translatedVertices[j].y);
            }
        }
        
        ctx.stroke();
    }
    
    /**
     * Draw Fibonacci Spiral pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawFibonacciSpiral(ctx, centerX, centerY, radius, rotation) {
        // Golden ratio
        const phi = (1 + Math.sqrt(5)) / 2;
        
        ctx.beginPath();
        
        // Draw spiral
        let angle = rotation;
        let distance = 0;
        
        // Draw spiral points
        for (let i = 0; i < 500; i++) {
            angle += 0.1;
            distance = radius * 0.02 * Math.sqrt(i);
            
            const x = centerX + distance * Math.cos(angle);
            const y = centerY + distance * Math.sin(angle);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw golden rectangles
        ctx.beginPath();
        
        let size = radius * 0.1;
        let x = centerX;
        let y = centerY;
        
        for (let i = 0; i < 8; i++) {
            // Draw rectangle
            ctx.rect(x - size, y - size, size * 2, size * 2);
            
            // Update size and position for next rectangle
            const newSize = size * phi;
            x += size;
            y += size;
            size = newSize;
        }
        
        ctx.stroke();
    }
    
    /**
     * Draw a rotated circle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     * @param {number} radius - Radius
     * @param {number} rotation - Rotation angle
     * @private
     */
    drawRotatedCircle(ctx, x, y, radius, rotation) {
        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius, rotation, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    /**
     * Rotate a 3D point
     * @param {Object} point - Point with x, y, z coordinates
     * @param {number} rotationX - Rotation around X axis
     * @param {number} rotationY - Rotation around Y axis
     * @returns {Object} Rotated point
     * @private
     */
    rotatePoint3D(point, rotationX, rotationY) {
        // Clone point
        const p = { ...point };
        
        // Rotate around X axis
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.y * sinX + p.z * cosX;
        
        // Rotate around Y axis
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const x2 = p.x * cosY + z1 * sinY;
        const z2 = -p.x * sinY + z1 * cosY;
        
        return {
            x: x2,
            y: y1,
            z: z2
        };
    }
    
    /**
     * Update colors based on theme
     * @param {string} lineColor - Color for pattern lines
     * @returns {SacredGeometryBackdrop} This instance for chaining
     */
    updateColors(lineColor) {
        this.options.lineColor = lineColor;
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
    }

    /**
     * Draw Vesica Piscis pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} rotation - Current rotation angle
     * @param {Object} options - Drawing options
     */
    drawVesicaPiscis(ctx, rotation = 0, options = {}) {
        const {
            radius = Math.min(this.state.width, this.state.height) * 0.2,
            strokeStyle = this.options.strokeStyle,
            lineWidth = this.options.lineWidth,
            opacity = this.options.opacity
        } = options;

        // Save context state
        ctx.save();
        
        // Set drawing styles
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity;
        
        // Move to center and apply rotation
        ctx.translate(this.state.width / 2, this.state.height / 2);
        ctx.rotate(rotation);
        
        // Draw first circle
        ctx.beginPath();
        ctx.arc(-radius/2, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw second circle
        ctx.beginPath();
        ctx.arc(radius/2, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Restore context state
        ctx.restore();
        
        return this;
    }

    /**
     * Detect Safari browser for optimizations
     * @private
     * @returns {boolean} Whether the browser is Safari
     */
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
}

/**
 * Initialize sacred geometry backdrops on elements with the 'sacred-geometry-backdrop' class
 * @param {Object} [options] - Default options for all backdrops
 * @returns {Array<SacredGeometryBackdrop>} Array of backdrop instances
 */
function initSacredGeometryBackdrops(options = {}) {
    const containers = document.querySelectorAll('.sacred-geometry-backdrop');
    const instances = [];
    
    containers.forEach(container => {
        // Get container-specific options from data attributes
        const containerOptions = {
            container,
            pattern: container.dataset.pattern || options.pattern,
            lineColor: container.dataset.lineColor || options.lineColor,
            opacity: container.dataset.opacity ? 
                    parseFloat(container.dataset.opacity) : 
                    options.opacity
        };
        
        // Create backdrop instance with merged options
        const instance = new SacredGeometryBackdrop({
            ...options,
            ...containerOptions
        });
        
        instances.push(instance);
    });
    
    return instances;
}

// Export the SacredGeometryBackdrop class and initialization function
export { SacredGeometryBackdrop, initSacredGeometryBackdrops };
export default SacredGeometryBackdrop;
