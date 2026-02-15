import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMessages = createAsyncThunk('messages/fetch', async (swapRequestId) => {
  const { data } = await api.get(`/messages/${swapRequestId}`);
  return data;
});

export const sendMessage = createAsyncThunk('messages/send', async (messageData) => {
  const { data } = await api.post('/messages', messageData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
});

export const markAsRead = createAsyncThunk('messages/markRead', async (messageIds) => {
  await api.patch('/messages/read', { messageIds });
  return messageIds;
});

export const starMessage = createAsyncThunk('messages/star', async ({ id, isStarred }) => {
  const { data } = await api.patch(`/messages/${id}/star`, { isStarred });
  return data;
});

export const deleteMessage = createAsyncThunk('messages/delete', async ({ id, deleteForEveryone }) => {
  await api.delete(`/messages/${id}`, { data: { deleteForEveryone } });
  return { id, deleteForEveryone };
});

export const addReaction = createAsyncThunk('messages/reaction', async ({ id, emoji }) => {
  const { data } = await api.post(`/messages/${id}/reaction`, { emoji });
  return data;
});

export const logCall = createAsyncThunk('messages/logCall', async (callData) => {
  const { data } = await api.post('/messages/call/log', callData);
  return data;
});

export const votePoll = createAsyncThunk('messages/votePoll', async ({ id, optionIndex }) => {
  const { data } = await api.post(`/messages/${id}/poll/vote`, { optionIndex });
  return data;
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index !== -1) state.messages[index] = action.payload;
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
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        action.payload.forEach(id => {
          const msg = state.messages.find(m => m._id === id);
          if (msg) {
            msg.isRead = true;
            msg.readAt = new Date();
          }
        });
      })
      .addCase(starMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.messages[index] = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        if (action.payload.deleteForEveryone) {
          state.messages = state.messages.filter(m => m._id !== action.payload.id);
        }
      })
      .addCase(addReaction.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.messages[index] = action.payload;
      })
      .addCase(logCall.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(votePoll.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.messages[index] = action.payload;
      });
  },
});

export const { addMessage, updateMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
