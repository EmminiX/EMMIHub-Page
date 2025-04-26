/**
 * EMMIHUB - Main Application
 * 
 * This is the main entry point for the EMMIHUB website JavaScript.
 * It initializes all components, sets up event listeners, and manages the application state.
 * 
 * @author Emmi C.
 * @version 1.0
 */

// Import dependencies
import errorLogger from './error-logging.js';
import { NeuralOrganicNetwork } from '../animations/neural-organic-network.js';

// Main application class
class EmmihubApp {
    /**
     * Initialize the application
     */
    constructor() {
    // Application state
    this.state = {
    currentTheme: 'quantum-void',
    // Load reduced motion preference from localStorage or system preference
    reducedMotion: localStorage.getItem('emmihub_reduced_motion') === 'true' || 
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: false,
    currentSection: null,
    isMenuOpen: false,
    carouselElements: null,
    animations: {
    neuralNetworks: [],
    particleSystems: [],
    sacredGeometry: null,
    splitScreenNeural: null,
    globeCommunity: null,
    communityTiers: null,
    technologySection: null,
    orbitalCarousel: {
        isAnimating: false,
        animationFrame: null
    }
    }
    };

    // DOM elements cache
    this.elements = {
        reducedMotionToggle: document.querySelector('.reduced-motion-toggle'),
    };

    // Initialize the application
    this.init();
    }

    /**
     * Initialize the application
     * @private
     */
    init() {
    try {
    // Cache DOM elements
    this.cacheElements();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize components
    this.initializeComponents();

    // Apply user preferences
    this.applyUserPreferences();

    // Set initial section based on URL hash
    this.handleHashChange();
    
    // Identify current section based on scroll position
    this.updateCurrentSection();
    
    // Explicitly update active nav link to ensure it's highlighted
    this.updateActiveNavLink();

    // Mark current theme as active
    this.elements.themeOptions.forEach(option => {
        const themeValue = option.getAttribute('data-theme');
        option.classList.toggle('active', themeValue === this.state.currentTheme);
    });

    // Make sure to detect section on full page load
    window.addEventListener('load', () => {
        // Ensure current section is detected after all content is loaded
        this.updateCurrentSection();
        this.updateActiveNavLink();
    });

    // Force a scroll event to update the current section
    window.dispatchEvent(new Event('scroll'));

    // Log initialization
    console.log('%cEMMIHUB Application Initialized', 
                'color: #00f0ff; font-weight: bold; font-size: 12px;');
    } catch (error) {
    // Log any initialization errors
    errorLogger.error(
        `Failed to initialize application: ${error.message}`,
        'initialization',
        'critical',
        { stack: error.stack }
    );
    }
    }

    /**
     * Cache DOM elements for better performance
     * @private
     */
    cacheElements() {
    // Theme selector
    this.elements.themeToggle = document.querySelector('.theme-toggle');
    this.elements.themeOptions = document.querySelectorAll('.theme-option');

    // Accessibility controls
    this.elements.reducedMotionToggle = document.querySelector('.reduced-motion-toggle');
    this.elements.highContrastToggle = document.querySelector('.high-contrast-toggle');

    // Navigation
    this.elements.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.elements.mainNav = document.querySelector('.main-nav');
    this.elements.navLinks = document.querySelectorAll('.main-nav a');

    // Sections
    this.elements.sections = document.querySelectorAll('section[id]');

    // Interactive elements
    this.elements.typewriterElements = document.querySelectorAll('.typewriter');
    this.elements.ctaButtons = document.querySelectorAll('.cta-button');
    this.elements.cognitiveStyleOptions = document.querySelectorAll('.style-option');
    this.elements.assistantCards = document.querySelectorAll('.assistant-card');
    }

