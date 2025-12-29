import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPrimaryImageUrl } from '../utils/imageHelper';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('shopmaster_cart');
        if (storedCart) {
            try {
                return JSON.parse(storedCart);
            } catch (error) {
                console.error('Failed to parse cart items', error);
                return [];
            }
        }
        return [];
    });

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('shopmaster_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, variant = null, qty = 1) => {
        setCartItems((prevItems) => {
            // Create a unique ID for the item based on product ID and variant
            const itemId = variant ? `${product._id}-${variant.name}` : product._id;

            const existingItem = prevItems.find((item) => item.itemId === itemId);

            if (existingItem) {
                toast.success(`Updated quantity for ${product.name}`);
                return prevItems.map((item) =>
                    item.itemId === itemId
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                toast.success(`Added ${product.name} to cart`);
                return [
                    ...prevItems,
                    {
                        itemId,
                        productId: product._id,
                        name: product.name,
                        price: variant ? (product.basePrice + (variant.additionalPrice || 0)) : product.basePrice, // Updated for model consistency
                        image: getPrimaryImageUrl(product.images) || '', // Handle both string and object image formats
                        variant: variant,
                        qty,
                        productData: product // Store full product data for reference if needed
                    },
                ];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
        toast.success('Item removed from cart');
    };

    const updateQuantity = (itemId, newQty) => {
        if (newQty < 1) return;
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.itemId === itemId ? { ...item, qty: newQty } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('shopmaster_cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.qty, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
