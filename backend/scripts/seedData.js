const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopmaster_pro';

// Sample Data
const categoriesData = [
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices.',
        image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        sortOrder: 1
    },
    {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        sortOrder: 2
    },
    {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Decor and essentials for your home.',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        sortOrder: 3
    },
    {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Gear for your active lifestyle.',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        sortOrder: 4
    }
];

const productsData = [
    {
        name: 'Premium Wireless Headphones',
        sku: 'AUDIO-001',
        slug: 'premium-wireless-headphones',
        categorySlug: 'electronics',
        basePrice: 2499,
        sellingPrice: 1999,
        description: 'Experience high-fidelity sound with our Premium Wireless Headphones. Featuring active noise cancellation, 30-hour battery life, and plush ear cushions for all-day comfort.',
        shortDescription: 'High-fidelity wireless headphones with noise cancellation.',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 45,
        avgPurchasePrice: 1500,
        isFeatured: true
    },
    {
        name: 'Smart Fitness Watch',
        sku: 'WEAR-002',
        slug: 'smart-fitness-watch',
        categorySlug: 'electronics',
        basePrice: 3999,
        sellingPrice: 2499,
        description: 'Track your health and fitness goals with precision. Monitors heart rate, sleep, and activity levels. Water-resistant and features a vibrant OLED display.',
        shortDescription: 'Advanced fitness tracker with heart rate monitoring.',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 12,
        avgPurchasePrice: 1800,
        isFeatured: true
    },
    {
        name: 'Leather Crossbody Bag',
        sku: 'FASH-003',
        slug: 'leather-crossbody-bag',
        categorySlug: 'fashion',
        basePrice: 1800,
        sellingPrice: 1299,
        description: 'Handcrafted from genuine leather, this crossbody bag is perfect for daily use. Features multiple compartments and an adjustable strap.',
        shortDescription: 'Genuine leather bag with adjustable strap.',
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 8,
        avgPurchasePrice: 900
    },
    {
        name: 'Ceramic Plant Pot Set',
        sku: 'HOME-004',
        slug: 'ceramic-plant-pot-set',
        categorySlug: 'home-living',
        basePrice: 899,
        sellingPrice: 599,
        description: 'Add a touch of greenery to your home with this set of 3 ceramic plant pots. Modern design suitable for indoor and outdoor use.',
        shortDescription: 'Set of 3 modern ceramic plant pots.',
        images: [
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 15,
        avgPurchasePrice: 300
    },
    {
        name: 'Yoga Mat Professional',
        sku: 'SPRT-005',
        slug: 'yoga-mat-professional',
        categorySlug: 'sports-fitness',
        basePrice: 1200,
        sellingPrice: 899,
        description: 'Extra thick non-slip yoga mat for maximum comfort and stability during your practice. Eco-friendly material.',
        shortDescription: 'Non-slip, extra thick professional yoga mat.',
        images: [
            'https://images.unsplash.com/photo-1592432678010-c59121c2f987?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 60,
        avgPurchasePrice: 500
    },
    {
        name: 'Mechanical Gaming Keyboard',
        sku: 'TECH-006',
        slug: 'mechanical-gaming-keyboard',
        categorySlug: 'electronics',
        basePrice: 4500,
        sellingPrice: 3499,
        description: 'RGB backlit mechanical keyboard with blue switches for tactile feedback. Durable aluminum frame.',
        shortDescription: 'RGB mechanical keyboard for gaming.',
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b91a05c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 25,
        avgPurchasePrice: 2500,
        isFeatured: true
    },
    {
        name: 'Classic Denim Jacket',
        sku: 'FASH-007',
        slug: 'classic-denim-jacket',
        categorySlug: 'fashion',
        basePrice: 2200,
        sellingPrice: 1599,
        description: 'Timeless denim jacket with a vintage wash. A wardrobe staple that never goes out of style.',
        shortDescription: 'Vintage wash classic denim jacket.',
        images: [
            'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 40,
        avgPurchasePrice: 1000
    },
    {
        name: 'Modern Table Lamp',
        sku: 'HOME-008',
        slug: 'modern-table-lamp',
        categorySlug: 'home-living',
        basePrice: 1500,
        sellingPrice: 999,
        description: 'Minimalist table lamp with adjustable brightness. ideal for bedside or study desk.',
        shortDescription: 'Minimalist adjustable table lamp.',
        images: [
            'https://images.unsplash.com/photo-1507473888900-52e1adad5489?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        currentStock: 5,
        avgPurchasePrice: 600
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('Cleared existing data');

        // Create Users
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@shopmaster.com',
            password: 'admin123',
            role: 'admin',
            isActive: true,
        });

        const staff = await User.create({
            name: 'Staff User',
            email: 'staff@shopmaster.com',
            password: 'staff123',
            role: 'staff',
            isActive: true,
        });

        const customer = await User.create({
            name: 'John Customer',
            email: 'customer@example.com',
            password: 'customer123',
            role: 'customer',
            phone: '9876543210',
            address: {
                street: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001',
            },
        });

        const customer2 = await User.create({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: 'customer123',
            role: 'customer',
            phone: '9876543211',
            address: {
                street: '456 Park Avenue',
                city: 'Delhi',
                state: 'Dl',
                pincode: '110001',
            },
        });

        console.log('Created users');

        // Create Categories
        const categoryMap = {};
        for (const catData of categoriesData) {
            const category = await Category.create(catData);
            categoryMap[catData.slug] = category._id;
        }
        console.log('Created categories');

        // Create Products
        const createdProducts = [];
        for (const prodData of productsData) {
            const { categorySlug, ...productFields } = prodData;
            const product = await Product.create({
                ...productFields,
                category: categoryMap[categorySlug],
                createdBy: admin._id,
                images: productFields.images.map(url => ({ url, alt: productFields.name, isPrimary: true }))
            });
            createdProducts.push(product);
        }
        console.log('Created', createdProducts.length, 'products');

        // Create Orders
        // 1. Completed order for John
        await Order.create({
            orderNumber: 'ORD-20231201-0001',
            customer: customer._id,
            items: [
                {
                    product: createdProducts[0]._id, // Headphones
                    name: createdProducts[0].name,
                    sku: createdProducts[0].sku,
                    qty: 1,
                    priceAtOrder: createdProducts[0].sellingPrice,
                    lineTotal: createdProducts[0].sellingPrice
                },
                {
                    product: createdProducts[2]._id, // Bag
                    name: createdProducts[2].name,
                    sku: createdProducts[2].sku,
                    qty: 1,
                    priceAtOrder: createdProducts[2].sellingPrice,
                    lineTotal: createdProducts[2].sellingPrice
                }
            ],
            subtotal: 3298,
            taxAmount: 0,
            shippingAmount: 0,
            totalAmount: 3298,
            status: 'completed',
            paymentInfo: { method: 'card', status: 'paid', paidAt: new Date() },
            shippingAddress: { ...customer.address, fullName: customer.name, phone: customer.phone },
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        });

        // 2. Processing order for Jane
        await Order.create({
            orderNumber: 'ORD-20231205-0002',
            customer: customer2._id,
            items: [
                {
                    product: createdProducts[1]._id, // Watch
                    name: createdProducts[1].name,
                    sku: createdProducts[1].sku,
                    qty: 1,
                    priceAtOrder: createdProducts[1].sellingPrice,
                    lineTotal: createdProducts[1].sellingPrice
                }
            ],
            subtotal: 2499,
            taxAmount: 0,
            shippingAmount: 50,
            totalAmount: 2549,
            status: 'processing',
            paymentInfo: { method: 'upi', status: 'paid', paidAt: new Date() },
            shippingAddress: { ...customer2.address, fullName: customer2.name, phone: customer2.phone },
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        });

        // 3. Pending order for John
        await Order.create({
            orderNumber: 'ORD-20231207-0003',
            customer: customer._id,
            items: [
                {
                    product: createdProducts[4]._id, // Yoga mat
                    name: createdProducts[4].name,
                    sku: createdProducts[4].sku,
                    qty: 2,
                    priceAtOrder: createdProducts[4].sellingPrice,
                    lineTotal: createdProducts[4].sellingPrice * 2
                }
            ],
            subtotal: 1798,
            shippingAmount: 100,
            totalAmount: 1898,
            status: 'pending',
            paymentInfo: { method: 'cod', status: 'pending' },
            shippingAddress: { ...customer.address, fullName: customer.name, phone: customer.phone },
            createdAt: new Date() // Today
        });

        console.log('Created sample orders');

        console.log('\n=== Seed Data Complete ===');
        console.log('Login Credentials:');
        console.log('Admin: admin@shopmaster.com / admin123');
        console.log('Customer: customer@example.com / customer123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
