import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSessions = createAsyncThunk('sessions/fetchAll', async () => {
  const { data } = await api.get('/sessions');
  return data;
});

export const createSession = createAsyncThunk('sessions/create', async (sessionData) => {
  const { data } = await api.post('/sessions', sessionData);
  return data;
});

export const updateSession = createAsyncThunk('sessions/update', async ({ id, sessionData }) => {
  const { data } = await api.put(`/sessions/${id}`, sessionData);
  return data;
});

export const deleteSession = createAsyncThunk('sessions/delete', async (id) => {
  await api.delete(`/sessions/${id}`);
  return id;
});

export const updateSessionStatus = createAsyncThunk('sessions/updateStatus', async ({ id, status }) => {
  const { data } = await api.patch(`/sessions/${id}/status`, { status });
  return data;
});

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: { sessions: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => { state.loading = true; })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.sessions[index] = action.payload;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s._id !== action.payload);
      });
  },
});

export default sessionsSlice.reducer;
