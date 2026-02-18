// Footer Component for CoffeeNet System
class FooterComponent {
    constructor() {
        this.render();
    }

    render() {
        document.getElementById('footer').innerHTML = `
            <footer class="bg-gray-800 text-white mt-16">
                <div class="container mx-auto px-4 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <!-- About Section -->
                        <div class="col-span-1 md:col-span-2">
                            <h3 class="text-xl font-bold mb-4">کافی‌نت</h3>
                            <p class="text-gray-300 mb-4">
                                سامانه حرفه‌ای کافی‌شری با امکانات کامل برای مدیریت خدمات، سفارش‌ها و مشتریان.
                                ما با استفاده از آخرین فناوری‌ها تلاش می‌کنیم تا بهترین تجربه را برای شما فراهم کنیم.
                            </p>
                            <div class="flex space-x-4 space-x-reverse">
                                <a href="#" class="text-gray-300 hover:text-white">
                                    <i class="fab fa-instagram text-xl"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-white">
                                    <i class="fab fa-telegram text-xl"></i>
                                </a>
                                <a href="#" class="text-gray-300 hover:text-white">
                                    <i class="fab fa-twitter text-xl"></i>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div>
                            <h4 class="text-lg font-semibold mb-4">لینک‌های سریع</h4>
                            <ul class="space-y-2">
                                <li><a href="#" onclick="uiHelper.loadPage('home')" class="text-gray-300 hover:text-white transition-colors">صفحه اصلی</a></li>
                                <li><a href="#" onclick="uiHelper.loadPage('services')" class="text-gray-300 hover:text-white transition-colors">خدمات</a></li>
                                <li><a href="#" onclick="uiHelper.loadPage('pricing')" class="text-gray-300 hover:text-white transition-colors">قیمت‌ها</a></li>
                                <li><a href="#" onclick="uiHelper.loadPage('contact')" class="text-gray-300 hover:text-white transition-colors">تماس با ما</a></li>
                                <li><a href="#" onclick="uiHelper.loadPage('about')" class="text-gray-300 hover:text-white transition-colors">درباره ما</a></li>
                            </ul>
                        </div>

                        <!-- Contact Info -->
                        <div>
                            <h4 class="text-lg font-semibold mb-4">اطلاعات تماس</h4>
                            <ul class="space-y-2 text-gray-300">
                                <li class="flex items-center">
                                    <i class="fas fa-map-marker-alt ml-2"></i>
                                    تهران، خیابان ولیعصر
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-phone ml-2"></i>
                                    ۰۲۱-۱۲۳۴۵۶۷۸
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-envelope ml-2"></i>
                                    info@coffeenet.ir
                                </li>
                                <li class="flex items-center">
                                    <i class="fas fa-clock ml-2"></i>
                                    همه روزه ۷:۰۰ تا ۲۳:۰۰
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; ۱۴۰۲ کافی‌نت. تمامی حقوق محفوظ است.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FooterComponent();
});