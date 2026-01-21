import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
const initialState = {
  loading: false,
  error: null,
  stage1Data: null,
 
};

export const getStage1 = createAsyncThunk(
  "/stage/stage1",
  async (_, { rejectWithValue }) => {
    try {
      console.log("posting stage1 data action is calling");

      const response = await axios.get(
        "http://localhost:5000/api/personal-information/4"
      );

      console.log("response data is******:", response.data);

      return response.data;
    } catch (err) {
      console.log("error is:", err?.response?.data);
      return rejectWithValue(err?.response?.data);
    }
  }
);




const stage1Slice = createSlice({
  name: "serviceMaster",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getStage1.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getStage1.fulfilled, (state, action) => {
      state.stage1Data= action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getStage1.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

   

    
  },
});
//generate reducer
const stage1Reducer = stage1Slice.reducer;
export default stage1Reducer;
