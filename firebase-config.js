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

    // Initialize Remote Config
    const remoteConfig = firebase.remoteConfig();

    // Set config settings
    remoteConfig.settings = {
        minimumFetchIntervalMillis: 3600000, // 1 hour
        fetchTimeoutMillis: 60000, // 60 seconds
    };

    // Set default values (fallback if Remote Config fails)
    remoteConfig.defaultConfig = {
        'GEMINI_API_KEY': 'AIzaSyASHO1pu81Otv0iJsjox_tFpmOsOn6fGRY' // Fallback key
    };

    // Fetch and activate Remote Config
    async function initRemoteConfig() {
        try {
            console.log('🔄 Fetching Remote Config...');
            await remoteConfig.fetchAndActivate();
            console.log('✅ Remote Config activated');
            return true;
        } catch (error) {
            console.warn('⚠️ Remote Config fetch failed, using defaults:', error);
            return false;
        }
    }

    // Get config value
    function getConfigValue(key) {
        return remoteConfig.getValue(key).asString();
    }

    // Make available globally
    window.firebaseRemoteConfig = {
        init: initRemoteConfig,
        getValue: getConfigValue,
        config: remoteConfig
    };

    console.log('✅ Firebase Remote Config module loaded');
})();
