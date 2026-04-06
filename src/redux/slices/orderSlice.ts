import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '@/types';

interface OrderState {
    orders: Order[];
    allOrders: Order[]; // Admin uses this
    orderDetails: Order | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: OrderState = {
    orders: [],
    allOrders: [],
    orderDetails: null,
    loading: false,
    error: null,
    success: false,
};

const LOCAL_ORDERS_KEY = 'VELOURA_mock_orders';

const getLocalOrders = (): Order[] => {
    try {
        const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalOrders = (orders: Order[]) => {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData: any, { rejectWithValue }) => {
        let orders = getLocalOrders();
        const newOrder = { 
            ...orderData, 
            _id: Date.now().toString(), 
            createdAt: new Date().toISOString(),
            status: 'Processing',
            isPaid: false
        } as Order;
        orders.push(newOrder);
        saveLocalOrders(orders);
        return newOrder;
    }
);

export const getOrderDetails = createAsyncThunk(
    'orders/details',
    async (id: string, { rejectWithValue }) => {
        const orders = getLocalOrders();
        const order = orders.find(o => o._id === id);
        if (order) return order;
        return rejectWithValue('Order not found locally');
    }
);

export const listMyOrders = createAsyncThunk(
    'orders/myOrders',
    async (_, { rejectWithValue }) => {
        return getLocalOrders();
    }
);

export const listAllOrders = createAsyncThunk(
    'orders/allOrders',
    async (_, { rejectWithValue }) => {
        return getLocalOrders();
    }
);

export const updateOrderToShipped = createAsyncThunk(
    'orders/shipped',
    async (id: string, { rejectWithValue }) => {
        let orders = getLocalOrders();
        const index = orders.findIndex(o => o._id === id);
        if (index !== -1) {
            orders[index].status = 'Shipped';
            saveLocalOrders(orders);
            return orders[index];
        }
        return rejectWithValue('Order not found');
    }
);

export const updateOrderToDelivered = createAsyncThunk(
    'orders/delivered',
    async (id: string, { rejectWithValue }) => {
        let orders = getLocalOrders();
        const index = orders.findIndex(o => o._id === id);
        if (index !== -1) {
            orders[index].status = 'Delivered';
            orders[index].deliveredAt = new Date().toISOString();
            saveLocalOrders(orders);
            return orders[index];
        }
        return rejectWithValue('Order not found');
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async ({ id, reason, note }: { id: string, reason: string, note?: string }, { rejectWithValue }) => {
        let orders = getLocalOrders();
        const index = orders.findIndex(o => o._id === id);
        if (index !== -1) {
            orders[index].status = 'Cancelled';
            saveLocalOrders(orders);
            return orders[index];
        }
        return rejectWithValue('Order not found');
    }
);

export const reorderItems = createAsyncThunk(
    'orders/reorder',
    async (id: string, { rejectWithValue }) => {
        // Just mock success since it doesn't need to actually trigger the backend
        return { success: true };
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        // Create Order
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.success = true;
            state.orderDetails = action.payload;
            state.orders.push(action.payload); // push to our local list
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get Order Details
        builder.addCase(getOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.orderDetails = action.payload;
        });
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // List My Orders
        builder.addCase(listMyOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(listMyOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(listMyOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // List All Orders (Admin)
        builder.addCase(listAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(listAllOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
            state.loading = false;
            state.allOrders = action.payload;
        });
        builder.addCase(listAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update to Shipped
        builder.addCase(updateOrderToShipped.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateOrderToShipped.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(updateOrderToShipped.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update to Delivered
        builder.addCase(updateOrderToDelivered.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateOrderToDelivered.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.success = true;
            state.orderDetails = action.payload;
            const index = state.orders.findIndex(o => o._id === action.payload._id);
            if (index !== -1) state.orders[index] = action.payload;
        });
        builder.addCase(updateOrderToDelivered.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Cancel Order
        builder.addCase(cancelOrder.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
            state.loading = false;
            state.success = true;
            state.orderDetails = action.payload;
            const index = state.orders.findIndex(o => o._id === action.payload._id);
            if (index !== -1) state.orders[index] = action.payload;
        });
        builder.addCase(cancelOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Reorder (just loading tracking)
        builder.addCase(reorderItems.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(reorderItems.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(reorderItems.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
