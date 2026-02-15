import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';
import walletReducer from './slices/walletSlice';
import notificationsReducer from './slices/notificationsSlice';
import sessionsReducer from './slices/sessionsSlice';
import swapsReducer from './slices/swapsSlice';
import reviewsReducer from './slices/reviewsSlice';
import messagesReducer from './slices/messagesSlice';
import badgesReducer from './slices/badgesSlice';
import certificatesReducer from './slices/certificatesSlice';
import forumReducer from './slices/forumSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    skills: skillsReducer,
    wallet: walletReducer,
    notifications: notificationsReducer,
    sessions: sessionsReducer,
    swaps: swapsReducer,
    reviews: reviewsReducer,
    messages: messagesReducer,
    badges: badgesReducer,
    certificates: certificatesReducer,
    forum: forumReducer,
    admin: adminReducer,
  },
});

export default store;
