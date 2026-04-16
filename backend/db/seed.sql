-- =============================================
-- Seed Data — Default User + 20 Products + Cart
-- =============================================

-- Default user (assumed logged in)
INSERT INTO users (name, email) VALUES
('John Doe', 'john@example.com');

-- Create a cart for the default user
INSERT INTO carts (user_id) VALUES (1);

-- =============================================
-- PRODUCTS — 20 products across 5 categories
-- =============================================

-- ELECTRONICS (4 products)
INSERT INTO products (title, description, price, category, stock, images, rating, review_count) VALUES
(
    'Sony WH-1000XM5 Wireless Headphones',
    'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours of battery life with quick charging (3 min charge for 3 hours of playback). Ultra-comfortable and lightweight design for all-day wearing.',
    348.00, 'Electronics', 45,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600'],
    4.7, 2847
),
(
    'Samsung Galaxy S24 Ultra Smartphone',
    'Titanium frame with 6.8-inch Dynamic AMOLED 2X display. 200MP camera with advanced nightography. Galaxy AI built in for circle to search, live translate, and note assist. Snapdragon 8 Gen 3 processor with 12GB RAM. 5000mAh battery with 45W super fast charging.',
    1199.99, 'Electronics', 30,
    ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600'],
    4.5, 1523
),
(
    'MacBook Pro 16" M3 Pro Laptop',
    'Apple M3 Pro chip with 12-core CPU and 18-core GPU. 18GB unified memory and 512GB SSD storage. 16.2-inch Liquid Retina XDR display. Up to 22 hours of battery life. MagSafe charging, Thunderbolt 4 ports, SDXC card slot, HDMI port.',
    2499.00, 'Electronics', 20,
    ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600'],
    4.8, 3201
),
(
    'Apple Watch Series 9 GPS + Cellular',
    'Always-On Retina LTPO OLED display up to 2000 nits. S9 SiP with 5.6 billion transistors and 4-core Neural Engine. Double Tap gesture for one-handed control. Advanced health monitoring including blood oxygen, ECG, and temperature sensing.',
    499.99, 'Electronics', 55,
    ARRAY['https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'],
    4.6, 1876
),

