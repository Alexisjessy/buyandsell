import { createSlice } from '@reduxjs/toolkit';

const userLocal = localStorage.getItem('user');
const initialState = userLocal ? JSON.parse(userLocal) : null;

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            const newUser = action.payload;
            localStorage.setItem('user', JSON.stringify(newUser)); 
            return newUser; 
        },
        
        unsetUser: (state) => {
            localStorage.removeItem('user'); 
            return null; 
        },
    }
});


export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;
