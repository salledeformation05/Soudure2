/*
  # AlphaCadeau Initial Database Schema
  
  ## Overview
  This migration creates the complete database schema for the AlphaCadeau platform,
  a multi-channel marketplace for personalized printed products.
  
  ## Tables Created
  
  ### 1. User Management
  - `profiles` - Extended user profile information
  - `user_preferences` - User preferences and settings
  
  ### 2. Catalog Management
  - `categories` - Product and design categories (hierarchical)
  - `designs` - Design/motifs created by creators
  - `supports` - Physical product types (t-shirts, mugs, etc.)
  - `design_support_compatibility` - Which designs work on which supports
  
  ### 3. Provider Management
  - `providers` - Local production service providers
  - `provider_capabilities` - What each provider can produce
  - `provider_availability` - Provider schedule and capacity
  
  ### 4. Order Management
  - `orders` - Customer orders
  - `order_items` - Individual items in orders
  - `order_status_history` - Tracking order progression
  
  ### 5. Reviews and Ratings
  - `reviews` - Product and provider reviews
  
  ### 6. Notifications
  - `notifications` - System notifications
  - `notification_preferences` - User notification settings
  
  ### 7. Analytics
  - `design_views` - Track design impressions
  - `search_queries` - Track user searches
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Restrictive policies requiring authentication
  - Users can only access their own data unless explicitly allowed
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geolocation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- USER MANAGEMENT
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'creator', 'provider', 'admin')),
  language text NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'es')),
  avatar_url text,
  location text,
  country text,
  coordinates geography(POINT),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notification_email boolean DEFAULT true,
  notification_telegram boolean DEFAULT false,
  notification_whatsapp boolean DEFAULT false,
  notification_web boolean DEFAULT true,
  telegram_id text UNIQUE,
  whatsapp_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================================
-- CATALOG MANAGEMENT
-- ============================================================================

-- Categories (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  image_url text,
  display_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Designs/Motifs
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  thumbnail_url text,
  category_id uuid REFERENCES categories(id),
  tags text[] DEFAULT '{}',
  price numeric(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
  rejection_reason text,
  views int DEFAULT 0,
  favorites int DEFAULT 0,
  sales int DEFAULT 0,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Supports (physical products)
CREATE TABLE IF NOT EXISTS supports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('t-shirt', 'mug', 'bag', 'keychain', 'poster', 'phone-case', 'other')),
  description text,
  base_price numeric(10,2) DEFAULT 0,
  image_url text,
  variants jsonb DEFAULT '{}', -- sizes, colors, materials
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Design-Support compatibility
CREATE TABLE IF NOT EXISTS design_support_compatibility (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE NOT NULL,
  support_id uuid REFERENCES supports(id) ON DELETE CASCADE NOT NULL,
  price_adjustment numeric(10,2) DEFAULT 0,
  preview_url text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(design_id, support_id)
);

-- ============================================================================
-- PROVIDER MANAGEMENT
-- ============================================================================

-- Providers
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  description text,
  location text NOT NULL,
  address text,
  city text,
  country text NOT NULL,
  coordinates geography(POINT),
  phone text,
  email text,
  rating numeric(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_orders int DEFAULT 0,
  completed_orders int DEFAULT 0,
  capacity_per_week int DEFAULT 100,
  active boolean DEFAULT true,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Provider capabilities
CREATE TABLE IF NOT EXISTS provider_capabilities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  support_type text NOT NULL,
  technique text, -- silk-screen, sublimation, direct-print, etc.
  max_quantity_per_order int DEFAULT 100,
  min_delivery_days int DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Provider availability
CREATE TABLE IF NOT EXISTS provider_availability (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id uuid REFERENCES providers(id) ON DELETE CASCADE NOT NULL,
  unavailable_from date,
  unavailable_to date,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ORDER MANAGEMENT
-- ============================================================================

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES providers(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10,2) DEFAULT 0,
  shipping_cost numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'EUR',
  delivery_name text NOT NULL,
  delivery_phone text,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_postal_code text,
  delivery_country text NOT NULL,
  delivery_instructions text,
  estimated_delivery_date date,
  actual_delivery_date date,
  tracking_number text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  payment_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  design_id uuid REFERENCES designs(id) NOT NULL,
  support_id uuid REFERENCES supports(id) NOT NULL,
  quantity int DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  customization jsonb DEFAULT '{}', -- size, color, text, etc.
  preview_url text,
  created_at timestamptz DEFAULT now()
);

-- Order status history
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  comment text,
  changed_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- REVIEWS AND RATINGS
-- ============================================================================

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  design_id uuid REFERENCES designs(id) NOT NULL,
  provider_id uuid REFERENCES providers(id),
  design_rating int CHECK (design_rating >= 1 AND design_rating <= 5),
  product_quality_rating int CHECK (product_quality_rating >= 1 AND product_quality_rating <= 5),
  delivery_rating int CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  overall_rating int NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comment text,
  images text[],
  helpful_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(order_id, user_id)
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  channels text[] DEFAULT '{"web"}',
  read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- ANALYTICS
-- ============================================================================

-- Design views tracking
CREATE TABLE IF NOT EXISTS design_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  session_id text,
  ip_address inet,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Search queries
CREATE TABLE IF NOT EXISTS search_queries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  query text NOT NULL,
  filters jsonb DEFAULT '{}',
  results_count int DEFAULT 0,
  clicked_design_id uuid REFERENCES designs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, design_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);

CREATE INDEX IF NOT EXISTS idx_designs_creator ON designs(creator_id);
CREATE INDEX IF NOT EXISTS idx_designs_category ON designs(category_id);
CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status);
CREATE INDEX IF NOT EXISTS idx_designs_tags ON designs USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_designs_created ON designs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_provider ON orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_providers_location ON providers USING gist(coordinates);
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(active);
CREATE INDEX IF NOT EXISTS idx_providers_country ON providers(country);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_reviews_design ON reviews(design_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE supports ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_support_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view basic public profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  TO authenticated
  USING (active = true);

-- Designs policies
CREATE POLICY "Anyone can view approved designs"
  ON designs FOR SELECT
  TO authenticated
  USING (status = 'approved' AND available = true);

CREATE POLICY "Creators can view their own designs"
  ON designs FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert designs"
  ON designs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own designs"
  ON designs FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Supports policies (public read)
CREATE POLICY "Anyone can view available supports"
  ON supports FOR SELECT
  TO authenticated
  USING (available = true);

-- Providers policies
CREATE POLICY "Anyone can view active providers"
  ON providers FOR SELECT
  TO authenticated
  USING (active = true AND verified = true);

CREATE POLICY "Providers can view their own data"
  ON providers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can update their own data"
  ON providers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view assigned orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.user_id = auth.uid()
      AND providers.id = orders.provider_id
    )
  );

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update assigned orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.user_id = auth.uid()
      AND providers.id = orders.provider_id
    )
  );

-- Order items policies
CREATE POLICY "Users can view items from their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view items from assigned orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      JOIN providers ON providers.id = orders.provider_id
      WHERE orders.id = order_items.order_id
      AND providers.user_id = auth.uid()
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert reviews for their orders"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = reviews.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'delivered'
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designs_updated_at BEFORE UPDATE ON designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'AC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create order status history entry
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_status_history (order_id, status, changed_by)
    VALUES (NEW.id, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION create_order_status_history();

-- Function to update design view count
CREATE OR REPLACE FUNCTION increment_design_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE designs SET views = views + 1 WHERE id = NEW.design_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER design_view_count_trigger
  AFTER INSERT ON design_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_design_views();

-- Function to update provider rating
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.provider_id IS NOT NULL THEN
    UPDATE providers
    SET rating = (
      SELECT AVG(overall_rating)::numeric(3,2)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    )
    WHERE id = NEW.provider_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER provider_rating_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();
