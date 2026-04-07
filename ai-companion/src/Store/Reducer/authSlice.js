// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const sendUser = createAsyncThunk(
  "user/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = res;
      if (!res.ok) {
        const message = data?.message || data?.error || data?._raw || `HTTP ${res.status}`;
        return rejectWithValue({ message });
      }
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = res.json();
      if (!res.ok) {
        const message = data?.message || data?.error || data?._raw || `HTTP ${res.status}`;
        return rejectWithValue({ message });
      }
      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);
export const googleLogin = createAsyncThunk(
  "user/google",
  async ({ idToken }) => {
    const res = await fetch("http://localhost:5000/auth/firebase/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    })
    const data = await res.json();
    if(!res.ok) { console.log("error Occur ",data.message||`HTTP ${res.status}` )}
    console.log(data);
    return data;
  }
)
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    response: null,
    isChange: true,
    haveProfile:false
  },
  reducers: {
    logout: (state) => {
      state.isChange = false;
      localStorage.removeItem("user");
      localStorage.removeItem("user_data");
      state.response = null;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(sendUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.meta.arg; // same as before
        state.error = null;
        state.response = "Sign-up Successful";
      })
      .addCase(sendUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Sign-up failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.response = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isChange = true;
        state.error = null;
        state.user = action.payload;
        state.response = "Login Successful";
        try {
          const toStore = action.payload?.data ?? action.payload;
          localStorage.setItem("user", JSON.stringify(toStore));
        } catch (e) {
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Login failed";
        console.log(state.error);
      })
      .addCase(googleLogin.pending,(state,action)=>{
        state.loading=false,
        state.error=null
      })
      .addCase(googleLogin.fulfilled,(state,action)=>{
        state.loading=false;
        state.error=null;
        state.user=action.payload.user
        const user_email=action.payload.user?.email;
        const user_name=action.payload.user?.name;
        const img_user=action.payload.user?.photoUrl
        localStorage.setItem("user",JSON.stringify({email:user_email,name:user_name,img:img_user}))
        state.isChange=true;
        state.haveProfile=true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Login failed";
        console.log(state.error);
      })
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
