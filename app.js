// İSG Saha Kontrol - App Logic with Firebase Firestore

// Get Firebase and authManager from global scope (initialized in index.html)
const db = firebase.firestore();
const storage = window.storage;

// ===== FIREBASE STORAGE HELPERS =====

// Convert base64 data URL to Blob
function base64ToBlob(dataURL) {
    const parts = dataURL.split(',');
    const contentType = parts[0].match(/:(.*?);/)[1];
    const raw = atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

// Upload photo to Firebase Storage
async function uploadPhotoToStorage(photoBlob) {
    const user = window.authManager.getCurrentUser();

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `inspections/${user.uid}/${timestamp}_${random}.jpg`;

    // Create reference
    const storageRef = storage.ref(filename);

    // Upload with metadata
    const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
            uploadedBy: user.email,
            uploadedAt: new Date().toISOString()
        }
    };

    console.log('📤 Uploading photo to Storage:', filename);

    // Upload
    const snapshot = await storageRef.put(photoBlob, metadata);

    // Get download URL
    const downloadURL = await snapshot.ref.getDownloadURL();

    console.log('✅ Photo uploaded, URL:', downloadURL);

    return downloadURL;
}

// DOM Elements (Selected lazily or verified)
const getEl = (id) => document.getElementById(id);

// Global variables for DOM Elements
let startCameraBtn, captureBtn, retakeBtn, cameraPreview, photoCanvas, capturedPhoto,
    formSection, cameraSection, inspectionForm, cancelBtn, recordsList, recordCount,
    exportExcelBtn, logoutBtn;

// Initialize DOM Elements
function initDOMElements() {
    startCameraBtn = getEl('startCameraBtn');
    captureBtn = getEl('captureBtn');
    retakeBtn = getEl('retakeBtn');
    cameraPreview = getEl('cameraPreview');
    photoCanvas = getEl('photoCanvas');
    capturedPhoto = getEl('capturedPhoto');
    formSection = getEl('formSection');
    cameraSection = getEl('cameraSection');
    inspectionForm = getEl('inspectionForm');
    cancelBtn = getEl('cancelBtn');
    recordsList = getEl('recordsList');
    recordCount = getEl('recordCount');
    exportExcelBtn = getEl('exportExcelBtn');
    logoutBtn = getEl('logoutBtn');
}



// Global App State
let cameraStream = null;
let currentPhoto = null;
let records = [];
let unsubscribeRecords = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    setDefaultDates();
});

// ===== FIREBASE AUTH STATE LISTENER =====
// Check if user is logged in on page load
const startAuthListener = () => {
    const am = window.authManager;
    if (!am) {
        console.warn('⚠️ authManager not ready, retrying auth listener...');
        setTimeout(startAuthListener, 100);
        return;
    }

    am.onAuthStateChanged((user) => {
        console.log('📬 App auth listener received state:', user ? user.email : 'No user');
        if (!user) {
            console.log('🚫 No user session, redirecting to login.html');
            const basePath = '/isg-saha-kontrol/';
            const target = window.location.pathname.includes(basePath) ? basePath + 'login.html' : 'login.html';
            window.location.href = target;
            return;
        }

        // User is logged in - initialize app
        console.log('✅ User logged in:', user.email, '| Role:', user.role);

        // Initialize DOM elements now that we are on the main page
        initDOMElements();

        // Display user info
        displayUserInfo();

        // Setup UI based on role
        setupRoleBasedUI();

        // Load records from Firestore
        loadRecordsRealtime();

        // Setup event listeners
        setupEventListeners();
    });
};

startAuthListener();


// Display user information in header
function displayUserInfo() {
    const user = window.authManager.getCurrentUser();
    document.getElementById('userName').textContent = user.displayName;
    const roleSpan = document.getElementById('userRole');
    roleSpan.textContent = user.role === 'admin' ? 'Admin' : 'Teknik Ekip';
    roleSpan.classList.add(user.role);
}

