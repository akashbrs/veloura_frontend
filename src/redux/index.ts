import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/slices/authSlice';
import productReducer from '@/redux/slices/productSlice';
import cartReducer from '@/redux/slices/cartSlice';
import orderReducer from '@/redux/slices/orderSlice';
import wishlistReducer from '@/redux/slices/wishlistSlice';
import addressReducer from '@/redux/slices/addressSlice';
import securityReducer from '@/redux/slices/securitySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        orders: orderReducer,
        wishlist: wishlistReducer,
        address: addressReducer,
        security: securityReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
