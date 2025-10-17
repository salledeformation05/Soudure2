-- Seed test data for AlphaCadeau platform
-- This adds sample designs, orders, and other data for testing

-- Add sample categories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Art Abstrait', 'art-abstrait', 'Designs abstraits et modernes', 1),
('Nature', 'nature', 'Designs inspirés de la nature', 2),
('Typographie', 'typographie', 'Designs basés sur le texte', 3),
('Animaux', 'animaux', 'Designs avec des animaux', 4),
('Géométrique', 'geometrique', 'Motifs géométriques', 5)
ON CONFLICT (slug) DO NOTHING;

-- Add sample supports (products)
INSERT INTO supports (name, slug, description, base_price, production_time_days, available) VALUES
('T-Shirt Blanc', 't-shirt-blanc', 'T-shirt 100% coton blanc de haute qualité', 19.99, 3, true),
('Mug Céramique', 'mug-ceramique', 'Mug en céramique blanche 350ml', 12.99, 2, true),
('Poster A3', 'poster-a3', 'Poster imprimé sur papier premium A3', 15.99, 2, true),
('Coussin 40x40', 'coussin-40x40', 'Coussin avec housse personnalisable', 24.99, 4, true),
('Tote Bag', 'tote-bag', 'Sac en toile 100% coton', 14.99, 3, true),
('Sweatshirt', 'sweatshirt', 'Sweatshirt à capuche confortable', 39.99, 5, true),
('Coque iPhone', 'coque-iphone', 'Coque de protection personnalisable', 16.99, 2, true),
('Carnet A5', 'carnet-a5', 'Carnet ligné format A5', 9.99, 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Add sample designs (using Pexels stock images)
INSERT INTO designs (
  creator_id,
  title,
  description,
  image_url,
  price,
  category_id,
  tags,
  status,
  featured
)
SELECT
  p.id,
  title,
  description,
  image_url,
  price,
  (SELECT id FROM categories WHERE slug = category_slug),
  tags,
  'approved',
  featured
FROM profiles p
CROSS JOIN (VALUES
  ('Mountain Sunrise', 'Magnifique lever de soleil sur les montagnes', 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800', 9.99, 'nature', ARRAY['montagne', 'lever-soleil', 'paysage'], true),
  ('Abstract Waves', 'Vagues abstraites colorées', 'https://images.pexels.com/photos/1109543/pexels-photo-1109543.jpeg?auto=compress&cs=tinysrgb&w=800', 12.99, 'art-abstrait', ARRAY['abstrait', 'vagues', 'coloré'], true),
  ('Geometric Patterns', 'Motifs géométriques modernes', 'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=800', 8.99, 'geometrique', ARRAY['géométrique', 'motifs', 'moderne'], false),
  ('Typography Art', 'Citation motivante stylisée', 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800', 7.99, 'typographie', ARRAY['citation', 'motivation', 'texte'], true),
  ('Cute Cat', 'Chat mignon en style minimaliste', 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800', 11.99, 'animaux', ARRAY['chat', 'minimaliste', 'mignon'], false),
  ('Forest Path', 'Sentier dans une forêt mystérieuse', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=800', 10.99, 'nature', ARRAY['forêt', 'sentier', 'mystère'], false),
  ('Neon Lights', 'Néons abstraits dans la nuit', 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800', 13.99, 'art-abstrait', ARRAY['néon', 'lumière', 'nuit'], true),
  ('Tropical Leaves', 'Feuilles tropicales luxuriantes', 'https://images.pexels.com/photos/1164761/pexels-photo-1164761.jpeg?auto=compress&cs=tinysrgb&w=800', 9.99, 'nature', ARRAY['tropical', 'feuilles', 'vert'], false),
  ('Hexagon Grid', 'Grille hexagonale colorée', 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg?auto=compress&cs=tinysrgb&w=800', 8.99, 'geometrique', ARRAY['hexagone', 'grille', 'couleur'], false),
  ('Dream Big', 'Typographie inspirante "Dream Big"', 'https://images.pexels.com/photos/1181292/pexels-photo-1181292.jpeg?auto=compress&cs=tinysrgb&w=800', 7.99, 'typographie', ARRAY['rêve', 'inspiration', 'motivation'], true),
  ('Cute Dog', 'Adorable chien en style cartoon', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800', 11.99, 'animaux', ARRAY['chien', 'cartoon', 'adorable'], false),
  ('Ocean Waves', 'Vagues océaniques apaisantes', 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=800', 10.99, 'nature', ARRAY['océan', 'vagues', 'apaisant'], false),
  ('Colorful Gradient', 'Dégradé de couleurs vives', 'https://images.pexels.com/photos/1174938/pexels-photo-1174938.jpeg?auto=compress&cs=tinysrgb&w=800', 12.99, 'art-abstrait', ARRAY['dégradé', 'couleurs', 'vif'], true),
  ('Minimalist Lines', 'Lignes minimalistes élégantes', 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800', 8.99, 'geometrique', ARRAY['minimaliste', 'lignes', 'élégant'], false),
  ('Stay Positive', 'Message positif en belle typographie', 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=800', 7.99, 'typographie', ARRAY['positif', 'message', 'inspiration'], false)
) AS seed_data(title, description, image_url, price, category_slug, tags, featured)
WHERE p.role = 'creator'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Make designs compatible with all supports
INSERT INTO design_support_compatibility (design_id, support_id, available)
SELECT d.id, s.id, true
FROM designs d
CROSS JOIN supports s
ON CONFLICT (design_id, support_id) DO NOTHING;

-- Add sample providers
INSERT INTO profiles (id, email, full_name, phone, role, location, country)
SELECT
  gen_random_uuid(),
  'provider' || generate_series || '@example.com',
  'Atelier ' ||
    CASE generate_series
      WHEN 1 THEN 'Paris Print'
      WHEN 2 THEN 'Lyon Créations'
      WHEN 3 THEN 'Marseille Design'
      ELSE 'Provider ' || generate_series
    END,
  '+33' || (600000000 + generate_series * 100000)::text,
  'provider',
  CASE generate_series
    WHEN 1 THEN 'Paris, France'
    WHEN 2 THEN 'Lyon, France'
    WHEN 3 THEN 'Marseille, France'
    ELSE 'France'
  END,
  'FR'
FROM generate_series(1, 3)
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'provider' || generate_series || '@example.com');

-- Add provider details
INSERT INTO providers (profile_id, business_name, business_address, business_city, business_postal_code, business_country, production_capacity, rating, total_orders_completed)
SELECT
  p.id,
  p.full_name,
  CASE
    WHEN p.location LIKE '%Paris%' THEN '15 Rue de la Paix'
    WHEN p.location LIKE '%Lyon%' THEN '42 Rue de la République'
    WHEN p.location LIKE '%Marseille%' THEN '28 La Canebière'
    ELSE '1 Rue Principale'
  END,
  CASE
    WHEN p.location LIKE '%Paris%' THEN 'Paris'
    WHEN p.location LIKE '%Lyon%' THEN 'Lyon'
    WHEN p.location LIKE '%Marseille%' THEN 'Marseille'
    ELSE 'France'
  END,
  CASE
    WHEN p.location LIKE '%Paris%' THEN '75002'
    WHEN p.location LIKE '%Lyon%' THEN '69002'
    WHEN p.location LIKE '%Marseille%' THEN '13001'
    ELSE '75000'
  END,
  'FR',
  50 + (random() * 100)::int,
  4.5 + (random() * 0.5),
  (random() * 200)::int
FROM profiles p
WHERE p.role = 'provider'
AND NOT EXISTS (SELECT 1 FROM providers WHERE profile_id = p.id);

-- Add provider capabilities
INSERT INTO provider_capabilities (provider_id, support_id, available, min_quantity, max_quantity)
SELECT
  pr.id,
  s.id,
  true,
  1,
  100 + (random() * 400)::int
FROM providers pr
CROSS JOIN supports s
ON CONFLICT (provider_id, support_id) DO NOTHING;

-- Add some sample orders for testing
INSERT INTO orders (
  customer_id,
  status,
  total_amount,
  shipping_address,
  shipping_city,
  shipping_postal_code,
  shipping_country,
  notes
)
SELECT
  p.id,
  CASE (random() * 5)::int
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'confirmed'
    WHEN 2 THEN 'in_production'
    WHEN 3 THEN 'ready_for_delivery'
    WHEN 4 THEN 'in_delivery'
    ELSE 'delivered'
  END,
  50 + (random() * 200),
  '123 Rue Example',
  'Paris',
  '75001',
  'FR',
  'Commande de test'
FROM profiles p
WHERE p.role = 'client'
LIMIT 10
ON CONFLICT DO NOTHING;

-- Add order items for each order
INSERT INTO order_items (
  order_id,
  design_id,
  support_id,
  quantity,
  unit_price,
  customization_options
)
SELECT
  o.id,
  d.id,
  s.id,
  1 + (random() * 3)::int,
  d.price + s.base_price,
  jsonb_build_object(
    'size', CASE (random() * 3)::int WHEN 0 THEN 'S' WHEN 1 THEN 'M' ELSE 'L' END,
    'color', CASE (random() * 3)::int WHEN 0 THEN 'Blanc' WHEN 1 THEN 'Noir' ELSE 'Bleu' END
  )
FROM orders o
CROSS JOIN LATERAL (
  SELECT id, price FROM designs ORDER BY random() LIMIT 1
) d
CROSS JOIN LATERAL (
  SELECT id, base_price FROM supports ORDER BY random() LIMIT 1
) s
ON CONFLICT DO NOTHING;

-- Add some reviews
INSERT INTO reviews (
  user_id,
  design_id,
  rating,
  comment
)
SELECT
  p.id,
  d.id,
  3 + (random() * 2)::int,
  CASE (random() * 4)::int
    WHEN 0 THEN 'Excellent design, très content du résultat !'
    WHEN 1 THEN 'Beau design, correspond à mes attentes.'
    WHEN 2 THEN 'Très satisfait, qualité au rendez-vous.'
    WHEN 3 THEN 'Super ! Je recommande.'
    ELSE 'Parfait pour mon projet.'
  END
FROM profiles p
CROSS JOIN LATERAL (
  SELECT id FROM designs ORDER BY random() LIMIT 1
) d
WHERE p.role = 'client'
LIMIT 20
ON CONFLICT DO NOTHING;

-- Update design statistics
UPDATE designs SET
  views_count = 50 + (random() * 500)::int,
  downloads_count = 10 + (random() * 100)::int,
  favorites_count = 5 + (random() * 50)::int,
  rating = 4.0 + (random() * 1.0);