-- BOOKS (4 products)
(
    'Clean Code by Robert C. Martin',
    'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees. This book is a must-read for any developer, software engineer, project manager, team lead, or systems analyst.',
    39.99, 'Books', 150,
    ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    4.7, 5432
),
(
    'The Great Gatsby by F. Scott Fitzgerald',
    'The Great Gatsby, F. Scott Fitzgerald''s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers. The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    14.99, 'Books', 200,
    ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600'],
    4.4, 8901
),
(
    'The Joy of Cooking: 2024 Edition',
    'America''s most trusted cookbook! Completely revised and updated with over 4,000 recipes covering every technique a home cook needs to know. From quick weeknight dinners to holiday feasts, this comprehensive guide covers cuisines from around the world.',
    35.00, 'Books', 85,
    ARRAY['https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
    4.6, 2345
),
(
    'A Brief History of Time by Stephen Hawking',
    'A landmark volume in science writing by one of the great minds of our time. Stephen Hawking explores such profound questions as: How did the universe begin? What made its start possible? These questions challenge our knowledge of the cosmos.',
    18.99, 'Books', 120,
    ARRAY['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    4.5, 6721
),

-- CLOTHING (4 products)
(
    'Nike Dri-FIT Premium Cotton T-Shirt',
    'Made with premium cotton and Dri-FIT technology that moves sweat away from your body to help keep you dry and comfortable. Relaxed fit for easy movement. Ribbed crew neck. Available in multiple colors. Machine washable.',
    34.99, 'Clothing', 300,
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
    4.3, 3456
),
(
    'Levi''s 501 Original Fit Jeans',
    'The original blue jean since 1873. Levi''s 501 Original Fit Jeans sit at the waist with a straight leg. Crafted from premium denim with a button fly. The iconic fit that started it all. Versatile enough for any occasion.',
    69.50, 'Clothing', 180,
    ARRAY['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600'],
    4.4, 4567
),
(
    'The North Face ThermoBall Eco Jacket',
    'Synthetic insulated jacket made with recycled materials. ThermoBall Eco insulation continues to trap heat even when wet. Packable design fits into its own internal chest pocket. Durable water-repellent finish. Zippered hand pockets and internal media pocket.',
    199.00, 'Clothing', 65,
    ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', 'https://images.unsplash.com/photo-1544923246-77307dd270b1?w=600', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
    4.6, 1234
),
(
    'Nike Air Max 270 Running Sneakers',
    'The Nike Air Max 270 delivers visible Air cushioning and an ultra-comfortable ride. Features the tallest Air unit yet for a super soft ride. Mesh upper with synthetic overlays for breathability and support. Rubber outsole for durability and traction.',
    150.00, 'Clothing', 90,
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'],
    4.5, 2890
),

-- HOME & KITCHEN (4 products)
(
    'Breville Barista Express Espresso Machine',
    'Go from beans to espresso in under a minute. Integrated conical burr grinder with dose-control grinding. Digital temperature control for precise extraction. 15 bar Italian pump. Micro-foam milk texturing. Includes 54mm tamper, single and dual wall filter baskets.',
    699.95, 'Home & Kitchen', 25,
    ARRAY['https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600'],
    4.7, 3678
),
(
    'Vitamix Professional Series 750 Blender',
    'Professional-grade blending for the home kitchen. 2.2 HP motor powers through the toughest ingredients. Five pre-programmed settings for smoothies, hot soups, frozen desserts, purées, and self-cleaning. 64-ounce low-profile container. 10-year full warranty.',
    549.95, 'Home & Kitchen', 35,
    ARRAY['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600', 'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=600', 'https://images.unsplash.com/photo-1622480914634-8e9d4ab586e4?w=600'],
    4.8, 2145
),
(
    'Wüsthof Classic 8-Piece Knife Block Set',
    'German-made precision-forged knives with full tang and triple-riveted handles. Set includes 8" chef''s knife, 8" bread knife, 6" utility knife, 3.5" paring knife, kitchen shears, honing steel, and 13-slot knife block. Lifetime warranty.',
    349.99, 'Home & Kitchen', 40,
    ARRAY['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', 'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?w=600'],
    4.6, 1567
),
(
    'Brooklinen Luxe Core Sheet Set - Queen',
    'Made from 100% long-staple cotton sateen with a 480 thread count. Buttery smooth finish. Set includes: 1 fitted sheet, 1 flat sheet, 2 pillowcases. OEKO-TEX certified. Machine washable. Available in 20+ colors. Free shipping and returns.',
    169.00, 'Home & Kitchen', 75,
    ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'],
    4.5, 4321
),

-- SPORTS & OUTDOORS (4 products)
(
    'Manduka PRO Yoga Mat 6mm',
    'Ultra-dense cushioning for joint protection. Lifetime guarantee. Closed-cell surface prevents sweat from seeping into the mat. Non-toxic, emissions-free manufacturing. 71" x 26" standard size. 6mm thick for superior comfort. OEKO-TEX certified.',
    120.00, 'Sports', 60,
    ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600'],
    4.7, 2890
),
(
    'Bowflex SelectTech 552 Adjustable Dumbbells',
    'Replace 15 sets of weights with just one pair. Each dumbbell adjusts from 5 to 52.5 lbs in 2.5 lb increments. Unique dial system for quick weight changes. Compact design saves space. Durable molding around metal plates for safe, quiet workouts.',
    429.00, 'Sports', 20,
    ARRAY['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
    4.6, 1876
),
(
    'ASICS Gel-Kayano 30 Running Shoes',
    'Maximum support running shoe with 4D Guidance System. FF BLAST PLUS ECO cushioning for energized comfort. LITETRUSS technology for enhanced stability. Engineered knit upper with internal support. 10mm drop. Ideal for overpronators.',
    159.95, 'Sports', 70,
    ARRAY['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
    4.5, 3421
),
(
    'Hydro Flask Wide Mouth 32oz Water Bottle',
    'TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours and hot up to 12 hours. BPA-free and phthalate-free. 18/8 pro-grade stainless steel. Wide mouth opening for ice cubes and easy cleaning. Flex Cap with honeycomb insulation.',
    44.95, 'Sports', 200,
    ARRAY['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600', 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600'],
    4.8, 5678
);