// Setup UI based on user role
function setupRoleBasedUI() {
    const isAdmin = window.authManager.isAdmin();
    const user = window.authManager.getCurrentUser();

    console.log('Setting up role-based UI for:', user);
    console.log('Is admin?', isAdmin);
    console.log('Camera section element:', cameraSection);

    if (isAdmin) {
        // Admin sees everything
        if (cameraSection) {
            cameraSection.style.display = 'block';
            console.log('✅ Camera section shown for admin');
        } else {
            console.error('❌ Camera section element not found!');
        }
    } else {
        // Technical team cannot add new records
        if (cameraSection) {
            cameraSection.style.display = 'none';
            console.log('🚫 Camera section hidden for technical team');
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    console.log('👂 Setting up event listeners...');

    if (authManager.isAdmin()) {
        console.log('📸 Admin detected, enabling camera listeners');
        getEl('startCameraBtn')?.addEventListener('click', startCamera);
        getEl('captureBtn')?.addEventListener('click', capturePhoto);
        getEl('retakeBtn')?.addEventListener('click', retakePhoto);
        getEl('cancelBtn')?.addEventListener('click', cancelForm);
        getEl('inspectionForm')?.addEventListener('submit', saveRecord);
    }

    getEl('exportExcelBtn')?.addEventListener('click', exportToExcel);

    // Logout button (attached early for safety)
    const logoutBtn = getEl('logoutBtn');
    if (logoutBtn) {
        // Remove existing listeners by cloning (simple way to reset)
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);

        newLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Logout button clicked (safe mode)');
            if (window.authManager) {
                window.authManager.logout();
            } else {
                // Fallback if authManager not ready
                firebase.auth().signOut().then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
        console.log('✅ Logout button listener attached early');
    }
}

// Global App State
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('kontrolTarihi').value = today;
    document.getElementById('terminTarihi').value = today;
}

// Load records from Firestore with real-time updates
function loadRecordsRealtime() {
    // Unsubscribe from previous listener if exists
    if (unsubscribeRecords) {
        unsubscribeRecords();
    }

    // Listen to real-time updates
    unsubscribeRecords = db.collection('inspections')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            records = [];
            snapshot.forEach((doc) => {
                records.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            renderRecords();
        }, (error) => {
            console.error('Firestore error:', error);
            // Fallback to local storage if Firestore fails
            loadRecordsFromLocalStorage();
        });
}

// Fallback: Load from localStorage
function loadRecordsFromLocalStorage() {
    try {
        const stored = localStorage.getItem('isg_records');
        records = stored ? JSON.parse(stored) : [];
        renderRecords();
    } catch (error) {
        console.error('Local storage load error:', error);
        records = [];
        renderRecords();
    }
}

// Camera Functions
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };

        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraPreview.srcObject = cameraStream;
        cameraPreview.style.display = 'block';

        startCameraBtn.style.display = 'none';
        captureBtn.style.display = 'block';

    } catch (error) {
        console.error('Camera access error:', error);
        alert('Kameraya erişilemiyor. Lütfen kamera izinlerini kontrol edin.');
    }
}

function capturePhoto() {
    const canvas = photoCanvas;
    const video = cameraPreview;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    currentPhoto = canvas.toDataURL('image/jpeg', 0.8);

    capturedPhoto.src = currentPhoto;
    capturedPhoto.style.display = 'block';
    cameraPreview.style.display = 'none';

    stopCamera();

    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'block';

    generateMaddeNo();

    // Show form first
    formSection.style.display = 'block';
    formSection.scrollIntoView({ behavior: 'smooth' });
}


// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#2ecc71' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function retakePhoto() {
    currentPhoto = null;
    capturedPhoto.style.display = 'none';
    retakeBtn.style.display = 'none';
    startCameraBtn.style.display = 'block';
    formSection.style.display = 'none';
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

// Form Functions
function cancelForm() {
    if (confirm('Formu iptal etmek istediğinizden emin misiniz?')) {
        resetForm();
    }
}

function resetForm() {
    inspectionForm.reset();
    currentPhoto = null;
    capturedPhoto.style.display = 'none';
    retakeBtn.style.display = 'none';
    startCameraBtn.style.display = 'block';
    formSection.style.display = 'none';
    setDefaultDates();
    document.getElementById('maddeNo').value = '';
}

// Generate Auto Madde No
function generateMaddeNo() {
    let maxNo = 0;
    records.forEach(record => {
        const num = parseInt(record.maddeNo);
        if (!isNaN(num) && num > maxNo) {
            maxNo = num;
        }
    });

    const nextNo = maxNo + 1;
    const maddeNo = String(nextNo).padStart(3, '0');
    document.getElementById('maddeNo').value = maddeNo;
}

