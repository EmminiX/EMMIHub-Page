// Technology Section Component
// Manages the PromptSage™ framework visualization and code examples

import { getThemeColors } from '../utils/theme-utils.js';
import { NeuralOrganicNetwork } from '../animations/neural-organic-network.js';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { errorLogger } from '../utils/error-logger.js';

gsap.registerPlugin(ScrollTrigger);

export class TechnologySection {
  constructor() {
    this.section = document.querySelector('.technology-section');
    this.visualization = null;
    this.themeObserver = null;
    
    if (this.section) {
      this.initVisualization();
      this.observeThemeChanges();
    }
  }

  initVisualization() {
    const container = this.section.querySelector('.framework-visualization');
    if (!container) return;

    const colors = getThemeColors();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.visualization = new NeuralOrganicNetwork({
      container,
      nodeCount: 50,
      nodeSize: [2, 4],
      connectionDistance: 150,
      color: colors.accent,
      backgroundColor: 'transparent',
      pulseFrequency: 2000,
      pulseScale: 1.2,
      noiseScale: 0.002,
      reducedMotion
    });
    this.visualization.init(container);
  }

  observeThemeChanges() {
    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const colors = getThemeColors();
          if (this.visualization && this.visualization.updateColors) {
            this.visualization.updateColors(colors.accent, `${colors.accent}4D`);
          }
        }
      });
    });

    this.themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  cleanup() {
    if (this.visualization && this.visualization.cleanup) {
      this.visualization.cleanup();
    }
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }
}

/**
 * Technology section visualization
 * Manages the 3D visualization of interconnected technology nodes
 */
export class TechnologyVisualization {
    constructor() {
        this.container = document.querySelector('.technology-visualization');
        if (!this.container) {
            throw new Error('Technology visualization container not found');
        }

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        
        this.nodes = [];
        this.connections = [];
        this.isAnimating = false;
        
        this.init();
        this.setupEventListeners();
    }
    
    /**
     * Initialize the visualization
     * @private
     */
    init() {
        try {
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.container.appendChild(this.renderer.domElement);
            
            this.camera.position.z = 5;
            
            this.createTechnologyNodes();
            
            this.animate();
            
            this.setupScrollAnimations();
        } catch (error) {
            errorLogger.error(
                `Failed to initialize technology visualization: ${error.message}`,
                'technology-section',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Create technology nodes and their connections
     * @private
     */
    createTechnologyNodes() {
        const technologies = [
            { name: 'AI', color: 0x00ff00 },
            { name: 'Blockchain', color: 0x0000ff },
            { name: 'Cloud', color: 0xff0000 },
            { name: 'Data', color: 0xff00ff },
            { name: 'Edge', color: 0xffff00 }
        ];
        
        technologies.forEach((tech, index) => {
            const geometry = new THREE.SphereGeometry(0.2, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: tech.color,
                emissive: tech.color,
                emissiveIntensity: 0.5
            });
            
            const node = new THREE.Mesh(geometry, material);
            const angle = (index / technologies.length) * Math.PI * 2;
            node.position.x = Math.cos(angle) * 2;
            node.position.y = Math.sin(angle) * 2;
            
            this.nodes.push(node);
            this.scene.add(node);
        });
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    this.nodes[i].position,
                    this.nodes[j].position
                ]);
                
                const material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3
                });
                
                const line = new THREE.Line(geometry, material);
                this.connections.push(line);
                this.scene.add(line);
            }
        }
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }
    
    /**
     * Setup scroll-based animations
     * @private
     */
    setupScrollAnimations() {
        ScrollTrigger.create({
            trigger: this.container,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
                this.isAnimating = true;
                gsap.to(this.scene.rotation, {
                    y: Math.PI * 2,
                    duration: 20,
                    ease: 'none',
                    repeat: -1
                });
            },
            onLeave: () => {
                this.isAnimating = false;
            },
            onEnterBack: () => {
                this.isAnimating = true;
            },
            onLeaveBack: () => {
                this.isAnimating = false;
            }
        });
    }
    
    /**
     * Setup window resize and other event listeners
     * @private
     */
    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    /**
     * Handle window resize
     * @private
     */
    handleResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    /**
     * Animation loop
     * @private
     */
    animate() {
        if (!this.isAnimating) return;
        
        requestAnimationFrame(this.animate.bind(this));
        
        this.nodes.forEach((node, index) => {
            const time = Date.now() * 0.001;
            node.position.y += Math.sin(time + index) * 0.002;
        });
        
        this.connections.forEach((line, index) => {
            const positions = line.geometry.attributes.position.array;
            const sourceNode = this.nodes[Math.floor(index / (this.nodes.length - 1))];
            const targetNode = this.nodes[index % (this.nodes.length - 1) + 1];
            
            positions[0] = sourceNode.position.x;
            positions[1] = sourceNode.position.y;
            positions[2] = sourceNode.position.z;
            positions[3] = targetNode.position.x;
            positions[4] = targetNode.position.y;
            positions[5] = targetNode.position.z;
            
            line.geometry.attributes.position.needsUpdate = true;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Clean up resources
     * @public
     */
    destroy() {
        if (this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        window.removeEventListener('resize', this.handleResize.bind(this));
        
        this.nodes.forEach(node => {
            node.geometry.dispose();
            node.material.dispose();
        });
        
        this.connections.forEach(line => {
            line.geometry.dispose();
            line.material.dispose();
        });
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.nodes = [];
        this.connections = [];
    }
} 