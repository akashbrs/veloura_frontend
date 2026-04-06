import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Product } from '@/types';
import { fetchProducts, fetchProductById } from '@/services/productDataService';

interface ProductState {
    products: Product[];
    productDetails: Product | null;
    page: number;
    pages: number;
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    productDetails: null,
    page: 1,
    pages: 1,
    loading: false,
    success: false,
    error: null,
};

// Async Thunks
export const listProducts = createAsyncThunk(
    'products/list',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            const data = await fetchProducts(params);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const getProductDetails = createAsyncThunk(
    'products/details',
    async (id: string, { rejectWithValue }) => {
        try {
            const data = await fetchProductById(id);
            if (!data) {
                return rejectWithValue('Product not found');
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/products/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/create',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/products`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/update',
    async (product: any, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/products/${product._id}`, product);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductDetails: (state) => {
            state.productDetails = null;
        },
        resetProductState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // List Products
        builder.addCase(listProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(listProducts.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            // Handle both older array returns and newer paginated object returns
            if (Array.isArray(action.payload)) {
                state.products = action.payload;
                state.page = 1;
                state.pages = 1;
            } else {
                state.products = action.payload.products || [];
                state.page = action.payload.page || 1;
                state.pages = action.payload.pages || 1;
            }
        });
        builder.addCase(listProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get Product Details
        builder.addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
            state.loading = false;
            state.productDetails = action.payload;
        });
        builder.addCase(getProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete Product
        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteProduct.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Product
        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createProduct.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Product
        builder.addCase(updateProduct.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateProduct.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearProductDetails, resetProductState } = productSlice.actions;
export default productSlice.reducer;
