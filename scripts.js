// Function to enable editing on double-click
function makeEditable(event) {
    const element = event.target;
    // Prevent editing of static elements
    if (!element.classList.contains('static')) {
        element.setAttribute('contenteditable', 'true');
        element.focus();

        // Remove editable state on blur
        element.addEventListener('blur', () => {
            element.removeAttribute('contenteditable');
        }, { once: true });
    }
}

// Initialize event listeners on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add the double-click event to all text-containing elements
    document.querySelectorAll('.container *').forEach((el) => {
        if (el.innerText.trim() !== '' && !el.classList.contains('static')) {
            el.addEventListener('dblclick', makeEditable);
        }
    });

    // Add click listener to the "Save as PNG" button
    document.getElementById('save-as-png').addEventListener('click', () => {
        const container = document.querySelector('.container');

        // Use html2canvas to capture the container div
        html2canvas(container, {
            backgroundColor: null, // Preserve transparency
            useCORS: true, // Handle cross-origin issues for images
            scale: 2, // Higher scale for better resolution
        }).then((canvas) => {
            // Create a download link and trigger it
            const link = document.createElement('a');
            link.download = 'warhammer-unit-stats.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch((error) => {
            console.error('Error capturing the card:', error);
            alert('Failed to save the card. Please try again.');
        });
    });
});
