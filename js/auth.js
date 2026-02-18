// Authentication Module for CoffeeNet System
class AuthManager {
    constructor() {
        this.currentUser = storage.get('current_user');
    }

    // Login with phone number (OTP simulation)
    async loginWithPhone(phoneNumber) {
        // Simulate OTP sending
        const otp = this.generateOTP();
        
        // In a real system, this would send OTP to the phone
        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        
        // For demo purposes, we'll store the OTP temporarily
        storage.set('temp_otp', { phone: phoneNumber, otp: otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 minutes
        
        return { success: true, message: 'کد تأیید به شماره شما ارسال شد' };
    }

    // Verify OTP
    verifyOTP(enteredOTP) {
        const tempData = storage.get('temp_otp');
        
        if (!tempData || tempData.expires < Date.now()) {
            return { success: false, message: 'کد تأیید منقضی شده است' };
        }
        
        if (tempData.otp === enteredOTP) {
            // Find user by phone number
            const users = storage.getAllUsers();
            let user = users.find(u => u.phone === tempData.phone);
            
            // If user doesn't exist, create a new customer account
            if (!user) {
                user = {
                    id: this.generateId(),
                    name: 'مشتری جدید',
                    phone: tempData.phone,
                    email: '',
                    role: 'customer',
                    created_at: new Date().toISOString()
                };
                storage.addUser(user);
            }
            
            // Set current user
            this.currentUser = user;
            storage.set('current_user', user);
            
            // Clear temporary OTP
            storage.remove('temp_otp');
            
            return { success: true, user: user, message: 'ورود موفقیت‌آمیز' };
        }
        
        return { success: false, message: 'کد تأیید اشتباه است' };
    }

    // Login with credentials (for admin panel)
    loginWithCredentials(username, password) {
        const users = storage.getAllUsers();
        const user = users.find(u => (u.email === username || u.phone === username) && u.password === password);
        
        if (user) {
            this.currentUser = user;
            storage.set('current_user', user);
            return { success: true, user: user };
        }
        
        return { success: false, message: 'نام کاربری یا رمز عبور اشتباه است' };
    }

    // Logout
    logout() {
        this.currentUser = null;
        storage.remove('current_user');
        return { success: true, message: 'با موفقیت خارج شدید' };
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Get current user
    getCurrentUser() {
        if (!this.currentUser) {
            this.currentUser = storage.get('current_user');
        }
        return this.currentUser;
    }

    // Check if current user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }

    // Update user profile
    updateProfile(profileData) {
        const user = this.getCurrentUser();
        if (!user) {
            return { success: false, message: 'ابتدا باید وارد شوید' };
        }

        const updatedUser = { ...user, ...profileData, updated_at: new Date().toISOString() };
        storage.updateUser(user.id, updatedUser);

        // Update current user
        this.currentUser = updatedUser;
        storage.set('current_user', updatedUser);

        return { success: true, user: updatedUser };
    }

    // Generate OTP code
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    }

    // Generate random ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Create global instance
const auth = new AuthManager();