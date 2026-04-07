import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


export const stepPlot = createAsyncThunk(
  "step/add",
  async ({ step ,day}, { rejectWithValue }) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({step:step,day:day})
      });
      const data = await res.json();
      if (!res.ok) {
        // prefer server-provided message, fallback to raw text or status
        const message = data?.message || data?.error || data?._raw || `HTTP ${res.status}`;
        return rejectWithValue({ message });
      }

      return data;
    } catch (err) {
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);
const statistic_profile=createSlice({
    name :"statistic",
    initialState:{
        loading:false,
        bmi_scrore:null,
        category:null,
        data:null,
        error:null
    },
    reducers:{
        bmi_scores:(state,action)=>{
            state.bmi_scrore=action?.payload;
        },
        categorys:(state,payload)=>{
            state.category=action?.payload
            console.log("call category")
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(stepPlot.pending,(state)=>{
            state.loading=true;
        })
        .addCase(stepPlot.fulfilled,(state,acion)=>{
            state.loading=false;
            state.data=acion.payload.plotImage
        })
        .addCase(stepPlot.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.error
            console.log(action.payload)
        })
    }
})
export const {bmi_scores,categorys,data,loading} =statistic_profile.actions;
export default statistic_profile.reducer;