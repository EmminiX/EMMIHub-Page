/**
 * Community Cards Interaction - Direct Style Manipulation
 * Fixes hover effects by directly applying and removing inline styles
 * instead of relying on classes
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find the community section
    const communitySection = document.querySelector('.community-section');
    if (!communitySection) {
        console.log('Community section not found');
        return;
    }
    
    // Find all tier cards within the community section
    const tierCards = communitySection.querySelectorAll('.tier');
    if (!tierCards.length) {
        console.log('No tier cards found in community section');
        return;
    }
    
    console.log(`Initializing direct style hover effects for ${tierCards.length} community tier cards`);
    
    // Direct style approach for each card type
    const hoverStyles = {
        base: {
            transform: 'translateY(-10px)',
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
            zIndex: '2'
        },
        explorer: {
            borderColor: 'rgba(16, 185, 129, 0.6)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
        },
        scholar: {
            borderColor: 'rgba(114, 9, 183, 0.6)',
            boxShadow: '0 8px 32px rgba(114, 9, 183, 0.2)'
        },
        visionary: {
            borderColor: 'rgba(255, 215, 0, 0.6)',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
        },
        innovator: {
            borderColor: 'rgba(0, 240, 255, 0.6)',
            boxShadow: '0 8px 32px rgba(0, 240, 255, 0.2)'
        }
    };
    
    // Button hover styles
    const buttonHoverStyles = {
        explorer: {
            background: 'rgba(16, 185, 129, 0.9)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transform: 'translateY(-2px)'
        },
        scholar: {
            background: 'rgba(114, 9, 183, 0.9)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(114, 9, 183, 0.3)',
            transform: 'translateY(-2px)'
        },
        visionary: {
            background: 'rgba(255, 215, 0, 0.9)',
            color: '#000000',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
            transform: 'translateY(-2px)'
        },
        innovator: {
            background: 'rgba(0, 240, 255, 0.9)',
            color: '#000000',
            boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)',
            transform: 'translateY(-2px)'
        }
    };
    
    // Save original styles to restore them
    const originalStyles = new Map();
    const originalButtonStyles = new Map();
    
    // We'll use this flag to track when we're handling a card click
    let handlingClick = false;
    
    // Process each tier card
    tierCards.forEach(card => {
        // Determine the tier type (explorer, scholar, etc.)
        let tierType = null;
        ['explorer', 'scholar', 'visionary', 'innovator'].forEach(type => {
            if (card.classList.contains(type)) {
                tierType = type;
            }
        });
        
        // Find the button inside the card
        const button = card.querySelector(`.tier-button.${tierType}`);
        
        // Save original styles
        const cardStyleObj = {};
        ['transform', 'boxShadow', 'zIndex', 'borderColor'].forEach(prop => {
            cardStyleObj[prop] = card.style[prop];
        });
        originalStyles.set(card, cardStyleObj);
        
        // Save original button styles if button exists
        if (button) {
            const buttonStyleObj = {};
            ['background', 'color', 'boxShadow', 'transform'].forEach(prop => {
                buttonStyleObj[prop] = button.style[prop];
            });
            originalButtonStyles.set(button, buttonStyleObj);
        }
        
        // Function to apply hover styles
        function applyHoverStyles() {
            if (handlingClick) return;
            
            // Apply base hover styles
            Object.entries(hoverStyles.base).forEach(([prop, value]) => {
                card.style[prop] = value;
            });
            
            // Apply tier-specific hover styles
            if (tierType && hoverStyles[tierType]) {
                Object.entries(hoverStyles[tierType]).forEach(([prop, value]) => {
                    card.style[prop] = value;
                });
            }
            
            // Apply button styles if button exists
            if (button && tierType && buttonHoverStyles[tierType]) {
                Object.entries(buttonHoverStyles[tierType]).forEach(([prop, value]) => {
                    button.style[prop] = value;
                });
            }
        }
        
        // Function to remove hover styles
        function removeHoverStyles() {
            if (handlingClick) return;
            
            // Remove any directly applied hover styles by restoring original values
            const origStyles = originalStyles.get(card);
            if (origStyles) {
                Object.entries(origStyles).forEach(([prop, value]) => {
                    card.style[prop] = value || '';
                });
            }
            
            // Restore button styles
            if (button) {
                const origButtonStyles = originalButtonStyles.get(button);
                if (origButtonStyles) {
                    Object.entries(origButtonStyles).forEach(([prop, value]) => {
                        button.style[prop] = value || '';
                    });
                }
            }
        }
        
        // Add direct event listeners for mouseenter/mouseleave
        card.addEventListener('mouseenter', applyHoverStyles);
        card.addEventListener('mouseleave', removeHoverStyles);
        
        // Removed click event handler to prevent interference with hover effects
    });
    
    // Removed global click event listener on community section to prevent interference with hover effects
});
