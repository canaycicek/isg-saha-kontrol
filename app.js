// İSG Saha Kontrol - App Logic

let cameraStream = null;
let currentPhoto = null;
let records = [];

// DOM Elements
const startCameraBtn = document.getElementById('startCameraBtn');
const captureBtn = document.getElementById('captureBtn');
const retakeBtn = document.getElementById('retakeBtn');
const cameraPreview = document.getElementById('cameraPreview');
const photoCanvas = document.getElementById('photoCanvas');
const capturedPhoto = document.getElementById('capturedPhoto');
const formSection = document.getElementById('formSection');
const inspectionForm = document.getElementById('inspectionForm');
const cancelBtn = document.getElementById('cancelBtn');
const recordsList = document.getElementById('recordsList');
const recordCount = document.getElementById('recordCount');
const exportExcelBtn = document.getElementById('exportExcelBtn');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadRecords();
    setupEventListeners();
    setDefaultDates();
});

// Setup Event Listeners
function setupEventListeners() {
    startCameraBtn.addEventListener('click', startCamera);
    captureBtn.addEventListener('click', capturePhoto);
    retakeBtn.addEventListener('click', retakePhoto);
    cancelBtn.addEventListener('click', cancelForm);
    inspectionForm.addEventListener('submit', saveRecord);
    exportExcelBtn.addEventListener('click', exportToExcel);
}

// Set Default Dates
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('kontrolTarihi').value = today;
    document.getElementById('terminTarihi').value = today;
}

// Camera Functions
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: 'environment', // Arka kamera
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
        console.error('Kamera erişim hatası:', error);
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

    // Convert to base64
    currentPhoto = canvas.toDataURL('image/jpeg', 0.8);

    // Show captured photo
    capturedPhoto.src = currentPhoto;
    capturedPhoto.style.display = 'block';
    cameraPreview.style.display = 'none';

    // Stop camera
    stopCamera();

    // Show buttons
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'block';

    // Set auto Madde No
    generateMaddeNo();

    // Show form
    formSection.style.display = 'block';
    formSection.scrollIntoView({ behavior: 'smooth' });
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
    // Find highest existing Madde No
    let maxNo = 0;
    records.forEach(record => {
        const num = parseInt(record.maddeNo);
        if (!isNaN(num) && num > maxNo) {
            maxNo = num;
        }
    });

    // Generate next number
    const nextNo = maxNo + 1;
    const maddeNo = String(nextNo).padStart(3, '0');
    document.getElementById('maddeNo').value = maddeNo;
}

// Save Record
function saveRecord(e) {
    e.preventDefault();

    if (!currentPhoto) {
        alert('Lütfen önce fotoğraf çekin!');
        return;
    }

    const maddeNo = document.getElementById('maddeNo').value.trim();
    const bulgular = document.getElementById('bulgular').value.trim();

    // Check for duplicate Madde No
    const isDuplicate = records.some(record => record.maddeNo === maddeNo);
    const finalBulgular = isDuplicate ? `${bulgular} (Tekrar eden bulgu)` : bulgular;

    const record = {
        id: Date.now(),
        kontrolTarihi: document.getElementById('kontrolTarihi').value,
        maddeNo: maddeNo,
        bulgular: finalBulgular,
        alinmasiGerekenAksiyon: document.getElementById('alinmasiGerekenAksiyon').value.trim(),
        alinanAksiyon: '', // Excel'de doldurulacak
        terminTarihi: document.getElementById('terminTarihi').value,
        durum: document.getElementById('durum').value,
        fotograf: currentPhoto
    };

    records.unshift(record); // Add to beginning
    saveRecords();
    renderRecords();
    resetForm();

    // Show success message
    alert('✅ Kayıt başarıyla eklendi!');
}

// Storage Functions
function saveRecords() {
    try {
        localStorage.setItem('isg_records', JSON.stringify(records));
    } catch (error) {
        console.error('Kayıt hatası:', error);
        alert('Kayıt sırasında hata oluştu. Depolama alanı dolu olabilir.');
    }
}

