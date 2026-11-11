"use client";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// import { AppDispatch } from "@/Setup/redux/store";
import { AppDispatch } from "../set-up/redux/store";
import { RootState } from "../set-up/redux/root-reducer";
import { resetAuth } from "../Redux/auth";
import { signOut } from "../utils/data";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAuth = () => {
	const dispatch = useAppDispatch();

	const handleLogOut = () => {
		dispatch(resetAuth());
		signOut();
	};

	return { handleLogOut };
};
