/**
 * PromptSageVisualization - Interactive visualization of the PromptSage™ framework
 * Features:
 * - Central hub with radiating structure for different processing types
 * - Structured layers and hexagonal boundaries
 * - Animated signal flows between nodes
 * - Role node highlighting
 * - Responsive design with reduced motion support
 */

export function initPromptSageVisualization(config = {}) {
    // Default configuration
    const defaultConfig = {
        container: null,
        width: 800,
        height: 600,
        nodeCount: {
            visual: 7,    // Blue/cyan nodes
            analytical: 7, // Purple nodes
            pattern: 7     // Gold/yellow nodes
        },
        colors: {
            hub: 'var(--color-primary)',
            visual: 'var(--color-accent-1, #00c8ff)',
            analytical: 'var(--color-accent-2, #9c6bff)',
            pattern: 'var(--color-accent-3, #ffbb00)',
            boundary: 'var(--color-accent-4, rgba(255, 255, 255, 0.15))'
        },
        particleCount: 50,
        particleSize: [1.5, 3],
        animationSpeed: 1,
        reducedMotion: false,
        boundary: {
            rings: 2,
            segments: 6 // Hexagonal
        },
        roles: ['Tutor', 'Examiner', 'Assistant']
    };
    
    // Merge provided config with defaults
    const mergedConfig = {...defaultConfig, ...config};
    
    // Store instance state
    const state = {
        canvas: null,
        ctx: null,
        centerX: 0,
        centerY: 0,
        nodes: {
            hub: null,
            visual: [],
            analytical: [],
            pattern: [],
            roles: []
        },
        particles: [],
        boundaries: [],
        animationFrame: null,
        hoveredNode: null,
        activeRole: 0, // Index of currently highlighted role
        roleInterval: null,
        tooltipElement: null,
        dpr: window.devicePixelRatio || 1
    };
    
    // Initialize the visualization
    function init() {
        if (!mergedConfig.container) {
            console.error('PromptSage visualization: No container element provided');
            return;
        }
        
        createCanvas();
        createNodes();
        createParticles();
        createBoundaries();
        setupTooltip();
        setupEventListeners();
        
        // Start role rotation interval
        cycleActiveRole();
        state.roleInterval = setInterval(cycleActiveRole, 5000);
        
        // Start animation loop
        animate();
        
        // Return public methods
        return {
            updateColors,
            reset,
            cleanup
        };
    }
    
    // Create and set up the canvas
    function createCanvas() {
        state.canvas = document.createElement('canvas');
        state.ctx = state.canvas.getContext('2d');
        
        // Set canvas size with DPI adjustment
        const containerRect = mergedConfig.container.getBoundingClientRect();
        const width = containerRect.width;
        const height = Math.min(containerRect.height, width * 0.75); // Aspect ratio control
        
        state.canvas.style.width = `${width}px`;
        state.canvas.style.height = `${height}px`;
        state.canvas.width = width * state.dpr;
        state.canvas.height = height * state.dpr;
        state.ctx.scale(state.dpr, state.dpr);
        
        state.centerX = width / 2;
        state.centerY = height / 2;
        
        // Add canvas to container
        mergedConfig.container.appendChild(state.canvas);
    }
    
    // Create node structure
    function createNodes() {
        // Create hub node at center
        state.nodes.hub = {
            x: state.centerX,
            y: state.centerY,
            radius: Math.min(state.centerX, state.centerY) * 0.08,
            color: mergedConfig.colors.hub,
            type: 'hub',
            pulse: 0,
            tooltip: 'AI Core'
        };
        
        // Create processing nodes
        const radius = Math.min(state.centerX, state.centerY) * 0.7;
        
        // Visual processing nodes (blue/cyan)
        createBranchNodes('visual', -Math.PI/6, Math.PI/2, radius);
        
        // Analytical processing nodes (purple)
        createBranchNodes('analytical', Math.PI/2, Math.PI + Math.PI/6, radius);
        
        // Pattern processing nodes (gold/yellow)
        createBranchNodes('pattern', Math.PI + Math.PI/6, Math.PI * 2 - Math.PI/6, radius);
        
        // Create role nodes
        createRoleNodes(radius * 0.9);
    }
    
    // Create nodes for a specific processing branch
    function createBranchNodes(type, startAngle, endAngle, radius) {
        const nodeCount = mergedConfig.nodeCount[type];
        const angleStep = (endAngle - startAngle) / (nodeCount - 1);
        
        for (let i = 0; i < nodeCount; i++) {
            const angle = startAngle + angleStep * i;
            
            // Create inner and outer layer nodes
            // Vary the distance from center for visual interest
            const distance = radius * (0.5 + (i % 3) * 0.16); 
            
            state.nodes[type].push({
                x: state.centerX + Math.cos(angle) * distance,
                y: state.centerY + Math.sin(angle) * distance,
                radius: 4 + Math.random() * 3,
                color: mergedConfig.colors[type],
                type: type,
                angle: angle,
                distance: distance,
                baseDistance: distance,
                pulse: Math.random() * Math.PI * 2,
                tooltip: `${type.charAt(0).toUpperCase() + type.slice(1)} Processing`
            });
        }
    }
    
    // Create role nodes
    function createRoleNodes(radius) {
        const roles = mergedConfig.roles;
        const angleStep = (Math.PI * 2) / roles.length;
        
        for (let i = 0; i < roles.length; i++) {
            const angle = i * angleStep;
            
            state.nodes.roles.push({
                x: state.centerX + Math.cos(angle) * radius,
                y: state.centerY + Math.sin(angle) * radius,
                radius: 6,
                color: mergedConfig.colors.hub,
                type: 'role',
                role: roles[i],
                angle: angle,
                distance: radius,
                pulse: 0,
                active: i === 0, // First role active by default
                tooltip: roles[i]
            });
        }
    }
    
    // Create particles for flow animation
    function createParticles() {
        for (let i = 0; i < mergedConfig.particleCount; i++) {
            // Randomly assign to a processing type
            const types = ['visual', 'analytical', 'pattern'];
            const type = types[Math.floor(Math.random() * types.length)];
            const targetNodes = state.nodes[type];
            
            // Random target node within the type
            const targetNode = targetNodes[Math.floor(Math.random() * targetNodes.length)];
            
            state.particles.push({
                x: state.centerX,
                y: state.centerY,
                size: mergedConfig.particleSize[0] + Math.random() * 
                      (mergedConfig.particleSize[1] - mergedConfig.particleSize[0]),
                color: mergedConfig.colors[type],
                type: type,
                speed: 0.5 + Math.random() * 0.5,
                // Particle flow states: 0 = from hub to node, 1 = at node, 2 = from node to hub
                state: 0,
                stateProgress: 0,
                targetNode: targetNode,
                delay: Math.random() * 100  // Staggered start
            });
        }
    }
    
    // Create boundary visualization
    function createBoundaries() {
        const outerRadius = Math.min(state.centerX, state.centerY) * 0.85;
        const rings = mergedConfig.boundary.rings;
        const segments = mergedConfig.boundary.segments;
        
        for (let ring = 1; ring <= rings; ring++) {
            const radius = outerRadius * (ring / rings);
            state.boundaries.push({
                radius: radius,
                segments: segments,
                color: mergedConfig.colors.boundary,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Set up tooltip element
    function setupTooltip() {
        state.tooltipElement = document.createElement('div');
        state.tooltipElement.classList.add('promptsage-tooltip');
        state.tooltipElement.style.position = 'absolute';
        state.tooltipElement.style.padding = '4px 8px';
        state.tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        state.tooltipElement.style.color = 'white';
        state.tooltipElement.style.borderRadius = '4px';
        state.tooltipElement.style.fontSize = '12px';
        state.tooltipElement.style.pointerEvents = 'none';
        state.tooltipElement.style.zIndex = '100';
        state.tooltipElement.style.opacity = '0';
        state.tooltipElement.style.transition = 'opacity 0.2s';
        
        mergedConfig.container.appendChild(state.tooltipElement);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Mouse move for node hovering
        state.canvas.addEventListener('mousemove', handleMouseMove);
        
        // Resize handling
        window.addEventListener('resize', handleResize);
        
        // Reduced motion handling
        if (window.matchMedia) {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (motionQuery.matches) {
                mergedConfig.reducedMotion = true;
            }
            
            motionQuery.addEventListener('change', () => {
                mergedConfig.reducedMotion = motionQuery.matches;
            });
        }
    }
    
    // Handle mouse movement
    function handleMouseMove(e) {
        const rect = state.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Check for node hover
        state.hoveredNode = null;
        
        // Check hub
        const hubNode = state.nodes.hub;
        if (isPointInNode(mouseX, mouseY, hubNode)) {
            state.hoveredNode = hubNode;
        }
        
        // Check processing nodes
        if (!state.hoveredNode) {
            ['visual', 'analytical', 'pattern'].forEach(type => {
                state.nodes[type].forEach(node => {
                    if (isPointInNode(mouseX, mouseY, node)) {
                        state.hoveredNode = node;
                    }
                });
            });
        }
        
        // Check role nodes
        if (!state.hoveredNode) {
            state.nodes.roles.forEach(node => {
                if (isPointInNode(mouseX, mouseY, node)) {
                    state.hoveredNode = node;
                }
            });
        }
        
        // Update tooltip
        updateTooltip(mouseX, mouseY);
    }
    
    // Check if point is inside a node
    function isPointInNode(x, y, node) {
        const dx = x - node.x;
        const dy = y - node.y;
        return (dx * dx + dy * dy) <= (node.radius * node.radius);
    }
    
    // Update tooltip position and content
    function updateTooltip(mouseX, mouseY) {
        if (state.hoveredNode) {
            state.tooltipElement.textContent = state.hoveredNode.tooltip;
            state.tooltipElement.style.left = `${mouseX + 10}px`;
            state.tooltipElement.style.top = `${mouseY + 10}px`;
            state.tooltipElement.style.opacity = '1';
        } else {
            state.tooltipElement.style.opacity = '0';
        }
    }
    
    // Handle window resize
    function handleResize() {
        // Cleanup current canvas
        state.canvas.width = 0;
        state.canvas.height = 0;
        
        // Recreate canvas with new dimensions
        createCanvas();
        
        // Reset node positions
        resetNodes();
    }
    
    // Reset node positions after resize
    function resetNodes() {
        // Reset hub position
        state.nodes.hub.x = state.centerX;
        state.nodes.hub.y = state.centerY;
        
        // Recalculate radius based on new dimensions
        const radius = Math.min(state.centerX, state.centerY) * 0.7;
        
        // Reset processing nodes
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.nodes[type].forEach((node, index) => {
                const totalNodes = state.nodes[type].length;
                let startAngle, endAngle;
                
                // Visual branch (top-right)
                if (type === 'visual') {
                    startAngle = -Math.PI/6;
                    endAngle = Math.PI/2;
                } 
                // Analytical branch (left)
                else if (type === 'analytical') {
                    startAngle = Math.PI/2;
                    endAngle = Math.PI + Math.PI/6;
                } 
                // Pattern branch (bottom-right)
                else {
                    startAngle = Math.PI + Math.PI/6;
                    endAngle = Math.PI * 2 - Math.PI/6;
                }
                
                const angleStep = (endAngle - startAngle) / (totalNodes - 1);
                const angle = startAngle + angleStep * index;
                
                // Adjust distance for visual interest (as in createBranchNodes)
                const distanceRatio = node.baseDistance / node.distance;
                const newDistance = radius * (0.5 + (index % 3) * 0.16);
                
                node.angle = angle;
                node.distance = newDistance;
                node.baseDistance = newDistance;
                node.x = state.centerX + Math.cos(angle) * newDistance;
                node.y = state.centerY + Math.sin(angle) * newDistance;
            });
        });
        
        // Reset role nodes
        const roleRadius = radius * 0.9;
        const roleAngleStep = (Math.PI * 2) / state.nodes.roles.length;
        
        state.nodes.roles.forEach((node, index) => {
            const angle = index * roleAngleStep;
            
            node.angle = angle;
            node.distance = roleRadius;
            node.x = state.centerX + Math.cos(angle) * roleRadius;
            node.y = state.centerY + Math.sin(angle) * roleRadius;
        });
        
        // Reset boundary rings
        state.boundaries = [];
        createBoundaries();
    }
    
    // Animation loop
    function animate() {
        // Clear canvas
        state.ctx.clearRect(0, 0, state.canvas.width / state.dpr, state.canvas.height / state.dpr);
        
        // Draw boundary rings
        drawBoundaries();
        
        // Draw connections between nodes
        drawConnections();
        
        // Update and draw particles
        updateParticles();
        drawParticles();
        
        // Update and draw nodes
        updateNodes();
        drawNodes();
        
        // Request next frame
        state.animationFrame = requestAnimationFrame(animate);
    }
    
    // Draw the boundary rings
    function drawBoundaries() {
        state.boundaries.forEach(boundary => {
            const segments = boundary.segments;
            const angleStep = (Math.PI * 2) / segments;
            
            // Update pulse
            boundary.pulse += 0.005 * mergedConfig.animationSpeed;
            if (boundary.pulse > Math.PI * 2) boundary.pulse -= Math.PI * 2;
            
            // Draw hexagonal ring
            state.ctx.strokeStyle = boundary.color;
            state.ctx.lineWidth = 1;
            
            if (mergedConfig.reducedMotion) {
                // Simple hexagon for reduced motion
                state.ctx.beginPath();
                for (let i = 0; i < segments; i++) {
                    const angle = i * angleStep;
                    const x = state.centerX + Math.cos(angle) * boundary.radius;
                    const y = state.centerY + Math.sin(angle) * boundary.radius;
                    
                    if (i === 0) {
                        state.ctx.moveTo(x, y);
                    } else {
                        state.ctx.lineTo(x, y);
                    }
                }
                state.ctx.closePath();
                state.ctx.stroke();
            } else {
                // Animated hexagon with fluctuating radius
                state.ctx.beginPath();
                for (let i = 0; i < segments; i++) {
                    const angle = i * angleStep;
                    // Add subtle fluctuation to radius
                    const radiusOffset = Math.sin(angle * 3 + boundary.pulse) * 5;
                    const segmentRadius = boundary.radius + radiusOffset;
                    
                    const x = state.centerX + Math.cos(angle) * segmentRadius;
                    const y = state.centerY + Math.sin(angle) * segmentRadius;
                    
                    if (i === 0) {
                        state.ctx.moveTo(x, y);
                    } else {
                        state.ctx.lineTo(x, y);
                    }
                }
                state.ctx.closePath();
                state.ctx.stroke();
            }
        });
    }
    
    // Draw connections between nodes
    function drawConnections() {
        const hubNode = state.nodes.hub;
        
        // Draw connections from hub to processing nodes
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.ctx.strokeStyle = mergedConfig.colors[type];
            state.ctx.lineWidth = 0.5;
            state.ctx.globalAlpha = 0.3;
            
            state.nodes[type].forEach(node => {
                state.ctx.beginPath();
                state.ctx.moveTo(hubNode.x, hubNode.y);
                state.ctx.lineTo(node.x, node.y);
                state.ctx.stroke();
            });
        });
        
        // Reset alpha
        state.ctx.globalAlpha = 1;
        
        // Draw connections between nodes of the same type
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.ctx.strokeStyle = mergedConfig.colors[type];
            state.ctx.lineWidth = 0.3;
            state.ctx.globalAlpha = 0.15;
            
            for (let i = 0; i < state.nodes[type].length; i++) {
                for (let j = i + 1; j < state.nodes[type].length; j++) {
                    const nodeA = state.nodes[type][i];
                    const nodeB = state.nodes[type][j];
                    
                    state.ctx.beginPath();
                    state.ctx.moveTo(nodeA.x, nodeA.y);
                    state.ctx.lineTo(nodeB.x, nodeB.y);
                    state.ctx.stroke();
                }
            }
        });
        
        // Reset alpha
        state.ctx.globalAlpha = 1;
    }
    
    // Update particle positions and states
    function updateParticles() {
        const hubNode = state.nodes.hub;
        const speed = mergedConfig.reducedMotion ? 0.3 : 1;
        
        state.particles.forEach(particle => {
            // Handle initial delay
            if (particle.delay > 0) {
                particle.delay -= 1;
                return;
            }
            
            // Update based on current state
            switch (particle.state) {
                // Moving from hub to target node
                case 0:
                    // Calculate direction vector
                    const dx = particle.targetNode.x - particle.x;
                    const dy = particle.targetNode.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Move particle
                    if (distance > 5) {
                        particle.x += (dx / distance) * particle.speed * speed * mergedConfig.animationSpeed;
                        particle.y += (dy / distance) * particle.speed * speed * mergedConfig.animationSpeed;
                    } else {
                        // Reached target node, transition to state 1
                        particle.state = 1;
                        particle.stateProgress = 0;
                    }
                    break;
                    
                // At target node
                case 1:
                    // Stay at node for a brief period
                    particle.stateProgress += 0.02 * speed * mergedConfig.animationSpeed;
                    if (particle.stateProgress >= 1) {
                        // Transition to returning to hub
                        particle.state = 2;
                    }
                    break;
                    
                // Returning to hub
                case 2:
                    // Calculate direction vector to hub
                    const dxHub = hubNode.x - particle.x;
                    const dyHub = hubNode.y - particle.y;
                    const distanceHub = Math.sqrt(dxHub * dxHub + dyHub * dyHub);
                    
                    // Move particle
                    if (distanceHub > 5) {
                        particle.x += (dxHub / distanceHub) * particle.speed * speed * mergedConfig.animationSpeed;
                        particle.y += (dyHub / distanceHub) * particle.speed * speed * mergedConfig.animationSpeed;
                    } else {
                        // Reached hub, select new target and transition to state 0
                        const types = ['visual', 'analytical', 'pattern'];
                        const type = types[Math.floor(Math.random() * types.length)];
                        const targetNodes = state.nodes[type];
                        
                        particle.type = type;
                        particle.color = mergedConfig.colors[type];
                        particle.targetNode = targetNodes[Math.floor(Math.random() * targetNodes.length)];
                        particle.state = 0;
                    }
                    break;
            }
        });
    }
    
    // Draw particles
    function drawParticles() {
        state.particles.forEach(particle => {
            // Skip particles still in delay
            if (particle.delay > 0) return;
            
            // Draw particle
            state.ctx.fillStyle = particle.color;
            
            // Adjust opacity based on state
            if (particle.state === 1) {
                // Pulse opacity at target node
                state.ctx.globalAlpha = 0.5 + Math.sin(particle.stateProgress * Math.PI) * 0.5;
            } else {
                state.ctx.globalAlpha = 0.8;
            }
            
            state.ctx.beginPath();
            state.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            state.ctx.fill();
        });
        
        // Reset alpha
        state.ctx.globalAlpha = 1;
    }
    
    // Update node animations
    function updateNodes() {
        // Update hub pulsing
        state.nodes.hub.pulse += 0.03 * mergedConfig.animationSpeed;
        if (state.nodes.hub.pulse > Math.PI * 2) state.nodes.hub.pulse -= Math.PI * 2;
        
        // Update processing nodes
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.nodes[type].forEach(node => {
                // Update pulse
                node.pulse += 0.01 * mergedConfig.animationSpeed;
                if (node.pulse > Math.PI * 2) node.pulse -= Math.PI * 2;
                
                // Subtle movement if not in reduced motion mode
                if (!mergedConfig.reducedMotion) {
                    const pulseOffset = Math.sin(node.pulse) * 5;
                    node.x = state.centerX + Math.cos(node.angle) * (node.baseDistance + pulseOffset);
                    node.y = state.centerY + Math.sin(node.angle) * (node.baseDistance + pulseOffset);
                }
            });
        });
        
        // Update role nodes
        state.nodes.roles.forEach(node => {
            node.pulse += 0.02 * mergedConfig.animationSpeed;
            if (node.pulse > Math.PI * 2) node.pulse -= Math.PI * 2;
        });
    }
    
    // Draw all nodes
    function drawNodes() {
        // Draw hub node with glow
        const hubNode = state.nodes.hub;
        const glowRadius = hubNode.radius * (1 + Math.sin(hubNode.pulse) * 0.2);
        
        // Draw glow
        const gradient = state.ctx.createRadialGradient(
            hubNode.x, hubNode.y, 0,
            hubNode.x, hubNode.y, glowRadius * 2
        );
        gradient.addColorStop(0, hubNode.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        state.ctx.fillStyle = gradient;
        state.ctx.beginPath();
        state.ctx.arc(hubNode.x, hubNode.y, glowRadius * 2, 0, Math.PI * 2);
        state.ctx.fill();
        
        // Draw hub node
        state.ctx.fillStyle = hubNode.color;
        state.ctx.beginPath();
        state.ctx.arc(hubNode.x, hubNode.y, glowRadius, 0, Math.PI * 2);
        state.ctx.fill();
        
        // Draw processing nodes
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.nodes[type].forEach(node => {
                // Brighten node if it's the hover target
                const isHovered = state.hoveredNode === node;
                
                // Draw node
                state.ctx.fillStyle = node.color;
                state.ctx.globalAlpha = isHovered ? 1 : 0.7;
                state.ctx.beginPath();
                state.ctx.arc(node.x, node.y, isHovered ? node.radius * 1.3 : node.radius, 0, Math.PI * 2);
                state.ctx.fill();
                
                // Reset alpha
                state.ctx.globalAlpha = 1;
            });
        });
        
        // Draw role nodes
        state.nodes.roles.forEach((node, index) => {
            const isActive = index === state.activeRole;
            const isHovered = state.hoveredNode === node;
            
            // Determine node appearance
            const nodeRadius = isActive || isHovered ? node.radius * 1.3 : node.radius;
            const nodeAlpha = isActive ? 1 : (isHovered ? 0.9 : 0.6);
            
            // Draw node with glow if active
            if (isActive || isHovered) {
                const glow = state.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, nodeRadius * 2
                );
                glow.addColorStop(0, node.color);
                glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                state.ctx.fillStyle = glow;
                state.ctx.globalAlpha = nodeAlpha * 0.5;
                state.ctx.beginPath();
                state.ctx.arc(node.x, node.y, nodeRadius * 2, 0, Math.PI * 2);
                state.ctx.fill();
            }
            
            // Draw node
            state.ctx.fillStyle = node.color;
            state.ctx.globalAlpha = nodeAlpha;
            state.ctx.beginPath();
            state.ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
            state.ctx.fill();
            
            // Reset alpha
            state.ctx.globalAlpha = 1;
            
            // Draw role label
            if (isActive || isHovered) {
                state.ctx.fillStyle = '#fff';
                state.ctx.font = '10px sans-serif';
                state.ctx.textAlign = 'center';
                state.ctx.textBaseline = 'middle';
                state.ctx.fillText(node.role, node.x, node.y);
            }
        });
    }
    
    // Cycle through active roles
    function cycleActiveRole() {
        state.activeRole = (state.activeRole + 1) % state.nodes.roles.length;
    }
    
    // Update colors for theme changes
    function updateColors(newColors) {
        Object.assign(mergedConfig.colors, newColors);
        
        // Update hub color
        state.nodes.hub.color = mergedConfig.colors.hub;
        
        // Update processing node colors
        ['visual', 'analytical', 'pattern'].forEach(type => {
            state.nodes[type].forEach(node => {
                node.color = mergedConfig.colors[type];
            });
        });
        
        // Update role node colors
        state.nodes.roles.forEach(node => {
            node.color = mergedConfig.colors.hub;
        });
        
        // Update particle colors
        state.particles.forEach(particle => {
            particle.color = mergedConfig.colors[particle.type];
        });
        
        // Update boundary colors
        state.boundaries.forEach(boundary => {
            boundary.color = mergedConfig.colors.boundary;
        });
    }
    
    // Reset visualization
    function reset() {
        cleanup();
        return init();
    }
    
    // Clean up resources
    function cleanup() {
        if (state.animationFrame) {
            cancelAnimationFrame(state.animationFrame);
            state.animationFrame = null;
        }
        
        if (state.roleInterval) {
            clearInterval(state.roleInterval);
            state.roleInterval = null;
        }
        
        if (state.canvas) {
            state.canvas.removeEventListener('mousemove', handleMouseMove);
            state.canvas.remove();
        }
        
        if (state.tooltipElement) {
            state.tooltipElement.remove();
        }
        
        window.removeEventListener('resize', handleResize);
    }
    
    // Initialize and return public methods
    return init();
}