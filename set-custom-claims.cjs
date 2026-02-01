// Firebase Admin SDK - Set Custom Claims
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Set custom claims for users
async function setUserRoles() {
    try {
        // Set admin role
        await admin.auth().setCustomUserClaims('RTkRb9XmKbY7wSN53lpCKtkqShl1', {
            role: 'admin',
            displayName: 'İSG Admin'
        });
        console.log('✅ Admin role set for: isg@canaycicek.com');

        // Set technical role
        await admin.auth().setCustomUserClaims('ez2U3bk5tZg5q6B8hsgZW7Nw6JJ3', {
            role: 'technical',
            displayName: 'Teknik Ekip'
        });
        console.log('✅ Technical role set for: teknik@canaycicek.com');

        console.log('\n🎉 Custom claims başarıyla atandı!');
        console.log('Kullanıcıların tekrar giriş yapması gerekiyor.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

setUserRoles();
