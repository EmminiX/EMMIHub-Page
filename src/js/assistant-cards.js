// EMMIHUB - Assistant Cards Component
// This script manages the interactive assistant cards display and video player

// Assistant data
const assistantData = [
    {
        id: 'math-sage',
        name: 'Math Sage',
        icon: 'math-icon',
        description: 'A mathematics assistant that guides through problems step-by-step, adapting to your learning style.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'research-guide',
        name: 'Research Guide',
        icon: 'research-icon',
        description: 'Your collaborative research companion, helping organize information, connect disparate concepts, and generate insights from complex data.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'focus-flow',
        name: 'Focus Flow',
        icon: 'focus-icon',
        description: 'An assistant that extracts and reorganizes information from lengthy texts, formatting content specifically for dyslexic and ADHD cognitive patterns.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'linux-navigator',
        name: 'Linux Navigator',
        icon: 'linux-icon',
        description: 'Your command line companion that explains, demonstrates, and guides through Linux operations with contextual examples.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'creative-partner',
        name: 'Creative Partner',
        icon: 'creative-icon',
        description: 'An assistant that helps break through creative blocks, offering inspiration and structured approaches to ideation and project development.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'workflow-optimizer',
        name: 'Workflow Optimizer',
        icon: 'workflow-icon',
        description: 'Streamline your processes and discover more efficient ways to accomplish your goals through systematic analysis and refinement.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    // Add at least 2 more assistants to demonstrate scrolling
    {
        id: 'code-companion',
        name: 'Code Companion',
        icon: 'math-icon', // Reuse an existing icon class
        description: 'An intelligent coding assistant that helps with debugging, refactoring, and learning new programming languages.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    },
    {
        id: 'writing-mentor',
        name: 'Writing Mentor',
        icon: 'research-icon', // Reuse an existing icon class
        description: 'A writing assistant that helps improve clarity, structure, and style in various forms of written communication.',
        videoSrc: 'assets/video/soon.mp4' // Updated to use local MP4 file
    }
];

// Flag to track if initial video has been loaded
let videoLoaded = false;

// Flag to track user's mute preference
let userMutedVideo = true; // Default to muted until user explicitly unmutes

// Set up intersection observer to load video when section comes into view
document.addEventListener('DOMContentLoaded', function() {
    // Create assistant cards
    createAssistantCards();
    
    // Initialize continuous loop scroll for cards
    initContinuousScroll();
    
    // Set up video loading when the section becomes visible
    initVideoOnView();
});

// Function to initialize video loading when section becomes visible
function initVideoOnView() {
    const videoSection = document.querySelector('.assistants-section');
    const video = document.getElementById('assistant-demo-video');
    
    if (!videoSection || !video) return;
    
    // Ensure video is initially muted
    video.muted = true;
    
    // Create intersection observer to detect when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view class for styling
                const wrapper = video.closest('.video-player-wrapper');
                if (wrapper) wrapper.classList.add('in-view');
                
                // Only play the video when section is in view
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.error('Error playing video:', error);
                        // If autoplay fails, ensure it's muted and try again
                        video.muted = true;
                        video.play().catch(e => console.error('Secondary play attempt failed:', e));
                    });
                }
                
                // If user hasn't explicitly chosen to mute, unmute when in view
                if (!userMutedVideo) {
                    video.muted = false;
                }
                
                // Remember that video has been loaded
                if (!videoLoaded) {
                    videoLoaded = true;
                }
            } else {
                // Remove in-view class when not visible
                const wrapper = video.closest('.video-player-wrapper');
                if (wrapper) wrapper.classList.remove('in-view');
                
                // Always mute when not in view
                video.muted = true;
                
                // Pause the video when not in view
                if (video.currentTime > 0 && !video.paused && !video.ended) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of section is visible
    
    // Start observing the section
    observer.observe(videoSection);
    
    // Add mute toggle button
    const videoContainer = video.closest('.video-player-wrapper');
    if (videoContainer) {
        let muteButton = videoContainer.querySelector('.video-mute-toggle');
        
        if (!muteButton) {
            muteButton = document.createElement('button');
            muteButton.className = 'video-mute-toggle';
            muteButton.innerHTML = '<span>🔇</span>'; // Start with muted icon
            muteButton.title = 'Toggle sound';
            
            muteButton.addEventListener('click', () => {
                userMutedVideo = !userMutedVideo; // Update user preference
                video.muted = userMutedVideo;
                muteButton.innerHTML = userMutedVideo ? '<span>🔇</span>' : '<span>🔊</span>';
                
                // If unmuting and video is paused, try to play
                if (!userMutedVideo && (video.paused || video.ended)) {
                    video.play().catch(e => {
                        console.error('Play on unmute failed:', e);
                        // If play fails, revert to muted state
                        video.muted = true;
                        userMutedVideo = true;
                        muteButton.innerHTML = '<span>🔇</span>';
                    });
                }
            });
            
            videoContainer.appendChild(muteButton);
        }
    }
    
    // Add click-to-play functionality
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play().catch(e => console.error('Play on click failed:', e));
        } else {
            video.pause();
        }
    });
}

