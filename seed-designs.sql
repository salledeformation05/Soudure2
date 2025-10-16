-- Seed file for sample designs
-- This file creates test creator users and sample designs for each category

-- Note: Run this after signing up test users in the application
-- This script assumes you have at least one creator user in the system

-- First, let's create a test creator profile if it doesn't exist
-- You'll need to sign up a user first, then update their role to 'creator'

-- Sample query to find a user to make a creator:
-- UPDATE profiles SET role = 'creator' WHERE email = 'creator@test.com';

-- Once you have a creator user, get their ID and use it below
-- Example: SELECT id FROM profiles WHERE role = 'creator' LIMIT 1;

-- For now, we'll create designs that reference a placeholder creator_id
-- You'll need to update this with actual creator IDs after user creation

DO $$
DECLARE
  v_creator_id uuid;
  v_cat_vetements uuid;
  v_cat_maison uuid;
  v_cat_accessoires uuid;
  v_cat_tech uuid;
  v_cat_art uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO v_cat_vetements FROM categories WHERE slug = 'vetements';
  SELECT id INTO v_cat_maison FROM categories WHERE slug = 'maison-bureau';
  SELECT id INTO v_cat_accessoires FROM categories WHERE slug = 'accessoires';
  SELECT id INTO v_cat_tech FROM categories WHERE slug = 'technologie';
  SELECT id INTO v_cat_art FROM categories WHERE slug = 'art-decoration';

  -- Try to find a creator user
  SELECT id INTO v_creator_id FROM profiles WHERE role = 'creator' LIMIT 1;

  -- If no creator exists, use a placeholder (you'll need to update this later)
  IF v_creator_id IS NULL THEN
    v_creator_id := '00000000-0000-0000-0000-000000000001';
    RAISE NOTICE 'No creator found. Using placeholder ID. Create a creator user and update designs.';
  END IF;

  -- Insert sample designs
  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Design Géométrique Moderne', 'Motif abstrait avec formes géométriques colorées',
         'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg',
         'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?w=300',
         v_cat_art, ARRAY['geometrique', 'moderne', 'abstrait'], 5.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Design Géométrique Moderne');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Citation Motivante', 'Citation inspirante avec typographie élégante',
         'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg',
         'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?w=300',
         v_cat_vetements, ARRAY['citation', 'motivation', 'typographie'], 4.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Citation Motivante');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Motif Floral Aquarelle', 'Fleurs délicates peintes à l''aquarelle',
         'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg',
         'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?w=300',
         v_cat_maison, ARRAY['floral', 'aquarelle', 'nature'], 6.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Motif Floral Aquarelle');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Logo Minimaliste Chat', 'Illustration minimaliste d''un chat stylisé',
         'https://images.pexels.com/photos/1440387/pexels-photo-1440387.jpeg',
         'https://images.pexels.com/photos/1440387/pexels-photo-1440387.jpeg?w=300',
         v_cat_accessoires, ARRAY['minimaliste', 'animal', 'chat'], 5.49, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Logo Minimaliste Chat');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Pattern Tropical', 'Motif tropical avec feuilles exotiques',
         'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg',
         'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?w=300',
         v_cat_tech, ARRAY['tropical', 'nature', 'exotique'], 5.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Pattern Tropical');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Constellation Étoilée', 'Carte des constellations avec étoiles dorées',
         'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg',
         'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?w=300',
         v_cat_art, ARRAY['astronomie', 'espace', 'etoiles'], 7.49, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Constellation Étoilée');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Vague Japonaise', 'Inspiration de la grande vague de Kanagawa',
         'https://images.pexels.com/photos/1212487/pexels-photo-1212487.jpeg',
         'https://images.pexels.com/photos/1212487/pexels-photo-1212487.jpeg?w=300',
         v_cat_vetements, ARRAY['japonais', 'vague', 'traditionnel'], 6.49, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Vague Japonaise');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Café Vintage', 'Illustration rétro pour les amateurs de café',
         'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
         'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=300',
         v_cat_maison, ARRAY['cafe', 'vintage', 'retro'], 4.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Café Vintage');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Mandala Zen', 'Mandala complexe pour la méditation',
         'https://images.pexels.com/photos/1626844/pexels-photo-1626844.jpeg',
         'https://images.pexels.com/photos/1626844/pexels-photo-1626844.jpeg?w=300',
         v_cat_art, ARRAY['mandala', 'zen', 'meditation'], 5.99, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Mandala Zen');

  INSERT INTO designs (creator_id, title, description, image_url, thumbnail_url, category_id, tags, price, status, available)
  SELECT v_creator_id, 'Monstera Urbain', 'Feuille de monstera en style urbain moderne',
         'https://images.pexels.com/photos/3076899/pexels-photo-3076899.jpeg',
         'https://images.pexels.com/photos/3076899/pexels-photo-3076899.jpeg?w=300',
         v_cat_accessoires, ARRAY['plante', 'urbain', 'moderne'], 5.49, 'approved', true
  WHERE NOT EXISTS (SELECT 1 FROM designs WHERE title = 'Monstera Urbain');

  RAISE NOTICE 'Sample designs created successfully!';
END $$;
