import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCertificates = createAsyncThunk('certificates/fetchAll', async () => {
  const { data } = await api.get('/certificates');
  return data;
});

export const requestCertificate = createAsyncThunk('certificates/request', async (certData) => {
  const { data } = await api.post('/certificates', certData);
  return data;
});

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState: { certificates: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      });
  },
});

export default certificatesSlice.reducer;