// Function to create assistant cards from data
function createAssistantCards() {
    const container = document.getElementById('assistant-card-container');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Hide scrollbar while maintaining functionality
    container.style.scrollbarWidth = 'none'; // Firefox
    container.style.msOverflowStyle = 'none'; // IE/Edge
    container.style.overflow = 'hidden'; // Hide scrollbar but maintain scroll functionality
    
    // Create a wrapper for the cards to enable smooth looping
    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'assistant-cards-wrapper';
    cardsWrapper.style.position = 'relative';
    cardsWrapper.style.width = '100%';
    container.appendChild(cardsWrapper);
    
    // Create cards from data
    assistantData.forEach((assistant) => {
        const card = document.createElement('div');
        card.className = 'assistant-card';
        card.setAttribute('data-assistant-id', assistant.id);
        card.setAttribute('data-exclude-from-orbital', 'true');
        card.setAttribute('data-video-src', assistant.videoSrc);
        
        // Create content container with centered alignment
        const contentContainer = document.createElement('div');
        contentContainer.className = 'assistant-card-content';
        
        // Create icon with brain image
        const icon = document.createElement('div');
        icon.className = 'assistant-icon';
        
        // Add brain image to icon
        const brainImage = document.createElement('img');
        brainImage.src = '../../assets/images/ai-brain.jpg';
        brainImage.alt = 'Brain icon';
        icon.appendChild(brainImage);
        
        // Create title
        const title = document.createElement('h3');
        title.textContent = assistant.name;
        
        // Add elements to content container in horizontal order
        contentContainer.appendChild(icon);
        contentContainer.appendChild(title);
        
        // Create hidden description (for potential future use)
        const description = document.createElement('p');
        description.textContent = assistant.description;
        description.style.display = 'none';
        
        // Create corner elements
        const topRightCorner = document.createElement('div');
        topRightCorner.className = 'top-right-corner';
        
        const bottomLeftCorner = document.createElement('div');
        bottomLeftCorner.className = 'bottom-left-corner';
        
        // Add elements to content container
        contentContainer.appendChild(icon);
        contentContainer.appendChild(title);
        
        // Add content container and other elements to card
        card.appendChild(contentContainer);
        card.appendChild(description);
        card.appendChild(topRightCorner);
        card.appendChild(bottomLeftCorner);
        
        // Add card to wrapper
        cardsWrapper.appendChild(card);
        
        // Add hover event listeners only
        setupCardEvents(card);
    });

    // Clone all cards and append them at the end for perfect looping
    // This creates a duplicate set that allows seamless transition when we reach the end
    const cards = cardsWrapper.querySelectorAll('.assistant-card');
    cards.forEach(card => {
        const clonedCard = card.cloneNode(true);
        cardsWrapper.appendChild(clonedCard);
        setupCardEvents(clonedCard);
    });
}

