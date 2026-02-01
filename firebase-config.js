// Firebase Configuration and Initialization
// This file handles Firebase initialization and Remote Config setup

(function () {
    'use strict';

    // Firebase Configuration
    const firebaseConfig = {
        apiKey: "AIzaSyAjNnt7e39kI6loOoTyb9uORR6CqUBqznc",
        authDomain: "saha-kontrol-7a1fb.firebaseapp.com",
        projectId: "saha-kontrol-7a1fb",
        storageBucket: "saha-kontrol-7a1fb.firebasestorage.app",
        messagingSenderId: "347469985700",
        appId: "1:347469985700:web:4cf0476eaefd0a2ea63331"
    };

    // Initialize Firebase (if not already initialized)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized');
    }

    // Make available globally
    window.firebaseApp = firebase.app();

    console.log('✅ Firebase initialized');
})();
