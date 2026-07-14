import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../utils/baseUrl";
const initialState = {
  loading: false,
  error: null,
  genericEditData: null,
  for_page:null
 
};

export const getGenericEdit = createAsyncThunk(
  "/stage/stage1",
  async ({url,for_page}, { rejectWithValue }) => {
    try {
      console.log('edit action is calling:::',url)
      const response = await axios.get(url);
      console.log('response data is:',{data:response.data,for_page:for_page})
      return {data:response.data,for_page:for_page};
      
    } catch (err) {
      console.log("error is:", err?.response?.data);
      return rejectWithValue(err?.response?.data);
    }
  }
);




const genericEditSlice = createSlice({
  name: "serviceMaster",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenericEdit.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getGenericEdit.fulfilled, (state, action) => {
      state.genericEditData= action.payload.data;
      state.for_page=action.payload.for_page;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(getGenericEdit.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

   

    
  },
});
//generate reducer
const genericEditReducer = genericEditSlice.reducer;
export default genericEditReducer;
