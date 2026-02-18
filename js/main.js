// Main Application File for CoffeeNet System
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    console.log('CoffeeNet System Loaded Successfully');
    
    // Load home page by default
    if (!uiHelper.currentPage) {
        uiHelper.loadPage('home');
    }
    
    // Handle navigation links
    document.addEventListener('click', (e) => {
        // Handle dynamic page loading via data attributes
        if (e.target.hasAttribute('data-page')) {
            e.preventDefault();
            const pageName = e.target.getAttribute('data-page');
            uiHelper.loadPage(pageName);
        }
    });
});

// Global helper functions
function formatCurrency(amount) {
    return uiHelper.formatCurrency(amount);
}

function formatDate(dateString) {
    return uiHelper.formatDate(dateString);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    // For now, we'll just reload the home page
    // In a real implementation, you would handle routing properly
    uiHelper.loadPage('home');
});