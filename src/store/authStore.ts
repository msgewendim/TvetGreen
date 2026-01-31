import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface AuthUser {
	id: string;
	phone: string;
	name?: string;
	createdAt: string;
}

interface AuthState {
	user: AuthUser | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	hasCheckedAuth: boolean;

	checkAuth: () => Promise<void>;
	requestOtp: (phone: string) => Promise<boolean>;
	verifyOtp: (phone: string, otp: string) => Promise<boolean>;
	logout: () => Promise<void>;
	updateProfile: (name: string) => void;
}

async function secureGet(key: string): Promise<string | null> {
	if (Platform.OS === "web") {
		return localStorage.getItem(key);
	}
	return SecureStore.getItemAsync(key);
}

async function secureSet(key: string, value: string): Promise<void> {
	if (Platform.OS === "web") {
		localStorage.setItem(key, value);
		return;
	}
	await SecureStore.setItemAsync(key, value);
}

async function secureDelete(key: string): Promise<void> {
	if (Platform.OS === "web") {
		localStorage.removeItem(key);
		return;
	}
	await SecureStore.deleteItemAsync(key);
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isLoading: false,
	isAuthenticated: false,
	hasCheckedAuth: false,

	checkAuth: async () => {
		set({ isLoading: true });
		try {
			const [token, userJson] = await Promise.all([
				secureGet(TOKEN_KEY),
				secureGet(USER_KEY),
			]);

			if (token && userJson) {
				const user = JSON.parse(userJson) as AuthUser;
				set({
					user,
					token,
					isAuthenticated: true,
					hasCheckedAuth: true,
					isLoading: false,
				});
			} else {
				set({ hasCheckedAuth: true, isLoading: false });
			}
		} catch {
			set({ hasCheckedAuth: true, isLoading: false });
		}
	},

	requestOtp: async (phone: string) => {
		set({ isLoading: true });
		try {
			// TODO: Replace with real API call
			// Simulate OTP send
			await new Promise((resolve) => setTimeout(resolve, 1000));
			set({ isLoading: false });
			return true;
		} catch {
			set({ isLoading: false });
			return false;
		}
	},

	verifyOtp: async (phone: string, otp: string) => {
		set({ isLoading: true });
		try {
			// TODO: Replace with real API call
			// For MVP, accept any 6-digit OTP
			if (otp.length !== 6) {
				set({ isLoading: false });
				return false;
			}

			// Simulate verification
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const user: AuthUser = {
				id: `user_${phone.replace(/\D/g, "")}`,
				phone,
				createdAt: new Date().toISOString(),
			};
			const token = `mock_token_${Date.now()}`;

			await Promise.all([
				secureSet(TOKEN_KEY, token),
				secureSet(USER_KEY, JSON.stringify(user)),
			]);

			set({
				user,
				token,
				isAuthenticated: true,
				isLoading: false,
			});
			return true;
		} catch {
			set({ isLoading: false });
			return false;
		}
	},

	logout: async () => {
		await Promise.all([secureDelete(TOKEN_KEY), secureDelete(USER_KEY)]);
		set({
			user: null,
			token: null,
			isAuthenticated: false,
		});
	},

	updateProfile: (name: string) => {
		const { user } = get();
		if (user) {
			const updated = { ...user, name };
			set({ user: updated });
			secureSet(USER_KEY, JSON.stringify(updated));
		}
	},
}));
