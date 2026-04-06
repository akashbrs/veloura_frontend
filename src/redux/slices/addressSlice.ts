import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Address } from '@/types';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: AddressState = {
    addresses: [],
    loading: false,
    error: null,
    success: false,
};

const LOCAL_ADDRESSES_KEY = 'VELOURA_mock_addresses';

const getLocalAddresses = (): Address[] => {
    try {
        const raw = localStorage.getItem(LOCAL_ADDRESSES_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
};

const saveLocalAddresses = (addresses: Address[]) => {
    localStorage.setItem(LOCAL_ADDRESSES_KEY, JSON.stringify(addresses));
};

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        return getLocalAddresses();
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData: Omit<Address, '_id' | 'user'>, { rejectWithValue }) => {
        const addresses = getLocalAddresses();
        const newAddress = { ...addressData, _id: Date.now().toString() } as Address;
        
        if (addresses.length === 0 || newAddress.isDefault) {
             addresses.forEach(a => a.isDefault = false);
             newAddress.isDefault = true;
        }
        addresses.push(newAddress);
        saveLocalAddresses(addresses);
        return addresses;
    }
);

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ id, data }: { id: string, data: Partial<Address> }, { rejectWithValue }) => {
        let addresses = getLocalAddresses();
        const index = addresses.findIndex(a => a._id === id);
        if (index !== -1) {
            if (data.isDefault) addresses.forEach(a => a.isDefault = false);
            addresses[index] = { ...addresses[index], ...data };
            saveLocalAddresses(addresses);
        }
        return addresses;
    }
);

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (id: string, { rejectWithValue }) => {
        let addresses = getLocalAddresses();
        addresses = addresses.filter(a => a._id !== id);
        saveLocalAddresses(addresses);
        return id;
    }
);

export const setDefaultAddress = createAsyncThunk(
    'address/setDefaultAddress',
    async (id: string, { rejectWithValue }) => {
        let addresses = getLocalAddresses();
        addresses.forEach(a => { a.isDefault = a._id === id; });
        saveLocalAddresses(addresses);
        return addresses;
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearAddressState: (state) => {
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.addresses = state.addresses.filter(a => a._id !== action.payload);
                state.success = true;
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Set Default
            .addCase(setDefaultAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(setDefaultAddress.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.success = true;
            })
            .addCase(setDefaultAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;
