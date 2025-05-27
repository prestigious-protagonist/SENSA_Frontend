import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserConnections {
  connections?: [];
  connectionCount?: number;
}

const initialState: UserConnections = {
  connections: [],
  connectionCount: 0,
};

export const userConnections = createSlice({
  name: "connections",
  initialState,
  reducers: {
    setConnectionCount: (state, action: PayloadAction<UserConnections>) => {
      state.connectionCount = action.payload.connectionCount;
    },
    setConnections: (state, action: PayloadAction<UserConnections>) => {
      state.connections = action.payload.connections;
    },
  },
});

export const { setConnectionCount, setConnections } = userConnections.actions;

export default userConnections.reducer;