// Save Record to Firestore
async function saveRecord(e) {
    e.preventDefault();

    if (!currentPhoto) {
        alert('Lütfen önce fotoğraf çekin!');
        return;
    }

    const maddeNo = document.getElementById('maddeNo').value.trim();
    const bulgular = document.getElementById('bulgular').value.trim();

    // Check for duplicate
    const isDuplicate = records.some(record => record.maddeNo === maddeNo);
    const finalBulgular = isDuplicate ? `${bulgular} (Tekrar eden bulgu)` : bulgular;

    const user = window.authManager.getCurrentUser();

    // Get submit button for loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
        // Show loading indicator
        submitBtn.disabled = true;
        submitBtn.textContent = '📤 Fotoğraf yükleniyor...';

        // Convert and upload photo to Storage
        console.log('🔄 Converting photo to Blob...');
        const photoBlob = base64ToBlob(currentPhoto);

        console.log('📤 Uploading to Firebase Storage...');
        const photoURL = await uploadPhotoToStorage(photoBlob);

        console.log('✅ Photo URL received:', photoURL);

        // Update loading text
        submitBtn.textContent = '💾 Kayıt kaydediliyor...';

        // Prepare record with photo URL
        const record = {
            kontrolTarihi: document.getElementById('kontrolTarihi').value,
            maddeNo: maddeNo,
            bulgular: finalBulgular,
            alinmasiGerekenAksiyon: document.getElementById('alinmasiGerekenAksiyon').value.trim(),
            alinanAksiyon: '',
            terminTarihi: document.getElementById('terminTarihi').value,
            durum: document.getElementById('durum').value,
            fotograf: photoURL,  // ✅ Storage URL instead of base64
            createdBy: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: user.email
        };

        // Save to Firestore
        await db.collection('inspections').add(record);

        // Also save to localStorage as backup (with URL, not base64)
        localStorage.setItem('isg_records', JSON.stringify([record, ...records]));

        resetForm();
        alert('✅ Kayıt başarıyla eklendi!');

    } catch (error) {
        console.error('❌ Save error:', error);
        alert('❌ Kayıt eklenirken hata oluştu: ' + error.message);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Render Records
function renderRecords() {
    // Defensive checks for DOM elements
    if (!recordsList) {
        console.warn('⚠️ recordsList element not found, retrying...');
        setTimeout(renderRecords, 100);
        return;
    }

    if (records.length === 0) {
        recordsList.innerHTML = '<p class="empty-state">Henüz kayıt yok. Fotoğraf çekerek başlayın.</p>';
        if (exportExcelBtn) exportExcelBtn.style.display = 'none';
        if (recordCount) recordCount.textContent = '0';
        return;
    }

    if (recordCount) recordCount.textContent = records.length;
    if (exportExcelBtn) exportExcelBtn.style.display = 'block';

    const isAdmin = window.authManager.isAdmin();
    const user = window.authManager.getCurrentUser();

    recordsList.innerHTML = records.map(record => {
        // Determine if photo is base64 (old) or Storage URL (new)
        const photoSrc = record.fotograf || '';
        const isBase64 = photoSrc.startsWith('data:image');

        return `
        <div class="record-card">
            <div class="record-header">
                <div class="record-meta">
                    <h3>Madde ${record.maddeNo}</h3>
                    <p>${formatDate(record.kontrolTarihi)}</p>
                </div>
                <div class="record-actions">
                    ${isAdmin ? `
                        <button class="btn btn-danger btn-small" onclick="deleteRecord('${record.id}')">
                            🗑️ Sil
                        </button>
                    ` : ''}
                    ${!isAdmin ? `
                        <select class="status-select" onchange="updateStatus('${record.id}', this.value)">
                            <option value="Tamamlanmadı" ${record.durum === 'Tamamlanmadı' ? 'selected' : ''}>Tamamlanmadı</option>
                            <option value="Tamamlandı" ${record.durum === 'Tamamlandı' ? 'selected' : ''}>Tamamlandı</option>
                        </select>
                    ` : ''}
                </div>
            </div>
            
            <div class="record-content">
                <div class="record-field">
                    <label>Bulgular</label>
                    <p>${record.bulgular}</p>
                </div>
                
                <div class="record-field">
                    <label>Alınması Gereken Aksiyon</label>
                    <p>${record.alinmasiGerekenAksiyon}</p>
                </div>
                
                <div class="record-field">
                    <label>Termin Tarihi</label>
                    <p>${formatDate(record.terminTarihi)}</p>
                </div>
                
                <div class="record-field">
                    <label>Durum</label>
                    <p><span class="status-badge ${record.durum === 'Tamamlandı' ? 'status-tamamlandi' : 'status-tamamlanmadi'}">
                        ${record.durum}
                    </span></p>
                </div>
            </div>
            
            <div class="record-photo" onclick="viewPhoto('${record.id}')">
                ${photoSrc ? `
                    <img src="${photoSrc}" alt="Saha Fotoğrafı" loading="lazy">
                    ${isBase64 ? '<span class="photo-badge">💾 Yerel</span>' : '<span class="photo-badge">☁️ Cloud</span>'}
                ` : '<p>Fotoğraf yok</p>'}
            </div>
        </div>
        `;
    }).join('');
}

// Update status (for technical team)
async function updateStatus(recordId, newStatus) {
    const user = window.authManager.getCurrentUser();

    try {
        await db.collection('inspections').doc(recordId).update({
            durum: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: user.email
        });

        alert('✅ Durum güncellendi!');
    } catch (error) {
        console.error('Update error:', error);
        alert('❌ Güncelleme hatası: ' + error.message);
    }
}

// Delete Record (admin only)
async function deleteRecord(id) {
    if (!window.authManager.isAdmin()) {
        alert('❌ Bu işlem için yetkiniz yok!');
        return;
    }

    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        try {
            await db.collection('inspections').doc(id).delete();
            alert('✅ Kayıt silindi!');
        } catch (error) {
            console.error('Delete error:', error);
            alert('❌ Silme hatası: ' + error.message);
        }
    }
}

