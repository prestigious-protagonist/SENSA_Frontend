import { configureStore } from "@reduxjs/toolkit";
import allUsersReducer from "@/features/allUsersSlice";
import userDataSliceReducer from "@/features/userSlice";
import notificationSliceReducer from "@/features/checkNotiSlice";
import userConnectionsReducer from "@/features/connectionSlice";

const store = configureStore({
  reducer: {
    users: allUsersReducer,
    user: userDataSliceReducer,
    connections: userConnectionsReducer,
    notification: notificationSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
