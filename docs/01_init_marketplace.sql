-- 1. Tabloların Oluşturulması
-- Profiles tablosu mevcut auth.users tablosu ile otomatik bağlanmalıdır
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'CUSTOMER', -- 'ADMIN', 'CUSTOMER', 'SELLER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Tablosu
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    product_type TEXT DEFAULT 'PHYSICAL', -- 'PHYSICAL', 'DIGITAL', 'SERVICE'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Images Tablosu
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Orders Tablosu
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'
    payment_provider TEXT DEFAULT 'IYZICO', -- İleride STRIPE vb eklenebilir
    payment_id TEXT, -- Iyzico'dan dönen sipariş/işlem numarası
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Tablosu
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL
);

-- 2. Güvenlik ve Row Level Security (RLS) Politikaları
-- Tüm tablolarda RLS'yi aktif ediyoruz
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiller: Herkes kendi profilini görebilir ve güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini görebilir" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Satıcılar herkes tarafından görülebilir" ON public.profiles FOR SELECT USING (role = 'SELLER');

-- Ürünler: Aktif ürünleri herkes görebilir, sadece satıcısı güncelleyebilir
CREATE POLICY "Aktif ürünleri herkes görebilir" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Satıcılar kendi ürünlerini yönetebilir" ON public.products FOR ALL USING (auth.uid() = seller_id);

-- Ürün Görselleri: Ürün resimlerini herkes görebilir
CREATE POLICY "Ürün görsellerini herkes görebilir" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Satıcılar görselleri yönetebilir" ON public.product_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.products WHERE products.id = product_images.product_id AND products.seller_id = auth.uid())
);

-- Siparişler: Müşteriler kendi siparişlerini görür, satıcılar kendi ürünlerinin siparişini (ileride eklenecek view ile) görür
CREATE POLICY "Müşteriler kendi siparişlerini görebilir" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
-- Not: Sipariş yaratma işi güvenli olması için doğrudan client üzerinden değil, Edge Function veya API üzerinden yapılmalıdır.
