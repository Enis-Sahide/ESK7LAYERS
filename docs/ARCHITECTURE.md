# Sistem Mimarisi ve Veri Akışı (System Architecture & Data Flow)

Bu doküman, projelerimiz (`proje1`, `proje1-web` ve `backend`) arasındaki ilişkileri, veritabanı (Supabase) bağlantılarını ve genel sistem mimarisini detaylı bir şekilde açıklar.

## 1. Genel Sistem Mimarisi

Uygulamamızın genel yapısı; Mobil İstemci (Expo), Web İstemcisi (Next.js), Yönetim/Backend (Next.js) ve Veritabanı/BaaS (Supabase) katmanlarından oluşmaktadır.

```mermaid
architecture-beta
    group clients(İstemciler)
    service mobile(Mobil Uygulama<br/>Expo / React Native) in clients
    service web(Web Uygulaması<br/>Next.js) in clients

    group backend_services(Arka Plan Servisleri)
    service backend(Backend / API<br/>Next.js) in backend_services
    service functions(Edge Functions<br/>Supabase Deno) in backend_services

    group database(Veri Katmanı - Supabase)
    service db(PostgreSQL<br/>Veritabanı) in database
    service auth(Supabase Auth<br/>Kimlik Doğrulama) in database
    service storage(Storage<br/>Dosya Depolama) in database

    mobile:R --> L:backend
    web:R --> L:backend
    
    mobile:B --> T:auth
    mobile:B --> T:db
    web:B --> T:auth
    web:B --> T:db
    
    backend:B --> T:db
    functions:L --> R:db
```

*(Not: Mermaid'in klasik flowchart yapısıyla daha detaylı bir veri akışı aşağıda verilmiştir.)*

---

## 2. Detaylı Veri Akışı ve Yetkilendirme (Flowchart)

Kullanıcının uygulamaya girmesiyle başlayıp, veritabanından veri çekilmesine kadar uzanan süreç:

```mermaid
flowchart TD
    %% Katmanlar
    subgraph Frontend [İstemciler / Frontend]
        M[📱 Mobil Uygulama - Expo]
        W[💻 Web Uygulaması - Next.js]
    end

    subgraph Supabase [Supabase (BaaS Katmanı)]
        SA[Supabase Auth<br/>Kimlik Doğrulama]
        SDB[(PostgreSQL Veritabanı)]
        SST[Supabase Storage<br/>Medya & Dosyalar]
        SEF[Edge Functions<br/>Özel Arka Plan İşleri]
    end

    subgraph CustomBackend [Özel Sunucu / API]
        API[Node.js / Next.js Backend<br/>Karmaşık İş Mantığı]
    end

    %% Bağlantılar ve Veri Akışı
    M -->|1. Login / Kayıt| SA
    W -->|1. Login / Kayıt| SA
    
    SA -->|2. JWT Token Döner| M
    SA -->|2. JWT Token Döner| W

    M -->|3. Token ile Veri Sorgusu<br/>Row Level Security| SDB
    W -->|3. Token ile Veri Sorgusu<br/>Row Level Security| SDB

    M -.->|Opsiyonel: Profil Foto Yükleme| SST
    
    %% Backend Etkileşimi
    M -->|Ağır Hesaplamalar / Ödeme İşlemleri| API
    W -->|Ağır Hesaplamalar / Ödeme İşlemleri| API
    
    API <-->|Service Role Key ile<br/>Yetkili Veritabanı Erişimi| SDB
    
    %% Edge Functions
    SDB -.->|Database Webhooks<br/>(Yeni kayıt eklendiğinde tetikle)| SEF
    SEF -.->|Harici API'lara İstek| SDB
```

## 3. Katmanların Görevleri

### İstemciler (Clients)
*   **proje1 (Expo):** Kullanıcıların doğrudan telefonlarına indirdiği ana mobil uygulamamız.
*   **proje1-web (Next.js):** Kullanıcıların tarayıcı üzerinden eriştiği web sürümü.

### Supabase (Veri ve Kimlik Katmanı)
*   **Auth:** Kullanıcıların e-posta, Google veya Apple hesaplarıyla giriş yapmasını sağlar. JWT token oluşturur.
*   **PostgreSQL:** Ana veritabanımız. Tüm tablolar (kullanıcılar, içerikler, ayarlar) burada tutulur. **RLS (Row Level Security)** politikaları ile verilerin sadece yetkili kişilerce görülmesi sağlanır.
*   **Storage:** Kullanıcıların yüklediği görsellerin veya PDF gibi belgelerin tutulduğu yer.
*   **Edge Functions:** Veritabanına yeni bir veri eklendiğinde (örneğin yeni kullanıcı kaydı) otomatik çalışan küçük sunucusuz fonksiyonlar.

### Custom Backend (`backend` Klasörü)
*   Supabase'in doğrudan çözemediği; örneğin **ödeme entegrasyonları (Iyzico/Stripe)**, **üçüncü parti API bağlantıları**, **ağır astrolojik hesaplamalar** veya **yönetici paneli (Admin Dashboard)** işlevleri için kullanılır. Bu sunucu veritabanına "Service Role Key" (tam yetkili gizli anahtar) ile bağlanır.

## 4. Veritabanı Bağlantı Kuralları
1.  **İstemciler (Mobil/Web)**, veritabanına her zaman güvenli anonim anahtar (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) ve kullanıcının oturum açtığında aldığı JWT token ile bağlanmalıdır.
2.  **Backend**, veritabanında tüm işlemleri yapabilmek için gizli yönetici anahtarını (`SUPABASE_SERVICE_ROLE_KEY`) kullanmalıdır. Bu anahtar **asla** istemci tarafında sızdırılmamalıdır.
