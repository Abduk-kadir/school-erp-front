import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  staff_id: null,
  get_staff_Id:null
};

export const setStaffId = createAsyncThunk("/registration/staff_id",async ({staff_id}, { rejectWithValue, getState, dispatch }) => {
      console.log('calling set staff id:',staff_id)
      return staff_id 
  }
);

export const getStaffId = createAsyncThunk("get/registration/staff_id",async ({}, { rejectWithValue, getState, dispatch }) => {
      const state = getState();
      console.log('getting staffid:',state.staffId.staff_id)
      return state.staffId.staff_id 
  }
);

const staffIdSlice = createSlice({
  name: "staffId",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(setStaffId.fulfilled, (state, action) => {
      state.staff_id = action.payload;
    });
    builder.addCase(getStaffId.fulfilled, (state, action) => {
      state.get_staff_Id = action.payload;
    });
  },
});

const staffIdReducer =staffIdSlice.reducer;
export default staffIdReducer;
