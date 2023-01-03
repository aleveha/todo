import { atom } from "jotai";

export interface UserState {
	email: string;
	passwordHash: string;
}

export const userState = atom<UserState | null>(null);