// Make functions globally accessible for inline onclick handlers
window.deleteRecord = deleteRecord;
window.updateStatus = updateStatus;
window.viewPhoto = viewPhoto;


// View Photo
function viewPhoto(id) {
    const record = records.find(r => r.id === id);
    if (record) {
        const win = window.open('', '_blank');
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Fotoğraf - Madde ${record.maddeNo}</title>
                <style>
                    body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                </style>
            </head>
            <body>
                <img src="${record.fotograf}" alt="Saha Fotoğrafı">
            </body>
            </html>
        `);
    }
}

// Date Formatting
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
}

// Excel Export
async function exportToExcel() {
    if (records.length === 0) {
        alert('Dışa aktarılacak kayıt yok!');
        return;
    }

    const btn = document.getElementById('exportExcelBtn');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Hazırlanıyor...';
    btn.disabled = true;

    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Saha Kontrol');

        worksheet.columns = [
            { header: 'No', key: 'no', width: 10 },
            { header: 'Kontrol Tarihi', key: 'kontrolTarihi', width: 15 },
            { header: 'Termin Tarihi', key: 'terminTarihi', width: 15 },
            { header: 'Bulgu', key: 'bulgu', width: 50 },
            { header: 'Çekilen Fotoğraf', key: 'fotograf', width: 25 },
            { header: 'Alınması Gereken Aksiyon', key: 'alinmasiGerekenAksiyon', width: 40 },
            { header: 'Alınan Aksiyon', key: 'alinanAksiyon', width: 40 },
            { header: 'Durum', key: 'durum', width: 15 }
        ];

        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4A90E2' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        records.forEach((record, index) => {
            const rowData = {
                no: record.maddeNo,
                kontrolTarihi: formatDate(record.kontrolTarihi),
                terminTarihi: formatDate(record.terminTarihi),
                bulgu: record.bulgular,
                fotograf: '',
                alinmasiGerekenAksiyon: record.alinmasiGerekenAksiyon,
                alinanAksiyon: record.alinanAksiyon,
                durum: record.durum
            };

            const row = worksheet.addRow(rowData);
            row.height = 120;
            row.alignment = { vertical: 'top', wrapText: true };

            if (record.fotograf) {
                try {
                    const base64Data = record.fotograf.split(',')[1];
                    const imageId = workbook.addImage({
                        base64: base64Data,
                        extension: 'jpeg',
                    });

                    worksheet.addImage(imageId, {
                        tl: { col: 4, row: index + 1 },
                        br: { col: 5, row: index + 2 },
                        editAs: 'oneCell'
                    });
                } catch (err) {
                    console.error('Photo add error:', err);
                    row.getCell('fotograf').value = 'Var';
                }
            }

            const durumCell = row.getCell('durum');
            if (record.durum === 'Tamamlandı') {
                durumCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2ECC71' }
                };
                durumCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            } else {
                durumCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE74C3C' }
                };
                durumCell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
            }
            durumCell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        const today = new Date();
        const filename = `ISG_Saha_Kontrol_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`;

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

        btn.textContent = originalText;
        btn.disabled = false;

        alert('✅ Excel dosyası başarıyla indirildi!');

    } catch (error) {
        console.error('Excel creation error:', error);
        alert('❌ Excel oluşturulurken hata oluştu: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (unsubscribeRecords) {
        unsubscribeRecords();
    }
});
