import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:false,
    error:null,
 reportvalue:null,
};

export const setReportEntry = createAsyncThunk("/report/entry",async ({reportvalue}, { rejectWithValue, getState, dispatch }) => {
      console.log('calling set report entry with reportvalue:',reportvalue)
      return reportvalue
  }
);

export const getReportEntry = createAsyncThunk("get/report/entry",async ({}, { rejectWithValue, getState, dispatch }) => {
      const state = getState();
      console.log('calling get report entry with reportvalue:',state.reportEntry.reportvalue)
      return state.reportEntry.reportvalue
  }
);



const reportEntrySlice = createSlice({
  name: "reportEntry",
  initialState,
  extraReducers: (builder) => {

    builder.addCase(setReportEntry.fulfilled, (state, action) => {
        state.reportvalue = action.payload;
      });
      builder.addCase(getReportEntry.fulfilled, (state, action) => {
        state.reportvalue = action.payload;
      });
  },
});

const reportEntryReducer = reportEntrySlice.reducer;
export default reportEntryReducer;
