import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWallet = createAsyncThunk('wallet/fetch', async () => {
  const { data } = await api.get('/wallet');
  return data;
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    credits: 0,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => { state.loading = true; })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.credits = action.payload.credits;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default walletSlice.reducer;
