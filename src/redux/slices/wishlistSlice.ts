import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toastService } from '@/services/toastService';

/* ─── Types ──────────────────────────────────────────────────────────────── */
export interface WishlistProduct {
    _id?: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    category?: string;
    brand?: string;
}

interface WishlistState {
    items: WishlistProduct[];
    loading: boolean;
    error: string | null;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
    error: null,
};

/* ─── Async Thunks ───────────────────────────────────────────────────────── */
const LOCAL_WISHLIST_KEY = 'VELOURA_mock_wishlist';

const getLocalWishlist = (): WishlistProduct[] => {
    try {
        const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalWishlist = (items: WishlistProduct[]) => {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(items));
};

export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        return getLocalWishlist();
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/add',
    async (payload: {
        productId: string;
        name?: string;
        price?: number;
        image?: string;
        category?: string;
    }, { rejectWithValue }) => {
        let items = getLocalWishlist();
        if (!items.find(i => i.productId === payload.productId)) {
            items.push({
                _id: Date.now().toString(),
                productId: payload.productId,
                name: payload.name || 'Unknown Product',
                image: payload.image || '',
                price: payload.price || 0,
                category: payload.category || '',
            });
            saveLocalWishlist(items);
        }
        toastService.success('Added to wishlist ♥');
        return items;
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (productId: string, { rejectWithValue }) => {
        let items = getLocalWishlist();
        items = items.filter(i => i.productId !== productId);
        saveLocalWishlist(items);
        return items;
    }
);

export const moveWishlistToCart = createAsyncThunk(
    'wishlist/moveToCart',
    async (payload: { productId: string; size: string; quantity?: number }, { rejectWithValue }) => {
        let items = getLocalWishlist();
        items = items.filter(i => i.productId !== payload.productId);
        saveLocalWishlist(items);
        toastService.success('Moved to cart');
        return { wishlistProducts: items };
    }
);

export const moveAllWishlistToCart = createAsyncThunk(
    'wishlist/moveAllToCart',
    async (size: string = 'M', { rejectWithValue }) => {
        saveLocalWishlist([]);
        return { wishlistProducts: [] };
    }
);

/* ─── Slice ───────────────────────────────────────────────────────────────── */
const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        clearWishlist: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        /* ─── Fetch ─────────────────── */
        builder.addCase(fetchWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(fetchWishlist.rejected, (state, action) => {
            state.loading = false;
            if (action.payload) state.error = action.payload as string;
        });

        /* ─── Add ───────────────────── */
        builder.addCase(addToWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(addToWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Remove ────────────────── */
        builder.addCase(removeFromWishlist.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<WishlistProduct[]>) => {
            state.loading = false;
            state.items = action.payload;
        });
        builder.addCase(removeFromWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Move to Cart ──────────── */
        builder.addCase(moveWishlistToCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(moveWishlistToCart.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.items = action.payload.wishlistProducts || [];
        });
        builder.addCase(moveWishlistToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        /* ─── Move All to Cart ──────── */
        builder.addCase(moveAllWishlistToCart.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(moveAllWishlistToCart.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.items = action.payload.wishlistProducts || [];
        });
        builder.addCase(moveAllWishlistToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
