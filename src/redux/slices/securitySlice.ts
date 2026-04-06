import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { AttackLog, AttackStat, SecurityState } from '@/types/security';

const initialState: SecurityState = {
  logs: [],
  stats: [],
  loading: false,
  error: null,
};

// --- Async Thunks ---

export const fetchAttackLogs = createAsyncThunk(
  'security/fetchLogs',
  async (_, { rejectWithValue }) => {
    try {
      // Documentation says /security/logs/ - using absolute path to bypass /api prefix
      const { data } = await api.get('/security/logs/', { baseURL: '/' });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch attack logs');
    }
  }
);

export const fetchAttackStats = createAsyncThunk(
  'security/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      // Documentation says /security/stats/ - using absolute path to bypass /api prefix
      const { data } = await api.get('/security/stats/', { baseURL: '/' });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch attack statistics');
    }
  }
);

// --- Slice ---

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    clearSecurityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Logs
    builder.addCase(fetchAttackLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAttackLogs.fulfilled, (state, action: PayloadAction<AttackLog[]>) => {
      state.loading = false;
      state.logs = action.payload;
    });
    builder.addCase(fetchAttackLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Stats
    builder.addCase(fetchAttackStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAttackStats.fulfilled, (state, action: PayloadAction<AttackStat[]>) => {
      state.loading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchAttackStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSecurityError } = securitySlice.actions;
export default securitySlice.reducer;
