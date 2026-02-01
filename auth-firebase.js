// Firebase Authentication Manager
// İSG Saha Kontrol - Firebase Auth Integration

class FirebaseAuthManager {
    constructor() {
        this.auth = firebase.auth();
        this.currentUser = null;
    }

    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} User object with role
     */
    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            await this.loadUserClaims();
            return this.currentUser;
        } catch (error) {
            console.error('Login error:', error);
            throw this.getErrorMessage(error);
        }
    }

    /**
     * Login with Google
     * @returns {Promise<Object>} User object with role
     */
    async loginWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const userCredential = await this.auth.signInWithPopup(provider);
            await this.loadUserClaims();
            return this.currentUser;
        } catch (error) {
            console.error('Google login error:', error);
            throw this.getErrorMessage(error);
        }
    }

    /**
     * Load custom claims from Firebase Auth token
     */
    async loadUserClaims() {
        const user = this.auth.currentUser;
        if (user) {
            const idTokenResult = await user.getIdTokenResult();
            this.currentUser = {
                uid: user.uid,
                email: user.email,
                role: idTokenResult.claims.role || 'technical',
                displayName: idTokenResult.claims.displayName || user.email.split('@')[0]
            };
        } else {
            this.currentUser = null;
        }
    }

    /**
     * Logout current user
     */
    async logout() {
        try {
            console.log('🚪 Logging out...');
            await this.auth.signOut();
            this.currentUser = null;
            console.log('👋 Sign out successful, redirecting to login.html');

            // Handle redirection with base path awareness
            const basePath = '/isg-saha-kontrol/';
            if (window.location.pathname.includes(basePath)) {
                window.location.href = basePath + 'login.html';
            } else {
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Çıkış yapılırken bir hata oluştu.');
        }
    }

    /**
     * Listen to authentication state changes
     * @param {Function} callback - Called with user object or null
     */
    onAuthStateChanged(callback) {
        console.log('🔄 Setting up auth state change listener...');
        this.auth.onAuthStateChanged(async (user) => {
            console.log('📡 Auth state changed:', user ? user.email : 'No user');
            if (user) {
                await this.loadUserClaims();
            } else {
                this.currentUser = null;
            }
            callback(this.currentUser);
        });
    }

    /**
     * Check if user is logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    /**
     * Check if current user is admin
     * @returns {boolean}
     */
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

    /**
     * Check if current user is technical team
     * @returns {boolean}
     */
    isTechnical() {
        return this.currentUser?.role === 'technical';
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Get user-friendly error message
     * @param {Error} error 
     * @returns {Error}
     */
    getErrorMessage(error) {
        const errorMessages = {
            'auth/invalid-email': 'Geçersiz email adresi',
            'auth/user-disabled': 'Bu kullanıcı devre dışı bırakılmış',
            'auth/user-not-found': 'Kullanıcı bulunamadı',
            'auth/wrong-password': 'Yanlış şifre',
            'auth/invalid-credential': 'Geçersiz kullanıcı adı veya şifre',
            'auth/too-many-requests': 'Çok fazla başarısız deneme. Lütfen daha sonra tekrar deneyin',
            'auth/network-request-failed': 'İnternet bağlantısı hatası'
        };

        const message = errorMessages[error.code] || 'Giriş yapılamadı. Lütfen tekrar deneyin.';
        return new Error(message);
    }
}

// Export singleton instance (optional, but handled in HTML for now)
// const authManager = new FirebaseAuthManager();
