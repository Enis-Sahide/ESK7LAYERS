export const CATEGORIES = [
  { id: 'stones', name: 'Doğal Taşlar', icon: 'gem' },
  { id: 'incense', name: 'Tütsüler', icon: 'wind' },
  { id: 'oils', name: 'Uçucu Yağlar', icon: 'droplet' },
  { id: 'accessories', name: 'Aksesuarlar', icon: 'watch' }
];

export const VENDORS = [
  {
    id: 'sifa-tasi',
    name: 'Şifa Taşı Dükkanı',
    description: 'Doğadan gelen saf enerji. Sertifikalı ve arındırılmış doğal taşlar.',
    avatar: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=256&auto=format&fit=crop',
    rating: 4.8,
    isFeatured: true,
  },
  {
    id: 'kadim-kokular',
    name: 'Kadim Kokular',
    description: 'El yapımı tütsüler ve %100 saf uçucu yağlar ile enerjinizi yükseltin.',
    avatar: 'https://images.unsplash.com/photo-1608508644127-ba99d7732fee?q=80&w=256&auto=format&fit=crop',
    rating: 4.9,
    isFeatured: true,
  },
  {
    id: 'mistik-yol',
    name: 'Mistik Yol',
    description: 'Spiritüel yolculuğunuzda size eşlik edecek kadim aksesuarlar.',
    avatar: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=256&auto=format&fit=crop',
    rating: 4.5,
    isFeatured: false,
  }
];

export const PRODUCTS = [
  {
    id: 'p1',
    vendorId: 'sifa-tasi',
    categoryId: 'stones',
    name: 'Ham Ametist Kümesi',
    description: 'Üçüncü göz çakrasını açmak ve ortamdaki negatif enerjiyi temizlemek için doğal ametist kümesi. Brezilya menşeili.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1567439050888-0857502c34d4?q=80&w=1000&auto=format&fit=crop',
    stock: 12
  },
  {
    id: 'p2',
    vendorId: 'kadim-kokular',
    categoryId: 'incense',
    name: 'Palo Santo Ağaç Tütsü',
    description: 'Peru\'dan ithal edilmiş, şifalı Palo Santo ağacı çubukları. 5\'li paket.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1611077544837-77983637651a?q=80&w=1000&auto=format&fit=crop',
    stock: 50
  },
  {
    id: 'p3',
    vendorId: 'sifa-tasi',
    categoryId: 'stones',
    name: 'Pembe Kuvars Kolye',
    description: 'Kalp çakrasını dengeleyen, sevgi enerjisini çeken 925 ayar gümüş zincirli pembe kuvars.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    stock: 8
  },
  {
    id: 'p4',
    vendorId: 'kadim-kokular',
    categoryId: 'oils',
    name: 'Saf Lavanta Yağı',
    description: 'Uyku kalitesini artırmak ve zihni sakinleştirmek için %100 saf uçucu lavanta yağı (10ml).',
    price: 150,
    image: 'https://images.unsplash.com/photo-1608508644349-2e06c277bcaf?q=80&w=1000&auto=format&fit=crop',
    stock: 25
  },
  {
    id: 'p5',
    vendorId: 'mistik-yol',
    categoryId: 'accessories',
    name: '7 Çakra Bileklik',
    description: 'Gerçek doğal taşlardan oluşan (Ametist, Lapis, Turkuaz, Aventurin, Kaplan Gözü, Akik, Kırmızı Jasper) dengeleme bilekliği.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1599643477874-9097e3fc2ba6?q=80&w=1000&auto=format&fit=crop',
    stock: 15
  }
];
