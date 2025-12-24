// Mock data for demo purposes - makes the website look functional
// This simulates what would come from the backend API

export const mockCategories = [
    {
        _id: 'cat1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Gadgets, devices, and tech accessories',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
        productCount: 24,
        isActive: true
    },
    {
        _id: 'cat2',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, accessories, and footwear',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
        productCount: 56,
        isActive: true
    },
    {
        _id: 'cat3',
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture, decor, and home essentials',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop',
        productCount: 38,
        isActive: true
    },
    {
        _id: 'cat4',
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Equipment, apparel, and accessories',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
        productCount: 19,
        isActive: true
    }
];

export const mockProducts = [
    {
        _id: 'prod1',
        name: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        sku: 'EL-HP-001',
        description: 'Experience exceptional sound quality with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for extended listening.',
        basePrice: 2499,
        sellingPrice: 1999,
        category: { _id: 'cat1', name: 'Electronics' },
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
        ],
        currentStock: 45,
        avgPurchasePrice: 1200,
        hasVariants: true,
        variants: [
            { _id: 'v1', name: 'Black', attributes: { color: 'Black' }, priceAdjustment: 0 },
            { _id: 'v2', name: 'White', attributes: { color: 'White' }, priceAdjustment: 100 },
            { _id: 'v3', name: 'Rose Gold', attributes: { color: 'Rose Gold' }, priceAdjustment: 200 }
        ],
        isActive: true,
        createdAt: '2024-11-01T10:00:00Z'
    },
    {
        _id: 'prod2',
        name: 'Smart Fitness Watch Pro',
        slug: 'smart-fitness-watch-pro',
        sku: 'EL-SW-002',
        description: 'Track your fitness goals with precision. Heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50m.',
        basePrice: 4999,
        sellingPrice: 3999,
        category: { _id: 'cat1', name: 'Electronics' },
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
        ],
        currentStock: 28,
        avgPurchasePrice: 2500,
        hasVariants: false,
        variants: [],
        isActive: true,
        createdAt: '2024-11-05T10:00:00Z'
    },
    {
        _id: 'prod3',
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-tshirt',
        sku: 'FA-TS-001',
        description: 'Premium quality 100% organic cotton t-shirt. Soft, breathable, and perfect for everyday wear. Pre-shrunk fabric for lasting fit.',
        basePrice: 799,
        sellingPrice: 599,
        category: { _id: 'cat2', name: 'Fashion' },
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop'
        ],
        currentStock: 120,
        avgPurchasePrice: 300,
        hasVariants: true,
        variants: [
            { _id: 'v4', name: 'S-White', attributes: { size: 'S', color: 'White' }, priceAdjustment: 0 },
            { _id: 'v5', name: 'M-White', attributes: { size: 'M', color: 'White' }, priceAdjustment: 0 },
            { _id: 'v6', name: 'L-Black', attributes: { size: 'L', color: 'Black' }, priceAdjustment: 50 },
            { _id: 'v7', name: 'XL-Black', attributes: { size: 'XL', color: 'Black' }, priceAdjustment: 50 }
        ],
        isActive: true,
        createdAt: '2024-11-10T10:00:00Z'
    },
    {
        _id: 'prod4',
        name: 'Minimalist Desk Lamp',
        slug: 'minimalist-desk-lamp',
        sku: 'HL-DL-001',
        description: 'Modern LED desk lamp with adjustable brightness and color temperature. Touch control, USB charging port, and flexible neck design.',
        basePrice: 1499,
        sellingPrice: 1199,
        category: { _id: 'cat3', name: 'Home & Living' },
        images: [
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop'
        ],
        currentStock: 35,
        avgPurchasePrice: 650,
        hasVariants: false,
        variants: [],
        isActive: true,
        createdAt: '2024-11-12T10:00:00Z'
    },
    {
        _id: 'prod5',
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        sku: 'SP-YM-001',
        description: 'Extra thick 6mm eco-friendly yoga mat with alignment lines. Non-slip surface, perfect for yoga, pilates, and floor exercises.',
        basePrice: 1299,
        sellingPrice: 999,
        category: { _id: 'cat4', name: 'Sports & Fitness' },
        images: [
            'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop'
        ],
        currentStock: 52,
        avgPurchasePrice: 450,
        hasVariants: true,
        variants: [
            { _id: 'v8', name: 'Purple', attributes: { color: 'Purple' }, priceAdjustment: 0 },
            { _id: 'v9', name: 'Teal', attributes: { color: 'Teal' }, priceAdjustment: 0 },
            { _id: 'v10', name: 'Black', attributes: { color: 'Black' }, priceAdjustment: 0 }
        ],
        isActive: true,
        createdAt: '2024-11-15T10:00:00Z'
    },
    {
        _id: 'prod6',
        name: 'Bluetooth Portable Speaker',
        slug: 'bluetooth-portable-speaker',
        sku: 'EL-SP-003',
        description: 'Compact yet powerful Bluetooth speaker with 360° surround sound. 12-hour playtime, waterproof IPX7 rating, and built-in microphone.',
        basePrice: 2999,
        sellingPrice: 2499,
        category: { _id: 'cat1', name: 'Electronics' },
        images: [
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
        ],
        currentStock: 18,
        avgPurchasePrice: 1400,
        hasVariants: false,
        variants: [],
        isActive: true,
        createdAt: '2024-11-18T10:00:00Z'
    },
    {
        _id: 'prod7',
        name: 'Leather Crossbody Bag',
        slug: 'leather-crossbody-bag',
        sku: 'FA-BG-002',
        description: 'Genuine leather crossbody bag with adjustable strap. Multiple compartments, secure zip closure, and timeless design for any occasion.',
        basePrice: 2499,
        sellingPrice: 1899,
        category: { _id: 'cat2', name: 'Fashion' },
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop'
        ],
        currentStock: 8,
        avgPurchasePrice: 900,
        hasVariants: true,
        variants: [
            { _id: 'v11', name: 'Tan', attributes: { color: 'Tan' }, priceAdjustment: 0 },
            { _id: 'v12', name: 'Black', attributes: { color: 'Black' }, priceAdjustment: 0 }
        ],
        isActive: true,
        createdAt: '2024-11-20T10:00:00Z'
    },
    {
        _id: 'prod8',
        name: 'Ceramic Plant Pot Set',
        slug: 'ceramic-plant-pot-set',
        sku: 'HL-PP-002',
        description: 'Set of 3 handcrafted ceramic pots with drainage holes and saucers. Perfect for succulents, herbs, and small indoor plants.',
        basePrice: 899,
        sellingPrice: 699,
        category: { _id: 'cat3', name: 'Home & Living' },
        images: [
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop'
        ],
        currentStock: 42,
        avgPurchasePrice: 350,
        hasVariants: false,
        variants: [],
        isActive: true,
        createdAt: '2024-11-22T10:00:00Z'
    }
];

