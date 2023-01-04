import { atom } from "jotai";

export enum Filter {
	all,
	completed,
	incompleted
}

export interface UserState {
	email: string;
	passwordHash: string;
	sorting?: Filter;
}

export const userState = atom<UserState | null>(null);
