// PromptSage XML Tag Nodes Animation
export function initPromptSageAnimation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Configuration
    const tags = [
        { text: 'mode', content: 'Examiner', color: '#00ffcc' },
        { text: 'role', content: 'Tutor', color: '#9966ff' },
        { text: 'behavior', content: 'Visual', color: '#3399ff' },
        { text: 'rules', content: 'Ethical', color: '#ffcc00' },
        { text: 'system', content: 'Role', color: '#ff6b6b' },
        { text: 'output', content: 'Allowed', color: '#4ecdc4' },
        { text: 'preference', content: 'Neurodivergent', color: '#a8e6cf' },
        { text: 'restriction', content: 'NotAllowed', color: '#ff8b94' }
    ];

    // Create central element
    const center = document.createElement('div');
    center.className = 'promptsage-center';
    center.textContent = 'PromptSage™';
    container.appendChild(center);

    const containerRect = container.getBoundingClientRect();
    const safeMargin = 25.575;
    const tagElements = [];

    // Create and position tags
    tags.forEach((tag, index) => {
        const tagContainer = document.createElement('div');
        tagContainer.className = 'promptsage-tag';
        tagContainer.innerHTML = `
            <span class="tag-open">&lt;${tag.text}&gt;</span>
            <span class="tag-content">${tag.content}</span>
            <span class="tag-close">&lt;/${tag.text}&gt;</span>
        `;
        tagContainer.style.setProperty('--tag-color', tag.color);
        container.appendChild(tagContainer);

        const rect = tagContainer.getBoundingClientRect();
        const startX = Math.random() * (containerRect.width - rect.width - 2 * safeMargin) + safeMargin;
        const startY = Math.random() * (containerRect.height - rect.height - 2 * safeMargin) + safeMargin;
        const angle = Math.random() * Math.PI * 2;
        const speed = (1.8 + Math.random() * 1.2) * 0.425; // Moderate speed increase with less variation

        const tagObj = {
            element: tagContainer,
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            width: rect.width,
            height: rect.height,
            isPaused: false
        };

        // Removed click event listener that was pausing tag movement
        
        tagElements.push(tagObj);
    });

    function animate() {
        const containerRect = container.getBoundingClientRect();

        tagElements.forEach(tag => {
            if (tag.isPaused) return;

            // Update position with smoother movement
            tag.x += tag.vx * 0.525; // Moderate increase from original 0.425
            tag.y += tag.vy * 0.525; // Moderate increase from original 0.425

            // Bounce off walls with gentler rebounds
            if (tag.x <= safeMargin) {
                tag.x = safeMargin;
                tag.vx = -tag.vx; // Removed bounce multiplier
            } else if (tag.x + tag.width >= containerRect.width - safeMargin) {
                tag.x = containerRect.width - tag.width - safeMargin;
                tag.vx = -tag.vx; // Removed bounce multiplier
            }

            if (tag.y <= safeMargin) {
                tag.y = safeMargin;
                tag.vy = -tag.vy; // Removed bounce multiplier
            } else if (tag.y + tag.height >= containerRect.height - safeMargin) {
                tag.y = containerRect.height - tag.height - safeMargin;
                tag.vy = -tag.vy; // Removed bounce multiplier
            }

            // Collision with other tags
            tagElements.forEach(other => {
                if (tag === other || other.isPaused) return;

                const dx = other.x - tag.x;
                const dy = other.y - tag.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDist = (tag.width + other.width + tag.height + other.height) / 4;

                if (distance < minDist && distance > 0) {
                    const nx = dx / distance;
                    const ny = dy / distance;

                    const u1 = tag.vx * nx + tag.vy * ny;
                    const u2 = other.vx * nx + other.vy * ny;

                    const tag_vx_new = tag.vx - u1 * nx + u2 * nx;
                    const tag_vy_new = tag.vy - u1 * ny + u2 * ny;
                    const other_vx_new = other.vx - u2 * nx + u1 * nx;
                    const other_vy_new = other.vy - u2 * ny + u1 * ny;

                    tag.vx = tag_vx_new;
                    tag.vy = tag_vy_new;
                    other.vx = other_vx_new;
                    other.vy = other_vy_new;

                    const overlap = minDist - distance;
                    if (overlap > 0) {
                        const separationX = (overlap * nx) / 2;
                        const separationY = (overlap * ny) / 2;
                        tag.x -= separationX;
                        tag.y -= separationY;
                        other.x += separationX;
                        other.y += separationY;
                    }
                }
            });

            // Apply position
            tag.element.style.transform = `translate3d(${tag.x}px, ${tag.y}px, 0)`;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    requestAnimationFrame(animate);
}