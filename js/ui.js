// UI Helper Functions for CoffeeNet System
class UIHelper {
    constructor() {
        this.currentPage = '';
    }

    // Load page content dynamically
    async loadPage(pageName) {
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Page ${pageName} not found`);
            }
            
            const content = await response.text();
            document.getElementById('main-content').innerHTML = content;
            this.currentPage = pageName;
            
            // Initialize page-specific scripts if they exist
            if (window[`init${this.toPascalCase(pageName)}Page`]) {
                window[`init${this.toPascalCase(pageName)}Page`]();
            }
        } catch (error) {
            console.error('Error loading page:', error);
            document.getElementById('main-content').innerHTML = `
                <div class="container mx-auto px-4 py-8 text-center">
                    <h2 class="text-2xl font-bold text-red-600 mb-4">صفحه یافت نشد</h2>
                    <p class="text-gray-600">متاسفانه صفحه مورد نظر شما وجود ندارد یا در دسترس نیست.</p>
                </div>
            `;
        }
    }

    // Convert kebab-case or snake_case to PascalCase
    toPascalCase(str) {
        return str.replace(/(^\w|-\w)/g, (match) => {
            return match[1] ? match[1].toUpperCase() : match.toUpperCase();
        });
    }

    // Format currency
    formatCurrency(amount) {
        if (typeof amount === 'number') {
            return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
        }
        return amount + ' تومان';
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Show loading spinner
    showLoading(element) {
        element.innerHTML = `
            <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        `;
    }

    // Hide loading spinner
    hideLoading(element, originalContent) {
        element.innerHTML = originalContent;
    }

    // Validate form fields
    validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.addValidationError(input);
                isValid = false;
            } else {
                this.removeValidationError(input);
            }
        });

        return isValid;
    }

    // Add validation error to input
    addValidationError(input) {
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-300');
        
        // Check if error message already exists
        const existingError = input.parentNode.querySelector('.error-message');
        if (!existingError) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message text-red-500 text-sm mt-1';
            errorMessage.textContent = 'این فیلد الزامی است';
            input.parentNode.appendChild(errorMessage);
        }
    }

    // Remove validation error from input
    removeValidationError(input) {
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
        
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Debounce function
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

    // Scroll to element
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    // Check if element is in viewport
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Create global instance
const uiHelper = new UIHelper();