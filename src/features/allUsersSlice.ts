import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  bio: string;
  email: string;
  fullname: string;
  gender: string;
  age: number;
  Skills: string[];
  username: string;
  profilePicture: string;
  InterestedIns: string[];
  social: {
    github: string;
    linkedIn: string;
  };
}

export interface AllUsers {
  users?: User[];
}

const initialState: AllUsers = {
  users: [],
};

export const allUsers = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAllusers: (state, action: PayloadAction<AllUsers>) => {
      state.users = action.payload.users;
    },
  },
});

export const { setAllusers } = allUsers.actions;

export default allUsers.reducer;
