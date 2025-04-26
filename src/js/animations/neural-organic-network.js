// Neural Organic Network Animation
// This module provides consistent neural network background animations across sections

export class NeuralOrganicNetwork {
    // Static array to track all instances
    static instances = [];

    constructor(options = {}) {
        this.options = {
            nodeCount: options.nodeCount || 50,
            nodeSize: options.nodeSize || [2, 4],
            connectionDistance: options.connectionDistance || 150,
            connectionOpacity: options.connectionOpacity || 0.15,
            nodeOpacity: options.nodeOpacity || 0.3,
            animationSpeed: options.animationSpeed || 0.5,
            color: options.color || 'var(--color-primary)',
            backgroundColor: options.backgroundColor || 'transparent',
            pulseFrequency: options.pulseFrequency || 2000,
            pulseScale: options.pulseScale || 1.2,
            noiseScale: options.noiseScale || 0.002,
            ...options
        };
        
        this.nodes = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.lastTime = 0;
        this.isActive = true;

        // Add this instance to the static array
        NeuralOrganicNetwork.instances.push(this);
    }

    // Static method to stop all animations
    static stopAllAnimations() {
        NeuralOrganicNetwork.instances.forEach(instance => {
            if (instance.animationFrame) {
                cancelAnimationFrame(instance.animationFrame);
                instance.animationFrame = null;
            }
            instance.isActive = false;
            instance.clearCanvas();
        });
    }

    // Static method to start all animations
    static startAllAnimations() {
        NeuralOrganicNetwork.instances.forEach(instance => {
            instance.isActive = true;
            if (!instance.animationFrame) {
                instance.animate();
            }
        });
    }

    clearCanvas() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    init(container) {
        // Create and setup canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        // Set canvas size
        this.resize();

        // Initialize nodes
        this.initNodes();

        // Start animation
        this.animate();

        // Add resize listener
        window.addEventListener('resize', () => this.resize());

        // Add intersection observer for performance
        this.setupIntersectionObserver(container);
    }

    initNodes() {
        this.nodes = [];
        for (let i = 0; i < this.options.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: this.options.nodeSize[0] + Math.random() * (this.options.nodeSize[1] - this.options.nodeSize[0]),
                speedX: (Math.random() - 0.5) * this.options.animationSpeed,
                speedY: (Math.random() - 0.5) * this.options.animationSpeed,
                lastPulse: Math.random() * this.options.pulseFrequency
            });
        }
    }

    resize() {
        if (!this.canvas) return;
        
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Reinitialize nodes when canvas is resized
        this.initNodes();
    }

    // Modify the animate method to respect the isActive flag
    animate(currentTime = 0) {
        if (!this.ctx || !this.canvas || !this.isActive) return;

        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw nodes
        this.updateNodes(deltaTime);
        this.drawConnections();
        this.drawNodes(deltaTime);

        // Request next frame
        this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    }

    updateNodes(deltaTime) {
        const noise = this.simplex2D.bind(this);
        
        this.nodes.forEach(node => {
            // Apply noise-based movement
            const timeScale = Date.now() * this.options.noiseScale;
            node.x += noise(node.x * this.options.noiseScale, timeScale) * this.options.animationSpeed;
            node.y += noise(timeScale, node.y * this.options.noiseScale) * this.options.animationSpeed;

            // Wrap around edges
            if (node.x < 0) node.x = this.canvas.width;
            if (node.x > this.canvas.width) node.x = 0;
            if (node.y < 0) node.y = this.canvas.height;
            if (node.y > this.canvas.height) node.y = 0;
        });
    }

    drawConnections() {
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - this.nodes[i].x;
                const dy = this.nodes[j].y - this.nodes[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.connectionDistance) {
                    const opacity = (1 - distance / this.options.connectionDistance) * this.options.connectionOpacity;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNodes(deltaTime) {
        this.ctx.fillStyle = this.options.color;
        
        this.nodes.forEach(node => {
            // Calculate pulse effect
            node.lastPulse += deltaTime;
            const pulsePhase = (node.lastPulse % this.options.pulseFrequency) / this.options.pulseFrequency;
            const pulseScale = 1 + Math.sin(pulsePhase * Math.PI * 2) * (this.options.pulseScale - 1);
            
            this.ctx.globalAlpha = this.options.nodeOpacity;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size * pulseScale, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    setupIntersectionObserver(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.animationFrame) {
                        this.animate();
                    }
                } else {
                    if (this.animationFrame) {
                        cancelAnimationFrame(this.animationFrame);
                        this.animationFrame = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(container);
    }

    // Simplex noise implementation for smooth movement
    simplex2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        
        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        
        const n0 = this.gradientNoise(i, j, x0, y0);
        const n1 = this.gradientNoise(i + 1, j, x0 - 1, y0);
        const n2 = this.gradientNoise(i, j + 1, x0, y0 - 1);
        const n3 = this.gradientNoise(i + 1, j + 1, x0 - 1, y0 - 1);
        
        return (n0 + n1 + n2 + n3) * 0.25;
    }

    gradientNoise(ix, iy, x, y) {
        const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
                       [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
                       [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
        
        const w = 0.5 * (1.0 - Math.cos(Math.PI * Math.min(Math.max(1.0 - Math.sqrt(x*x + y*y), 0.0), 1.0)));
        const gi = Math.floor((ix * 1640531513 ^ iy * 2654435789) % 12);
        const g = grad3[gi];
        
        return w * (g[0] * x + g[1] * y);
    }

    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        // Remove this instance from the static array
        const index = NeuralOrganicNetwork.instances.indexOf(this);
        if (index > -1) {
            NeuralOrganicNetwork.instances.splice(index, 1);
        }
    }
}

// Initialize neural networks for both sections with consistent configuration
export function initNeuralOrganicNetworks() {
    const commonConfig = {
        nodeCount: 40,
        nodeSize: [2, 3.5],
        connectionDistance: 180,
        connectionOpacity: 1.0,  // Set to 100% opacity
        nodeOpacity: 1.0,       // Set to 100% opacity
        animationSpeed: 0.6,
        pulseFrequency: 3500,
        pulseScale: 1.75,
        noiseScale: 0.0015
    };

    // Initialize for introduction section
    const introNetwork = new NeuralOrganicNetwork(commonConfig);
    const introContainer = document.querySelector('.introduction-section .neural-organic-network');
    if (introContainer) {
        introNetwork.init(introContainer);
    }

    // Initialize for assistants section
    const assistantsNetwork = new NeuralOrganicNetwork(commonConfig);
    const assistantsContainer = document.querySelector('.assistants-section .neural-organic-network');
    if (assistantsContainer) {
        assistantsNetwork.init(assistantsContainer);
    }
    
    // Initialize for about section
    const aboutNetwork = new NeuralOrganicNetwork(commonConfig);
    const aboutContainer = document.querySelector('.join-section .neural-organic-network');
    if (aboutContainer) {
        aboutNetwork.init(aboutContainer);
    }
}