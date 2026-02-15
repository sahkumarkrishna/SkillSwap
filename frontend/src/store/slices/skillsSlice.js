import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSkills = createAsyncThunk('skills/fetch', async (filters = {}) => {
  const { data } = await api.get('/skills', { params: filters });
  return data;
});

export const fetchSkillById = createAsyncThunk('skills/fetchById', async (id) => {
  const { data } = await api.get(`/skills/${id}`);
  return data;
});

export const createSkill = createAsyncThunk('skills/create', async (skillData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/skills', skillData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create skill');
  }
});

export const updateSkill = createAsyncThunk('skills/update', async ({ id, skillData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/skills/${id}`, skillData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update skill');
  }
});

export const deleteSkill = createAsyncThunk('skills/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/skills/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete skill');
  }
});

export const requestSkill = createAsyncThunk('skills/request', async (id) => {
  const { data } = await api.post(`/skills/${id}/request`);
  return { id, message: data.message };
});

export const toggleFavorite = createAsyncThunk('skills/toggleFavorite', async (id) => {
  const { data } = await api.post(`/skills/${id}/favorite`);
  return { id, isFavorite: data.isFavorite };
});

export const rateSkill = createAsyncThunk('skills/rate', async ({ id, rating }) => {
  const { data } = await api.post(`/skills/${id}/rate`, { rating });
  return { id, ...data };
});

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    skills: [],
    currentSkill: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSkill: (state) => {
      state.currentSkill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.currentSkill = action.payload;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills.unshift(action.payload);
        state.error = null;
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.skills.findIndex(skill => skill._id === action.payload._id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = state.skills.filter(skill => skill._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(requestSkill.fulfilled, (state, action) => {
        const skill = state.skills.find(s => s._id === action.payload.id);
        if (skill) skill.requestCount = (skill.requestCount || 0) + 1;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const skill = state.skills.find(s => s._id === action.payload.id);
        if (skill) {
          skill.favoriteCount = action.payload.isFavorite 
            ? (skill.favoriteCount || 0) + 1 
            : Math.max((skill.favoriteCount || 0) - 1, 0);
        }
      })
      .addCase(rateSkill.fulfilled, (state, action) => {
        const skill = state.skills.find(s => s._id === action.payload.id);
        if (skill) {
          skill.rating = action.payload.rating;
          skill.ratingCount = action.payload.ratingCount;
        }
      });
  },
});

export const { clearCurrentSkill } = skillsSlice.actions;
export default skillsSlice.reducer;
