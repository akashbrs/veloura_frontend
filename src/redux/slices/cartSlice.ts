import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toastService } from '@/services/toastService';
import api from '@/services/api';
import type { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const GUEST_KEY = 'VELOURA_guest_cart';

const loadGuestCart = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(GUEST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveGuestCart = (items: CartItem[]) =>
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));

const initialState: CartState = {
    items: loadGuestCart(),
    loading: false,
    error: null,
};

const mapItems = (items: any[]): CartItem[] => {
    return items.reduce((acc, item) => {
        const prodId = item.product_id || item.product?._id || item.product;
        if (!prodId) {
            return acc;
        }
        acc.push({
            product: String(prodId),
            _id: String(prodId),
            name: item.name || item.product?.name || 'Product',
            image: item.image || item.product?.images?.[0] || '',
            price: item.price ?? item.product?.price ?? 0,
            originalPrice: item.originalPrice ?? item.product?.originalPrice,
            stock: item.stock ?? item.product?.stock ?? 0,
            quantity: item.quantity || 1,
            size: item.size || 'M',
            color: item.color,
        });
        return acc;
    }, [] as CartItem[]);
};

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/cart/view/');
            return Array.isArray(data) ? data : data.items || [];
        } catch (error: any) {
            if (error.response?.status === 401) return [];
            const message = error.message || error.response?.data?.message || 'Failed to fetch cart';
            toastService.error(message, 'cart-fetch-error');
            return rejectWithValue(message);
        }
    }
);

// Request specific merge removed (not in backend spec)

export const addCartItem = createAsyncThunk(
    'cart/add',
    async (itemData: {
        product: string;
        quantity: number;
        size?: string;
        color?: string;
        name?: string;
        price?: number;
        image?: string;
        images?: string[];
        category?: string;
        description?: string;
        stock?: number;
        originalPrice?: number;
    }, { rejectWithValue }) => {
        try {
            const payload = {
                product_id: itemData.product,
                name: itemData.name || 'Unknown Item',
                price: itemData.price || 0
            };
            const { data } = await api.post('/cart/add/', payload);
            return data.items || data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to add to cart';
            toastService.error(message, 'cart-add-error');
            return rejectWithValue(message);
        }
    }
);

export const removeCartItem = createAsyncThunk<{ product: string; size: string }, { product: string; size?: string }>(
    'cart/remove',
    async ({ product, size }, { rejectWithValue }) => {
        try {
            await api.post(`/cart/remove/`, { product_id: product });
            // Return BOTH product and a normalized size so we can filter precisely in the reducer
            return { product, size: size || 'M' };
        } catch (error: any) {
            const message = error.message || error.response?.data?.message || 'Failed to remove item';
            toastService.error(message, 'cart-remove-error');
            return rejectWithValue(message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            saveGuestCart([]);
        },
        addGuestItem: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const itemSize = item.size || 'M';
            const idx = state.items.findIndex(
                c => c.product === item.product && (c.size || 'M') === itemSize && c.color === item.color
            );
            if (idx > -1) {
                state.items[idx].quantity = (state.items[idx].quantity || 0) + (item.quantity || 1);
            } else {
                state.items.push({ ...item, size: itemSize });
            }
            saveGuestCart(state.items);
        },
        removeGuestItem: (state, action: PayloadAction<{ product: string; size?: string }>) => {
            const targetSize = action.payload.size || 'M';
            state.items = state.items.filter(
                c => !(c.product === action.payload.product && (c.size || 'M') === targetSize)
            );
            saveGuestCart(state.items);
        },
        updateGuestItem: (state, action: PayloadAction<{ product: string; size?: string; quantity: number }>) => {
            const idx = state.items.findIndex(
                c => c.product === action.payload.product && c.size === action.payload.size
            );
            if (idx > -1) {
                state.items[idx].quantity = action.payload.quantity;
            }
            saveGuestCart(state.items);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchCart.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            const backendItems = mapItems(action.payload);
            // Preserve guest items (local-slug products not stored in backend)
            const guestOnlyItems = state.items.filter(
                existing => !/^[a-f\d]{24}$/i.test(existing.product)
            );
            state.items = [...backendItems, ...guestOnlyItems];
        });
        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) state.error = action.payload as string;
        });

        // Merge Cart - removed


        builder.addCase(addCartItem.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addCartItem.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = mapItems(action.payload);
        });
        builder.addCase(addCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(removeCartItem.pending, (state) => { state.loading = true; });
        builder.addCase(removeCartItem.fulfilled, (state, action: PayloadAction<{ product: string; size: string }>) => {
            state.loading = false;
            const { product, size } = action.payload;
            state.items = state.items.filter(
                item => !(item.product === product && (item.size || 'M') === size)
            );
            toastService.success('Item removed from cart', [], 'cart-remove-success');
        });
        builder.addCase(removeCartItem.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearCart, addGuestItem, removeGuestItem, updateGuestItem } = cartSlice.actions;
export default cartSlice.reducer;
