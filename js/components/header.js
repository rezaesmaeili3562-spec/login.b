// Header Component for CoffeeNet System
class HeaderComponent {
    constructor() {
        this.render();
        this.bindEvents();
    }

    render() {
        const isLoggedIn = storage.get('current_user');
        const isAdmin = isLoggedIn && isLoggedIn.role === 'admin';
        
        document.getElementById('header').innerHTML = `
            <header class="bg-white shadow-md sticky top-0 z-40">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <!-- Logo -->
                        <div class="flex items-center">
                            <h1 class="text-2xl font-bold text-blue-600">کافی‌نت</h1>
                        </div>

                        <!-- Desktop Navigation -->
                        <nav class="hidden md:flex space-x-8 space-x-reverse">
                            <a href="#" onclick="uiHelper.loadPage('home')" class="text-gray-700 hover:text-blue-600 transition-colors">صفحه اصلی</a>
                            <a href="#" onclick="uiHelper.loadPage('services')" class="text-gray-700 hover:text-blue-600 transition-colors">خدمات</a>
                            <a href="#" onclick="uiHelper.loadPage('pricing')" class="text-gray-700 hover:text-blue-600 transition-colors">قیمت‌ها</a>
                            <a href="#" onclick="uiHelper.loadPage('contact')" class="text-gray-700 hover:text-blue-600 transition-colors">تماس با ما</a>
                            <a href="#" onclick="uiHelper.loadPage('about')" class="text-gray-700 hover:text-blue-600 transition-colors">درباره ما</a>
                        </nav>

                        <!-- User Actions -->
                        <div class="flex items-center space-x-4 space-x-reverse">
                            ${isLoggedIn 
                                ? `<div class="relative group">
                                        <button class="flex items-center text-gray-700 hover:text-blue-600">
                                            <i class="fas fa-user-circle text-xl ml-1"></i>
                                            <span>${isLoggedIn.name}</span>
                                            <i class="fas fa-chevron-down mr-2 text-xs"></i>
                                        </button>
                                        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden group-hover:block z-50">
                                            <a href="#" onclick="uiHelper.loadPage('customer/dashboard')" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">داشبورد مشتری</a>
                                            <a href="#" onclick="uiHelper.loadPage('customer/orders')" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">سفارش‌های من</a>
                                            ${isAdmin ? '<a href="#" onclick="uiHelper.loadPage(\'admin/dashboard\')" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">پنل مدیریت</a>' : ''}
                                            <a href="#" onclick="this.logout()" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">خروج</a>
                                        </div>
                                    </div>`
                                : `<a href="#" onclick="uiHelper.loadPage('login')" class="text-gray-700 hover:text-blue-600 flex items-center">
                                        <i class="fas fa-sign-in-alt ml-1"></i>
                                        ورود
                                    </a>`
                            }
                            
                            <!-- Mobile Menu Button -->
                            <button id="mobile-menu-button" class="md:hidden text-gray-700">
                                <i class="fas fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Mobile Navigation (Initially Hidden) -->
                    <div id="mobile-menu" class="hidden md:hidden py-4 border-t">
                        <div class="flex flex-col space-y-4 pb-4">
                            <a href="#" onclick="uiHelper.loadPage('home')" class="text-gray-700 hover:text-blue-600">صفحه اصلی</a>
                            <a href="#" onclick="uiHelper.loadPage('services')" class="text-gray-700 hover:text-blue-600">خدمات</a>
                            <a href="#" onclick="uiHelper.loadPage('pricing')" class="text-gray-700 hover:text-blue-600">قیمت‌ها</a>
                            <a href="#" onclick="uiHelper.loadPage('contact')" class="text-gray-700 hover:text-blue-600">تماس با ما</a>
                            <a href="#" onclick="uiHelper.loadPage('about')" class="text-gray-700 hover:text-blue-600">درباره ما</a>
                            ${isLoggedIn 
                                ? `<div class="pt-4 border-t">
                                    <a href="#" onclick="uiHelper.loadPage('customer/dashboard')" class="block text-gray-700 hover:text-blue-600 py-1">داشبورد مشتری</a>
                                    <a href="#" onclick="uiHelper.loadPage('customer/orders')" class="block text-gray-700 hover:text-blue-600 py-1">سفارش‌های من</a>
                                    ${isAdmin ? '<a href="#" onclick="uiHelper.loadPage(\'admin/dashboard\')" class="block text-gray-700 hover:text-blue-600 py-1">پنل مدیریت</a>' : ''}
                                    <a href="#" onclick="this.logout()" class="block text-gray-700 hover:text-blue-600 py-1">خروج</a>
                                </div>` 
                                : `<a href="#" onclick="uiHelper.loadPage('login')" class="text-gray-700 hover:text-blue-600 flex items-center">
                                    <i class="fas fa-sign-in-alt ml-1"></i>
                                    ورود
                                </a>`
                            }
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    bindEvents() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    logout() {
        storage.remove('current_user');
        this.render(); // Re-render header after logout
        uiHelper.loadPage('home');
        toast.show('با موفقیت خارج شدید', 'success');
    }
}

// Initialize header when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeaderComponent();
});