export type ProductType = 'PHYSICAL' | 'DIGITAL' | 'SERVICE';
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
export type PaymentProvider = 'IYZICO' | 'STRIPE' | 'WALLET';

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  product_type: ProductType;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_provider: PaymentProvider;
  payment_id: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

// ==========================================
// Ödeme Sağlayıcısı Soyutlaması (Abstraction)
// ==========================================
export interface PaymentRequest {
  order_id: string;
  amount: number;
  currency: string;
  customer_info: {
    id: string;
    email: string;
    name: string;
    ip_address?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  error_message?: string;
  raw_response?: any;
}

// Hangi sağlayıcı olursa olsun, tüm ödeme servisleri bu kalıba uymak zorundadır.
export interface IPaymentGateway {
  initializePayment(request: PaymentRequest): Promise<PaymentResponse>;
  checkPaymentStatus(transaction_id: string): Promise<PaymentResponse>;
  refundPayment(transaction_id: string, amount: number): Promise<PaymentResponse>;
}
