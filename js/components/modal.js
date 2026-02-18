// Modal Component for CoffeeNet System
class ModalComponent {
    constructor() {
        this.isOpen = false;
    }

    // Show modal with custom content
    show(options = {}) {
        const {
            title = '',
            content = '',
            size = 'md', // sm, md, lg, xl
            buttons = [],
            onClose = null
        } = options;

        const sizeClasses = {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-lg',
            xl: 'max-w-xl'
        };

        const buttonHtml = buttons.map((btn, index) => `
            <button 
                data-action="${btn.action || 'close'}"
                class="px-4 py-2 rounded-md ${btn.type === 'primary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90 transition-opacity"
            >
                ${btn.text}
            </button>
        `).join('');

        const modalHtml = `
            <div id="modal-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-transform duration-300 scale-95 animate-fade-in-up">
                    <div class="border-b p-4 flex justify-between items-center">
                        <h3 class="text-lg font-semibold">${title}</h3>
                        <button id="modal-close-btn" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-4">
                        ${typeof content === 'string' ? content : ''}
                    </div>
                    ${buttons.length > 0 ? `
                    <div class="border-t p-4 flex justify-end space-x-2 space-x-reverse">
                        ${buttonHtml}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHtml;
        document.getElementById('modal-container').classList.remove('hidden');

        this.isOpen = true;

        // Bind events
        this.bindEvents(onClose);

        // Add animation class after a small delay to trigger the transition
        setTimeout(() => {
            const modal = document.querySelector('#modal-overlay .transform');
            if (modal) {
                modal.classList.add('scale-100');
            }
        }, 10);
    }

    // Hide modal
    hide() {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.classList.add('hidden');
            modalContainer.innerHTML = '';
        }
        this.isOpen = false;
    }

    // Bind modal events
    bindEvents(onClose) {
        // Close button
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
                if (onClose) onClose();
            });
        }

        // Overlay click
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hide();
                    if (onClose) onClose();
                }
            });
        }

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.hide();
                if (onClose) onClose();
            }
        });

        // Button actions
        const actionButtons = document.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                
                if (action === 'close') {
                    this.hide();
                    if (onClose) onClose();
                } else if (typeof window[action] === 'function') {
                    window[action]();
                }
            });
        });
    }

    // Show confirmation modal
    confirm(message, onConfirm, onCancel = null, title = 'تایید عملیات') {
        this.show({
            title: title,
            content: `<p class="text-gray-700">${message}</p>`,
            size: 'sm',
            buttons: [
                { text: 'لغو', type: 'secondary', action: 'cancelModal' },
                { text: 'تایید', type: 'primary', action: 'confirmModal' }
            ],
            onClose: onCancel
        });

        // Attach confirm/cancel functions to window so they can be called from data-action
        window.confirmModal = () => {
            this.hide();
            if (onConfirm) onConfirm();
        };

        window.cancelModal = () => {
            this.hide();
            if (onCancel) onCancel();
        };
    }

    // Show alert modal
    alert(message, title = 'پیام سیستم', onClose = null) {
        this.show({
            title: title,
            content: `<p class="text-gray-700">${message}</p>`,
            size: 'sm',
            buttons: [
                { text: 'تایید', type: 'primary', action: 'close' }
            ],
            onClose: onClose
        });
    }
}

// Create global instance
const modal = new ModalComponent();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.3s ease-out forwards;
    }
`;
document.head.appendChild(style);