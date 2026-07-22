// File: src/core/store/rootReducer.ts

import { combineReducers } from "@reduxjs/toolkit";
import saintsReducer from "../../features/saints/store/saintsSlice";

export const rootReducer = combineReducers({
  saints: saintsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
