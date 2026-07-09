import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";

const initialState = {
  loading: false,
  error: null,
  reg_no: null,
  getRegNo:null,

  staff:null,
  staffLoading:false,
  staffError:null
};

export const setRegistrationNo = createAsyncThunk("/registration/reg_no",async ({reg_no}, { rejectWithValue, getState, dispatch }) => {
      console.log('calling set registration no with reg no:',reg_no)
      return reg_no 
  }
);

export const getRegistrationNo = createAsyncThunk("get/registration/reg_no",async ({}, { rejectWithValue, getState, dispatch }) => {
      const state = getState();
      console.log('calling get registration no with reg no:',state.registrationNo.reg_no)
      return state.registrationNo.reg_no 
  }
);

export const getStaffData = createAsyncThunk("get/staff/data",async ({token}, { rejectWithValue, getState, dispatch }) => {
  try {
    console.log('calling staff data api')
    const response = await axios.get(`${baseUrl}/api/staff/detail`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000,
    });
    console.log('staff Data**********************:', response.data)
    return response.data
  } catch (error) {
    console.log('staff Data error**********************:', error?.response?.data?.message ?? error?.message ?? error)
    return rejectWithValue(error?.response?.data?.message ?? error?.message ?? 'Failed to fetch staff data')
  }
}
);

const registrationNoSlice = createSlice({
  name: "registrationNo",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(setRegistrationNo.fulfilled, (state, action) => {
      state.reg_no = action.payload;
    });
    builder.addCase(getRegistrationNo.fulfilled, (state, action) => {
      state.getRegNo = action.payload;
    });
    builder.addCase(getStaffData.pending, (state) => {
      state.staffLoading = true;
    });
    builder.addCase(getStaffData.rejected, (state, action) => {
      state.staffLoading = false;
      state.staffError = action.payload;
    });
    builder.addCase(getStaffData.fulfilled, (state, action) => {
      state.staff = action.payload;
      state.staffLoading = false;
      state.staffError=null
    });
  },
});

const registrationNoReducer = registrationNoSlice.reducer;
export default registrationNoReducer;
