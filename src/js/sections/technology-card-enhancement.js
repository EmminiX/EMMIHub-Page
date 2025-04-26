// EMMIHUB - Technology Section Enhancements
// This script adds advanced visual elements to the technology section cards

document.addEventListener('DOMContentLoaded', function() {
    // Find all subsection cards in the technology section
    const subsectionCards = document.querySelectorAll('.technology-section .subsection');
    
    if (subsectionCards.length > 0) {
        console.log(`Enhancing ${subsectionCards.length} technology section cards`);
        
        // Add the visual enhancement elements to each card
        subsectionCards.forEach(card => {
            // Create corner accents
            const cornerTopLeft = document.createElement('div');
            cornerTopLeft.className = 'corner corner-top-left';
            card.appendChild(cornerTopLeft);
            
            const cornerTopRight = document.createElement('div');
            cornerTopRight.className = 'corner corner-top-right';
            card.appendChild(cornerTopRight);
            
            const cornerBottomLeft = document.createElement('div');
            cornerBottomLeft.className = 'corner corner-bottom-left';
            card.appendChild(cornerBottomLeft);
            
            const cornerBottomRight = document.createElement('div');
            cornerBottomRight.className = 'corner corner-bottom-right';
            card.appendChild(cornerBottomRight);
            
            // Create circuit pattern background
            const circuitPattern = document.createElement('div');
            circuitPattern.className = 'circuit-pattern';
            card.appendChild(circuitPattern);
            
            // Create sacred geometry background
            const sacredGeometry = document.createElement('div');
            sacredGeometry.className = 'sacred-geometry';
            card.appendChild(sacredGeometry);
            
            // Add hover effect
            card.addEventListener('mouseenter', () => {
                // Add subtle animation to the corners on hover
                cornerTopLeft.style.animation = 'pulse 2s infinite ease-in-out';
                cornerTopRight.style.animation = 'pulse 2s infinite ease-in-out 0.5s';
                cornerBottomLeft.style.animation = 'pulse 2s infinite ease-in-out 1s';
                cornerBottomRight.style.animation = 'pulse 2s infinite ease-in-out 1.5s';
            });
            
            card.addEventListener('mouseleave', () => {
                // Remove animations when not hovering
                cornerTopLeft.style.animation = '';
                cornerTopRight.style.animation = '';
                cornerBottomLeft.style.animation = '';
                cornerBottomRight.style.animation = '';
            });
        });
        
        // Add particle effects to list items on hover
        const listItems = document.querySelectorAll('.technology-section .framework-features li');
        listItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // We'll use CSS for the main hover effect, but could add more JS-based effects here
                item.classList.add('hover-active');
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('hover-active');
            });
        });
    }
});