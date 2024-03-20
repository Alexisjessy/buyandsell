import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'
import userReducer from '../features/session/sessionSlice';
import chatReducer from '../features/chat/chatSlice';

import notificationMiddleware from '../features/chat/notificationMiddleware';
export default configureStore({
    reducer: {
        // On ajoute le reducer en récupérant le reducerPath et le reducer depuis apiSlice
        [apiSlice.reducerPath]: apiSlice.reducer, 
    
       'user': userReducer,
       'chat' :chatReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(notificationMiddleware),

    // On ajoute aussi le middleware
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware)
    }
})