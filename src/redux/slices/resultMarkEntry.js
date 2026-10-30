import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";

const initialState = {
    loading:false,
    error:null,
 marksentryvalue:null,
};

export const setResultMarkEntry = createAsyncThunk("/result/mark_entry",async ({marksentryvalue}, { rejectWithValue, getState, dispatch }) => {
      console.log('calling set result mark entry with marksentryvalue:',marksentryvalue)
      return marksentryvalue 
  }
);

export const getResultMarkEntry = createAsyncThunk("get/result/mark_entry",async ({}, { rejectWithValue, getState, dispatch }) => {
      const state = getState();
      console.log('calling get result mark entry with marksentryvalue:',state.resultMarkEntry.marksentryvalue)
      return state.resultMarkEntry.marksentryvalue
  }
);



const resultMarkEntrySlice = createSlice({
  name: "resultMarkEntry",
  initialState,
  extraReducers: (builder) => {
   
    builder.addCase(setResultMarkEntry.fulfilled, (state, action) => {
        state.marksentryvalue = action.payload;
      });
      builder.addCase(getResultMarkEntry.fulfilled, (state, action) => {
        state.marksentryvalue = action.payload;
      });
  },
});

const resultMarkEntryReducer = resultMarkEntrySlice.reducer;
export default resultMarkEntryReducer;
