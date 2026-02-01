const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'saha-kontrol-7a1fb.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function cleanupOldRecords() {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        console.log(`🔍 Searching for records older than ${sevenDaysAgo.toISOString()}`);

        // Find old records
        const snapshot = await db.collection('inspections')
            .where('createdAt', '<', sevenDaysAgo)
            .get();

        if (snapshot.empty) {
            console.log('✅ No old records found. All clean!');
            return;
        }

        console.log(`📋 Found ${snapshot.size} old records to delete`);

        // Delete each record and its photo
        const deletePromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();

            // Extract photo path from Storage URL
            if (data.fotograf && data.fotograf.includes('firebasestorage')) {
                try {
                    const url = new URL(data.fotograf);
                    const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);

                    // Delete from Storage
                    await bucket.file(path).delete();
                    console.log(`🗑️ Deleted photo: ${path}`);
                } catch (error) {
                    console.warn(`⚠️ Failed to delete photo for ${doc.id}:`, error.message);
                }
            }

            // Delete Firestore record
            await doc.ref.delete();
            console.log(`✅ Deleted record: ${doc.id}`);
        });

        await Promise.all(deletePromises);

        console.log(`🎉 Cleanup complete! Deleted ${snapshot.size} records.`);

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
}

cleanupOldRecords();
