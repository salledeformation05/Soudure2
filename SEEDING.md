# Database Seeding Guide

This guide explains how to populate the AlphaCadeau database with test data for development and testing.

## Quick Start

The database has been pre-populated with:
- ✅ Categories (5 main categories)
- ✅ Supports (7 different product types)

## Creating Test Users

To fully test the application, you'll need to create users with different roles:

### 1. Create a Client User
1. Go to the application
2. Click "Sign Up"
3. Register with: `client@test.com` / password of your choice
4. This user will have the default 'client' role

### 2. Create a Creator User
1. Sign up with: `creator@test.com` / password of your choice
2. In the database, update the role:
   ```sql
   UPDATE profiles SET role = 'creator' WHERE email = 'creator@test.com';
   ```

### 3. Create a Provider User
1. Sign up with: `provider@test.com` / password of your choice
2. Update the role:
   ```sql
   UPDATE profiles SET role = 'provider' WHERE email = 'provider@test.com';
   ```
3. Create provider profile:
   ```sql
   INSERT INTO providers (user_id, business_name, location, capabilities, capacity_per_week, active)
   SELECT id, 'Test Print Shop', 'Paris, France',
          ARRAY['t-shirt', 'mug', 'bag', 'poster'], 50, true
   FROM profiles WHERE email = 'provider@test.com';
   ```

### 4. Create an Admin User
1. Sign up with: `admin@test.com` / password of your choice
2. Update the role:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
   ```

## Adding Sample Designs

Once you have a creator user, you can add sample designs:

1. Get the creator's user ID:
   ```sql
   SELECT id FROM profiles WHERE email = 'creator@test.com';
   ```

2. Run the seed-designs.sql script:
   ```bash
   # The script will automatically use the first creator it finds
   # Or you can manually run the SQL queries with the creator ID
   ```

The seed file will create 10 diverse sample designs across all categories.

## Pre-populated Data

### Categories
- Vêtements (Clothing)
- Maison & Bureau (Home & Office)
- Accessoires (Accessories)
- Technologie (Technology)
- Art & Décoration (Art & Decoration)

### Supports
- T-shirt Blanc Premium (€15.99)
- T-shirt Noir Classic (€14.99)
- Mug Céramique Blanc (€9.99)
- Tote Bag en Coton (€12.99)
- Porte-clés Métal (€5.99)
- Poster A3 Mat (€19.99)
- Coque iPhone Souple (€11.99)

## Testing Workflow

1. **As a Client**: Browse designs, customize products, place orders
2. **As a Creator**: Upload new designs, manage your portfolio
3. **As a Provider**: View and manage incoming orders
4. **As an Admin**: Moderate designs, manage users and platform

## Verifying Seed Data

Check that data was inserted correctly:

```sql
-- Check categories
SELECT COUNT(*) as category_count FROM categories;

-- Check supports
SELECT COUNT(*) as support_count FROM supports;

-- Check users
SELECT email, role FROM profiles;

-- Check designs (after running seed-designs.sql)
SELECT COUNT(*) as design_count FROM designs;
```

## Notes

- All sample images are from Pexels (royalty-free stock photos)
- Prices are in EUR by default
- All designs are pre-approved and available
- The seed script uses idempotent inserts (won't create duplicates)
