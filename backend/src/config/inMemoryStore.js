/**
 * In-Memory Data Store
 * 
 * Provides a complete fallback when PostgreSQL is not configured.
 * Stores products, cart, and orders in memory so the app works out-of-the-box.
 * Data resets on server restart.
 */

// =============================================
// SEED DATA — 20 products across 5 categories
// =============================================
const products = [
  {
    id: 1,
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours of battery life with quick charging (3 min charge for 3 hours of playback). Ultra-comfortable and lightweight design for all-day wearing.',
    price: 348.00,
    category: 'Electronics',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600'
    ],
    rating: 4.7,
    review_count: 2847,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra Smartphone',
    description: 'Titanium frame with 6.8-inch Dynamic AMOLED 2X display. 200MP camera with advanced nightography. Galaxy AI built in for circle to search, live translate, and note assist. Snapdragon 8 Gen 3 processor with 12GB RAM. 5000mAh battery with 45W super fast charging.',
    price: 1199.99,
    category: 'Electronics',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600'
    ],
    rating: 4.5,
    review_count: 1523,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'MacBook Pro 16" M3 Pro Laptop',
    description: 'Apple M3 Pro chip with 12-core CPU and 18-core GPU. 18GB unified memory and 512GB SSD storage. 16.2-inch Liquid Retina XDR display. Up to 22 hours of battery life. MagSafe charging, Thunderbolt 4 ports, SDXC card slot, HDMI port.',
    price: 2499.00,
    category: 'Electronics',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600'
    ],
    rating: 4.8,
    review_count: 3201,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Apple Watch Series 9 GPS + Cellular',
    description: 'Always-On Retina LTPO OLED display up to 2000 nits. S9 SiP with 5.6 billion transistors and 4-core Neural Engine. Double Tap gesture for one-handed control. Advanced health monitoring including blood oxygen, ECG, and temperature sensing.',
    price: 499.99,
    category: 'Electronics',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'
    ],
    rating: 4.6,
    review_count: 1876,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Clean Code by Robert C. Martin',
    description: 'A Handbook of Agile Software Craftsmanship. Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. This book is a must-read for any developer, software engineer, project manager, team lead, or systems analyst.',
    price: 39.99,
    category: 'Books',
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
    ],
    rating: 4.7,
    review_count: 5432,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: 'The Great Gatsby by F. Scott Fitzgerald',
    description: 'The Great Gatsby, F. Scott Fitzgerald\'s third book, stands as the supreme achievement of his career. This exemplary novel of the Jazz Age has been acclaimed by generations of readers.',
    price: 14.99,
    category: 'Books',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600'
    ],
    rating: 4.4,
    review_count: 8901,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    title: 'The Joy of Cooking: 2024 Edition',
    description: 'America\'s most trusted cookbook! Completely revised and updated with over 4,000 recipes covering every technique a home cook needs to know.',
    price: 35.00,
    category: 'Books',
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'
    ],
    rating: 4.6,
    review_count: 2345,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    title: 'A Brief History of Time by Stephen Hawking',
    description: 'A landmark volume in science writing by one of the great minds of our time. Stephen Hawking explores such profound questions as: How did the universe begin?',
    price: 18.99,
    category: 'Books',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
    ],
    rating: 4.5,
    review_count: 6721,
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    title: 'Nike Dri-FIT Premium Cotton T-Shirt',
    description: 'Made with premium cotton and Dri-FIT technology that moves sweat away from your body. Relaxed fit for easy movement. Ribbed crew neck. Machine washable.',
    price: 34.99,
    category: 'Clothing',
    stock: 300,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'
    ],
    rating: 4.3,
    review_count: 3456,
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    title: "Levi's 501 Original Fit Jeans",
    description: 'The original blue jean since 1873. Levi\'s 501 Original Fit Jeans sit at the waist with a straight leg. Crafted from premium denim with a button fly.',
    price: 69.50,
    category: 'Clothing',
    stock: 180,
    images: [
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=600',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600'
    ],
    rating: 4.4,
    review_count: 4567,
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    title: 'The North Face ThermoBall Eco Jacket',
    description: 'Synthetic insulated jacket made with recycled materials. ThermoBall Eco insulation continues to trap heat even when wet. Packable design.',
    price: 199.00,
    category: 'Clothing',
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
      'https://images.unsplash.com/photo-1544923246-77307dd270b1?w=600',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'
    ],
    rating: 4.6,
    review_count: 1234,
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    title: 'Nike Air Max 270 Running Sneakers',
    description: 'The Nike Air Max 270 delivers visible Air cushioning and an ultra-comfortable ride. Features the tallest Air unit yet for a super soft ride.',
    price: 150.00,
    category: 'Clothing',
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600'
    ],
    rating: 4.5,
    review_count: 2890,
    created_at: new Date().toISOString()
  },
  {
    id: 13,
    title: 'Breville Barista Express Espresso Machine',
    description: 'Go from beans to espresso in under a minute. Integrated conical burr grinder with dose-control grinding. Digital temperature control for precise extraction. 15 bar Italian pump.',
    price: 699.95,
    category: 'Home & Kitchen',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
      'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=600'
    ],
    rating: 4.7,
    review_count: 3678,
    created_at: new Date().toISOString()
  },
  {
    id: 14,
    title: 'Vitamix Professional Series 750 Blender',
    description: 'Professional-grade blending for the home kitchen. 2.2 HP motor powers through the toughest ingredients. Five pre-programmed settings.',
    price: 549.95,
    category: 'Home & Kitchen',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600',
      'https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=600',
      'https://images.unsplash.com/photo-1622480914634-8e9d4ab586e4?w=600'
    ],
    rating: 4.8,
    review_count: 2145,
    created_at: new Date().toISOString()
  },
  {
    id: 15,
    title: 'Wüsthof Classic 8-Piece Knife Block Set',
    description: 'German-made precision-forged knives with full tang and triple-riveted handles. Set includes 8" chef\'s knife, 8" bread knife, 6" utility knife, and more.',
    price: 349.99,
    category: 'Home & Kitchen',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      'https://images.unsplash.com/photo-1566454419290-57a0589c9b17?w=600'
    ],
    rating: 4.6,
    review_count: 1567,
    created_at: new Date().toISOString()
  },
  {
    id: 16,
    title: 'Brooklinen Luxe Core Sheet Set - Queen',
    description: 'Made from 100% long-staple cotton sateen with a 480 thread count. Buttery smooth finish. OEKO-TEX certified. Machine washable. Available in 20+ colors.',
    price: 169.00,
    category: 'Home & Kitchen',
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600'
    ],
    rating: 4.5,
    review_count: 4321,
    created_at: new Date().toISOString()
  },
  {
    id: 17,
    title: 'Manduka PRO Yoga Mat 6mm',
    description: 'Ultra-dense cushioning for joint protection. Lifetime guarantee. Closed-cell surface prevents sweat from seeping into the mat. 71" x 26" standard size.',
    price: 120.00,
    category: 'Sports',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600'
    ],
    rating: 4.7,
    review_count: 2890,
    created_at: new Date().toISOString()
  },
  {
    id: 18,
    title: 'Bowflex SelectTech 552 Adjustable Dumbbells',
    description: 'Replace 15 sets of weights with just one pair. Each dumbbell adjusts from 5 to 52.5 lbs in 2.5 lb increments. Unique dial system for quick weight changes.',
    price: 429.00,
    category: 'Sports',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'
    ],
    rating: 4.6,
    review_count: 1876,
    created_at: new Date().toISOString()
  },
  {
    id: 19,
    title: 'ASICS Gel-Kayano 30 Running Shoes',
    description: 'Maximum support running shoe with 4D Guidance System. FF BLAST PLUS ECO cushioning for energized comfort. Engineered knit upper with internal support.',
    price: 159.95,
    category: 'Sports',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'
    ],
    rating: 4.5,
    review_count: 3421,
    created_at: new Date().toISOString()
  },
  {
    id: 20,
    title: 'Hydro Flask Wide Mouth 32oz Water Bottle',
    description: 'TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours and hot up to 12 hours. BPA-free and phthalate-free. 18/8 pro-grade stainless steel.',
    price: 44.95,
    category: 'Sports',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=600'
    ],
    rating: 4.8,
    review_count: 5678,
    created_at: new Date().toISOString()
  }
];

