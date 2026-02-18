// Toast Notification Component for CoffeeNet System
class ToastComponent {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toastCounter = 0;
    }

    // Show toast notification
    show(message, type = 'info', duration = 5000) {
        const toastId = `toast-${++this.toastCounter}`;
        
        const typeClasses = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        const toastHtml = `
            <div id="${toastId}" class="toast-item flex items-center p-4 bg-white rounded-lg shadow-lg border-l-4 ${typeClasses[type] || typeClasses.info} text-white max-w-md animate-fade-in">
                <div class="flex-1">${message}</div>
                <button class="close-btn text-white hover:text-gray-200 mr-2" onclick="toast.close('${toastId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', toastHtml);

        const toastElement = document.getElementById(toastId);
        
        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.close(toastId);
            }, duration);
        }

        // Add close event
        const closeBtn = toastElement.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.close(toastId);
            });
        }
    }

    // Close specific toast
    close(toastId) {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.classList.add('animate-fade-out');
            setTimeout(() => {
                toastElement.remove();
            }, 300);
        }
    }

    // Show success toast
    success(message, duration = 5000) {
        this.show(message, 'success', duration);
    }

    // Show error toast
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }

    // Show warning toast
    warning(message, duration = 5000) {
        this.show(message, 'warning', duration);
    }

    // Show info toast
    info(message, duration = 5000) {
        this.show(message, 'info', duration);
    }

    // Clear all toasts
    clear() {
        this.container.innerHTML = '';
    }
}

// Create global instance
const toast = new ToastComponent();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }
    
    .animate-fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }
    
    .toast-item {
        position: relative;
        margin-bottom: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
`;
document.head.appendChild(style);