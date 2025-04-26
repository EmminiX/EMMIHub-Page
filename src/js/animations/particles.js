import errorLogger from '../core/error-logging.js';

/**
 * ParticleSystem class for creating and controlling interactive particle animations
 */
class ParticleSystem {
    constructor(options) {
        // Default options
        this.defaults = {
            container: null,
            particleCount: 500,
            particleSize: [2, 3],
            maxSpeed: 2,
            attractionStrength: 0.5,
            friction: 0.95,
            primaryColor: '#48cae4',
            secondaryColor: '#7209b7',
            secondaryRatio: 0.2,
            connectParticles: true,
            connectionDistance: 100,
            sacredGeometry: true,
            patternInterval: [15000, 18000],
            patternDuration: [3000, 4000],
            patternDwellTime: 0,
            responsive: true,
            patternSequence: ['flower-of-life', 'metatron-cube', 'fibonacci-spiral', 'platonic-solid', 'vesica-piscis'],
            enablePatternHighlight: false
        };
        
        this.options = { ...this.defaults, ...options };
        
        if (typeof this.options.container === 'string') {
            this.container = document.querySelector(this.options.container);
        } else {
            this.container = this.options.container;
        }
        
        if (!this.container) {
            errorLogger.error('Particle system container not found', 'particles', 'high');
            return;
        }
        
        this.state = {
            isRunning: false,
            mousePosition: { x: null, y: null },
            particles: [],
            canvas: null,
            ctx: null,
            width: 0,
            height: 0,
            animationFrame: null,
            patternActive: false,
            currentPattern: null
        };
        
        this.patterns = {
            'flower-of-life': this.createFlowerOfLifePattern.bind(this),
            'metatron-cube': this.createMetatronCubePattern.bind(this),
            'fibonacci-spiral': this.createFibonacciSpiralPattern.bind(this),
            'platonic-solid': this.createPlatonicSolidPattern.bind(this),
            'vesica-piscis': this.createVesicaPiscisPattern.bind(this)
        };
        
        // Pattern sequence configuration
        this.patternSequence = this.options.patternSequence || ['flower-of-life', 'metatron-cube', 'fibonacci-spiral', 'platonic-solid'];
        this.currentPatternIndex = 0;
        this.patternInterval = null;
        
        this.init();
    }
    
    init() {
        try {
            this.createCanvas();
            this.createParticles();
            this.setupEventListeners();
            this.start();
            
            if (this.options.sacredGeometry) {
                setTimeout(() => {
                    this.startPatternCycle();
                }, 1000);
            }
        } catch (error) {
            errorLogger.error(
                `Failed to initialize particle system: ${error.message}`,
                'particles',
                'medium',
                { stack: error.stack }
            );
        }
    }
    
    createCanvas() {
        this.state.canvas = document.createElement('canvas');
        this.state.canvas.classList.add('particle-canvas');
        this.state.width = this.container.offsetWidth;
        this.state.height = this.container.offsetHeight;
        this.state.canvas.width = this.state.width;
        this.state.canvas.height = this.state.height;
        this.state.canvas.style.position = 'absolute';
        this.state.canvas.style.top = '0';
        this.state.canvas.style.left = '0';
        this.state.canvas.style.width = '100%';
        this.state.canvas.style.height = '100%';
        this.state.canvas.style.pointerEvents = 'none';
        this.state.ctx = this.state.canvas.getContext('2d');
        this.container.appendChild(this.state.canvas);
        const containerPosition = window.getComputedStyle(this.container).position;
        if (containerPosition === 'static') {
            this.container.style.position = 'relative';
        }
    }
    
