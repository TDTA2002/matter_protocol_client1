import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer } from './slices/user.slices';

// Kết hợp reducer
const rootReducer = combineReducers({
    userStore: userReducer,
});

// Xuất ra store type
export type StoreType = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer
})

export default store