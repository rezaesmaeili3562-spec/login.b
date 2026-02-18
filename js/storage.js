// Storage Manager for CoffeeNet System
class StorageManager {
    constructor() {
        this.prefix = 'coffeenet_';
    }

    // Get item from localStorage
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    }

    // Set item in localStorage
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item in storage:', error);
            return false;
        }
    }

    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing item from storage:', error);
            return false;
        }
    }

    // Clear all items with prefix
    clear() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Get all orders
    getAllOrders() {
        return this.get('orders') || [];
    }

    // Add new order
    addOrder(order) {
        const orders = this.getAllOrders();
        orders.push(order);
        return this.set('orders', orders);
    }

    // Update existing order
    updateOrder(orderId, updatedOrder) {
        const orders = this.getAllOrders();
        const index = orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            orders[index] = { ...orders[index], ...updatedOrder };
            return this.set('orders', orders);
        }
        return false;
    }

    // Get all services
    getAllServices() {
        return this.get('services') || [];
    }

    // Get all categories
    getAllCategories() {
        return this.get('categories') || [];
    }

    // Get all users
    getAllUsers() {
        return this.get('users') || [];
    }

    // Add new user
    addUser(user) {
        const users = this.getAllUsers();
        users.push(user);
        return this.set('users', users);
    }

    // Update user
    updateUser(userId, updatedUser) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            return this.set('users', users);
        }
        return false;
    }

    // Initialize mock data if not exists
    initializeMockData() {
        if (!this.get('services')) {
            this.set('services', [
                {
                    id: 1,
                    title: 'قهوه تخصصی',
                    description: 'قهوه با کیفیت بالا از دانه‌های انتخابی',
                    price: 25000,
                    category_id: 1,
                    image: '',
                    options: [
                        { id: 1, name: 'سایز', values: ['کوچک', 'متوسط', 'بزرگ'], prices: [0, 5000, 10000] },
                        { id: 2, name: 'شیر', values: ['بدون شیر', 'نیمه چرب', 'کامل'], prices: [0, 3000, 5000] }
                    ]
                },
                {
                    id: 2,
                    title: 'چای انواع',
                    description: 'چای‌های مختلف با کیفیت',
                    price: 15000,
                    category_id: 2,
                    image: '',
                    options: [
                        { id: 1, name: 'نوع چای', values: ['سبز', 'سیاه', 'نوشابه‌ای'], prices: [0, 2000, 3000] }
                    ]
                }
            ]);
        }

        if (!this.get('categories')) {
            this.set('categories', [
                { id: 1, name: 'قهوه' },
                { id: 2, name: 'چای' },
                { id: 3, name: 'نوشیدنی‌های سرد' },
                { id: 4, name: 'دسرها' }
            ]);
        }

        if (!this.get('orders')) {
            this.set('orders', []);
        }

        if (!this.get('users')) {
            this.set('users', []);
        }

        if (!this.get('payments')) {
            this.set('payments', []);
        }
    }
}

// Create global instance
const storage = new StorageManager();
storage.initializeMockData();