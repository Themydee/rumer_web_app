"use client";
import { combineReducers } from "redux";
import authReducer from "./children/auth";

export const rootReducer = combineReducers({
	auth: authReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
