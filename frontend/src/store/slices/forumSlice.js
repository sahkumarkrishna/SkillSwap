import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchForumPosts = createAsyncThunk('forum/fetchAll', async () => {
  const { data } = await api.get('/forum');
  return data;
});

export const createForumPost = createAsyncThunk('forum/create', async (postData) => {
  const { data } = await api.post('/forum', postData);
  return data;
});

export const addAnswer = createAsyncThunk('forum/addAnswer', async ({ postId, content }) => {
  const { data } = await api.post(`/forum/${postId}/answers`, { content });
  return data;
});

export const upvotePost = createAsyncThunk('forum/upvotePost', async (postId) => {
  const { data } = await api.put(`/forum/${postId}/upvote`);
  return data;
});

export const upvoteAnswer = createAsyncThunk('forum/upvoteAnswer', async ({ postId, answerId }) => {
  const { data } = await api.put(`/forum/${postId}/answers/${answerId}/upvote`);
  return data;
});

export const acceptAnswer = createAsyncThunk('forum/acceptAnswer', async ({ postId, answerId }) => {
  const { data } = await api.put(`/forum/${postId}/answers/${answerId}/accept`);
  return data;
});

export const updatePost = createAsyncThunk('forum/updatePost', async ({ postId, postData }) => {
  const { data } = await api.put(`/forum/${postId}`, postData);
  return data;
});

export const deletePost = createAsyncThunk('forum/deletePost', async (postId) => {
  await api.delete(`/forum/${postId}`);
  return postId;
});

const forumSlice = createSlice({
  name: 'forum',
  initialState: { posts: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForumPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchForumPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchForumPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createForumPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(addAnswer.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(upvoteAnswer.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(acceptAnswer.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.posts[index] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
      });
  },
});

export default forumSlice.reducer;
