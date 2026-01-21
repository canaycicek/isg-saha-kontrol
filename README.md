# İSG Saha Kontrol Sistemi 📋

Mobil uyumlu, sahada kullanılmak üzere tasarlanmış İSG (İş Sağlığı ve Güvenliği) Saha Kontrol Kayıt web uygulaması.

## 🌟 Özellikler

- **📷 Kamera Entegrasyonu**: Mobil cihazlarda doğrudan fotoğraf çekme
- **📝 Otomatik Form Doldurma**: Madde numarası otomatik artan (001, 002, 003...)
- **💾 Offline Çalışma**: İnternet bağlantısı gerektirmez, localStorage ile veri saklama
- **📊 Excel Export**: Fotoğrafları hücre içinde yerleşik olarak Excel'e aktarma
- **📱 PWA Desteği**: Mobil cihazlarda uygulama gibi kullanılabilir
- **🎨 Modern Tasarım**: Koyu tema, parlak renkler, glowing efektleri

## 🚀 Canlı Demo

**[İSG Saha Kontrol - Canlı Uygulama](https://KULLANICI_ADI.github.io/isg-saha-kontrol/)**

## 💻 Kurulum

### Yerel Çalıştırma

1. Depoyu klonlayın:
```bash
git clone https://github.com/KULLANICI_ADI/isg-saha-kontrol.git
cd isg-saha-kontrol
```

2. Basit bir HTTP sunucu başlatın:
```bash
# Python ile
python -m http.server 8000

# veya Node.js ile
npx serve .
```

3. Tarayıcınızda açın:
```
http://localhost:8000
```

## 📱 Kullanım

1. **Kamerayı Aç**: Arka kamera otomatik açılır
2. **Fotoğraf Çek**: Sahadan uygunsuzluğu kaydedin
3. **Form Doldur**:
   - **Madde No**: Otomatik (001, 002...)
   - **Bulgular**: Sadece gözlem (yorum YOK!)
   - **Alınması Gereken Aksiyon**: Gerekli aksiyon
   - **Termin Tarihi**: Son tarih
   - **Durum**: Otomatik "Tamamlanmadı"
4. **Kaydet**: LocalStorage'a kaydedilir
5. **Excel İndir**: Tüm kayıtları fotoğraflarıyla birlikte indirin

## 📋 Excel Format

| No | Kontrol Tarihi | Termin Tarihi | Bulgu | Çekilen Fotoğraf | Alınması Gereken Aksiyon | Alınan Aksiyon | Durum |
|----|----------------|---------------|-------|------------------|------------------------|----------------|-------|
| 001 | 21.01.2026 | 25.01.2026 | ... | 🖼️ | ... | | Tamamlanmadı |

- Fotoğraflar hücre içinde yerleşik olarak görünür
- Durum sütunu renkli (Yeşil/Kırmızı)
- Excel'de düzenlenebilir

## 🛠️ Teknolojiler

- **HTML5**: MediaDevices API (kamera)
- **CSS3**: Glassmorphism, animations
- **JavaScript ES6+**: Async/await, localStorage
- **ExcelJS**: Excel oluşturma ve fotoğraf yerleştirme
- **PWA**: Manifest.json, offline capability

## 📂 Proje Yapısı

```
isg-saha-kontrol/
├── index.html          # Ana sayfa
├── styles.css          # Vibrant dark theme
├── app.js              # Uygulama mantığı
├── manifest.json       # PWA yapılandırması
├── KULLANIM.md         # Detaylı kullanım kılavuzu
└── README.md           # Bu dosya
```

## 🎯 SOP Uyumluluğu

✅ Sadece gözlem (yorum yok)  
✅ Tek fotoğraf (her kayıt için 1 adet)  
✅ Yapılandırılmış veri (Excel uyumlu)  
✅ Tekrar eden bulgu tespiti (otomatik)  
✅ Tarih formatı (GG.AA.YYYY)

## 📄 Lisans

MIT License - Deva Holding için geliştirilmiştir.

## 👨‍💻 Geliştirici

Can Ayçiçek - İSG Uzmanı

## 📞 Destek

Sorularınız için: caycicek@deva.com.tr

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