export const mockOrders = [
    {
        _id: 'ord1',
        orderNumber: 'ORD-2024-001',
        customer: { _id: 'user1', name: 'Rahul Sharma', email: 'rahul@example.com' },
        items: [
            { product: mockProducts[0], qty: 1, priceAtOrder: 1999, lineTotal: 1999 },
            { product: mockProducts[3], qty: 2, priceAtOrder: 1199, lineTotal: 2398 }
        ],
        subtotal: 4397,
        tax: 791,
        total: 5188,
        status: 'completed',
        shippingAddress: { street: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', zip: '400001', country: 'India' },
        paymentInfo: { method: 'cod', status: 'paid' },
        createdAt: '2024-12-01T14:30:00Z',
        updatedAt: '2024-12-03T10:00:00Z'
    },
    {
        _id: 'ord2',
        orderNumber: 'ORD-2024-002',
        customer: { _id: 'user2', name: 'Priya Patel', email: 'priya@example.com' },
        items: [
            { product: mockProducts[2], qty: 3, priceAtOrder: 599, lineTotal: 1797 }
        ],
        subtotal: 1797,
        tax: 323,
        total: 2120,
        status: 'shipped',
        shippingAddress: { street: '456 Park Street', city: 'Bangalore', state: 'Karnataka', zip: '560001', country: 'India' },
        paymentInfo: { method: 'cod', status: 'pending' },
        createdAt: '2024-12-03T09:15:00Z',
        updatedAt: '2024-12-04T16:00:00Z'
    },
    {
        _id: 'ord3',
        orderNumber: 'ORD-2024-003',
        customer: { _id: 'user3', name: 'Amit Kumar', email: 'amit@example.com' },
        items: [
            { product: mockProducts[1], qty: 1, priceAtOrder: 3999, lineTotal: 3999 },
            { product: mockProducts[4], qty: 1, priceAtOrder: 999, lineTotal: 999 }
        ],
        subtotal: 4998,
        tax: 900,
        total: 5898,
        status: 'confirmed',
        shippingAddress: { street: '789 Civil Lines', city: 'Delhi', state: 'Delhi', zip: '110001', country: 'India' },
        paymentInfo: { method: 'cod', status: 'pending' },
        createdAt: '2024-12-05T11:45:00Z',
        updatedAt: '2024-12-05T12:00:00Z'
    },
    {
        _id: 'ord4',
        orderNumber: 'ORD-2024-004',
        customer: { _id: 'user4', name: 'Sneha Reddy', email: 'sneha@example.com' },
        items: [
            { product: mockProducts[6], qty: 1, priceAtOrder: 1899, lineTotal: 1899 }
        ],
        subtotal: 1899,
        tax: 342,
        total: 2241,
        status: 'pending',
        shippingAddress: { street: '321 Tank Bund Road', city: 'Hyderabad', state: 'Telangana', zip: '500001', country: 'India' },
        paymentInfo: { method: 'cod', status: 'pending' },
        createdAt: '2024-12-06T08:30:00Z',
        updatedAt: '2024-12-06T08:30:00Z'
    }
];

export const mockDashboardStats = {
    totalSales: 156750,
    totalOrders: 42,
    pendingOrders: 8,
    inventoryValue: 485000,
    lowStockCount: 3,
    todaySales: 12500,
    todayOrders: 5,
    topProducts: [
        { name: 'Premium Wireless Headphones', sales: 28, revenue: 55972 },
        { name: 'Smart Fitness Watch Pro', sales: 18, revenue: 71982 },
        { name: 'Classic Cotton T-Shirt', sales: 45, revenue: 26955 },
        { name: 'Bluetooth Portable Speaker', sales: 12, revenue: 29988 },
        { name: 'Yoga Mat Premium', sales: 22, revenue: 21978 }
    ],
    recentOrders: mockOrders.slice(0, 5),
    salesByDay: [
        { date: '2024-12-01', sales: 18500 },
        { date: '2024-12-02', sales: 22000 },
        { date: '2024-12-03', sales: 15800 },
        { date: '2024-12-04', sales: 28900 },
        { date: '2024-12-05', sales: 31200 },
        { date: '2024-12-06', sales: 12500 }
    ]
};

export const mockLowStockProducts = [
    { ...mockProducts[6], currentStock: 8 },
    { ...mockProducts[5], currentStock: 18 },
    { ...mockProducts[1], currentStock: 28 }
];
