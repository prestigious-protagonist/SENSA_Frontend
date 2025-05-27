import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface userData {
  userId: string;
  username: string;
  skills: string[];
  biography: string;
  interests: string[];
  githubProfile: string;
  linkedInProfile: string;
}

const initialState: userData = {
  userId: "",
  skills: [],
  username: "",
  interests: [],
  biography: "",
  githubProfile: "",
  linkedInProfile: "",
};

export const userDataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<userData>) => {
      state.skills = action.payload.skills;
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.interests = action.payload.interests;
      state.biography = action.payload.biography;
      state.githubProfile = action.payload.githubProfile;
      state.linkedInProfile = action.payload.linkedInProfile;
    },
  },
});

export const { setUserData } = userDataSlice.actions;

export default userDataSlice.reducer;
