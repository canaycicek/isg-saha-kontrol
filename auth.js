// Simple Authentication System
// Kullanıcı Bilgileri (Normal uygulamalarda bu server-side olmalı, demo için client-side)
const USERS = {
    isg: {
        username: 'isg',
        password: 'isg123',
        role: 'admin',
        displayName: 'İSG Admin'
    },
    teknik: {
        username: 'teknik',
        password: 'teknik123',
        role: 'technical',
        displayName: 'Teknik Ekip'
    }
};

// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = this.loadCurrentUser();
    }

    // Load current user from sessionStorage
    loadCurrentUser() {
        const userJson = sessionStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    }

    // Save current user to sessionStorage
    saveCurrentUser(user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Login function
    login(username, password) {
        const user = USERS[username];

        if (!user) {
            throw new Error('Kullanıcı bulunamadı!');
        }

        if (user.password !== password) {
            throw new Error('Şifre yanlış!');
        }

        // Remove password before saving
        const userToSave = {
            username: user.username,
            role: user.role,
            displayName: user.displayName
        };

        this.saveCurrentUser(userToSave);
        return userToSave;
    }

    // Logout function
    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.reload();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Check if user is technical team
    isTechnical() {
        return this.currentUser && this.currentUser.role === 'technical';
    }
}

// Export singleton instance
const authManager = new AuthManager();