function loadRecords() {
    try {
        const stored = localStorage.getItem('isg_records');
        records = stored ? JSON.parse(stored) : [];
        renderRecords();
    } catch (error) {
        console.error('Yükleme hatası:', error);
        records = [];
    }
}

// Render Records
function renderRecords() {
    if (records.length === 0) {
        recordsList.innerHTML = '<p class="empty-state">Henüz kayıt yok. Fotoğraf çekerek başlayın.</p>';
        exportExcelBtn.style.display = 'none';
        recordCount.textContent = '0';
        return;
    }

    recordCount.textContent = records.length;
    exportExcelBtn.style.display = 'block';

    recordsList.innerHTML = records.map(record => `
        <div class="record-card">
            <div class="record-header">
                <div class="record-meta">
                    <h3>Madde ${record.maddeNo}</h3>
                    <p>${formatDate(record.kontrolTarihi)}</p>
                </div>
                <div class="record-actions">
                    <button class="btn btn-danger btn-small" onclick="deleteRecord(${record.id})">
                        🗑️ Sil
                    </button>
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
            
            <div class="record-photo" onclick="viewPhoto(${record.id})">
                <img src="${record.fotograf}" alt="Saha Fotoğrafı" loading="lazy">
            </div>
        </div>
    `).join('');
}

// Delete Record
function deleteRecord(id) {
    if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
        records = records.filter(record => record.id !== id);
        saveRecords();
        renderRecords();
        // Update Madde No in form if form is visible
        if (formSection.style.display === 'block') {
            generateMaddeNo();
        }
    }
}

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

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
}

// Excel Export with Images
async function exportToExcel() {
    if (records.length === 0) {
        alert('Dışa aktarılacak kayıt yok!');
        return;
    }

    // Show loading message
    const btn = document.getElementById('exportExcelBtn');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Hazırlanıyor...';
    btn.disabled = true;

    try {
        // Create workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Saha Kontrol');

        // Define columns with new order
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

        // Style header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4A90E2' }
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        // Add data rows
        records.forEach((record, index) => {
            const rowData = {
                no: record.maddeNo,
                kontrolTarihi: formatDate(record.kontrolTarihi),
                terminTarihi: formatDate(record.terminTarihi),
                bulgu: record.bulgular,
                fotograf: '', // Will be replaced with image
                alinmasiGerekenAksiyon: record.alinmasiGerekenAksiyon,
                alinanAksiyon: record.alinanAksiyon,
                durum: record.durum
            };

            const row = worksheet.addRow(rowData);
            row.height = 120; // Height for image
            row.alignment = { vertical: 'top', wrapText: true };

            // Add image to cell
            if (record.fotograf) {
                try {
                    // Convert base64 to buffer
                    const base64Data = record.fotograf.split(',')[1];
                    const imageId = workbook.addImage({
                        base64: base64Data,
                        extension: 'jpeg',
                    });

                    // Add image to worksheet at specific cell
                    // Column E (5th column, index 4) for 'Çekilen Fotoğraf'
                    worksheet.addImage(imageId, {
                        tl: { col: 4, row: index + 1 }, // top-left position (0-indexed for row)
                        br: { col: 5, row: index + 2 }, // bottom-right position
                        editAs: 'oneCell'
                    });
                } catch (err) {
                    console.error('Fotoğraf ekleme hatası:', err);
                    row.getCell('fotograf').value = 'Var';
                }
            }

            // Style Durum column
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

        // Add borders to all cells
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Generate filename with date
        const today = new Date();
        const filename = `ISG_Saha_Kontrol_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}.xlsx`;

        // Write to file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);

        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;

        alert('✅ Excel dosyası başarıyla indirildi!');

    } catch (error) {
        console.error('Excel oluşturma hatası:', error);
        alert('❌ Excel oluşturulurken hata oluştu: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker will be added if needed for offline functionality
    });
}
