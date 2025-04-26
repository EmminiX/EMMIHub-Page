#Here are the requirments for www.emmihub.com Website(logo is in )(if there are more images requiered across the project then create a mock image and I will add the image after the website is built and functioning)


## Global Design System

### Typography System

- **Primary Font Family:** Lexend (all weights from Light to Bold)
- **Secondary Font:** Monospace for code elements and terminal interfaces
- **Font Loading Strategy:** Preloaded variable font with fallback system
- **Typography Scale:** 1.25 ratio with 16px base (mobile), 18px base (desktop)

### Color Theme System

User-selectable via orbital toggle with seamless transition effects (500ms crossfade):

**1. Quantum Void (Default)**

- Background: Deep space gradient (#0a0e17 to #1a1a2e)
- Primary accent: Electric blue (#00f0ff)
- Secondary accent: Cosmic purple (#7209b7)
- Text: Silver-white (#f0f2f5)
- Highlights: Quantum yellow (#ffd60a)
- Particle color: #48cae4 with #7209b7 secondary

**2. Biomorphic Synthesis**

- Background: Deep forest gradient (#0a2e1a to #1a2e0e)
- Primary accent: Bioluminescent teal (#43fec4)
- Secondary accent: Moss green (#466d1d)
- Text: Parchment (#f2f0e6)
- Highlights: Amber (#ffb100)
- Particle color: #43fec4 with #ffb100 secondary

**3. Neural Circuit**

- Background: Circuit black (#050505 to #101010) 
- Primary accent: Neon red (#ff2b4e)
- Secondary accent: Signal blue (#0066ff)
- Text: Terminal green (#d1ffd2)
- Highlights: Circuit gold (#e2c275)
- Particle color: #ff2b4e with #0066ff secondary

**4. Blockchain Horizons**

- Background: Digital blue (#0c1929 to #1d293a)
- Primary accent: Crypto cyan (#00e9c0)
- Secondary accent: Block gray (#3a506b)
- Text: Node white (#ffffff)
- Highlights: Token orange (#ff6b35)
- Particle color: #00e9c0 with #ff6b35 secondary

### Animation System

- **Easing Functions:** 
- Default: cubic-bezier(0.42, 0, 0.58, 1)
- Entrance: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Emphasis: cubic-bezier(0.18, 0.89, 0.32, 1.28)
- Exit: cubic-bezier(0.55, 0.06, 0.68, 0.19)
- **Animation Durations:**
- Micro-animations: 300-500ms
- Transitions: 500-800ms
- Feature animations: 1000-3000ms
- Ambient animations: 10000-30000ms (continuous)
- **Optimization Strategy:**
- GPU-accelerated properties (transform, opacity)
- Compositor-only animations
- Adaptive quality based on device capability
- Reduced motion option for accessibility

## Hero Section

**Headline (Typewriter Animation):** 
"EMMI: Engaging Minds, Merging Ideas"

- Character delay: Variable 30-70ms (slower on vowels)
- Cursor: Pulsing vertical line (500ms cycle)
- Color: Changes based on active theme
- Complete animation duration: 3000ms

**Subheadline (Fade-in Sequence):**
"Experience AI assistants built with the PromptSage™ framework—where technology enhances human potential rather than replacing it."

- Entrance animation: Opacity 0 to 1 (800ms)
- Entrance delay: Begins after headline completes
- Split words have slight staggered reveal (50ms delay between words)

**Visual Elements:**

1. **Neural-Organic Network:**

- Thin golden lines (0.5px width) forming neural network
- Initial state: Standard neural network topology
- Transform state: Gradually morphs into organic patterns resembling:
    - Tree branch structures
    - River delta patterns
    - Constellation maps
- Transformation duration: 4000ms
- Transformation cycle: Every 20 seconds
- Opacity variation: 30-60% (3s cycle)

2. **Parallax Background:**

- Three distinct layers with differential movement:
    - Distant stars/particles (10% movement ratio)
    - Mid-field network elements (25% movement ratio)
    - Foreground interface elements (40% movement ratio)
- Movement triggered by: Scroll position and cursor position
- Movement damping: 200ms ease-out

3. **Dynamic Background Gradient:**

- Base gradient: Deep indigo (#1a1a2e) to cosmic purple (#4b0082)
- Gradient animation: Subtle shift and rotation (15s cycle)
- Interaction effect: Slight gradient shift based on cursor position
- Secondary effect: Occasional subtle "energy pulse" that brightens gradient momentarily (every 10-15s)

4. **Interactive Particle System:**

- Particle count: 200-300 small points (2-3px)
- Behavior: Gentle gravitational attraction to cursor
- Physics properties:
    - Attraction strength: Moderate (fully configurable)
    - Maximum speed: 2px/s
    - Friction/damping: 0.95
- Special effect: Particles occasionally form sacred geometry patterns:
    - Platonic solids
    - Golden ratio spiral
    - Metatron's cube
- Pattern formation interval: Random between 15-30s
- Pattern hold duration: 3-5s before dispersing

5. **Sacred Geometry Backdrop:**

- Platonic solid wireframes rotating slowly (1 rotation per 60s)
- Opacity: 10% base, pulsing to 15%
- Scale: Various sizes, largest at 50% of screen height
- Position: Randomly distributed in 3D space behind main elements

**CTA Button:**

- Label: "Join the Community" or "Explore AI Assistants"
- Design:
- Floating effect with 3px subtle elevation shadow
- Gentle pulse animation (scale 1.00 to 1.05, 3s cycle)
- Gradient border (primary to secondary accent colors)
- Border animation: Flowing gradient movement (clockwise, 3s duration)
- Text reveal: Left-to-right characters appear when in viewport
- Hover state:
- Elevation increases to 5px
- Scale increases to 1.08
- Particle attraction to button increases
- Subtle white glow (0 0 10px rgba(255,255,255,0.5))
- Click animation:
- Quick scale down to 0.95
- Release with slight overshoot
- Radial ripple effect emanating from click point

## Introduction Section

**Section Title: "Who We Are"**

- Animation: Typewriter effect with 50ms delay
- Entrance: Triggered at 20% viewport visibility

**Main Content:**
"EMMI represents a vision where technology serves as an extension of human consciousness rather than a replacement for it. Built by Emanuel Covasa, this project explores the boundless possibilities when AI adapts to diverse human thinking patterns instead of forcing humans to adapt to technology.

The PromptSage™ framework enables creation of AI assistants that intuitively respond to your unique cognitive style—whether you process information visually, analytically, or through patterns and connections."

- Text entrance: Fade in and slide up transform
- Transform values: translateY(20px) to translateY(0)
- Duration: 800ms
- Staggered paragraph delay: 200ms

**Visual Elements:**

1. **Split-Screen Neural Visualization:**

- Left side: Human brain neural pathways
    - Color: Blue-teal gradient (#00b4d8 to #90e0ef)
    - Animation: Subtle pulse effect resembling brain activity
    - Density: Higher concentration in frontal cortex
- Right side: AI neural network
    - Color: Purple-pink gradient (#7209b7 to #f72585)
    - Animation: Data processing visualization with traveling pulses
    - Structure: More geometric and organized than human side
- Center connection zone:
    - Animated lines (1px width) flowing between both sides
    - Data transfer pulses traveling along connection lines
    - Pulse frequency: Variable (2-5 seconds between pulses)
    - Pulse color: Theme-based highlight color

2. **Parallax Scrolling Elements:**

- Foreground elements move at 140% scroll speed
- Background elements move at 60% scroll speed
- Creates 40% differential for depth perception
- Smooth transition between scroll speeds (200ms easing)

3. **Fractal Background Pattern:**

- Perlin noise animation generating ever-evolving patterns
- Opacity: 5% to maintain subtlety
- Animation speed: Very slow (one complete evolution per 30s)
- Pattern influenced by theme colors
- Light source effect creating subtle highlights on fractal topology

4. **Cognitive Style Selector:**

- Three interactive icons representing cognitive styles:
    - Visual: Eye/prism icon with colorful spectrum
    - Analytical: Grid/structure icon with organized elements
    - Pattern-based: Web/connection icon with node linking
- Hover behavior:
    - Scale increase (1.0 to 1.2)
    - Elevation shadow appears (0 0 15px rgba(theme.primary, 0.5))
    - Surrounding particles gravitate toward hovered icon
- Selection effect:
    - Icon remains elevated and highlighted
    - Connecting lines form between selected icon and content
    - Content formatting adjusts to demonstrate selected style:
    - Visual: More imagery, color-coding, spatial arrangements
    - Analytical: Structured lists, hierarchical organization, numbers
    - Pattern: Connected concepts, relationship maps, analogies

## Philosophy Section

**Section Title: "The Space Between Technology and Consciousness"**

- Animation: Left-to-right reveal with glowing trail effect
- Glow color: Theme-based highlight color
- Duration: 1200ms

**Main Content:**
"Every technological advancement carries the imprint of its creator's values. At EMMI, we believe:

- Technology should enhance human capabilities, not replace them
- Digital tools should adapt to diverse cognitive styles
- Knowledge and access should flow freely, without artificial constraints
- The future belongs to those who can merge technological innovation with human wisdom"
- Text entrance: Fade in after section title completes
- List item animation: Sequential appearance, 200ms delay between items

**Visual Elements:**

1. **Cosmic Environment:**

- Parallax star field with 3 depth layers:
    - Distant stars: 1px, slowest movement
    - Mid-field stars: 2px, moderate movement
    - Close stars: 3px, fastest movement
- Star color variation: Theme-based with subtle twinkle effect
- Background: Deep space gradient with subtle nebula-like formations
- Nebula opacity: 15-20%, colors match theme

2. **Constellation Visualizations:**

- Dynamic constellations forming:
    - Human profile outline (left side)
    - Digital interface/circuit outline (right side)
    - Connection lines between key points of both
- Formation animation: Stars brighten then connection lines form
- Line formation: Extends from point to point like electric current
- Duration: 3-5 seconds per complete formation
- Cycle: New formations every 15-20 seconds

3. **Sacred Geometry Formations:**

- Star particles occasionally reorganize into geometric patterns:
    - Metatron's Cube
    - Flower of Life
    - Fibonacci Spiral
    - Platonic Solids
- Formation interval: Every 10 seconds
- Hold duration: 2-3 seconds before dispersing
- Dispersion effect: Particles accelerate outward then resume normal movement

4. **List Item Formation Animation:**

- Each bullet point has multi-stage animation:
    - Initial state: Horizontal line (theme primary color)
    - Expansion: Line expands outward from center
    - Edge effect: Glowing edges during expansion
    - Text reveal: Fades in after line formation completes
    - Completion effect: Subtle pulse animation
- Animation timing:
    - Line formation: 400ms
    - Text fade: 300ms
    - Pulse effect: 500ms

5. **Aurora Wave Effect:**

- Subtle aurora-like waves moving across cosmic background
- Color range: #0077b6 to #48cae4 with 30% opacity
- Movement: Slow, undulating motion
- Wave count: 2-3 visible at any time
- Wave period: 15-20 seconds per complete transit

6. **Rotational Element:**

- Cosmic environment slowly rotates when scrolling vertically
- Maximum rotation: 15 degrees
- Rotation axis: Center of screen
- Rotation speed: Proportional to scroll speed
- Return animation: Smooth return to default orientation when scrolling stops

## Community Support Model Section

**Section Title: "Join the Evolution"**

- Animation: Characters form from particle convergence
- Particle origin: Random positions across viewport
- Formation time: 1500ms
- Completion effect: Letters stabilize with subtle glow

**Introduction Text:**
"EMMI is currently supported by a community of pioneers who share our vision of technology that respects human diversity and potential. Community members receive access to tools based on their level of support:"

- Entrance animation: Fade in and subtle scale (0.95 to 1.0)
- Timing: After section title completes

**Tier Structure:**

**Explorer Tier (Free):**

- Access to core AI assistants (backed by smaller AI models)
- Basic conversation capabilities
- Access to community forums (Discord)
- Experience the fundamentals of the PromptSage™ framework

**Explorer Support (one-time):**

- "Buy Me a Coffee" option for one-time contributions

**Scholar Tier (7€/month):**

- Access to advanced AI Assistants
- Integration with knowledge tools
- Assistant for creating flash cards from lecture documents
- Assistants for extracting key information from large documents
- Specialized research Assistants
- Mathematics tutors and other subject tutors
- Web search tools for all assistants
- Coding assistants
- Email support and dedicated Discord channel

**Visionary Tier (17€/month):**

- Access to specialized AI assistants
- Full suite of plugins and extensions
- Web research capabilities (Perplexity AI)
- Custom assistant configuration
- Document processing assistants
- Knowledge base integration
- Email, WhatsApp/Telegram support, Discord access

**Innovator Tier (29€/month):**

- Everything in Visionary Tier
- Assistants with agentic capabilities
- Custom integrations
- Priority feature development
- Advanced workflow automation
- Personal consultation sessions

**Support Allocation Text:**
"Your support helps fund:

- Server infrastructure and maintenance
- API access to advanced language models
- A future license for a premium AI platform
- Development of new assistants and capabilities
- Research into more intuitive human-AI interaction patterns"

**Visual Elements:**

1. **Hexagonal Tier Platforms:**

- Floating hex platforms with different elevation levels:
    - Explorer: 5px elevation shadow
    - Scholar: 10px elevation shadow
    - Visionary: 15px elevation shadow
    - Innovator: 20px elevation shadow
- Material effect:
    - Explorer: Glass-like transparency (20%)
    - Scholar: Metallic with light reflections
    - Visionary: Crystal with refraction effects
    - Innovator: Energy field with particle effects
- Hover animation: 2px vertical oscillation (3s cycle)
- Perspective: Slight 3D angle (10-15°) to show thickness

2. **Tier Aura Effects:**

- Each tier emits distinctive glowing aura:
    - Explorer: Blue (#48cae4, 30% opacity)
    - Scholar: Purple (#7209b7, 40% opacity)
    - Visionary: Gold (#ffd700, 50% opacity)
    - Innovator: Multi-color shifting (60% opacity)
- Aura animation: Subtle pulse (4s cycle, 10% intensity variation)
- Aura size: Extends 15-20px from platform edges
- Blur amount: 10px for soft edge effect

3. **Sequential List Animation:**

- List items appear with cascading timing
- Delay between items: 200ms
- Appearance effect: Fade + slide from left
- Transition: opacity 0 to 1, translateX(-10px) to 0
- Duration: 400ms per item

4. **Energy Flow Visualization:**

- Animated particle streams connecting tier levels:
    - Particles flow from Explorer upward to higher tiers
    - Streams branch at junction points
    - Particles then cycle downward through funding allocations
- Particle properties:
    - Size: 1-2px
    - Shape: Circular with subtle trail
    - Color: Theme-based with tier influence
    - Count: 50-100 particles per stream
- Flow speed: Normal state 2px/s, hover state 4px/s
- Path animation: Subtle undulation (sine wave, 5px amplitude)

5. **Hover Interactions:**

- Cards expand (scale 1.05) on hover
- Elevation increases (+5px shadow distance)
- Particles flow accelerates around hovered card
- Brightness increases by 10%
- Surrounding cards slightly dim (opacity 0.9)

6. **Background Elements:**

- Subtle topographic/contour map pattern
- Line thickness: 0.5px
- Line color: Theme-based with 10% opacity
- Pattern movement: Very slow shift (30s cycle)
- Movement direction changes based on mouse position

7. **Resource Allocation Visualization:**

- Animated infographic below tier cards
- Particle flow redistributes based on funding purposes
- Funding categories represented as collection nodes
- Node size corresponds to allocation importance
- Particles accumulate and circulate within nodes
- Connecting streams between nodes show interdependencies

## Technology Section

**Section Title: "PromptSage™ Framework"**

- Animation: Characters materialize from code fragments
- Fragments source: Simulated code elements rising from bottom
- Assembly effect: Code fragments converge to form letters
- Duration: 2000ms

**Main Content:**
"The heart of EMMI is the PromptSage™ framework—a structured approach to AI interaction using hierarchical organization of instructions that maintains consistent, ethical responses while adapting to your cognitive style.

Unlike traditional AI interfaces that force users into rigid interaction patterns, PromptSage™ creates assistants that can:

- Switch between different operational modes based on your needs
- Maintain clear ethical boundaries while responding to diverse queries
- Present information in formats that align with your thinking style
- Complement rather than compete with human cognition"
- Text entrance: Fade in (800ms)
- Highlight words: "hierarchical," "ethical," "cognitive style" pulse subtly with theme accent color

**Visual Elements:**

1. **Interactive 3D Framework Model:**

- Central visualization: Hierarchical XML structure as 3D tree
- Node levels:
    - Root level: Core framework principles
    - Branch level: Operational modes
    - Leaf level: Specific behaviors and responses
- Connection elements:
    - Glowing pathways between related nodes
    - Path color: Theme-based with data flow animation
    - Path thickness: 1-2px with variable opacity (60-100%)
- Node behavior:
    - Pulse effect when mentioned in adjacent text
    - Highlight state when user hovers
    - Expansion when clicked to show details
- Animation properties:
    - Gentle rotation (15° amplitude, 20s cycle)
    - Breathing effect (scale 0.98-1.02, 4s cycle)
    - Response to cursor proximity with subtle attraction

2. **Detail Zoom Effect:**

- Scroll-linked focus on specific framework components
- Transition: Smooth camera movement to zoom target
- Duration: 800ms with cubic-bezier easing
- Highlight effect: Target component scales slightly (1.1x) and brightens
- Background elements: Dim to 70% opacity during focus
- Return animation: Smooth transition back to full view

3. **Code Visualization:**

- XML/structural code snippets with syntax highlighting
- Highlighting animation: Progressive illumination of key elements
- Color coding:
    - Tags: Theme primary color
    - Attributes: Theme secondary color
    - Values: Theme highlight color
    - Comments: Lower opacity version of text color
- Interaction: Hover on code highlights corresponding framework element

4. **Split-Screen Demonstration:**

- Left panel: Framework code with highlighted components
- Right panel: Resulting assistant behavior visualization
- Connection elements:
    - Animated lines between related code and behavior
    - Line animation: Pulse effect traveling from code to behavior
    - Line color: Theme highlight color
- Panel behavior:
    - Synchronized scrolling
    - Highlighting in one panel triggers highlight in other
    - Interactive elements expand on click

5. **Ripple Interaction Effect:**

- Cursor movement generates ripple effects through framework
- Ripple properties:
    - Origin: Cursor position
    - Radius: Expands to 50-100px
    - Color: Theme primary at 20% opacity
    - Duration: 800ms expansion
    - Easing: Cubic-bezier out for natural dissipation

6. **Matrix Background:**

- Vertical streams of characters (code-like)
- Character properties:
    - Size: Variable 8-12px
    - Color: Theme primary at 10% opacity
    - Movement: Continuous downward flow
    - Speed: Variable 2-5px/s
- Special behavior:
    - Occasionally forms meaningful patterns/words
    - Pattern duration: 2-3s before resuming random flow
    - Pattern recognition effect: Brief highlight when pattern forms

7. **Transformation Sequences:**

- Scroll-triggered demonstrations of framework adaptability
- Sequence examples:
    - Tutor → Examiner mode transition
    - Analytical → Visual presentation mode
    - Simple → Detailed explanation level
- Transition animation:
    - Morphing effect between states
    - Color shift indicating mode change
    - Structure reorganization with fluid motion
    - Duration: 1500ms per transformation

## Assistants Showcase Section

**Section Title: "Meet Your Digital Collaborators"**

- Animation: Holographic projection effect
- Initial state: Light particles converging
- Formation: Letters materializing from light
- Stabilization: Letters solidify with subtle fluctuation
- Duration: 2000ms

**Introduction Text:**
"Our community currently has access to several assistants built with the PromptSage™ framework:"

- Entrance: Fade in after title animation completes
- Style: Slightly transparent with subtle glow

**Assistant Profiles:**

1. **MathSage**  
   "A mathematics assistant that guides through problems step-by-step, adapting to your learning style and providing visual or analytical explanations based on your preferences."
2. **ResearchGuide**  
   "Your collaborative research companion, helping organize information, connect disparate concepts, and generate insights from complex data."
3. **FocusFlow**  
   "An assistant that extracts and reorganizes information from lengthy texts, formatting content specifically for dyslexic and ADHD cognitive patterns with visual hierarchies, color coding, and chunked information delivery."
4. **LinuxNavigator**  
   "Your command line companion that explains, demonstrates, and guides through Linux operations with contextual examples and visual command structure mapping to enhance learning retention."
5. **CreativePartner**  
   "An assistant that helps break through creative blocks, offering inspiration and structured approaches to ideation and project development."
6. **WorkflowOptimizer**  
   "Streamline your processes and discover more efficient ways to accomplish your goals through systematic analysis and refinement."

**Closing Text:**
"Explore dozens more specialized assistants on the platform, each designed with the PromptSage™ framework to enhance different cognitive styles and domain-specific challenges."

**Visual Elements:**

1. **3D Orbital Carousel:**

- Assistant cards follow elliptical orbital paths
- Orbit properties:
    - Multiple elliptical paths at varying angles
    - Different orbital speeds (15-25s per revolution)
    - Path visualization: Subtle dotted line (0.5px, 10% opacity)
- Automatic rotation:
    - 15s full rotation cycle
    - Smooth physics-based movement
    - Pauses on hover/interaction
- Active card behavior:
    - Scales to 1.2x size
    - Moves to foreground (z-index and true 3D position)
    - Path brightens
    - Surrounding cards slightly dim and slow down

2. **Assistant Card Design:**

- Holographic info panel appearance:
    - Semi-transparent background (15% opacity)
    - 3D projection effect with perspective distortion
    - Edge glow based on assistant's domain color
    - Subtle floating animation (vertical 2px oscillation)
- Content layout:
    - Assistant icon (top)
    - Name (title case with custom typography)
    - Description (concise paragraph)
    - Example interaction preview (collapsed by default)
- Material effect:
    - Light refraction on surface
    - Edge highlighting
    - Subtle grain texture
    - Perspective shift based on viewing angle

3. **Domain-Specific Icons:**

- **MathSage:**
    - Floating mathematical symbols and formulas
    - Animation: Symbols rearrange to form solutions
    - Color scheme: Blue-violet gradient
    - Particle effect: Small numerals floating around icon
- **ResearchGuide:**
    - Knowledge graph with connecting nodes
    - Animation: Nodes form new connections
    - Color scheme: Green-blue gradient
    - Particle effect: Small data points traveling along connections
- **FocusFlow:**
    - Text fragments reorganizing into structure
    - Animation: Chaotic text organizing into clear layout
    - Color scheme: Purple-orange gradient
    - Particle effect: Text fragments circulating around icon
- **LinuxNavigator:**
    - Terminal with flowing command sequences
    - Animation: Commands typing and executing
    - Color scheme: Black-green gradient
    - Particle effect: Command syntax elements orbiting
- **CreativePartner:**
    - Color palette transforming into idea sketches
    - Animation: Colors form into concept outlines
    - Color scheme: Rainbow gradient
    - Particle effect: Color splashes and idea sparks
- **WorkflowOptimizer:**
    - Flowchart elements optimizing in real-time
    - Animation: Complex flow simplifying
    - Color scheme: Blue-cyan gradient
    - Particle effect: Process nodes reorganizing efficiently

4. **Icon Particle Systems:**

- Each icon emits 50-100 domain-specific particles
- Particle behavior:
    - Emanate from icon center
    - Follow orbital or flow-based paths
    - Return to source after travel distance
    - Variable opacity (30-100%)
- Particle generation rate: 5-10 per second
- Lifespan: 2-4 seconds per particle

5. **Card Background Gradients:**

- Each assistant has unique themed gradient
- Gradient animation: Subtle shift and rotation (10s cycle)
- Background elements: Domain-specific patterns at 10% opacity
- Border effect: 1px glowing edge with pulse animation

6. **Connecting Light Beams:**

- Thin light beams connect related assistants
- Beam properties:
    - Width: 1px
    - Opacity: 70%
    - Color: Theme-based with assistant influence
- Data transfer visualization:
    - Pulse effect traveling along connections
    - Pulse interval: Random 2-5s
    - Pulse color: Assistant-specific highlight color
- Intersection nodes: Brighter points where beams cross

7. **3D Interaction Response:**

- Cards respond to mouse movement with 3D perspective shifts
- Maximum rotation: 15° on both axes
- Rotation origin: Card center
- Movement damping: 200ms ease function
- Lighting effect: Highlight shifts with perspective

8. **Card Selection Animation:**

- Selection trigger: Click on card
- Transition animation:
    - Card rotates 180° on Y-axis
    - Scales to fill available screen space
    - Other cards fade out
    - Background shifts to match assistant theme
- Expanded state:
    - Full details panel appears
    - Interactive demo interface reveals
    - Related assistants suggested at bottom
- Return animation: Reverse sequence with different timing curve

9. **Ambient Glow Effects:**

- Each assistant card emits themed ambient glow
- Glow properties:
    - Radius: 50-100px
    - Opacity: 20-50% variation
    - Color: Assistant-specific theme color
    - Pulse cycle: 3s with ease-in-out timing
- Interaction effect: Glow intensity increases on hover/focus

10. **Assistant Constellation Background:**

    - Distant points of light representing additional assistants
    - Point properties:
    - Size: 1-2px
    - Color: Varied based on assistant domain
    - Brightness: Variable with subtle twinkle effect
    - Constellation behavior:
    - Forms loose groupings by domain/purpose
    - Subtle movement (0.5-1px positional variation)
    - New points occasionally appear (suggesting growing ecosystem)
    - Interaction: Points brighten when mouse passes nearby

## Future Vision Section

**Section Title: "Where We're Heading"**

- Animation: Future-tech materializing effect
- Text appears as if assembling from energy particles
- Formation pattern: Bottom-up assembly
- Completion effect: Stabilizes with subtle hover
- Duration: 1500ms

**Main Content:**
"Your support is helping build a future where:

- AI technology works with rather than against human cognitive diversity
- Specialized knowledge becomes accessible to everyone regardless of learning style
- Small businesses can leverage AI customized to their specific needs
- Educational tools adapt to students rather than forcing standardized approaches

With community backing, we aim to expand the PromptSage™ framework to more domains and secure the resources needed to make these tools available to those who need them most."

- List entrance: Sequential fade-in with 200ms delay between items
- Text highlight: Key terms pulse with theme highlight color

**Visual Elements:**

1. **Interactive Timeline Visualization:**

- Horizontal timeline with illuminated milestone markers
- Timeline properties:
    - Line thickness: 2px with glow effect
    - Marker size: 8px diameter nodes
    - Color scheme: Theme-based with progress indication
    - Extension: Beyond viewport suggesting ongoing development
- Marker types:
    - Completed: Fully illuminated with checkmark
    - Current: Pulsing highlight with progress indicator
    - Future: Semi-transparent with estimated date
- Interaction:
    - Hover reveals milestone details
    - Click expands to show full description
    - Drag to explore timeline quickly

2. **Development Ripple Effect:**

- Concentric circles emanating from milestone points
- Ripple properties:
    - Origin: Timeline milestone nodes
    - Expansion speed: Variable 3-6s per full expansion
    - Initial opacity: 60%, fading to 0% at maximum radius
    - Color: Milestone-specific with theme influence
    - Line thickness: 0.5px with slight blur
- Behavior pattern:
    - Regular ripples from current milestone
    - Occasional ripples from past milestones
    - Tentative/ghosted ripples from future milestones
- Intersection effect: Brightened nodes where ripples cross

3. **Scroll-Controlled Timeline Progression:**

- Vertical scroll controls horizontal timeline position
- Scroll mapping:
    - Downward scroll moves timeline forward in time
    - Upward scroll moves timeline backward in time
    - Scroll speed modifies timeline movement speed
- Transition smoothing: 300ms ease function for natural movement
- Milestone triggers:
    - Passing milestone activates associated description
    - Description appears with fade-in and expansion
    - Previous descriptions fade out with distance

4. **Future-Shifted Background:**

- Background gradually shifts toward brighter palette
- Transition properties:
    - Beginning: Current theme cosmic/dark style
    - End: More vibrant, hopeful color scheme
    - Transition: Linked to timeline position
- Light direction: Shifts from above/behind to ahead/forward
- Particle behavior: Becomes more energetic toward future
- Symbolic elements: Imagery shifts from current to aspirational

5. **Floating Data Point Visualization:**

- Data points surrounding timeline represent applications
- Point properties:
    - Size: Variable 5-15px based on importance
    - Shape: Domain-specific iconography
    - Color: Function-based categorization
    - Movement: Gentle floating with physics simulation
- Connection visualization:
    - Points connect to relevant timeline milestones
    - Connection opacity based on relationship strength
    - Data flows visualized along connections
- Interaction:
    - Hover reveals data point details
    - Click expands to show full use case
    - Points attract to cursor with gentle gravity

6. **Mouse-Influenced Ripple Dynamics:**

- Mouse movement affects ripple propagation
- Influence effects:
    - Direction: Ripples strengthen in cursor direction
    - Speed: Movement speed affects propagation velocity
    - Position: Proximity intensifies nearby ripples
- Physics simulation:
    - Natural wave interference patterns
    - Reflection off timeline boundaries
    - Dissipation with distance and time
- Visual feedback: Cursor leaves temporary "wake" in ripple field

7. **Blueprint Background Elements:**

- Subtle technical drawings of future interfaces
- Drawing properties:
    - Line style: Fine white/blue lines (0.5px)
    - Opacity: 5-10% for subtle background presence
    - Content: Interface wireframes, device concepts, connector diagrams
- Animation: Very slow panning movement (1px/s)
- Parallax effect: Multiple depth layers with different movement rates
- Interaction: Blueprints subtly respond to mouse position

## Join Us Section

**Section Title: "Become Part of Something Larger"**

- Animation: Letters form from connecting constellation points
- Formation pattern: Points appear then connect with lines
- Final effect: Letters solidify with starfield background
- Duration: 2000ms

**Main Content:**
"When you support EMMI, you're not just accessing AI tools—you're joining a movement that believes technology should serve human flourishing in all its diversity."

- Entrance animation: Fade in with subtle scale (0.95 to 1.0)
- Text highlight: "human flourishing" pulses with accent color

**CTA Buttons:**

- "Access Explorer Tier (Free)"
- "Support as a Scholar"
- "Join as a Visionary"
- "Become an Innovator"

**Visual Elements:**

1. **Global Community Visualization:**

- 3D globe with low-poly aesthetic
- Globe properties:
    - Polygon count: 400-600 triangles
    - Color scheme: Theme-based with illuminated edges
    - Rotation: Slow continuous movement (1 rotation per minute)
    - Texture: Subtle terrain with illuminated population centers
- Support indicators:
    - Rising light pillars from supporter locations
    - Pillar properties:
    - Height: Based on support tier
    - Color: Tier-specific matching card colors
    - Glow: Subtle radial effect at base
    - Animation: Gentle height oscillation
- Connection network:
    - Lines connecting supporter locations
    - Line properties:
    - Width: 0.5-1px
    - Color: Theme primary with 40-60% opacity
    - Animation: Lines appear and fade over 5s cycles
    - Behavior: New connections form as scroll position changes
    - Intersection nodes:
    - Glowing points where connections cross
    - Size: 2-3px with larger glow radius
    - Color: Theme highlight color
    - Effect: Pulse animation on formation

2. **CTA Button Platform Design:**

- Buttons presented as ascending platforms
- Arrangement: Left-to-right in ascending order
- Platform properties:
    - Shape: Rounded rectangle with 3D depth
    - Material effects:
    - Explorer: Glass-like transparency with refraction
    - Scholar: Metallic surface with light reflections
    - Visionary: Crystalline structure with facets
    - Innovator: Energy field with particle emission
    - Elevation: Increases with tier level
    - Dimension: Higher tiers slightly larger
- Hover effect:
    - Energy field appearance around button
    - Field properties:
    - Expansion: 10px beyond button borders
    - Color: Tier-specific theme color
    - Opacity: 40-60% with edge feathering
    - Particle effect: Small energy particles circulating
    - Text illumination: Increases brightness by 20%
    - Platform elevation: Rises an additional 3-5px

3. **Button Click Animation:**

- Initial press: Platform depresses 2px
- Release effect:
    - Returns to position with slight overshoot
    - Radial ripple emanates from click point
    - Ripple properties:
    - Radius: Expands to fill button then beyond
    - Color: White transitioning to theme color
    - Duration: 500ms expansion
    - Opacity: Starts 80%, fades to 0%
- Transition effect: Screen-wide expansion flash (if navigating)

4. **Energy Current Background:**

- Flowing energy currents between community nodes
- Current properties:
    - Width: Variable 2-5px pathways
    - Color: Theme primary with 30% opacity
    - Flow animation: Particles traveling along paths
    - Path behavior: Subtle undulation and path shifting
- Node visualization:
    - Connection points in global network
    - Energy pooling/distribution centers
    - Brighter intensity at active regions
- Interaction: Currents respond to nearby button interactions

5. **Directional Particle System:**

- Particles flowing toward CTA buttons
- Particle properties:
    - Count: 100-200 particles in system
    - Size: 1-2px with subtle trail effect
    - Color: Theme based with tier influence
    - Speed: Variable 2-5px/s
- Flow pattern:
    - General direction toward buttons
    - Path following along invisible guide curves
    - Occasional swarm behavior between paths
- Interaction: Mouse movement creates gentle current affecting particles

6. **Mouse Movement Distortion Field:**

- Cursor creates distortion effect in particle field
- Effect properties:
    - Radius: 50-100px influence zone
    - Strength: Moderate directional pull
    - Falloff: Exponential with distance
    - Recovery: 300ms return to normal flow
- Visual feedback:
    - Particle acceleration in cursor vicinity
    - Subtle warping of background elements
    - Wake effect behind fast cursor movement
- Limitation: Effect strength adapts to prevent chaotic behavior

7. **Aurora-Like Diversity Visualization:**

- Multi-colored aurora waves across section top
- Wave properties:
    - Height: 100-150px from top edge
    - Colors: Rainbow spectrum representing diversity
    - Movement: Slow undulation from left to right
    - Opacity: 20-40% with edge feathering
- Behavior:
    - Colors shift and blend continuously
    - Intensity varies with scroll position
    - Occasional brightening pulses (5-10s intervals)
- Integration: Subtle influence on lighting of other elements

## Creator Section

**Section Title: "About Emanuel"**

- Animation: Handwritten text effect
- Stroke properties: Follows natural handwriting pattern
- Timing: 1200ms from first to last character
- Completion effect: Subtle settling with ink absorption look

**Main Content:**
"EMMI was created by Emanuel Covasa, a Computer Networks and Cybersecurity student at ATU Sligo with a background in hospitality management. His unique perspective on technology comes from personal experience navigating diverse cognitive styles and a philosophical framework that blends techno-utopianism with scientific pantheism.

*"Technology should be a bridge between human minds and the universe—enhancing our connection to nature and each other rather than isolating us behind screens."*"

- Paragraph entrance: Fade in after title completes
- Quote animation: Special treatment described below

**Visual Elements:**

1. **Split-Effect Portrait Treatment:**

- Dual representation of creator:
    - Left half: Photo-realistic rendering
    - Right half: Digital/polygonal interpretation
- Transition between states:
    - Subtle morphing effect at center line
    - Transition cycle: 5s complete phase shift
    - Boundary behavior: Glowing seam at intersection
- Animation properties:
    - Breathing effect: Subtle scale change (0.98-1.02)
    - Micro-movements: Slight position shifts
    - Focus effect: Details sharpen on scroll into view

2. **Contextual Background Response:**

- Background elements respond to portrait side:
    - Digital side background:
    - Code fragments floating in space
    - Network connection visualizations
    - Circuit-like patterns forming and dissolving
    - Color scheme: Tech-focused with theme influence
    - Natural side background:
    - Organic patterns resembling growth systems
    - Natural textures with subtle animation
    - Particle systems mimicking natural phenomena
    - Color scheme: Nature-focused with theme influence
- Transition zone:
    - Gradual blending between worlds
    - Hybrid elements showing digital/natural synthesis
    - Energy transfer between systems

3. **Connecting Elements:**

- Golden connecting lines between portrait sides
- Line properties:
    - Width: 1px
    - Color: #ffd700 (golden)
    - Glow: Subtle radial effect
    - Count: 5-7 primary connections
- Connection points:
    - Key facial/structural features
    - Conceptual matching points between worlds
    - Energy transfer nodes with pulse animation
- Behavior:
    - Occasional pulse traveling along connections
    - New connections forming and old fading
    - Response to scroll position and mouse movement

4. **Quote Presentation:**

- Text appears as if written by invisible hand
- Character properties:
    - Delay: 200ms between characters
    - Movement: Follows natural writing motion path
    - Appearance: Fade in with slight position settling
- Background effect:
    - Radial gradient emphasizing quote
    - Gradient properties:
    - Center: Behind middle of quote
    - Radius: Extends to cover full quote area
    - Opacity: 30% at center, fading to 0%
    - Color: Theme highlight color
- Particle enhancement:
    - 10-15 particles floating behind text
    - Movement: Slow upward drift
    - Color: Theme accent with varying opacity
    - Effect: Creates sense of energy/importance

5. **Digital-Natural Transition Background:**

- Background continuously transitions between tech and nature
- Transformation examples:
    - Circuit patterns morph into tree branch structures
    - Neural networks transform into river delta formations
    - Code fragments rearrange into leaf and plant forms
    - Digital interfaces blend with natural landscapes
- Transition properties:
    - Duration: Very slow (30-60s complete cycle)
    - Pattern: Wave-like progression across background
    - Method: Shape morphing with cross-dissolve
- Integration: Elements maintain functional appearance while changing form

6. **Scroll-Triggered Reveals:**

- Content elements triggered by scroll position
- Animation sequence:
    - Fade in (opacity 0 to 1)
    - Slide up (translateY(20px) to translateY(0))
    - Timing: 800ms with ease-out function
- Triggering:
    - Elements begin animation at 20% viewport entry
    - Staggered timing for grouped elements
    - Delay increases with depth/hierarchy level
- Reset behavior: Elements reset when scrolled out of view (optional)

7. **Mouse Influence on Transition:**

- Mouse movement affects digital/natural transition
- Influence properties:
    - Direction: Horizontal position affects balance
    - Speed: Movement speed influences transition rate
    - Area: Creates local transition effects near cursor
- Visual feedback:
    - Transition accelerates in mouse direction
    - Wake effect showing recent influence path
    - Return to default when mouse leaves section

## Footer Section

**Content Elements:**

- Contact: [Email address]
- Terms & Privacy link
- Copyright: © 2025 EMMI - PromptSage™ Framework
- Creator credit: By Emmi C.
- Links: emmi.zone | LinkedIn | X | GitHub

**Visual Elements:**

1. **Perspective Footer Design:**

- Footer rises from bottom with perspective effect
- Perspective properties:
    - Viewing angle: 20° from horizontal
    - Origin: Bottom edge of viewport
    - Depth: Creates sense of footer as platform
- Material effect:
    - Slightly reflective surface
    - Subtle texture with tech-organic hybrid pattern
    - Edge highlight along top border

2. **Link Hover Animations:**

- Each link has custom hover effects:
    - Scale transformation: 1.0 to 1.1
    - Brightness increase: 20% higher luminosity
    - Small orbital particles: 3-5 particles circling cursor
    - Transition: 200ms ease-in-out for natural feel
- Click effect:
    - Quick pulse flash
    - Scale down then up with slight overshoot
    - Ripple emanating from click point

3. **Neural-Nature Background Pattern:**

- Miniature version of hero section pattern
- Pattern properties:
    - Scale: 30% of hero version
    - Opacity: 15-20% for subtle presence
    - Animation: Significantly slowed (3x slower than hero)
    - Position: Fixed to footer background
- Integration:
    - Influenced by active theme colors
    - Subtly affected by mouse position
    - Occasional subtle pulse/energy surge

4. **Animated Wave Bottom Edge:**

- Sine wave animation along bottom edge
- Wave properties:
    - Amplitude: 3px vertical displacement
    - Wavelength: Multiple frequencies combined
    - Speed: 10-second cycle for main frequency
    - Color: Theme primary with 60% opacity
- Behavior:
    - Continuous horizontal movement
    - Occasional amplitude variation
    - Wave reflection at viewport edges
- Integration: Subtle influence on footer lighting

5. **PromptSage™ Logo Animation:**

- Logo pulses with cosmic energy
- Pulse properties:
    - Scale variation: 1.0 to 1.05
    - Cycle duration: 4s with ease-in-out
    - Light emission: Subtle glow during expansion
    - Color shift: Slight hue variation with pulse
- Secondary effects:
    - Occasional particle emission
    - Subtle rotation oscillation (±2°)
    - Shadow intensity variation

6. **Completion Animation:**

- Triggered by: Final scroll action reaching footer
- Global effect:
    - All page elements briefly connect with light paths
    - Connection pattern: Meaningful topology (not random)
    - Duration: 1500ms for complete sequence
- Light path properties:
    - Width: 0.5px
    - Color: Theme highlight color
    - Opacity: Starts at 80%, fades to 0%
    - Timing: Staggered formation for organic feel
- Flash effect:
    - Soft white gradient overlay at sequence peak
    - Opacity: 30% at maximum
    - Duration: 300ms with quick fade-out
- Settlement behavior:
    - Elements perform subtle bounce effect
    - Scale: Quick 1.05 to 0.98 to 1.0 oscillation
    - Duration: 600ms total settlement time
    - Easing: Elastic ease-out for natural physics

## Technical Implementation Notes

**Performance Optimization:**

- All animations use compositor-only properties where possible
- Heavy animations pause when not in viewport
- Particle systems use instanced rendering
- 3D elements use optimized low-poly meshes
- Asset loading strategy: Critical assets preloaded, others lazy-loaded
- Adaptive quality settings based on device capability

**Progressive Enhancement:**

- Core content and functionality works without JS
- Basic styling provides cohesive experience with CSS only
- Enhanced features added based on device capability
- Fallback rendering for WebGL when not supported

**Accessibility:**

- Reduced motion option disables intensive animations
- High contrast mode available
- All interactive elements keyboard accessible
- Screen reader optimized content structure
- Proper ARIA attributes throughout

**Responsive Design:**

- Mobile-first approach with enhancement for larger screens
- Critical breakpoints: 576px, 768px, 992px, 1200px
- Touch-optimized interactions for mobile
- Element sizing uses relative units (rem, em, vh, vw)
- Flexbox/Grid layouts for fluid positioning

**Interaction Priority:**

1. Content clarity and readability
2. Navigation usability and intuitiveness
3. Aesthetic enhancements and animations
4. Experimental features

**Required Libraries:**

- Three.js for 3D visualizations
- GSAP for advanced animations
- Particles.js for particle systems
- Lottie for complex vector animations
- Scroll-trigger for scroll-based interactions

**Custom WebGL Shaders:**

- Glow effects shader
- Particle physics shader
- Liquid/flow animation shader
- Digital-organic transition shader

**Recommended Development Approach:**

1. Implement core layout and content
2. Add basic animations and transitions
3. Implement theme system and color schemes
4. Add interactive elements and hover states
5. Integrate WebGL and advanced visualizations
6. Optimize performance and implement fallbacks
7. Test thoroughly across devices and add final polish

# Detailed Animation Description for EMMIHUB Website

## Global Animation Systems

### Particle System
- **Implementation**: Canvas-based system with 200-300 particles (2-3px size)
- **Behavior**: Particles move slowly (1-2px/s) in a slightly random pattern
- **Interaction**: When cursor moves, particles within 100px radius gently gravitate toward cursor position with a subtle acceleration
- **Physics**: Particles have momentum (continue moving briefly in direction of travel), light friction (gradually slow down), and subtle random movement
- **Appearance**: Color matches theme (primary accent color at 70% opacity with subtle glow)
- **Special Events**: Every 15-30 seconds, particles within a central area smoothly transition into geometric formations (Flower of Life, Metatron's Cube, etc.) for 3-5 seconds before dispersing back to normal behavior

### Background Gradient Animation
- **Implementation**: CSS gradient with JavaScript-controlled keyframe animation
- **Behavior**: Gradient slowly rotates and shifts its color stops position
- **Timing**: Complete 15-second cycle for one full transition
- **Effect**: Creates a subtle "breathing" feeling as colors gently shift in intensity and position
- **Theme Integration**: Gradient colors dynamically update when theme changes with 500ms crossfade transition

### Theme Switcher
- **Implementation**: Orbital toggle control with smooth transition effects
- **Appearance**: Circular switcher with 4 theme indicators arranged in orbit
- **Transition**: When theme changes, all colored elements crossfade to new theme colors (500ms duration)
- **Effect**: Background elements (particles, networks, etc.) smoothly morph colors rather than abruptly changing

## Hero Section Animations

### Neural-Organic Network
- **Implementation**: Canvas-based line drawing system using Perlin noise
- **Initial State**: Thin golden lines (0.5px) arranged in neural network pattern (node and connection topology)
- **Transformation**: Over 4 seconds, connection points gradually shift positions and lines redraw to form organic patterns
- **Cycle**: Every 20 seconds, pattern completes full transformation from technological to organic and back
- **Appearance**: Lines have subtle glow effect and vary in opacity (30-60%) in a slow breathing pattern

### Typewriter Effect for Headline
- **Implementation**: JavaScript-based character-by-character text rendering
- **Behavior**: Characters of "EMMI: Engaging Minds, Merging Ideas" appear one at a time
- **Timing**: Variable 30-70ms delay between characters (slower on vowels for natural rhythm)
- **Cursor**: Vertical line cursor that blinks at 500ms intervals during typing, remains for 2 seconds after completion, then fades out
- **Completion**: After headline completes, subheadline fades in over 800ms

### CTA Button Animation
- **Implementation**: CSS animations with JavaScript triggers
- **Ambient Animation**: Button subtly pulsates (scale 1.00 to 1.05) on a 3-second cycle
- **Border Animation**: Gradient border color flows clockwise around button (3-second duration)
- **Hover State**: Button elevation shadow increases from 3px to 5px, scale increases to 1.08, white glow appears
- **Click Animation**: Button scales down to 0.95 on click, then releases with slight elastic overshoot, accompanied by a radial ripple effect from click point

## Introduction Section Animations

### Split-Screen Neural Visualization
- **Implementation**: WebGL rendering with custom shaders
- **Left Side (Human Brain)**: Blue-teal gradient (#00b4d8 to #90e0ef) neural pathways with organic, less structured arrangement and subtle pulse effects that mimic brain activity (0.5-2 second irregular intervals)
- **Right Side (AI Network)**: Purple-pink gradient (#7209b7 to #f72585) neural network with more geometric and structured arrangement, with data processing visualization shown as traveling pulses along connections (regular 1-3 second intervals)
- **Center Connection**: Animated lines (1px width) flowing between both sides with data transfer pulses (glowing dots) traveling along connection lines every 2-5 seconds

### Text Entrance Animation
- **Implementation**: CSS transitions triggered by scroll position
- **Behavior**: Text blocks fade in (opacity 0 to 1) while sliding upward (translateY(20px) to translateY(0))
- **Timing**: 800ms duration with 200ms delay between paragraphs
- **Trigger**: Animation begins when section reaches 20% of viewport

### Cognitive Style Selector
- **Implementation**: CSS transforms with JavaScript event handling
- **Idle State**: Three icons representing cognitive styles (Visual, Analytical, Pattern-based) at normal size
- **Hover Behavior**: Icon scales up (1.0 to 1.2), elevation shadow appears, surrounding particles gravitate toward hovered icon
- **Selection Effect**: Selected icon remains elevated and highlighted, connecting lines form between icon and content, and content formatting adjusts to demonstrate the selected cognitive style

## Philosophy Section Animations

### Cosmic Environment
- **Implementation**: Three.js scene with custom shaders
- **Star Field**: Three parallax layers of stars (1px, 2px, and 3px sizes) that move at different rates with scroll/cursor movement
- **Star Behavior**: Subtle twinkle effect (opacity variation 70-100% on 2-5 second random cycles)
- **Nebula Background**: Very subtle nebula-like formations at 15-20% opacity that slowly shift position

### Constellation Visualizations
- **Implementation**: Canvas-based line drawing with animation sequences
- **Formation Animation**: Stars brighten sequentially then connection lines extend from point to point like electric current
- **Appearance**: Human profile outline constellation on left side, digital interface/circuit outline on right side, with connecting lines between key points
- **Timing**: 3-5 seconds per complete formation, with new formations every 15-20 seconds
- **Effect**: Creates impression of meaningful patterns emerging from random stars

### List Item Animation
- **Implementation**: CSS animations with JavaScript triggers
- **Sequence**: Each bullet point has multi-stage animation:
  1. Starts as horizontal line (theme primary color)
  2. Line expands outward from center with glowing edges
  3. Text fades in after line formation completes
  4. Subtle pulse animation indicates completion
- **Timing**: Line formation (400ms), text fade (300ms), pulse effect (500ms)
- **Trigger**: Animations stagger with 200ms delay between items as user scrolls to them

## Community Support Model Section Animations

### Hexagonal Tier Platforms
- **Implementation**: CSS 3D transforms with shadow effects
- **Appearance**: Floating hex platforms with different elevation levels and material effects
- **Ambient Animation**: 2px vertical oscillation on a 3-second cycle creates floating impression
- **Material Differentiation**:
  - Explorer: Glass-like transparency (20%) with light refraction
  - Scholar: Metallic with light reflections that shift with viewport movement
  - Visionary: Crystal with subtle refraction effects
  - Innovator: Energy field with particle emission

### Tier Aura Effects
- **Implementation**: CSS gradient animations and box-shadows
- **Appearance**: Each tier emits distinctive glowing aura extending 15-20px from platform edges
- **Colors**: Explorer (blue #48cae4), Scholar (purple #7209b7), Visionary (gold #ffd700), Innovator (multi-color shifting)
- **Animation**: Subtle pulse (4s cycle, 10% intensity variation) creates living energy impression
- **Interaction**: Aura intensifies when platform is hovered

### Energy Flow Visualization
- **Implementation**: Canvas-based particle system
- **Appearance**: Animated particle streams connecting tier levels
- **Behavior**: Particles flow from Explorer upward to higher tiers, then cycle downward through funding allocations
- **Particle Properties**: 1-2px circular particles with subtle trail, 50-100 particles per stream
- **Flow Speed**: Normal state 2px/s, accelerating to 4px/s on nearby hover
- **Path Animation**: Subtle undulation (sine wave, 5px amplitude) makes flow appear natural

## Technology Section Animations

### Interactive 3D Framework Model
- **Implementation**: Three.js with interactive elements
- **Structure**: Hierarchical tree visualization of XML structure with nodes and connecting pathways
- **Ambient Animation**: Gentle rotation (15° amplitude, 20s cycle) and breathing effect (scale 0.98-1.02, 4s cycle)
- **Interaction**: Nodes pulse when mentioned in adjacent text, highlight on hover, expand when clicked
- **Connection Elements**: Glowing pathways between related nodes with data flow animation (subtle pulse traveling along paths)

### Code Visualization
- **Implementation**: Syntax-highlighted code blocks with animation
- **Appearance**: XML/structural code snippets with theme-based color coding
- **Animation**: Progressive illumination of key elements as user scrolls
- **Interaction**: Hovering on code highlights corresponding framework element in the 3D model
- **Syncing**: Split-screen showing code on left and resulting behavior on right, with animated connections between related elements

### Matrix Background
- **Implementation**: Canvas-based character animation
- **Appearance**: Vertical streams of code-like characters at 10% opacity
- **Behavior**: Continuous downward flow at variable speeds (2-5px/s)
- **Special Effect**: Occasionally forms meaningful patterns/words for 2-3 seconds before resuming random flow
- **Integration**: Subtly responds to user interactions by altering flow direction near cursor

## Assistants Showcase Section Animations

### 3D Orbital Carousel
- **Implementation**: Three.js with physics-based motion
- **Structure**: Assistant cards follow elliptical orbital paths at varying angles and speeds
- **Rotation**: Automatic 15-second full rotation cycle that pauses on hover
- **Active Card**: Current card scales to 1.2x size and moves to foreground with enhanced brightness
- **Path Visualization**: Subtle dotted line (0.5px, 10% opacity) showing orbital paths

### Assistant Card Design
- **Implementation**: CSS 3D transforms with custom lighting effects
- **Appearance**: Holographic info panel with 3D projection effect, semi-transparent background (15% opacity), and edge glow
- **Ambient Animation**: Subtle floating animation (vertical 2px oscillation) and perspective shift based on viewing angle
- **Expansion**: Cards rotate 180° on Y-axis and expand to full screen when selected
- **Material Effect**: Light refraction on surface, edge highlighting, subtle grain texture

### Domain-Specific Icons
- **Implementation**: Lottie animations or Canvas-based vector animations
- **MathSage**: Floating mathematical symbols that rearrange to form solutions
- **ResearchGuide**: Knowledge graph with nodes forming new connections
- **FocusFlow**: Chaotic text fragments organizing into clear layout
- **LinuxNavigator**: Terminal with flowing command sequences that type and execute
- **CreativePartner**: Color palette transforming into idea sketches
- **WorkflowOptimizer**: Flowchart elements optimizing in real-time

### Connecting Light Beams
- **Implementation**: Canvas-based line drawing with animation
- **Appearance**: Thin light beams (1px width, 70% opacity) connect related assistants
- **Effect**: Pulse animation (glowing dots) traveling along connections every 2-5 seconds
- **Interaction**: Beams brighten when related cards are hovered/selected
- **Intersection Nodes**: Brighter points where beams cross with subtle pulse effect

## Future Vision Section Animations

### Interactive Timeline Visualization
- **Implementation**: Canvas/SVG hybrid with interactive elements
- **Appearance**: Horizontal timeline with illuminated milestone markers, extending beyond screen edges
- **Marker Types**: Completed (fully illuminated), Current (pulsing highlight), Future (semi-transparent)
- **Interaction**: Hover reveals milestone details, click expands to show full description
- **Control**: Timeline position controlled by vertical scroll position

### Development Ripple Effect
- **Implementation**: Canvas-based circular animation
- **Appearance**: Concentric circles emanating from timeline milestone points
- **Properties**: Expansion over 3-6 seconds, starting at 60% opacity and fading to 0% at maximum radius
- **Pattern**: Regular ripples from current milestone, occasional ripples from past milestones, ghosted ripples from future milestones
- **Physics**: Natural wave interference patterns where ripples overlap, creating brightened nodes at intersection points

### Blueprint Background Elements
- **Implementation**: SVG patterns with subtle animations
- **Appearance**: Technical drawings of future interfaces with fine white/blue lines (0.5px)
- **Opacity**: 5-10% for subtle background presence
- **Animation**: Very slow panning movement (1px/s) creates living document feel
- **Content**: Interface wireframes, device concepts, connector diagrams that hint at future developments

## Join Us Section Animations

### Global Community Visualization
- **Implementation**: Three.js globe with interactive elements
- **Appearance**: Low-poly 3D globe (400-600 triangles) with illuminated edges and subtle terrain
- **Animation**: Slow continuous rotation (1 rotation per minute)
- **Support Indicators**: Rising light pillars from supporter locations with height based on support tier
- **Connection Network**: Lines forming between supporter locations that appear and fade over 5-second cycles

### CTA Button Platform Design
- **Implementation**: CSS 3D transforms with lighting effects
- **Appearance**: Buttons as ascending platforms with material effects matching tier level
- **Materials**: Explorer (glass), Scholar (metallic), Visionary (crystalline), Innovator (energy field)
- **Hover Effect**: Energy field appears around button (extends 10px beyond borders), platform rises 3-5px
- **Click Animation**: Platform depresses 2px on click, then returns with slight overshoot and radial ripple effect

### Energy Current Background
- **Implementation**: Canvas-based path animation
- **Appearance**: Flowing energy currents between community nodes
- **Properties**: Variable 2-5px pathway width, theme-based color at 30% opacity
- **Animation**: Particles traveling along paths with subtle undulation
- **Interaction**: Currents respond to nearby button interactions by intensifying flow

## Creator Section Animations

### Split-Effect Portrait
- **Implementation**: WebGL shader with transition effects
- **Appearance**: Dual representation with left half photo-realistic and right half digital/polygonal
- **Transition**: Subtle morphing effect at center line completing a full phase shift every 5 seconds
- **Background Response**: Digital elements (code, circuits) behind digital half, natural elements (organic patterns) behind realistic half
- **Boundary**: Glowing seam at intersection that pulses with energy transfer

### Quote Presentation
- **Implementation**: JavaScript character-by-character animation
- **Appearance**: Text appears as if written by invisible hand with 200ms delay between characters
- **Background Effect**: Radial gradient emphasizing quote (30% opacity at center, fading to 0%)
- **Enhancement**: 10-15 particles floating behind text with slow upward drift creates sense of energy/importance

### Digital-Natural Transition Background
- **Implementation**: Fragment shader with morphing capability
- **Appearance**: Background continuously transitions between tech and nature elements
- **Examples**: Circuit patterns morph into tree branches, neural networks transform into river deltas
- **Timing**: Very slow cycle (30-60s) creates subtle living environment
- **Interaction**: Mouse movement influences transition, accelerating in direction of cursor

## Footer Section Animations

### Perspective Footer Design
- **Implementation**: CSS 3D transforms
- **Appearance**: Footer rises from bottom with 20° perspective effect creating platform-like appearance
- **Material**: Slightly reflective surface with tech-organic hybrid pattern
- **Edge**: Subtle highlight along top border to enhance 3D effect

### Completion Animation
- **Implementation**: JavaScript-coordinated animation sequence
- **Trigger**: Final scroll action reaching footer
- **Sequence**: All page elements briefly connect with light paths in meaningful topology
- **Duration**: 1500ms for complete sequence with staggered timing
- **Flash Effect**: Soft white gradient overlay at sequence peak (30% opacity)
- **Settlement**: Elements perform subtle bounce effect (quick 1.05 to 0.98 to 1.0 scale) over 600ms

## Performance Considerations

- **Optimization Strategy**:
  - Use GPU-accelerated properties (transform, opacity) for animations
  - Implement adaptive quality based on device capability (lower particle counts, simpler effects)
  - Ensure heavy animations pause when not in viewport
  - Set reasonable frame rate targets (30fps minimum, 60fps ideal)

- **Progressive Enhancement**:
  - Core content and basic animations work without advanced features
  - Add complexity layers only when device capability is confirmed
  - Provide simplified fallbacks for older browsers

- **Responsive Adaptations**:
  - Reduce animation complexity at smaller viewport sizes
  - Consolidate some effects on mobile to maintain performance
  - Convert certain 3D elements to 2D on low-power devices

This detailed breakdown should help address specific animation issues by clarifying exactly how each component should behave and interact visually.