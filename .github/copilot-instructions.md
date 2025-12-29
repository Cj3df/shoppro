# ShopMaster Pro - AI Coding Agent Instructions

## Project Overview

ShopMaster Pro is a full-stack retail ERP system with a React frontend and Node.js/Express backend. The architecture follows a clear separation between admin/staff operations and customer-facing storefront functionality.

**Key Architecture Patterns:**
- **Dual Layout System**: AdminLayout for staff/admin operations, StorefrontLayout for customer experience
- **Role-Based Access Control**: Admin, staff, and customer roles with middleware protection
- **JWT Authentication**: Token-based auth with automatic refresh and localStorage persistence
- **MongoDB with Mongoose**: Document-based data modeling with relationships
- **Tailwind CSS**: Utility-first styling with consistent design system

## Development Workflow

### Commands
```bash
# Start both backend and frontend
npm run start-all

# Individual services
npm run dev --prefix backend  # Backend on port 5000
npm run dev --prefix frontend # Frontend on port 5173

# Backend specific
npm run seed  # Seed database with mock data

# Frontend specific  
npm run build # Build for production
npm run lint  # ESLint check
```

### Environment Setup
- Backend: `.env` file with `MONGO_URI`, `JWT_SECRET`, `PORT=5000`
- Frontend: `VITE_API_URL` (defaults to `/api` with proxy to localhost:5000)
- Database: MongoDB local instance on default port 27017

## Code Organization

### Backend Structure
```
backend/
├── controllers/     # Business logic (auth, products, orders, etc.)
├── models/         # Mongoose schemas (User, Product, Order, etc.)
├── routes/         # API endpoints with middleware
├── middleware/     # Auth, validation, error handling
├── utils/          # Helpers (token generation, email, SKU/slug)
└── scripts/        # Data seeding and utilities
```

### Frontend Structure
```
frontend/src/
├── components/     # Reusable UI components
├── pages/          # Route-level components
├── layouts/        # AdminLayout, StorefrontLayout
├── context/        # AuthContext, CartContext
├── router/         # ProtectedRoute, RoleRoute
├── config/         # apiClient with JWT interceptors
└── utils/          # Image helpers, formatters
```

## Key Patterns & Conventions

### Authentication Flow
- **Frontend**: AuthContext manages login state, token storage, and user data
- **Backend**: JWT middleware (`protect`, `roleMiddleware`) for route protection
- **API Client**: Automatic token attachment via axios interceptors

### Product Management
- **Variants**: Products support multiple variants with SKUs, attributes, and pricing
- **Inventory**: Real-time stock tracking with weighted average cost calculation
- **Categories**: Hierarchical category system with image support

### Order Processing
- **Status Flow**: Pending → Confirmed → Processing → Shipped → Delivered
- **Payment**: Integration-ready structure (Phase 2)
- **Inventory**: Automatic stock deduction on order confirmation

### Admin vs Storefront
- **Admin Routes**: `/admin/*` with RoleRoute protection for admin/staff
- **Storefront Routes**: Customer-facing pages with cart and wishlist
- **Shared Components**: ProductCard, ReviewSection used in both contexts

## Important Files & Examples

### Authentication Example
```javascript
// Frontend: Login with token persistence
const login = async (email, password) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.data.user);
};

// Backend: Protected route with role check
app.use('/api/admin', protect, roleMiddleware(['admin', 'staff']));
```

### Product with Variants
```javascript
// Product model supports variants with attributes
const product = {
    name: "Wireless Headphones",
    variants: [{
        name: "Black",
        sku: "EL-HP-001-BK",
        attributes: { color: "Black", connectivity: "Wireless" },
        additionalPrice: 0,
        currentStock: 50
    }]
};
```

### API Client Configuration
```javascript
// Automatic JWT token attachment
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
```

## Integration Points

### Database Models
- **User**: Role-based permissions, address management, wishlist
- **Product**: SKU generation, variant management, inventory tracking
- **Order**: Customer association, status tracking, payment integration ready
- **Inventory**: Stock movement tracking, cost calculation

### External Services (Phase 2 Ready)
- **Cloudinary**: Image upload infrastructure in place
- **Email**: Nodemailer configured for notifications
- **Payment**: Order model designed for payment gateway integration

## Development Tips

1. **Always use RoleRoute for admin endpoints** - Never expose admin functionality to customers
2. **Follow the variant pattern** - Products should support multiple variants when applicable
3. **Use the API client** - Don't make direct axios calls, use the configured apiClient
4. **Maintain inventory consistency** - Update stock levels in both product and inventory models
5. **Test with mock data** - Use the seed script to populate database for development

## Common Tasks

### Adding a New Product
1. Create product via Admin UI or API
2. Add variants with SKUs and attributes
3. Set initial inventory levels
4. Category association required

### Managing Orders
1. Orders flow through status pipeline
2. Inventory automatically updated on confirmation
3. Admin can update status, customers can track
4. Payment status separate from order status

### User Management
1. Role-based access controls throughout
2. Customer accounts for storefront
3. Admin/staff accounts for backend operations
4. Account activation/deactivation supported