// =============================================
// IN-MEMORY STATE
// =============================================
let cartItems = []; // { id, cart_id, product_id, quantity }
let cartItemIdCounter = 1;
let orders = [];    // { id, user_id, total_amount, address, status, created_at, items: [] }
let orderIdCounter = 1;
let orderItemIdCounter = 1;

// =============================================
// PRODUCT OPERATIONS
// =============================================
function getAllProducts(category) {
  if (category) {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return [...products];
}

function getProductById(id) {
  return products.find(p => p.id === parseInt(id)) || null;
}

function searchProducts(query) {
  const term = query.toLowerCase();
  return products.filter(p =>
    p.title.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term)
  );
}

function getCategories() {
  return [...new Set(products.map(p => p.category))].sort();
}

// =============================================
// CART OPERATIONS
// =============================================
function getCart() {
  const items = cartItems.map(ci => {
    const product = products.find(p => p.id === ci.product_id);
    return {
      id: ci.id,
      quantity: ci.quantity,
      product_id: product.id,
      title: product.title,
      price: product.price,
      images: product.images,
      stock: product.stock,
    };
  });

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart_id: 1,
    items,
    total_items: totalItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
  };
}

function addToCart(productId, quantity = 1) {
  const existing = cartItems.find(ci => ci.product_id === parseInt(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({
      id: cartItemIdCounter++,
      cart_id: 1,
      product_id: parseInt(productId),
      quantity,
    });
  }
  return getCart();
}

function updateCartItem(cartItemId, quantity) {
  const item = cartItems.find(ci => ci.id === parseInt(cartItemId));
  if (!item) return null;
  item.quantity = quantity;
  return getCart();
}

function removeCartItem(cartItemId) {
  const index = cartItems.findIndex(ci => ci.id === parseInt(cartItemId));
  if (index === -1) return null;
  cartItems.splice(index, 1);
  return getCart();
}

function clearCart() {
  cartItems = [];
}

// =============================================
// ORDER OPERATIONS
// =============================================
function createOrder(address) {
  const cart = getCart();
  if (cart.items.length === 0) return null;

  const orderId = orderIdCounter++;
  const orderItems = cart.items.map(item => ({
    id: orderItemIdCounter++,
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
    title: item.title,
    images: item.images,
  }));

  // Decrease stock
  for (const item of cart.items) {
    const product = products.find(p => p.id === item.product_id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  const order = {
    id: orderId,
    user_id: 1,
    total_amount: cart.subtotal,
    address,
    status: 'pending',
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  orders.push(order);
  clearCart();
  return order;
}

function getOrderById(orderId) {
  return orders.find(o => o.id === parseInt(orderId)) || null;
}

module.exports = {
  getAllProducts,
  getProductById,
  searchProducts,
  getCategories,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  createOrder,
  getOrderById,
};