    /**
     * Set up event listeners
     * @private
     */
    setupEventListeners() {
    // Theme switching
    if (this.elements.themeToggle) {
    this.elements.themeToggle.addEventListener('click', () => {
        this.toggleThemeSelector();
    });
    }

    this.elements.themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const theme = option.getAttribute('data-theme');
        if (theme && theme !== this.state.currentTheme) {
            this.switchTheme(theme);
            // Visual feedback
            this.elements.themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            // Debug log
            console.log(`Theme switched to: ${theme}`);
        }
    });
    });

    // Accessibility toggles
    if (this.elements.reducedMotionToggle) {
    this.elements.reducedMotionToggle.addEventListener('click', () => {
        this.toggleReducedMotion();
    });
    }

    if (this.elements.highContrastToggle) {
    this.elements.highContrastToggle.addEventListener('click', () => {
        this.toggleHighContrast();
    });
    }

    // Mobile menu
    if (this.elements.mobileMenuToggle) {
    this.elements.mobileMenuToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
    });
    }

    // Navigation
    this.elements.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Close mobile menu when a link is clicked
        if (this.state.isMenuOpen) {
            this.toggleMobileMenu();
        }
    });
    });

    // Cognitive style selector
    this.elements.cognitiveStyleOptions.forEach(option => {
    option.addEventListener('click', () => {
        this.switchCognitiveStyle(option.getAttribute('data-style'));
    });
    });

    // Hash change for navigation
    window.addEventListener('hashchange', () => {
    this.handleHashChange();
    });

    // Scroll events for animations
    window.addEventListener('scroll', () => {
    this.handleScroll();
    }, { passive: true });
    
    // Dedicated scroll listener for section detection with higher frequency
    // This ensures we detect section changes even during fast scrolling
    const sectionDetector = () => {
        this.updateCurrentSection();
        
        // Continue checking frequently
        this.sectionDetectorTimeout = setTimeout(sectionDetector, 100);
    };
    
    // Start the section detector
    sectionDetector();
    
    // Make sure it stops when user leaves the page
    window.addEventListener('beforeunload', () => {
        if (this.sectionDetectorTimeout) {
            clearTimeout(this.sectionDetectorTimeout);
        }
    });

    // Resize events
    window.addEventListener('resize', () => {
    this.handleResize();
    }, { passive: true });

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.addEventListener('change', () => {
    this.state.reducedMotion = prefersReducedMotion.matches;
    this.applyReducedMotion();
    });

    // Initial check
    this.state.reducedMotion = prefersReducedMotion.matches;
    }

    /**
     * Initialize components
     * @private
     */
    async initializeComponents() {
    try {
    // Initialize in sequence to avoid overwhelming the browser
    await this.initTypewriterEffect();
    await this.initParticleSystem();
    await this.initNeuralNetwork();
    await this.initSacredGeometry();
    await this.initSplitScreenNeural();
    await this.initGlobeCommunity();
    await this.initTechnologySection();

    // Initialize other components that don't require heavy animation
    this.initOrbitalCarousel();
    this.initInteractiveTimeline();

    // Trigger initial scroll animations
    this.handleScroll();

    console.log('All components initialized successfully');
    } catch (error) {
    errorLogger.error(
        `Failed to initialize components: ${error.message}`,
        'initialization',
        'high',
        { stack: error.stack }
    );
    }
    }

    /**
     * Initialize community tiers animations
     * @private
     */
    async initCommunityTiers() {
        try {
            // The community section now uses the neural network animation
            // No additional initialization needed as it's handled by initNeuralNetwork()
            console.log('Community section using neural network animation');
        } catch (error) {
            console.error('Failed to initialize community section:', error);
        }
    }

    /**
     * Initialize technology section visualization
     * @private
     */
    async initTechnologySection() {
    try {
    // Import the technology section module
    const { TechnologySection } = await import('../sections/technology-section.js');

    // Initialize technology section
    const technologySection = new TechnologySection();

    // Store reference for cleanup
    this.state.animations.technologySection = technologySection;

    console.log('Technology section initialized successfully');
    } catch (error) {
    errorLogger.error(
        `Failed to initialize technology section: ${error.message}`,
        'technology-section',
        'high',
        { stack: error.stack }
    );
    }
    }

    /**
     * Apply user preferences from localStorage
     * @private
     */
    applyUserPreferences() {
    try {
    // Get saved theme
    const savedTheme = localStorage.getItem('emmihub_theme');
    if (savedTheme) {
        this.switchTheme(savedTheme, false); // Don't save again
    }

    // Get accessibility preferences
    const reducedMotion = localStorage.getItem('emmihub_reduced_motion') === 'true';
    const highContrast = localStorage.getItem('emmihub_high_contrast') === 'true';

    if (reducedMotion) {
        this.state.reducedMotion = true;
        this.applyReducedMotion();
    }

    if (highContrast) {
        this.state.highContrast = true;
        this.applyHighContrast();
    }
    } catch (error) {
    errorLogger.warning(
        `Failed to apply user preferences: ${error.message}`,
        'preferences'
    );
    }
    }

    /**
     * Handle hash change for navigation
     * @private
     */
    handleHashChange() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                // Update current section
                this.state.currentSection = hash.substring(1);
                
                // Calculate offset accounting for header height and additional padding for all sections
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const extraPadding = 20; // Extra padding for better visibility
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraPadding;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: this.state.reducedMotion ? 'auto' : 'smooth'
                });
                
                // Update active nav link
                this.updateActiveNavLink();
            }
        } else {
            // Default to home/hero section
            this.state.currentSection = 'hero';
            this.updateActiveNavLink();
        }
    }

    /**
     * Handle scroll events
     * @private
     */
    handleScroll() {
        // Use requestAnimationFrame for smoother performance
        if (!this.scrollRAF) {
            this.scrollRAF = window.requestAnimationFrame(() => {
                // Always determine current section based on scroll position
                this.updateCurrentSection();
                
                // Trigger scroll-based animations only if reduced motion is not enabled
                if (!this.state.reducedMotion) {
                    this.triggerScrollAnimations();
                    this.updateParallaxEffects();
                }
                
                // Clear the RAF flag
                this.scrollRAF = null;
            });
        }
    }

    /**
     * Handle resize events
     * @private
     */
    handleResize() {
    // Throttle resize events
    if (this.resizeTimeout) return;

    this.resizeTimeout = setTimeout(() => {
    // Update orbital carousel positions
    this.updateOrbitalCarousel();

    // Update any responsive elements
    this.updateResponsiveElements();

    // Clear timeout
    this.resizeTimeout = null;
    }, 100);
    }

    /**
     * Toggle theme selector
     * @private
     */
    toggleThemeSelector() {
        const orbitalToggle = this.elements.themeToggle.querySelector('.orbital-toggle');
        orbitalToggle.classList.toggle('active');
        
        // Mark current theme as active
        this.elements.themeOptions.forEach(option => {
            const themeValue = option.getAttribute('data-theme');
            option.classList.toggle('active', themeValue === this.state.currentTheme);
        });
    }

    /**
     * Switch theme
     * @param {string} theme - Theme name
     * @param {boolean} [save=true] - Whether to save the theme preference
     */
    switchTheme(theme, save = true) {
        // Remove current theme class
        document.body.classList.remove(`theme-${this.state.currentTheme}`);

        // Add new theme class
        document.body.classList.add(`theme-${theme}`);

        // Update state
        this.state.currentTheme = theme;

        // Update active state on theme options
        this.elements.themeOptions.forEach(option => {
            const themeValue = option.getAttribute('data-theme');
            option.classList.toggle('active', themeValue === theme);
        });

        // Save preference
        if (save) {
            localStorage.setItem('emmihub_theme', theme);
        }

        // Update error logger context
        if (window.errorLogger) {
            window.errorLogger.updateUserContext({
                theme: `theme-${theme}`
            });
        }

        // Add visual effect to show theme has changed
        const themeOption = Array.from(this.elements.themeOptions).find(
            option => option.getAttribute('data-theme') === theme
        );
        
        if (themeOption) {
            // Add temporary pulse effect
            const dot = themeOption.querySelector('.theme-dot');
            if (dot) {
                dot.classList.add('pulse-effect');
                setTimeout(() => {
                    dot.classList.remove('pulse-effect');
                }, 1000);
            }
        }

        // Log theme change
        console.log(`Theme switched to: ${theme}`);
    }

    /**
     * Toggle reduced motion mode
     * @private
     */
    toggleReducedMotion() {
        this.state.reducedMotion = !this.state.reducedMotion;
        this.applyReducedMotion();
        localStorage.setItem('emmihub_reduced_motion', this.state.reducedMotion);
    }

    /**
     * Apply reduced motion settings
     * @private
     */
    applyReducedMotion() {
        if (this.state.reducedMotion) {
            document.body.classList.add('reduced-motion');
            if (this.elements.reducedMotionToggle) {
                this.elements.reducedMotionToggle.classList.add('active');
            }
            // Stop neural-organic-network animations by calling stop() on each instance
            if (this.state.animations.neuralNetworks && this.state.animations.neuralNetworks.length > 0) {
                this.state.animations.neuralNetworks.forEach(network => {
                    if (network && typeof network.stop === 'function') {
                        network.stop();
                    }
                });
            }
        } else {
            document.body.classList.remove('reduced-motion');
            if (this.elements.reducedMotionToggle) {
                this.elements.reducedMotionToggle.classList.remove('active');
            }
            // Start neural-organic-network animations by calling start() on each instance
            if (this.state.animations.neuralNetworks && this.state.animations.neuralNetworks.length > 0) {
                this.state.animations.neuralNetworks.forEach(network => {
                    if (network && typeof network.start === 'function') {
                        network.start();
                    }
                });
            }
        }
    }

    /**
     * Toggle high contrast mode
     * @private
     */
    toggleHighContrast() {
    this.state.highContrast = !this.state.highContrast;
    this.applyHighContrast();
    localStorage.setItem('emmihub_high_contrast', this.state.highContrast);
    }

    /**
     * Apply high contrast settings
     * @private
     */
    applyHighContrast() {
    if (this.state.highContrast) {
    document.body.classList.add('high-contrast');
    if (this.elements.highContrastToggle) {
        this.elements.highContrastToggle.classList.add('active');
    }
    } else {
    document.body.classList.remove('high-contrast');
    if (this.elements.highContrastToggle) {
        this.elements.highContrastToggle.classList.remove('active');
    }
    }
    }

    /**
     * Toggle mobile menu
     * @private
     */
    toggleMobileMenu() {
    this.state.isMenuOpen = !this.state.isMenuOpen;

    if (this.state.isMenuOpen) {
    this.elements.mobileMenuToggle.classList.add('active');
    this.elements.mainNav.classList.add('active');
    } else {
    this.elements.mobileMenuToggle.classList.remove('active');
    this.elements.mainNav.classList.remove('active');
    }
    }

    /**
     * Update current section based on scroll position
     * @private
     */
    updateCurrentSection() {
        // Get all sections and their positions
        const sections = Array.from(this.elements.sections);
        if (!sections.length) return;
        
        // Find which section occupies the most viewport space
        let maxVisibleSection = null;
        let maxVisibleArea = 0;
        
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            
            // Calculate how much of the section is visible in the viewport
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            
            // Apply a bias towards the top of the viewport (give sections at the top more weight)
            // This ensures we select the section once it starts entering the viewport
            const topBias = 1 - (visibleTop / viewportHeight);
            const weightedVisibleArea = visibleHeight * (topBias * 1.5);
            
            if (weightedVisibleArea > maxVisibleArea) {
                maxVisibleArea = weightedVisibleArea;
                maxVisibleSection = section;
            }
        });
        
        // Update current section if it changed
        if (maxVisibleSection && maxVisibleSection.id !== this.state.currentSection) {
            this.state.currentSection = maxVisibleSection.id;
            
            // Update URL hash without scrolling
            history.replaceState(null, null, `#${maxVisibleSection.id}`);
            
            // Update active nav link
            this.updateActiveNavLink();
            
            // Update error logger context
            if (window.errorLogger) {
                window.errorLogger.updateUserContext({
                    currentSection: maxVisibleSection.id
                });
            }
            
            // Debug: log section changes if debug mode is on
            if (window.location.search.includes('debug=true')) {
                console.log(`Section changed to: ${maxVisibleSection.id}`);
            }
        }
    }

    /**
     * Update active navigation link
     * @private
     */
    updateActiveNavLink() {
    if (!this.elements.navLinks) return;
    
    // Remove active class from all links
    this.elements.navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current section link
    if (this.state.currentSection) {
        // Try to find exact match first
        let activeLink = document.querySelector(`.main-nav a[href="#${this.state.currentSection}"]`);
        
        // If no exact match, try to find partial match (for cases where hash might differ slightly)
        if (!activeLink) {
            this.elements.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.substring(1) === this.state.currentSection) {
                    activeLink = link;
                }
            });
        }
        
        // If we found a matching link, add active class
        if (activeLink) {
            activeLink.classList.add('active');
            
            // Optional: scroll the link into view in mobile menu if needed
            if (window.innerWidth <= 768 && this.state.isMenuOpen) {
                activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
    }

    /**
     * Initialize typewriter effect
     * @private
     */
    async initTypewriterEffect() {
    if (this.state.reducedMotion) return;

    try {
    // Import the typewriter module
    const module = await import('../animations/typewriter.js');
    const { initTypewriters } = module;

    // Initialize typewriters
    const typewriters = await initTypewriters({
        charDelay: [30, 70],
        cursor: true,
        cursorChar: '|',
        cursorPulse: 500,
        onComplete: function() {
            const sub = this.element.parentElement.querySelector('.subheadline');
            if (sub) {
                setTimeout(() => {
                    sub.classList.add('animate-in');
                    sub.style.opacity = '1';
                    sub.style.transform = 'translateY(0)';
                }, 200);
            }
        }
    });

    console.log('Typewriter effects initialized');
    return typewriters;
    } catch (error) {
    errorLogger.error(
        `Failed to initialize typewriter: ${error.message}`,
        'typewriter',
        'medium',
        { stack: error.stack }
    );
    }
    }

    /**
     * Initialize particle system
     * @private
     */
    async initParticleSystem() {
    try {
    // Import the particle system module
    const module = await import('../animations/particles.js');
    const { initParticleSystems } = module;

    // Get theme colors
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim();
    const secondaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-secondary')
        .trim();

    // Initialize particle systems
    this.state.animations.particleSystems = await initParticleSystems({
        particleCount: 240,
        connectParticles: true,
        primaryColor,
        secondaryColor,
        sacredGeometry: true,
        patternInterval: [6000, 9000],
        patternDuration: 2000,
        particleSize: [1.2, 2.0],
        maxSpeed: 1.2,
        connectionDistance: 220,
        friction: 0.985,
                patternSequence: [
                    'flower-of-life',
                    'metatron-cube',
                    'fibonacci-spiral',
                    'platonic-solid',
                    'vesica-piscis'
                ],
                enablePatternHighlight: true,
                patternDwellTime: 0,
                vesicaPiscisSettings: {
                    additionalConnections: true,
                    connectionMultiplier: 1.5,
                    minConnections: 3
                }
            });

            // Listen for theme changes
            const observer = new MutationObserver(() => {
                const newPrimaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-primary')
                    .trim();
                const newSecondaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--color-secondary')
                    .trim();

                this.state.animations.particleSystems.forEach(system => {
                    system.updateColors(newPrimaryColor, newSecondaryColor);
                });
            });

            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            this._particleThemeObserver = observer;

            console.log('Particle systems initialized');
        } catch (error) {
            errorLogger.error(
                `Failed to initialize particle system: ${error.message}`,
                'particles',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Initialize neural network visualization
     * @private
     */
    async initNeuralNetwork() {
        const networkContainers = document.querySelectorAll('.neural-organic-network');
        if (!networkContainers.length) return;

        try {
            // Import the neural network module
            const module = await import('../animations/neural-network.js');
            const { NeuralOrganicNetwork } = module;

            // Theme color mapping
            const themeColors = {
                "quantum-void": {
                    node: "#00f0ff",
                    line: "rgba(0, 240, 255, 0.3)"
                },
                "biomorphic-synthesis": {
                    node: "#43fec4",
                    line: "rgba(67, 254, 196, 0.3)"
                },
                "neural-circuit": {
                    node: "#ff2b4e",
                    line: "rgba(255, 43, 78, 0.3)"
                },
                "blockchain-horizons": {
                    node: "#00e9c0",
                    line: "rgba(0, 233, 192, 0.3)"
                }
            };

            const getTheme = () => {
                const body = document.body;
                const match = Array.from(body.classList).find(cls => cls.startsWith("theme-"));
                return match ? match.replace("theme-", "") : "quantum-void";
            };

            const theme = getTheme();
            const colors = themeColors[theme] || themeColors["quantum-void"];

            networkContainers.forEach(container => {
                // Remove any existing canvas
                const oldCanvas = container.querySelector('.neural-network-canvas');
                if (oldCanvas) oldCanvas.remove();

                // Initialize new network
                const network = new NeuralOrganicNetwork({
                    container,
                    nodeCount: 120,
                    connectionDistance: 150,
                    nodeColor: colors.node,
                    lineColor: colors.line,
                    nodeSize: [2, 4],
                    lineWidth: 0.5,
                    transformSpeed: 0.0001,
                    responsive: true
                });

                this.state.animations.neuralNetworks.push(network);
            });

            // Listen for theme changes
            if (!this._neuralThemeListener) {
                this._neuralThemeListener = () => {
                    const theme = getTheme();
                    const colors = themeColors[theme] || themeColors["quantum-void"];
                    
                    this.state.animations.neuralNetworks.forEach(network => {
                        network.updateColors(colors.node, colors.line);
                    });
                };

                const observer = new MutationObserver(this._neuralThemeListener);
                observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
                this._neuralThemeObserver = observer;
            }

            console.log('Neural network visualizations initialized');
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
     * Initialize sacred geometry backdrop
     * @private
     */
    async initSacredGeometry() {
        const geometryContainer = document.querySelector('.sacred-geometry-backdrop');
        if (!geometryContainer) return;

        try {
            // Import the sacred geometry module
            const module = await import('../animations/sacred-geometry.js');
            const { SacredGeometryBackdrop } = module;

            // Get theme colors
            const primaryColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-primary')
                .trim();

            // Initialize backdrop
            this.state.animations.sacredGeometry = new SacredGeometryBackdrop({
                container: geometryContainer,
                pattern: 'all',
                opacity: 0.1,
                rotationSpeed: 0.0005,
                lineColor: `rgba(${this.hexToRgb(primaryColor)}, 0.3)`,
                lineWidth: 0.5,
                responsive: true
            });

            console.log('Sacred geometry backdrop initialized');
        } catch (error) {
            errorLogger.error(
                `Failed to initialize sacred geometry: ${error.message}`,
                'sacred-geometry',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Initialize split-screen neural visualization
     * @private
     */
    async initSplitScreenNeural() {
        const splitScreenContainer = document.querySelector('.split-screen-visualization');
        if (!splitScreenContainer) return;
        
        // Get the human side, AI side, and connection zone
        const humanSide = splitScreenContainer.querySelector('.human-side');
        const aiSide = splitScreenContainer.querySelector('.ai-side');
        const connectionZone = splitScreenContainer.querySelector('.connection-zone');
        
        if (!humanSide || !aiSide || !connectionZone) {
            console.warn('Split-screen neural visualization containers not found');
            return;
        }
        
    try {
    // Import the split-screen neural module
        const module = await import('../animations/split-screen-neural.js');
        const { SplitScreenNeural } = module;
        
        // Theme color mapping for neural visualization
        const themeColors = {
            "quantum-void": {
                humanColor: "#00b4d8",
                humanGradient: "#90e0ef",
                aiColor: "#7209b7",
                aiGradient: "#f72585"
            },
            "biomorphic-synthesis": {
                humanColor: "#43fec4",
                humanGradient: "#90e0ef",
                aiColor: "#ffb100",
                aiGradient: "#ff6b35"
            },
            "neural-circuit": {
                humanColor: "#0066ff",
                humanGradient: "#00a8e8",
                aiColor: "#ff2b4e",
                aiGradient: "#ff6b6b"
            },
            "blockchain-horizons": {
                humanColor: "#00e9c0",
                humanGradient: "#00f5d4",
                aiColor: "#ff6b35",
                aiGradient: "#ff9e00"
                }
            };
            
            const getTheme = () => {
                const body = document.body;
                const match = Array.from(body.classList).find(cls => cls.startsWith("theme-"));
                return match ? match.replace("theme-", "") : "quantum-void";
            };
            
            const theme = getTheme();
            const colors = themeColors[theme] || themeColors["quantum-void"];
            
            // Initialize split-screen neural visualization
            this.state.animations.splitScreenNeural = new SplitScreenNeural({
                humanSide,
                aiSide,
                connectionZone,
                humanColor: colors.humanColor,
                humanGradient: colors.humanGradient,
                aiColor: colors.aiColor,
                aiGradient: colors.aiGradient,
                nodeCount: 50,
                connectionCount: 10,
                pulseFrequency: 3,
                responsive: true
            });
            
            // Listen for theme changes to update colors
            if (!this._splitScreenThemeListener) {
                this._splitScreenThemeListener = () => {
                    const theme = getTheme();
                    const colors = themeColors[theme] || themeColors["quantum-void"];
                    
                    if (this.state.animations.splitScreenNeural) {
                        this.state.animations.splitScreenNeural.updateColors(
                            colors.humanColor,
                            colors.humanGradient,
                            colors.aiColor,
                            colors.aiGradient
                        );
                    }
                };
                
                // Listen for class changes on body (theme switch)
                const observer = new MutationObserver(this._splitScreenThemeListener);
                observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
                this._splitScreenThemeObserver = observer;
            }
            
            console.log('Split-screen neural visualization initialized');
        } catch (error) {
            errorLogger.error(
                `Failed to initialize split-screen neural visualization: ${error.message}`,
                'split-screen-neural',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Initialize globe community visualization
     * @private
     */
    async initGlobeCommunity() {
        const globeContainer = document.querySelector('.globe');
        if (!globeContainer) return;
        
        try {
            // Import the globe community module
            const module = await import('../animations/globe-community.js');
            const { initGlobeCommunities } = module;
            
            // Initialize globe communities
            this.state.animations.globeCommunity = await initGlobeCommunities({
                radius: Math.min(globeContainer.offsetWidth, globeContainer.offsetHeight) * 0.4,
                rotationSpeed: 0.0005,
                globeColor: `rgba(${this.hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim())}, 0.2)`,
                landColor: `rgba(${this.hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim())}, 0.5)`,
                connectionColor: 'rgba(255, 255, 255, 0.6)',
                nodeCount: 30,
                interactive: true
            });
            
            console.log('Globe community visualization initialized');
        } catch (error) {
            errorLogger.error(
                `Failed to initialize globe community: ${error.message}`,
                'globe-community',
                'high',
                { stack: error.stack }
            );
        }
    }
    
    /**
     * Initialize orbital carousel
     * @private
     */
    initOrbitalCarousel() {
        const carousel = document.querySelector('.orbital-carousel');
        if (!carousel) return;

        // Don't include assistant cards in the orbital carousel
        let cards = Array.from(carousel.querySelectorAll('.orbital-card'));
        
        // If no specific orbital cards exist, use other cards but exclude assistant cards
        if (!cards.length) {
            cards = Array.from(carousel.querySelectorAll('.card')).filter(card => 
                !card.classList.contains('assistant-card') && 
                !card.getAttribute('data-exclude-from-orbital')
            );
        }
        
        const isMobile = window.innerWidth <= 768;
        
        // Store references for later use
        this.state.carouselElements = {
            carousel,
            cards
        };
        
        // Stop any existing animation
        this.stopOrbitalRotation();
        
        if (!isMobile && cards.length) {
            // Initialize orbital positions
            cards.forEach((card, index) => {
                card.dataset.index = index;
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                // Reset any lingering styles from previous interactions
                card.classList.remove('active');
            });

            // Trigger initial positioning with a slight delay for smooth animation
            setTimeout(() => {
                this.updateOrbitalCarousel(carousel, cards);
                this.startOrbitalRotation(carousel, cards);
            }, 100);
        }

        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                location.reload(); // Refresh on mobile/desktop switch
            } else if (!newIsMobile) {
                this.updateOrbitalCarousel(carousel, cards);
            }
        }, 250));
    }
    
    /**
     * Update orbital carousel positions
     * @private
     */
    updateOrbitalCarousel(carousel, cards) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) return;

        carousel = carousel || (this.state.carouselElements && this.state.carouselElements.carousel);
        cards = cards || (this.state.carouselElements && this.state.carouselElements.cards);
        
        if (!carousel || !cards || !cards.length) return;

        const centerX = carousel.offsetWidth / 2;
        const centerY = carousel.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) * 0.75;
        const totalCards = cards.length;

        cards.forEach((card, index) => {
            // Skip active cards
            if (card.classList.contains('active')) return;
            
            // Ensure transition is reset
            card.style.transition = 'all 0.5s var(--ease-emphasis)';
            
            const angle = (index / totalCards) * Math.PI * 2;
            const x = centerX + radius * Math.cos(angle) - (card.offsetWidth / 2);
            const y = centerY + radius * Math.sin(angle) - (card.offsetHeight / 2);
            const rotationZ = (angle * 180) / Math.PI;
            const scale = 0.85 + (Math.sin(angle + Math.PI) * 0.15);
            const zIndex = Math.round(100 + (Math.sin(angle + Math.PI) * 100));

            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
            card.style.transform = `scale(${scale}) rotateZ(${rotationZ}deg) translateZ(${zIndex}px)`;
            card.style.zIndex = zIndex;
            card.style.opacity = '1';
        });
    }
    
    /**
     * Start orbital rotation animation
     * @private
     */
    startOrbitalRotation(carousel, cards) {
        if (window.innerWidth <= 768) return;

        // Keep track of existing rotation state
        let startTime = performance.now();
        const rotationDuration = 40000;
        
        // If animation already exists, try to maintain current rotation angle
        if (this.state.animations.orbitalCarousel && 
            this.state.animations.orbitalCarousel.startTime && 
            this.state.animations.orbitalCarousel.rotationAngle) {
            
            // Calculate elapsed time to maintain angle
            const elapsed = performance.now() - this.state.animations.orbitalCarousel.startTime;
            const progress = (elapsed % rotationDuration) / rotationDuration;
            
            // Adjust startTime to maintain current rotation angle
            startTime = performance.now() - (progress * rotationDuration);
        }

        // Stop any existing animation first
        this.stopOrbitalRotation();

        // Store animation state in the app instance
        this.state.animations.orbitalCarousel = {
            isAnimating: true,
            animationFrame: null,
            startTime: startTime,
            rotationAngle: 0
        };

        const animate = (currentTime) => {
            if (!this.state.animations.orbitalCarousel.isAnimating) return;

            const elapsed = currentTime - startTime;
            const progress = (elapsed % rotationDuration) / rotationDuration;
            const angle = progress * Math.PI * 2;
            
            // Store current rotation angle for potential restarts
            this.state.animations.orbitalCarousel.rotationAngle = angle;

            cards.forEach((card, index) => {
                // Skip cards that have the active class
                if (card.classList.contains('active')) return;
                
                const cardAngle = angle + ((index / cards.length) * Math.PI * 2);
                const centerX = carousel.offsetWidth / 2;
                const centerY = carousel.offsetHeight / 2;
                const radius = Math.min(centerX, centerY) * 0.75;

                const x = centerX + radius * Math.cos(cardAngle) - (card.offsetWidth / 2);
                const y = centerY + radius * Math.sin(cardAngle) - (card.offsetHeight / 2);
                const rotationZ = (cardAngle * 180) / Math.PI;
                const scale = 0.85 + (Math.sin(cardAngle + Math.PI) * 0.15);
                const zIndex = Math.round(100 + (Math.sin(cardAngle + Math.PI) * 100));
                
                // Add a will-change hint to improve rendering performance
                card.style.willChange = 'transform, left, top, z-index';
                
                // Apply position with hardware-accelerated transform when possible
                card.style.left = `${x}px`;
                card.style.top = `${y}px`;
                card.style.transform = `scale(${scale}) rotateZ(${rotationZ}deg) translateZ(${zIndex}px)`;
                card.style.zIndex = zIndex;
            });

            // Store the animation frame reference
            this.state.animations.orbitalCarousel.animationFrame = requestAnimationFrame(animate);
        };

        // Start animation
        this.state.animations.orbitalCarousel.animationFrame = requestAnimationFrame(animate);
    }
    
    /**
     * Stop orbital rotation animation
     * @private
     */
    stopOrbitalRotation() {
        if (this.state.animations.orbitalCarousel) {
            this.state.animations.orbitalCarousel.isAnimating = false;
            
            if (this.state.animations.orbitalCarousel.animationFrame) {
                cancelAnimationFrame(this.state.animations.orbitalCarousel.animationFrame);
                this.state.animations.orbitalCarousel.animationFrame = null;
            }
        }
    }
    
    /**
     * Initialize interactive timeline
     * @private
     */
    initInteractiveTimeline() {
        const timeline = document.querySelector('.interactive-timeline');
        if (!timeline) return;
        
        // Create timeline markers
        const milestones = [
            { id: 'past', label: 'Foundation', date: '2024', status: 'completed' },
            { id: 'present', label: 'Community Growth', date: '2025', status: 'current' },
            { id: 'future1', label: 'Advanced Assistants', date: '2026', status: 'future' },
            { id: 'future2', label: 'Global Expansion', date: '2027', status: 'future' }
        ];
        
        milestones.forEach(milestone => {
            const marker = document.createElement('div');
            marker.classList.add('timeline-marker', milestone.status);
            marker.setAttribute('data-id', milestone.id);
            
            const dot = document.createElement('div');
            dot.classList.add('marker-dot');
            
            const label = document.createElement('div');
            label.classList.add('marker-label');
            label.textContent = milestone.label;
            
            const date = document.createElement('div');
            date.classList.add('marker-date');
            date.textContent = milestone.date;
            
            marker.appendChild(dot);
            marker.appendChild(label);
            marker.appendChild(date);
            
            timeline.appendChild(marker);
        });
        
        // Add connecting line
        const line = document.createElement('div');
        line.classList.add('timeline-line');
        timeline.appendChild(line);
        
        // Add progress indicator
        const progress = document.createElement('div');
        progress.classList.add('timeline-progress');
        timeline.appendChild(progress);
        
        // Set initial progress
        progress.style.width = '50%'; // Current milestone
    }
    
    /**
     * Trigger scroll-based animations
     * @private
     */
    triggerScrollAnimations() {
        if (this.state.reducedMotion) return;
        
        // Get all animatable elements
        const animatableElements = document.querySelectorAll('.animate-on-scroll');
        
        // Check each element
        animatableElements.forEach(element => {
            if (this.isElementInViewport(element) && !element.classList.contains('animated')) {
                // Add animated class to prevent re-animation
                element.classList.add('animated');
                
                // Add animation class based on data attribute
                const animation = element.getAttribute('data-animation') || 'fade-in';
                element.classList.add(animation);
            }
        });
    }
    
    /**
     * Update parallax effects based on scroll position
     * @private
     */
    updateParallaxEffects() {
        if (this.state.reducedMotion) return;
        
        // Get scroll position
        const scrollY = window.scrollY;
        
        // Update parallax backgrounds
        const parallaxElements = document.querySelectorAll('.parallax-background');
        
        parallaxElements.forEach(element => {
            // Get parent section
            const section = element.closest('section');
            if (!section) return;
            
            // Calculate section position relative to viewport
            const sectionTop = section.getBoundingClientRect().top + scrollY;
            const sectionHeight = section.offsetHeight;
            
            // Only apply parallax if section is in view
            if (scrollY + window.innerHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                // Calculate relative position within section (0 to 1)
                const relativePos = (scrollY - sectionTop) / sectionHeight;
                
                // Apply different movement rates to layers
                const layers = element.querySelectorAll('.stars-layer');
                
                layers.forEach(layer => {
                    if (layer.classList.contains('distant')) {
                        // Distant stars move slowest (10%)
                        layer.style.transform = `translateY(${relativePos * 10}px)`;
                    } else if (layer.classList.contains('mid-field')) {
                        // Mid-field elements move moderately (25%)
                        layer.style.transform = `translateY(${relativePos * 25}px)`;
                    } else if (layer.classList.contains('foreground')) {
                        // Foreground elements move fastest (40%)
                        layer.style.transform = `translateY(${relativePos * 40}px)`;
                    }
                });
            }
        });
    }
    
    /**
     * Switch cognitive style
     * @param {string} style - Cognitive style name
     * @private
     */
    switchCognitiveStyle(style) {
        // Remove active class from all options
        this.elements.cognitiveStyleOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to selected option
        const selectedOption = document.querySelector(`.style-option[data-style="${style}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
        
        // Update content based on selected style
        this.updateContentForCognitiveStyle(style);
    }
    
    /**
     * Update content based on cognitive style
     * @param {string} style - Cognitive style name
     * @private
     */
    updateContentForCognitiveStyle(style) {
        // This is a placeholder for content adaptation
        // In a real implementation, this would modify content presentation
        console.log(`Content updated for cognitive style: ${style}`);
        
        // For now, we'll just add a class to the body
        document.body.classList.remove('style-visual', 'style-analytical', 'style-pattern');
        document.body.classList.add(`style-${style}`);
    }
    
    /**
     * Update responsive elements
     * @private
     */
    updateResponsiveElements() {
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        
        // Update orbital carousel for responsive layout
        this.updateOrbitalCarousel();
        
        // Update other responsive elements as needed
    }
    
    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} [offset=100] - Offset in pixels
     * @returns {boolean} Whether element is in viewport
     * @private
     */
    isElementInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        
        return (
            rect.top <= window.innerHeight + offset &&
            rect.bottom >= -offset &&
            rect.left <= window.innerWidth + offset &&
            rect.right >= -offset
        );
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
     * Clean up animations on page unload
     * @private
     */
    cleanup() {
        // Stop section detector
        if (this.sectionDetectorTimeout) {
            clearTimeout(this.sectionDetectorTimeout);
            this.sectionDetectorTimeout = null;
        }
        
        // Stop and clean up neural networks
        if (this.state.animations.neuralNetworks) {
            this.state.animations.neuralNetworks.forEach(network => network.destroy());
        }

        // Stop and clean up particle systems
        if (this.state.animations.particleSystems) {
            this.state.animations.particleSystems.forEach(system => system.destroy());
        }

        // Clean up sacred geometry
        if (this.state.animations.sacredGeometry) {
            this.state.animations.sacredGeometry.destroy();
        }

        // Clean up split screen neural
        if (this.state.animations.splitScreenNeural) {
            this.state.animations.splitScreenNeural.destroy();
        }

        // Clean up globe community
        if (this.state.animations.globeCommunity) {
            this.state.animations.globeCommunity.destroy();
        }

        // Remove theme observers
        if (this._neuralThemeObserver) {
            this._neuralThemeObserver.disconnect();
        }
        if (this._particleThemeObserver) {
            this._particleThemeObserver.disconnect();
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set default theme if none is set
    const savedTheme = localStorage.getItem('emmihub_theme');
    if (!savedTheme) {
        document.body.classList.remove(
            'theme-quantum-void',
            'theme-biomorphic-synthesis',
            'theme-neural-circuit',
            'theme-blockchain-horizons'
        );
        document.body.classList.add('theme-quantum-void');
    }

    // Create app instance
    window.emmihubApp = new EmmihubApp();

    // Clean up on page unload
    window.addEventListener('unload', () => {
        if (window.emmihubApp) {
            window.emmihubApp.cleanup();
        }
    });
});

// Export the application class
export default EmmihubApp;
