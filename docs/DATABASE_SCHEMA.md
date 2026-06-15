# Veritabanı Şeması (Database Schema & ERD)

Bu doküman, sistemin veri yapısını modeller. Her şeyi adım adım ve modüler bir şekilde inşa edeceğimiz için, tabloları amaçlarına göre gruplandırdık.

> **Esneklik Notu:** Pazar yerinde ağırlıklı olarak fiziksel ürün satılacak ancak ileride "danışmanlık/hizmet" satışlarına da olanak tanımak için `product_type` adında bir alan (enum) kullandık.

## 1. Varlık İlişki Diyagramı (ER Diagram)

Aşağıdaki şema, Supabase üzerindeki temel tablolarımızın birbirine nasıl bağlandığını gösterir.

```mermaid
erDiagram
    %% CORE MODÜLÜ (Kimlik)
    USERS ||--o| PROFILES : "1-to-1 (Supabase Auth)"
    PROFILES {
        uuid id PK "users.id ile eşleşir"
        string full_name
        string avatar_url
        string role "ADMIN, CUSTOMER, SELLER"
        timestamp created_at
    }

    %% MARKETPLACE MODÜLÜ
    PROFILES ||--o{ PRODUCTS : "satıcı olarak"
    PRODUCTS {
        uuid id PK
        uuid seller_id FK "Satıcı profili"
        string title
        text description
        float price
        int stock_quantity
        string product_type "PHYSICAL, DIGITAL, SERVICE"
        boolean is_active
        timestamp created_at
    }

    PRODUCTS ||--o{ PRODUCT_IMAGES : "sahiptir"
    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        string image_url
        int sort_order
    }

    %% SİPARİŞ MODÜLÜ
    PROFILES ||--o{ ORDERS : "müşteri olarak"
    ORDERS {
        uuid id PK
        uuid customer_id FK
        float total_amount
        string status "PENDING, PAID, SHIPPED, COMPLETED, CANCELLED"
        string payment_provider "IYZICO, STRIPE vb."
        string payment_id "Dış sistem referansı"
        timestamp created_at
    }

    ORDERS ||--|{ ORDER_ITEMS : "içerir"
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        float unit_price
    }
```

## 2. Tasarım Kararları (Architecture Decisions)

1. **Ödeme Altyapısı (Iyzico Soyutlaması):** Ödeme sağlayıcısı olarak Iyzico düşünülse de, `ORDERS` tablosunda `payment_provider` alanı açtık. İleride cüzdan sistemi veya Stripe eklemek istersek veritabanını yıkıp baştan yapmamıza gerek kalmayacak.
2. **Ürün Çeşitliliği:** `product_type` alanı sayesinde aynı tablo üzerinden hem fiziksel hem de hizmet/danışmanlık satışı yönetilebilecek. Eğer kargo gerekiyorsa sadece `PHYSICAL` ürünler için adres/kargo takibi adımları devreye girecek.
3. **Rol Yönetimi (RBAC):** Bir kullanıcı hem alıcı hem satıcı olabilir. Bunu `PROFILES` tablosundaki `role` alanı ile yöneteceğiz.

---
*Bu şema, backend ve frontend tarafındaki TypeScript arayüzlerinin (`interfaces/types`) temelini oluşturacaktır.*
