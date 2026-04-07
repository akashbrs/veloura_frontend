import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { User } from '@/types';

interface AuthState {
    userInfo: User | null;
    users: User[]; // Admin uses this
    loading: boolean;
    success: boolean; // For operation tracking
    error: string | null;
    hasFetched: boolean; // Prevents duplicate fetchUser calls
}

const initialState: AuthState = {
    userInfo: null,
    users: [],
    loading: false,
    success: false,
    error: null,
    hasFetched: false,
};

// --- Real Async Thunks (Django API) ---
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('login/', credentials);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('signup/', userData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

// --- Mocked Legacy Thunks (For UI Compatibility) ---
export const fetchUserIfNeeded = createAsyncThunk(
    'auth/fetchUserIfNeeded',
    async (_, { getState }) => {
        const state = getState() as any;
        return state.auth.userInfo;
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData: any, { getState, rejectWithValue }) => {
        const state = getState() as any;
        if (!state.auth.userInfo) return rejectWithValue('Not logged in');
        return { ...state.auth.userInfo, ...profileData };
    }
);

export const updateSizes = createAsyncThunk(
    'auth/updateSizes',
    async ({ gender, data }: { gender: string, data: any }, { getState, rejectWithValue }) => {
        const state = getState() as any;
        if (!state.auth.userInfo) return rejectWithValue('Not logged in');
        const updatedUser = { ...state.auth.userInfo };
        updatedUser.sizePreferences = {
            ...updatedUser.sizePreferences,
            [gender]: data
        };
        return updatedUser;
    }
);

export const deleteMyAccount = createAsyncThunk(
    'auth/deleteMyAccount',
    async () => {
        return null;
    }
);

export const listUsers = createAsyncThunk(
    'auth/listUsers',
    async () => {
        return [];
    }
);

export const deleteUser = createAsyncThunk(
    'auth/deleteUser',
    async (id: string) => {
        return id;
    }
);

export const updateUserRole = createAsyncThunk(
    'auth/updateUserRole',
    async ({ id, role }: { id: string, role: 'user' | 'admin' }) => {
        return { id, role };
    }
);

// --- Slice ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuthState: (state) => {
            state.success = false;
        },
        logoutUser: (state) => {
            state.userInfo = null;
            state.hasFetched = false;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.userInfo = action.payload;
            const token = action.payload?.access_token || action.payload?.token;
            if (token) {
                localStorage.setItem('token', token);
            }
        });
        builder.addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        builder.addCase(register.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // fetchUserIfNeeded
        builder.addCase(fetchUserIfNeeded.fulfilled, (state, action: PayloadAction<any>) => {
            state.hasFetched = true;
            if (action.payload) state.userInfo = action.payload;
        });

        // updateProfile
        builder.addCase(updateProfile.pending, (state) => { state.loading = true; state.success = false; });
        builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.success = true;
            state.userInfo = action.payload;
        });
        builder.addCase(updateProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // updateSizes
        builder.addCase(updateSizes.pending, (state) => { state.loading = true; });
        builder.addCase(updateSizes.fulfilled, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.userInfo = action.payload;
        });
        builder.addCase(updateSizes.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // deleteMyAccount
        builder.addCase(deleteMyAccount.fulfilled, (state) => {
            state.userInfo = null;
            localStorage.removeItem('token');
        });

        // listUsers
        builder.addCase(listUsers.pending, (state) => { state.loading = true; });
        builder.addCase(listUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.users = action.payload;
        });
        builder.addCase(listUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });

        // deleteUser
        builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u._id !== action.payload);
        });

        // updateUserRole
        builder.addCase(updateUserRole.fulfilled, (state, action: PayloadAction<{id: string, role: 'user' | 'admin'}>) => {
            const user = state.users.find(u => u._id === action.payload.id);
            if (user) user.role = action.payload.role;
        });
    }
});

export const { clearError, resetAuthState, logoutUser } = authSlice.actions;
export default authSlice.reducer;
