# 🎲 Kutu Oyunu AI Asistanı & Masa Hakemi

Haftalık kutu oyunu etkinliklerinde masalara konulan QR kodlar üzerinden çalışan, oyuncuların üye olmadan anında erişebildiği **Yapay Zeka Destekli Kural Hakemi ve Kurulum Asistanı**.

---

## 🚀 Öne Çıkan Özellikler

1. **Sıfır Sürtünme (Zero-Friction Access):**
   - Oyuncular masadaki veya kutudaki QR kodu okuttuğunda doğrudan o oyunun kural ekranına bağlanır (`/game/catan`, `/game/carcassonne`, vb.).
   - Herhangi bir hesap açma veya uygulama yükleme gerektirmez.

2. **Kural Hakemi (AI Sohbet & Sesli Destek):**
   - Masadaki kural anlaşmazlıklarında adım adım resmi kural kitapçığı kararlarını sunar.
   - **Sesli Soru Sorma (🎙️ Türkçe):** Masada kart tutarken tek tıkla sesli soru sorabilme.
   - Sık Sorulan Sorular (Hazır Çipler) ile tek dokunuşla hızlı cevap.

3. **Adım Adım Kurulum Rehberi:**
   - Oyuncu sayısına göre parçaların dağıtımı ve harita hazırlığı.

4. **Tur Akışı (Turn Flow):**
   - "Sıra bendeyken ne yapabilirim?" adımları.

5. **Masaüstü Araçları:**
   - 🎲 **Zar Atıcı & İlk Oyuncu Seçici:** "Oyuna kim başlayacak?" kararsızlığını ve zar ihtiyacını çözer.
   - 🏆 **Skor Tablosu:** Masadaki oyuncuların puanlarını takip etme.

6. **Masa QR Standı & Yazdırılabilir Kartvizit:**
   - Her oyun için tek tıkla **Yazdırılabilir Masa Kartı** (`/print/[id]`). Masaların üstüne koymak için hazır tasarım.

---

## 🛠️ Dahil Edilen Örnek Oyunlar

- **Catan** (Strateji & Ticaret)
- **Carcassonne** (Karo Yerleştirme & Alan Hakimiyeti)
- **Ticket to Ride: Europe** (Tren & Rota Oluşturma)
- **The Resistance: Avalon** (Sosyal Çıkarım & Gizli Roller)
- **Exploding Kittens** (Parti & Rus Ruleti)
- **Splendor** (Motor Kurma & Mücevherat)

---

## ⚙️ Kurulum & Çalıştırma

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Tarayıcınızda açın:
👉 **http://localhost:3000**

### Gemini API Anahtarı (Opsiyonel):
- Sistem **dahili kural motoru** ile API anahtarı olmadan da kural kitapçığı bilgileriyle çalışır.
- Gelişmiş doğal dil ve karmaşık kural durumları için sağ üstteki **"API Anahtarı"** butonuna basarak ücretsiz [Google AI Studio](https://aistudio.google.com/app/apikey) anahtarınızı ekleyebilirsiniz.
