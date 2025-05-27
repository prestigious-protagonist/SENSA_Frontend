import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface checkNotification {
  userIDs?: string[];
  notifications?: [];
  notificationCount?: number;
}

const initialState: checkNotification = {
  userIDs: [],
  notifications: [],
  notificationCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationCount: (state, action: PayloadAction<checkNotification>) => {
      state.notificationCount = action.payload.notificationCount;
    },
    setUserIDs: (state, action: PayloadAction<checkNotification>) => {
      state.userIDs = action.payload.userIDs;
    },
    setNotifications: (state, action: PayloadAction<checkNotification>) => {
      state.notifications = action.payload.notifications;
    },
  },
});

export const { setUserIDs, setNotificationCount, setNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
