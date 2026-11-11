"use client";
import { configureStore } from "@reduxjs/toolkit";
import {
	persistReducer,
	FLUSH,
	PAUSE,
	PURGE,
	persistStore,
	REGISTER,
	REHYDRATE,
	PERSIST,
} from "redux-persist";
import logger from "redux-logger";
import storage from "./custom-storage";
import { rootReducer } from "./root-reducer";

const persistConfig = {
	key: "Rummer-NG",
	storage: storage,
	blacklist: [],
	version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware: any) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(logger),

	devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
