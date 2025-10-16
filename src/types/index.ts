// User Types
export type UserRole = 'client' | 'creator' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  address?: string;
  language: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

// Design/Motif Types
export interface Design {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  category_id?: string;
  tags: string[];
  price: number;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  rejection_reason?: string;
  views: number;
  favorites: number;
  sales: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

// Support Types
export type SupportType = 't-shirt' | 'mug' | 'bag' | 'keychain' | 'poster' | 'phone-case' | 'other';

export interface Support {
  id: string;
  name: string;
  type: SupportType;
  description?: string;
  base_price: number;
  image_url?: string;
  available: boolean;
  created_at: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  design_id: string;
  support_id: string;
  provider_id?: string;
  status: OrderStatus;
  quantity: number;
  customization?: {
    size?: string;
    color?: string;
    text?: string;
    [key: string]: any;
  };
  total_price: number;
  delivery_address: string;
  delivery_country: string;
  created_at: string;
  updated_at: string;
}

// Provider Types
export interface Provider {
  id: string;
  user_id: string;
  business_name: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  capabilities: string[];
  capacity_per_week: number;
  rating: number;
  total_orders: number;
  active: boolean;
  created_at: string;
}

// Notification Types
export type NotificationChannel = 'email' | 'telegram' | 'whatsapp' | 'web';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  channels: NotificationChannel[];
  read: boolean;
  created_at: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  description?: string;
  image_url?: string;
}

// Review Types
export interface Review {
  id: string;
  order_id: string;
  user_id: string;
  design_id: string;
  provider_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
}
