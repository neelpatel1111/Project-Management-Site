import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn : false,
  user : null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLogin:(state, actions) => {
      state.isLoggedIn = true;
      state.user = actions.payload;
    },
    setUserLogout:(state)=>{
      state.isLoggedIn = false;
      state.user = null;
    }
  },
})

export const { setUserLogin, setUserLogout } = userSlice.actions

export default userSlice.reducer