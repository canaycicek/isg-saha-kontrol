# İSG Saha Kontrol Uygulaması - Brave Tarayıcıda Açma Talimatları

## 🚀 Hızlı Başlangıç

### Adım 1: Sunucu Çalışıyor
✅ Yerel sunucu çalışıyor durumda (Port 8000)

### Adım 2: Brave Tarayıcıda Açın

1. **Brave tarayıcınızı açın**

2. **Adres çubuğuna şunu yazın:**
   ```
   localhost:8000
   ```

3. **Enter'a basın**

### Adım 3: Mobil Görünümü Test Etme (Opsiyonel)

Brave tarayıcıda mobil görünümü test etmek için:
1. `F12` tuşuna basın (Geliştirici Araçları)
2. `Ctrl + Shift + M` tuşlarına basın (Responsive Mode)
3. Üstten bir telefon modeli seçin (örn: iPhone 12)

---

## 📱 Mobil Cihazda Kullanım

### Aynı WiFi Ağındaysanız:

1. Bilgisayarınızın IP adresini öğrenin:
   - Windows: `ipconfig` komutunu çalıştırın
   - IPv4 Address'i bulun (örn: 192.168.1.100)

2. Telefonunuzun Brave tarayıcısında şunu yazın:
   ```
   http://[IP-ADRESI]:8000
   ```
   Örnek: `http://192.168.1.100:8000`

3. Kamera erişimi için izin verin

---

## ⚠️ Önemli Notlar

- **Kamera İzni**: İlk açılışta Brave, kamera erişimi için izin isteyecektir - "İzin Ver" seçeneğini seçin
- **HTTPS Gerekliliği**: Bazı tarayıcılar kamera erişimi için HTTPS gerektirebilir. localhost'ta genellikle sorun çıkmaz
- **Offline Çalışma**: İnternet bağlantısı gerekmez, tüm veriler cihazınızda saklanır

---

## 🎯 Kullanım Akışı

1. **📷 Kamerayı Aç** butonuna tıklayın
2. Arka kamera otomatik açılacaktır
3. **📸 Fotoğraf Çek** ile sahadan fotoğraf çekin
4. Form alanlarını doldurun:
   - Kontrol Tarihi (otomatik bugün)
   - Madde No
   - Bulgular (sadece gözlem, yorum YOK)
   - Alınması Gereken Aksiyon
   - Alınan Aksiyon (varsa)
   - Termin Tarihi
   - Durum (Tamamlandı/Tamamlanmadı)
5. **✅ Kaydet** ile kaydedin
6. Tüm kayıtlarınızı listede görün
7. **📥 Excel İndir** ile SOP uyumlu Excel dosyası alın

---

## 🛠️ Sunucuyu Durdurmak İçin

Terminal penceresinde `Ctrl + C` tuşlarına basın