// Function to set up event listeners for each card
function setupCardEvents(card) {
    // Only add hover effects for pausing/resuming auto-scroll
    card.addEventListener('mouseenter', () => {
        // Pause auto-scrolling when user is interacting
        pauseAutoScroll();
    });
    
    card.addEventListener('mouseleave', () => {
        // Resume auto-scrolling when user is done interacting
        resumeAutoScroll();
    });
    
    // Add click event to switch video
    card.addEventListener('click', () => {
        const videoSrc = card.getAttribute('data-video-src');
        if (videoSrc) {
            loadVideo(videoSrc);
        }
    });
}

// Function to load video
function loadVideo(videoSrc) {
    const video = document.getElementById('assistant-demo-video');
    if (video && videoSrc) {
        // Update the video source
        video.src = videoSrc;
        // Load and play the video
        video.load();
        video.play().catch(e => console.error('Error playing video after source change:', e));
    }
}

// Auto-scroll variables
let animationFrameId = null;
let isAutoScrollPaused = false;
let cardHeight = 0;
let containerHeight = 0;
let totalScrollHeight = 0;
let scrollSpeed = 0.5; // Pixels per frame - adjust for speed
let scrollPosition = 0; // Current scroll position (virtual)

// Function to initialize continuous scroll
function initContinuousScroll() {
    const container = document.getElementById('assistant-card-container');
    const cardsWrapper = container ? container.querySelector('.assistant-cards-wrapper') : null;
    const cards = cardsWrapper ? cardsWrapper.querySelectorAll('.assistant-card') : null;
    
    if (!container || !cardsWrapper || !cards || cards.length === 0) return;
    
    // Calculate card height with margin
    const cardRect = cards[0].getBoundingClientRect();
    cardHeight = cardRect.height + 12; // 12px is the margin-bottom
    
    // Container visible height
    containerHeight = container.clientHeight;
    
    // Calculate original content height (before cloning)
    const originalCardCount = cards.length / 2; // Half are originals, half are clones
    totalScrollHeight = cardHeight * originalCardCount; 
    
    // Create a MutationObserver to maintain layout integrity
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style') {
                const card = mutation.target;
                
                // Only process excluded cards
                if (card.getAttribute('data-exclude-from-orbital') === 'true') {
                    // Reset position styles added by orbital carousel
                    if (card.style.position === 'absolute' || 
                        card.style.position === 'fixed') {
                        // Use timeout to ensure our styles come after others
                        setTimeout(() => {
                            card.style.position = '';
                            card.style.left = '';
                            card.style.top = '';
                            card.style.transform = '';
                            card.style.zIndex = '';
                            card.style.opacity = '1';
                        }, 0);
                    }
                }
            }
        });
    });
    
    // Observe each card for style changes
    cards.forEach(card => {
        observer.observe(card, { 
            attributes: true, 
            attributeFilter: ['style'] 
        });
    });
    
    // Start continuous smooth scrolling animation
    startSmoothScroll();
}

// Function to start smooth continuous scrolling with requestAnimationFrame
function startSmoothScroll() {
    const container = document.getElementById('assistant-card-container');
    const cardsWrapper = container ? container.querySelector('.assistant-cards-wrapper') : null;
    
    if (!container || !cardsWrapper) return;
    
    // Cancel any existing animation
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Animation function
    function animate() {
        if (!isAutoScrollPaused && container && cardsWrapper) {
            // Increment virtual scroll position
            scrollPosition += scrollSpeed;
            
            // If we've gone beyond the first set of cards, reset
            if (scrollPosition >= totalScrollHeight) {
                // Seamlessly loop by resetting position without visual glitch
                scrollPosition = 0;
            }
            
            // Apply transform instead of scrollTop for smoother animation
            cardsWrapper.style.transform = `translateY(-${scrollPosition}px)`;
        }
        
        // Continue the animation loop
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Start the animation
    animationFrameId = requestAnimationFrame(animate);
}

// Function to pause auto-scrolling
function pauseAutoScroll() {
    isAutoScrollPaused = true;
}

// Function to resume auto-scrolling
function resumeAutoScroll() {
    isAutoScrollPaused = false;
}