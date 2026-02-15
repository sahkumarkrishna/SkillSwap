import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMessages = createAsyncThunk('messages/fetch', async (userId) => {
  const { data } = await api.get(`/messages/${userId}`);
  return data;
});

export const sendMessage = createAsyncThunk('messages/send', async (messageData) => {
  const { data } = await api.post('/messages', messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
