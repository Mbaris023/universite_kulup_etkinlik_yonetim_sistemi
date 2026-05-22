# README Dosyasının Amacı ve Önemi

**README Dosyasının Amacı:**
Bir README dosyası, bir yazılım projesinin "vitrini" ve kullanım kılavuzudur. Projeyi ziyaret eden veya kullanmak isteyen kişilere projenin ne olduğunu, ne işe yaradığını, nasıl kurulup çalıştırılacağını ve projeye nasıl katkıda bulunulabileceğini açıklayan temel belgedir.

**Yazılım Projelerinde Neden Önemlidir?**
- **İlk İzlenim:** Projeyi inceleyen diğer geliştiricilerin veya kullanıcıların projeyi hızlıca anlamasını sağlar.
- **Zaman Tasarrufu:** Kurulum ve kullanım adımlarını netleştirerek, projeyi kullanacak kişilerin karşılaştığı sorunları en aza indirir.
- **İletişim ve İşbirliği:** Açık kaynaklı veya takım projelerinde, projeye dahil olacak yeni geliştiriciler için rehber niteliği taşır, projeye adaptasyon sürecini hızlandırır.
- **Dokümantasyon Başlangıcı:** Proje hakkında detaylı teknik bilgilerin ve mimarinin temel özetini sunar.

---

# Yazılım Mühendisliği Üniversite Kulüp Etkinlik Yönetim Sistemi

## Proje Tanımı
Üniversite Kulüp Etkinlik Yönetim Sistemi, üniversitelerdeki öğrenci kulüplerinin ve etkinliklerinin dijital ortamda merkezi olarak yönetilmesini sağlayan modern bir web uygulamasıdır. Sistem; öğrenciler, kulüp başkanları ve sistem yöneticileri (admin) olmak üzere farklı kullanıcı rollerine hizmet eder. Kulüplerin duyurular yapabilmesini, etkinlik düzenleyebilmesini ve öğrencilerin bu etkinliklere kolayca kayıt olabilmesini amaçlamaktadır.

## Özellikler
- **Rol Tabanlı Erişim Kontrolü:** Öğrenci, Kulüp Başkanı ve Admin yetkilendirmeleri.
- **Kulüp Yönetimi:** Kulüp oluşturma, bilgi güncelleme ve kulüp sayfalarını yönetme.
- **Etkinlik Yönetimi:** Yeni etkinlikler oluşturma, etkinlik detaylarını (kota, tarih, konum vb.) belirleme.
- **Öğrenci İşlemleri:** Etkinliklere kayıt olma, favori etkinlikleri belirleme ve kulüplere katılma.
- **Duyuru Sistemi:** Kulüplerin üyelerine ve öğrencilere yönelik duyurular yayınlaması.
- **Bildirimler:** Kullanıcılara sistem içi bildirimler (onay, iptal, yeni etkinlik vb.) gönderilmesi.
- **Modern ve Duyarlı Arayüz:** Tüm cihazlarla uyumlu kullanıcı dostu tasarım.

## Kullanılan Teknolojiler
- **Frontend (Ön Yüz):** Next.js (React), Tailwind CSS, TypeScript
- **Backend (Arka Yüz):** Next.js (Server Actions & API Routes), Node.js
- **Veritabanı:** SQLite (Prisma ORM ile entegre, PostgreSQL'e kolayca geçirilebilir yapıda)
- **Kimlik Doğrulama:** bcryptjs, jose (JWT)
- **Test Araçları:** Vitest, React Testing Library, Jest DOM

## Kurulum Adımları
Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Depoyu Klonlayın:**
   ```bash
   git clone <proje-repo-url>
   cd Yazilim-Muhendisligi-Universite-Kulup-Etkinlik-Yonetim-Sistemi-main
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın:**
   `.env.example` dosyasını `.env` olarak kopyalayın ve içerisindeki veritabanı ile diğer ayarları ortamınıza göre güncelleyin:
   ```bash
   cp .env.example .env
   ```

4. **Veritabanı Kurulumunu Yapın:**
   Prisma ile veritabanı şemasını oluşturun ve başlangıç verilerini yükleyin (seed):
   ```bash
   npm run db:setup
   ```

5. **Uygulamayı Çalıştırın:**
   Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz.

## Kullanım
- **Admin Girişi:** Sisteme genel yönetici olarak giriş yaparak tüm kulüpleri ve sistem ayarlarını denetleyebilirsiniz.
- **Kulüp Başkanı Girişi:** Kulübünüze ait etkinlikleri ve duyuruları yönetmek için kulüp başkanı paneline erişebilirsiniz.
- **Öğrenci Girişi:** Sisteme öğrenci olarak kayıt olup güncel etkinlikleri görüntüleyebilir, kota dolmadan etkinliklere kaydolabilirsiniz.

## Katkı (Contribution)
Bu projeye katkıda bulunmak isterseniz, lütfen aşağıdaki adımları izleyin:
1. Bu depoyu "fork"layın.
2. Yeni bir özellik veya düzeltme için bir dal (branch) oluşturun: `git checkout -b ozellik/yeni-ozellik`
3. Değişikliklerinizi yapın ve kaydedin: `git commit -m "Yeni özellik eklendi"`
4. Dalınızı (branch) kendi deponuza itin: `git push origin ozellik/yeni-ozellik`
5. Ana depoya bir Çekme İsteği (Pull Request) açın.

## Lisans
Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. Daha fazla bilgi için lütfen `LICENSE` dosyasını inceleyiniz.
