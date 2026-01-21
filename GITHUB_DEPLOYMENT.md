# GitHub'a Yükleme ve Yayınlama Rehberi 🚀

## 📝 Adım 1: GitHub Repository Oluşturma

1. **GitHub'da oturum açın**: https://github.com
2. **New Repository** butonuna tıklayın (sağ üst köşe, + işareti)
3. **Repository ayarları:**
   - Repository name: `isg-saha-kontrol`
   - Description: `İSG Saha Kontrol Kayıt Sistemi`
   - ✅ Public (herkes görebilsin)
   - ❌ Initialize with README (zaten var)
4. **Create repository** butonuna tıklayın

---

## 💻 Adım 2: Projeyi Git'e Ekle

Terminal/PowerShell'i projenin klasöründe açın ve şu komutları çalıştırın:

```bash
# Git başlat
git init

# Dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: İSG Saha Kontrol Sistemi"

# GitHub repository'yi bağla (GITHUB_KULLANICI_ADINIZ yerine kendi kullanıcı adınızı yazın)
git remote add origin https://github.com/GITHUB_KULLANICI_ADINIZ/isg-saha-kontrol.git

# Ana branch adını main yap
git branch -M main

# GitHub'a yükle
git push -u origin main
```

---

## 🌐 Adım 3: GitHub Pages ile Yayınlama

### Otomatik Yöntem (Önerilen)

1. **GitHub repository sayfanıza gidin**
2. **Settings** (Ayarlar) sekmesine tıklayın
3. Sol menüden **Pages** seçin
4. **Source** kısmında:
   - Branch: `main`
   - Folder: `/ (root)`
5. **Save** butonuna tıklayın
6. **Birkaç dakika bekleyin** (yayına çıkması 1-2 dakika sürer)
7. **Sayfa yenilendiğinde** üstte şu mesajı göreceksiniz:
   ```
   ✅ Your site is live at https://KULLANICI_ADI.github.io/isg-saha-kontrol/
   ```

### Manuel Kontrol

Aşağıdaki komutu çalıştırarak deployment durumunu kontrol edebilirsiniz:

```bash
# GitHub Actions durumunu kontrol et
git log --oneline -1
```

---

## ✅ Adım 4: Test Etme

1. **Tarayıcınızda açın**: `https://KULLANICI_ADI.github.io/isg-saha-kontrol/`
2. **Mobil test için**: Telefonunuzdan aynı linke girin
3. **Kamera izni verin** ve test edin

---

## 📱 Adım 5: PWA Kurulumu (Opsiyonel)

Telefonunuzda:
1. **Brave/Chrome** ile siteyi açın
2. Menü → **Ana Ekrana Ekle** / **Install App**
3. Artık bir uygulama gibi kullanabilirsiniz!

---

## 🔄 Güncellemeler İçin

Projede değişiklik yaptığınızda:

```bash
# Değişiklikleri göster
git status

# Dosyaları ekle
git add .

# Commit
git commit -m "Açıklama: Ne değiştirildi"

# GitHub'a gönder
git push

# 1-2 dakika bekleyin, otomatik yayınlanır!
```

---

## 🛠️ Sorun Giderme

### "Permission denied" hatası

```bash
# GitHub credential helper ayarla
git config --global credential.helper wincred

# Tekrar dene
git push -u origin main
```

### "Repository not found" hatası

```bash
# Remote URL'i kontrol et
git remote -v

# Yanlışsa düzelt
git remote set-url origin https://github.com/KULLANICI_ADI/isg-saha-kontrol.git
```

### GitHub Pages çalışmıyor

1. Repository'nin **Public** olduğundan emin olun
2. **Settings → Pages** kısmında `main` branch seçili mi kontrol edin
3. **Actions** sekmesinde deployment durumunu kontrol edin
4. 5-10 dakika bekleyin, bazen gecikme olabiliyor

---

## 📋 Checklist

- [  ] GitHub repository oluşturuldu
- [  ] Proje Git'e commit edildi
- [  ] GitHub'a push yapıldı
- [  ] GitHub Pages aktif edildi
- [  ] Site yayında: `https://KULLANICI_ADI.github.io/isg-saha-kontrol/`
- [  ] Mobil test yapıldı
- [  ] PWA kurulumu denendi

---

## 🎯 Sonuç

Artık uygulamanız canlıda! 🎉

**Canlı Link:** `https://KULLANICI_ADI.github.io/isg-saha-kontrol/`

Bu linki:
- ✅ Mobil cihazlarınızda kullanabilirsiniz
- ✅ Ekip arkadaşlarınızla paylaşabilirsiniz
- ✅ Sahada offline kullanabilirsiniz (ilk açılıştan sonra)

---

## 💡 Pro İpuçları

1. **Custom Domain**: Kendi domain'inizi bağlayabilirsiniz (örn: isg.deva.com.tr)
2. **Analytics**: Google Analytics ekleyebilirsiniz
3. **HTTPS**: GitHub Pages otomatik HTTPS sağlar (güvenli)
4. **Backup**: Tüm veriler localStorage'da, export ile yedekleyebilirsiniz

---

**Başarılar!** 🚀