    createParticles() {
        this.state.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            const particle = {
                x: Math.random() * this.state.width,
                y: Math.random() * this.state.height,
                size: this.getRandomSize(),
                speedX: (Math.random() - 0.5) * this.options.maxSpeed,
                speedY: (Math.random() - 0.5) * this.options.maxSpeed,
                color: Math.random() > (1 - this.options.secondaryRatio) ? 
                       this.options.secondaryColor : 
                       this.options.primaryColor,
                originalX: 0,
                originalY: 0,
                targetX: 0,
                targetY: 0,
                inPattern: false
            };
            this.state.particles.push(particle);
        }
    }
    
    setupEventListeners() {
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.state.canvas.getBoundingClientRect();
            this.state.mousePosition = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
        this.container.addEventListener('mouseleave', () => {
            this.state.mousePosition = { x: null, y: null };
        });
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
            this.state.width = this.container.offsetWidth;
            this.state.height = this.container.offsetHeight;
            this.state.canvas.width = this.state.width;
            this.state.canvas.height = this.state.height;
            this.redistributeParticles();
            this.resizeTimeout = null;
        }, 200);
    }
    
    redistributeParticles() {
        this.state.particles.forEach(particle => {
            particle.x = Math.min(Math.max(particle.x, 0), this.state.width);
            particle.y = Math.min(Math.max(particle.y, 0), this.state.height);
            particle.inPattern = false;
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
        this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
        if (this.options.connectParticles) {
            this.drawConnections();
        }
        this.updateParticles();
        this.drawParticles();
        this.state.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.state.particles.forEach(particle => {
            if (this.state.patternActive && particle.inPattern) {
                const dx = particle.targetX - particle.x;
                const dy = particle.targetY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Speed up movement in pattern mode for faster formation
                const speedFactor = this.state.currentPattern === 'platonic-solid' ? 0.5 : 0.4;
                
                if (distance > 0.1) {
                    particle.speedX = dx * speedFactor;
                    particle.speedY = dy * speedFactor;
                } else {
                    particle.speedX *= 0.4;
                    particle.speedY *= 0.4;
                }
            } else {
                if (this.state.mousePosition.x !== null && this.state.mousePosition.y !== null) {
                    const dx = this.state.mousePosition.x - particle.x;
                    const dy = this.state.mousePosition.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        const force = (150 - distance) / 150 * this.options.attractionStrength;
                        particle.speedX += dx * force * 0.01;
                        particle.speedY += dy * force * 0.01;
                    }
                }
                if (Math.random() < 0.05) {
                    particle.speedX += (Math.random() - 0.5) * 0.2;
                    particle.speedY += (Math.random() - 0.5) * 0.2;
                }
                particle.speedX *= this.options.friction;
                particle.speedY *= this.options.friction;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > this.options.maxSpeed) {
                    const ratio = this.options.maxSpeed / speed;
                    particle.speedX *= ratio;
                    particle.speedY *= ratio;
                }
            }
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            if (particle.x < 0) particle.x = this.state.width;
            if (particle.x > this.state.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.state.height;
            if (particle.y > this.state.height) particle.y = 0;
        });
    }
    
    drawParticles() {
        const ctx = this.state.ctx;
        const inPattern = this.state.patternActive && this.state.currentPattern;
        const patternHighlight = this.options.enablePatternHighlight && inPattern;
        
        this.state.particles.forEach(particle => {
            ctx.beginPath();
            
            // Use larger size for pattern particles if highlighting is enabled
            let particleSize = particle.size;
            if (patternHighlight && particle.inPattern) {
                particleSize *= 1.2;
            }
            
            ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
            
            // Use appropriate color based on pattern status
            if (patternHighlight && particle.inPattern) {
                // Use brighter color for pattern particles
                ctx.fillStyle = particle.color;
                
                // Add glow effect for pattern particles
                ctx.shadowColor = particle.color;
                ctx.shadowBlur = 5;
            } else {
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 0;
            }
            
            ctx.fill();
            
            // Reset shadow for next particle
            if (patternHighlight && particle.inPattern) {
                ctx.shadowBlur = 0;
            }
        });
    }
    
    drawConnections() {
        const particles = this.state.particles;
        const ctx = this.state.ctx;
        
        // Get primary color from options or computed style
        let lineColor = null;
        if (this.container) {
            const computed = window.getComputedStyle(this.container);
            const colorVar = computed.getPropertyValue('--color-primary');
            if (colorVar && colorVar.trim() !== '') {
                lineColor = colorVar.trim();
            }
        }
        
        // Fallback to options if no color was found
        if (!lineColor) {
            lineColor = this.options.primaryColor;
        }
        
        // Convert to RGB values for opacity control
        const rgbColor = this.hexToRgb(lineColor);
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Determine if we're in a pattern mode for different connection handling
        const inPattern = this.state.patternActive && this.state.currentPattern;
        
        // Special handling for patterns - adjust connection multiplier based on pattern
        let connectionMultiplier = 1;
        let minConnections = 0;
        
        if (inPattern) {
            if (this.state.currentPattern === 'vesica-piscis') {
                // Use vesica piscis specific settings if available
                if (this.options.vesicaPiscisSettings) {
                    connectionMultiplier = this.options.vesicaPiscisSettings.connectionMultiplier || 1.5;
                    minConnections = this.options.vesicaPiscisSettings.minConnections || 3;
                } else {
                    connectionMultiplier = 1.5;
                }
            } else if (this.state.currentPattern === 'platonic-solid') {
                connectionMultiplier = 1.8;
            } else {
                connectionMultiplier = 1.5;
            }
        }
        
        // Track connection counts for vesica piscis pattern
        const connectionCounts = new Map();
        if (this.state.currentPattern === 'vesica-piscis' && minConnections > 0) {
            particles.forEach((p, idx) => connectionCounts.set(idx, 0));
        }
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Use different connection logic for patterns
                let shouldConnect = false;
                let opacityMultiplier = 1;
                
                if (inPattern) {
                    // Add more connections for pattern visualization
                    const maxDistance = this.options.connectionDistance * connectionMultiplier;
                    
                    // Check if both particles are part of a pattern
                    if (particles[i].inPattern && particles[j].inPattern) {
                        // Increase connection probability for particles in patterns
                        shouldConnect = distance < maxDistance;
                        
                        // Override opacity for patterns to make them more visible
                        if (this.state.currentPattern === 'vesica-piscis') {
                            opacityMultiplier = 2.2; // Increased from 2.0 for better visibility
                        } else if (this.state.currentPattern === 'platonic-solid') {
                            opacityMultiplier = 2.5;
                        } else {
                            opacityMultiplier = 2;
                        }
                    } else if (distance < this.options.connectionDistance) {
                        // Regular connections for non-pattern particles
                        shouldConnect = true;
                    }
                } else if (distance < this.options.connectionDistance) {
                    // Regular connections outside patterns
                    shouldConnect = true;
                }
                
                if (shouldConnect) {
                    // Track connections for vesica piscis pattern
                    if (this.state.currentPattern === 'vesica-piscis' && minConnections > 0) {
                        connectionCounts.set(i, (connectionCounts.get(i) || 0) + 1);
                        connectionCounts.set(j, (connectionCounts.get(j) || 0) + 1);
                    }
                    
                    // Calculate opacity with adjusted curve for better visibility
                    const baseOpacity = Math.pow(1 - (distance / (this.options.connectionDistance * connectionMultiplier)), 1.5);
                    const opacity = Math.min(baseOpacity * 0.8 * opacityMultiplier, 0.9);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Special line treatment for vesica piscis pattern
                    if (inPattern && this.state.currentPattern === 'vesica-piscis' && 
                        particles[i].inPattern && particles[j].inPattern) {
                        ctx.strokeStyle = `rgba(${rgbColor}, ${opacity})`;
                        ctx.lineWidth = 0.8; // Slightly thicker lines for vesica piscis
                    } else {
                        ctx.strokeStyle = `rgba(${rgbColor}, ${opacity})`;
                        ctx.lineWidth = inPattern ? 0.8 : 0.5;
                    }
                    
                    ctx.stroke();
                }
            }
        }
        
        // Add additional connections for particles with too few connections in vesica piscis pattern
        if (this.state.currentPattern === 'vesica-piscis' && minConnections > 0) {
            particles.forEach((particle, i) => {
                if (particle.inPattern && connectionCounts.get(i) < minConnections) {
                    // Find closest particles to connect with
                    const closest = particles
                        .map((p, idx) => ({ idx, dist: Math.sqrt(Math.pow(p.x - particle.x, 2) + Math.pow(p.y - particle.y, 2)) }))
                        .filter(p => p.idx !== i && p.dist < this.options.connectionDistance * connectionMultiplier)
                        .sort((a, b) => a.dist - b.dist)
                        .slice(0, minConnections - connectionCounts.get(i));
                    
                    closest.forEach(({ idx, dist }) => {
                        const opacity = Math.pow(1 - (dist / (this.options.connectionDistance * connectionMultiplier)), 1.5) * 0.8 * 2.2;
                        
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(particles[idx].x, particles[idx].y);
                        ctx.strokeStyle = `rgba(${rgbColor}, ${Math.min(opacity, 0.9)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    });
                }
            });
        }
        
        ctx.restore();
    }
    
    formPattern(patternKey) {
        // Clear any active animation frames for smooth transition
        if (this.patternAnimationFrame) {
            cancelAnimationFrame(this.patternAnimationFrame);
            this.patternAnimationFrame = null;
        }
        
        console.log(`Forming pattern: ${patternKey}`);
        this.state.currentPattern = patternKey;
        
        const positions = this.patterns[patternKey]();
        
        // Calculate pattern bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        positions.forEach(pos => {
            minX = Math.min(minX, pos.x);
            maxX = Math.max(maxX, pos.x);
            minY = Math.min(minY, pos.y);
            maxY = Math.max(maxY, pos.y);
        });
        
        // Scale and center the pattern
        const patternWidth = maxX - minX;
        const patternHeight = maxY - minY;
        const scale = Math.min(
            (this.state.width * 0.8) / patternWidth,
            (this.state.height * 0.8) / patternHeight
        );
        
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const patternCenterX = minX + patternWidth / 2;
        const patternCenterY = minY + patternHeight / 2;
        
        // Transform positions
        const scaledPositions = positions.map(pos => ({
            x: centerX + (pos.x - patternCenterX) * scale,
            y: centerY + (pos.y - patternCenterY) * scale
        }));
        
        this.assignParticlesToPositions(scaledPositions);
    }
    
    /**
     * Create Flower of Life pattern
     * @private
     */
    createFlowerOfLifePattern() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const radius = Math.min(this.state.width, this.state.height) * 0.25;
        const positions = [];

        // Center point
        positions.push({ x: centerX, y: centerY });

        // First circle of 6 points
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            positions.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }

        // Second layer of circles
        for (let i = 0; i < 6; i++) {
            const baseAngle = (Math.PI / 3) * i;
            // Add points around each point in the first circle
            for (let j = 0; j < 6; j++) {
                const angle = baseAngle + (Math.PI / 3) * j;
                positions.push({
                    x: centerX + radius * Math.cos(baseAngle) + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(baseAngle) + radius * Math.sin(angle)
                });
            }
        }

        // Add intermediate points for better pattern definition
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI / 6) * i;
            // Inner ring
            positions.push({
                x: centerX + (radius * 0.5) * Math.cos(angle),
                y: centerY + (radius * 0.5) * Math.sin(angle)
            });
            // Outer ring
            positions.push({
                x: centerX + (radius * 1.5) * Math.cos(angle),
                y: centerY + (radius * 1.5) * Math.sin(angle)
            });
        }

        // Add connecting points for better pattern visibility
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            // Add points between center and first circle
            positions.push({
                x: centerX + (radius * 0.33) * Math.cos(angle),
                y: centerY + (radius * 0.33) * Math.sin(angle)
            });
            positions.push({
                x: centerX + (radius * 0.66) * Math.cos(angle),
                y: centerY + (radius * 0.66) * Math.sin(angle)
            });
        }

        // Add additional detail points for pattern enhancement
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI / 6) * i;
            // Add points at intersections
            positions.push({
                x: centerX + (radius * 0.866) * Math.cos(angle), // cos(60°) ≈ 0.866
                y: centerY + (radius * 0.866) * Math.sin(angle)
            });
        }

        return positions;
    }
    
    createMetatronCubePattern() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const scale = Math.min(this.state.width, this.state.height) * 0.3;
        const positions = [];
        
        // Center point
        positions.push({ x: centerX, y: centerY });
        
        // Inner hexagon
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            positions.push({
                x: centerX + scale * Math.cos(angle),
                y: centerY + scale * Math.sin(angle)
            });
        }
        
        // Outer points
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + (Math.PI / 6);
            positions.push({
                x: centerX + scale * 1.5 * Math.cos(angle),
                y: centerY + scale * 1.5 * Math.sin(angle)
            });
        }
        
        // Add additional points for connections
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI / 6) * i;
            positions.push({
                x: centerX + scale * 0.5 * Math.cos(angle),
                y: centerY + scale * 0.5 * Math.sin(angle)
            });
        }
        
        return positions;
    }
    
    createFibonacciSpiralPattern() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const scale = Math.min(this.state.width, this.state.height) * 0.35;
        const positions = [];
        const phi = (1 + Math.sqrt(5)) / 2;
        
        // Add center point
        positions.push({ x: centerX, y: centerY });
        
        // Reduce the number of points for less density
        const numPoints = Math.min(this.options.particleCount * 0.4, 120); // Reduced from 200
        
        // Create main spiral points with better spacing
        for (let i = 1; i < numPoints; i++) {
            // Improved logarithmic spiral formula for better point distribution
            const angle = i * (2 * Math.PI / phi);
            const distanceRatio = Math.pow(i / numPoints, 0.8); // Adjusted power for better spacing
            const distance = scale * distanceRatio;
            
            // Only add points at larger intervals to reduce density
            if (i % 3 === 0) { // Increased interval from every point to every third point
                positions.push({
                    x: centerX + distance * Math.cos(angle),
                    y: centerY + distance * Math.sin(angle)
                });
            }
        }
        
        // Add structured reference points for better pattern definition
        // Create golden ratio circles at key points
        const numCircles = 5; // Reduced from previous implementation
        for (let i = 1; i <= numCircles; i++) {
            const radius = scale * (i / numCircles);
            const numPointsInCircle = Math.floor(8 + i * 4); // More points in outer circles
            
            for (let j = 0; j < numPointsInCircle; j++) {
                const angle = (2 * Math.PI * j) / numPointsInCircle;
                positions.push({
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle)
                });
            }
        }
        
        // Add connecting points along golden ratio lines
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            for (let r = 0.2; r <= 1.0; r += 0.2) {
                const distance = scale * r;
                positions.push({
                    x: centerX + distance * Math.cos(angle),
                    y: centerY + distance * Math.sin(angle)
                });
            }
        }
        
        // Add some points to emphasize the golden ratio rectangles
        const goldenRatios = [1/phi, 1/phi/phi, 1/phi/phi/phi];
        goldenRatios.forEach(ratio => {
            const size = scale * ratio;
            // Add corner points
            [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([x, y]) => {
                positions.push({
                    x: centerX + size * x,
                    y: centerY + size * y
                });
            });
        });
        
        return positions;
    }
    
    createPlatonicSolidPattern() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const scale = Math.min(this.state.width, this.state.height) * 0.25;
        
        // Create a more visible 3D structure - using a custom geometric pattern
        // that will be more visible than the previous platonic solids
        return this.createGeometricPlatonic(centerX, centerY, scale);
    }
    
    createGeometricPlatonic(centerX, centerY, scale) {
        const positions = [];
        
        // Add center point
        positions.push({ x: centerX, y: centerY });
        
        // Create three main layers for better 3D effect
        const layers = 3;
        const layerSpacing = scale * 0.25; // Reduced from previous implementation
        
        for (let layer = 0; layer < layers; layer++) {
            const layerRadius = scale * (0.4 + layer * 0.2); // More gradual scaling
            const points = 8 + layer * 4; // Increase points gradually with each layer
            
            // Create main vertices for each layer
            for (let i = 0; i < points; i++) {
                const angle = (Math.PI * 2 / points) * i;
                positions.push({
                    x: centerX + layerRadius * Math.cos(angle),
                    y: centerY + layerRadius * Math.sin(angle)
                });
            }
            
            // Add intermediate points for structure definition
            if (layer < layers - 1) {
                for (let i = 0; i < points; i++) {
                    const angle = (Math.PI * 2 / points) * (i + 0.5);
                    positions.push({
                        x: centerX + (layerRadius + layerSpacing/2) * Math.cos(angle),
                        y: centerY + (layerRadius + layerSpacing/2) * Math.sin(angle)
                    });
                }
            }
        }
        
        // Create octahedron structure
        const octaPoints = [
            { x: 0, y: -0.8 },  // top
            { x: 0, y: 0.8 },   // bottom
            { x: -0.8, y: 0 },  // left
            { x: 0.8, y: 0 },   // right
            { x: 0, y: 0 }      // center
        ];
        
        octaPoints.forEach(point => {
            positions.push({
                x: centerX + scale * point.x,
                y: centerY + scale * point.y
            });
        });
        
        // Add connecting points for octahedron edges
        const octaConnections = [
            { x: -0.4, y: -0.4 },
            { x: 0.4, y: -0.4 },
            { x: -0.4, y: 0.4 },
            { x: 0.4, y: 0.4 }
        ];
        
        octaConnections.forEach(point => {
            positions.push({
                x: centerX + scale * point.x,
                y: centerY + scale * point.y
            });
        });
        
        // Create tetrahedron structure with better spacing
        const tetraRadius = scale * 0.6;
        const tetraPoints = 4;
        const tetraPhaseOffset = Math.PI / 6;
        
        for (let i = 0; i < tetraPoints; i++) {
            const angle = tetraPhaseOffset + (Math.PI * 2 / tetraPoints) * i;
            positions.push({
                x: centerX + tetraRadius * Math.cos(angle),
                y: centerY + tetraRadius * Math.sin(angle)
            });
            
            // Add midpoints between tetrahedron vertices
            const nextAngle = tetraPhaseOffset + (Math.PI * 2 / tetraPoints) * ((i + 1) % tetraPoints);
            const midAngle = (angle + nextAngle) / 2;
            positions.push({
                x: centerX + tetraRadius * 0.8 * Math.cos(midAngle),
                y: centerY + tetraRadius * 0.8 * Math.sin(midAngle)
            });
        }
        
        // Add inner star pattern for additional structure
        const innerStarPoints = 5;
        const innerRadius = scale * 0.3;
        const outerRadius = scale * 0.45;
        
        for (let i = 0; i < innerStarPoints * 2; i++) {
            const angle = (Math.PI / innerStarPoints) * i;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            positions.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        
        // Add connecting points between layers for better 3D effect
        const connectorCount = 6;
        for (let i = 0; i < connectorCount; i++) {
            const angle = (Math.PI * 2 / connectorCount) * i;
            for (let r = 0.2; r <= 0.8; r += 0.2) {
                positions.push({
                    x: centerX + scale * r * Math.cos(angle),
                    y: centerY + scale * r * Math.sin(angle)
                });
            }
        }
        
        return positions;
    }
    
    assignParticlesToPositions(positions) {
        const basePositions = positions;
        const transitionDuration = this.options.patternDuration || 2000;
        const startTime = performance.now();
        
        // Store initial positions
        this.state.particles.forEach(particle => {
            particle.startX = particle.x;
            particle.startY = particle.y;
        });
        
        // Create new pattern assignment with special handling for different patterns
        const currentPattern = this.state.currentPattern;
        
        // For platonic solid, ensure we have enough particles distributed to the star points
        if (currentPattern === 'platonic-solid') {
            // Reserve more particles for structure points in the platonic solid pattern
            const structurePoints = Math.min(positions.length, Math.floor(this.state.particles.length * 0.8));
            const remainingParticles = this.state.particles.length - structurePoints;
            
            // First assign structured particles
            for (let i = 0; i < structurePoints; i++) {
                const particle = this.state.particles[i];
                const basePos = positions[i % positions.length];
                
                // Very minimal jitter for structure points to keep pattern clear
                const jitterAmount = 2;
                const offsetX = (Math.random() - 0.5) * jitterAmount;
                const offsetY = (Math.random() - 0.5) * jitterAmount;
                
                particle.targetX = basePos.x + offsetX;
                particle.targetY = basePos.y + offsetY;
                particle.inPattern = true;
                particle.transitionStart = startTime;
                
                // Assign colors to emphasize structure
                if (i % 5 === 0 || i % 7 === 0) {
                    particle.color = this.options.secondaryColor;
                    particle.size *= 1.2; // Slightly larger for secondary color particles
                } else {
                    particle.color = this.options.primaryColor;
                }
            }
            
            // Remaining particles can be more randomly distributed
            for (let i = structurePoints; i < this.state.particles.length; i++) {
                const particle = this.state.particles[i];
                const basePos = positions[Math.floor(Math.random() * positions.length)];
                
                // More jitter for non-structure points
                const jitterAmount = 10;
                const offsetX = (Math.random() - 0.5) * jitterAmount;
                const offsetY = (Math.random() - 0.5) * jitterAmount;
                
                particle.targetX = basePos.x + offsetX;
                particle.targetY = basePos.y + offsetY;
                particle.inPattern = true;
                particle.transitionStart = startTime;
                
                // Use primarily the main color for background particles
                particle.color = Math.random() > 0.8 ? this.options.secondaryColor : this.options.primaryColor;
            }
        } else {
            // Original behavior for other patterns
            this.state.particles.forEach((particle, index) => {
                if (basePositions.length > 0) {
                    const basePos = basePositions[index % basePositions.length];
                    
                    // Reduced jitter for defined patterns, more for organic ones
                    let jitterAmount;
                    if (currentPattern === 'flower-of-life' || currentPattern === 'metatron-cube') {
                        jitterAmount = 3; // Less jitter for geometric patterns
                    } else if (currentPattern === 'fibonacci-spiral') {
                        jitterAmount = 2; // Very little jitter for spiral
                    } else {
                        jitterAmount = 5; // More jitter for other patterns
                    }
                    
                    const offsetX = (Math.random() - 0.5) * jitterAmount;
                    const offsetY = (Math.random() - 0.5) * jitterAmount;
                    
                    particle.targetX = basePos.x + offsetX;
                    particle.targetY = basePos.y + offsetY;
                    particle.inPattern = true;
                    particle.transitionStart = startTime;
                    
                    // Set color based on pattern for better visibility
                    if (index % 5 === 0) {
                        particle.color = this.options.secondaryColor;
                    } else {
                        particle.color = this.options.primaryColor;
                    }
                } else {
                    particle.inPattern = false;
                }
            });
        }
        
        // Update animation logic
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / transitionDuration, 1);
            
            // Smooth easing function
            const easeProgress = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            this.state.particles.forEach(particle => {
                if (particle.inPattern) {
                    particle.x = particle.startX + (particle.targetX - particle.startX) * easeProgress;
                    particle.y = particle.startY + (particle.targetY - particle.startY) * easeProgress;
                }
            });
            
            if (progress < 1) {
                this.patternAnimationFrame = requestAnimationFrame(animate);
            }
        };
        
        this.patternAnimationFrame = requestAnimationFrame(animate);
    }
    
    getRandomSize() {
        const min = this.options.particleSize[0];
        const max = this.options.particleSize[1];
        return Math.random() * (max - min) + min;
    }
    
    hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
    
    updateColors(primaryColor, secondaryColor) {
        this.options.primaryColor = primaryColor;
        this.options.secondaryColor = secondaryColor;
        this.state.particles.forEach(particle => {
            particle.color = Math.random() > (1 - this.options.secondaryRatio) ? 
                             this.options.secondaryColor : 
                             this.options.primaryColor;
        });
        return this;
    }
    
    destroy() {
        this.stop();
        if (this.state.canvas && this.state.canvas.parentNode) {
            this.state.canvas.parentNode.removeChild(this.state.canvas);
        }
        if (this.patternInterval) {
            clearInterval(this.patternInterval);
        }
        if (this.patternTimeout) {
            clearTimeout(this.patternTimeout);
        }
        if (this.patternAnimationFrame) {
            cancelAnimationFrame(this.patternAnimationFrame);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        window.removeEventListener('resize', this.handleResize);
    }
    
    startPatternCycle() {
        this.state.patternActive = true;
        
        // Start with the first pattern in the sequence
        this.formPattern(this.patternSequence[this.currentPatternIndex]);
        this.currentPatternIndex = (this.currentPatternIndex + 1) % this.patternSequence.length;
        
        // Clear any existing interval
        if (this.patternInterval) {
            clearInterval(this.patternInterval);
        }
        
        // Set up the interval for pattern transitions
        const setNextPatternTimeout = () => {
            // Get the base interval time
            const baseIntervalTime = typeof this.options.patternInterval === 'object' 
                ? Math.floor(Math.random() * (this.options.patternInterval[1] - this.options.patternInterval[0]) + this.options.patternInterval[0]) 
                : this.options.patternInterval;
            
            // Include dwell time
            const dwellTime = this.options.patternDwellTime || 0;
            const totalIntervalTime = baseIntervalTime + dwellTime;
            
            // Create timeout for next pattern
            this.patternTimeout = setTimeout(() => {
                // Form the next pattern
                const nextPattern = this.patternSequence[this.currentPatternIndex];
                console.log(`Pattern changing to: ${nextPattern}`);
                
                this.formPattern(nextPattern);
                
                // Update index for next iteration
                this.currentPatternIndex = (this.currentPatternIndex + 1) % this.patternSequence.length;
                
                // Set up next pattern transition
                setNextPatternTimeout();
            }, totalIntervalTime);
        };
        
        // Start the pattern cycle
        setNextPatternTimeout();
    }
    
    /**
     * Create Vesica Piscis pattern
     * @private
     */
    createVesicaPiscisPattern() {
        const centerX = this.state.width / 2;
        const centerY = this.state.height / 2;
        const radius = Math.min(this.state.width, this.state.height) * 0.25;
        const positions = [];

        // Calculate the distance between circle centers
        // In Vesica Piscis, this is equal to the radius of the circles
        const centerDistance = radius;

        // Add points for the left circle with increased density
        const leftCenterX = centerX - radius / 2;
        const leftCenterY = centerY;
        for (let i = 0; i < 48; i++) { // Increased from 36 to 48 points
            const angle = (Math.PI * 2 / 48) * i;
            positions.push({
                x: leftCenterX + radius * Math.cos(angle),
                y: leftCenterY + radius * Math.sin(angle)
            });
        }

        // Add points for the right circle with increased density
        const rightCenterX = centerX + radius / 2;
        const rightCenterY = centerY;
        for (let i = 0; i < 48; i++) { // Increased from 36 to 48 points
            const angle = (Math.PI * 2 / 48) * i;
            positions.push({
                x: rightCenterX + radius * Math.cos(angle),
                y: rightCenterY + radius * Math.sin(angle)
            });
        }

        // Add points along the intersection line with higher density
        const intersectionHeight = Math.sqrt(3) * radius / 2;
        for (let i = 0; i < 30; i++) { // Increased from 20 to 30 points
            const y = centerY - intersectionHeight + (2 * intersectionHeight * i / 29);
            positions.push({ x: centerX, y: y });
        }

        // Add center points of both circles and their midpoint
        positions.push({ x: leftCenterX, y: leftCenterY });
        positions.push({ x: rightCenterX, y: rightCenterY });
        positions.push({ x: centerX, y: centerY });

        // Add points for the vesica shape outline with increased detail
        const vesicaPoints = 36; // Increased from 24 to 36 points
        for (let i = 0; i < vesicaPoints; i++) {
            const t = i / (vesicaPoints - 1);
            const angle = Math.PI / 3 + (4 * Math.PI / 3) * t;
            positions.push({
                x: leftCenterX + radius * Math.cos(angle),
                y: leftCenterY + radius * Math.sin(angle)
            });
            
            const angle2 = -Math.PI / 3 - (4 * Math.PI / 3) * t;
            positions.push({
                x: rightCenterX + radius * Math.cos(angle2),
                y: rightCenterY + radius * Math.sin(angle2)
            });
        }

        // Add connecting points for better pattern definition with multiple layers
        for (let r = 0.3; r <= 0.8; r += 0.25) { // Add multiple circular layers
            for (let i = 0; i < 16; i++) {
                const angle = (Math.PI * 2 / 16) * i;
                const layerRadius = radius * r;
                positions.push({
                    x: centerX + layerRadius * Math.cos(angle),
                    y: centerY + layerRadius * Math.sin(angle)
                });
            }
        }

        // Add sacred ratio points based on phi (golden ratio)
        const phi = (1 + Math.sqrt(5)) / 2;
        const goldenRadius = radius / phi;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            positions.push({
                x: centerX + goldenRadius * Math.cos(angle),
                y: centerY + goldenRadius * Math.sin(angle)
            });
        }

        return positions;
    }
}

function initParticleSystems(options = {}) {
    const containers = document.querySelectorAll('.interactive-particle-system');
    const instances = [];
    containers.forEach(container => {
        const containerOptions = {
            container,
            particleCount: container.dataset.particleCount ? 
                          parseInt(container.dataset.particleCount, 10) : 
                          options.particleCount,
            primaryColor: container.dataset.particlePrimaryColor || 
                         options.primaryColor,
            secondaryColor: container.dataset.particleSecondaryColor || 
                           options.secondaryColor,
            sacredGeometry: container.dataset.particleSacredGeometry ? 
                           container.dataset.particleSacredGeometry !== 'false' : 
                           options.sacredGeometry
        };
        const instance = new ParticleSystem({
            ...options,
            ...containerOptions
        });
        instances.push(instance);
    });
    return instances;
}

export { ParticleSystem, initParticleSystems };
export default ParticleSystem;