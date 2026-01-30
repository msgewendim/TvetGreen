import { Platform } from "react-native";

// Android emulator uses 10.0.2.2 for host, iOS simulator uses localhost
const BASE_URL =
	Platform.OS === "android"
		? "http://10.0.2.2:3001/api"
		: "http://localhost:3001/api";

async function request<T>(
	path: string,
	options?: RequestInit,
): Promise<T> {
	const response = await fetch(`${BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
		...options,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(
			(error as { error?: string }).error || `HTTP ${response.status}`,
		);
	}

	return response.json();
}

export const api = {
	auth: {
		requestOtp: (phone: string) =>
			request<{ success: boolean }>("/auth/request-otp", {
				method: "POST",
				body: JSON.stringify({ phone }),
			}),
		verifyOtp: (phone: string, otp: string) =>
			request<{
				success: boolean;
				token: string;
				user: { id: string; phone: string };
			}>("/auth/verify-otp", {
				method: "POST",
				body: JSON.stringify({ phone, otp }),
			}),
	},

	courses: {
		getAll: () =>
			request<{ courses: unknown[] }>("/courses"),
		getById: (courseId: string) =>
			request<unknown>(`/courses/${courseId}`),
		getLessons: (courseId: string) =>
			request<{ lessons: unknown[] }>(`/courses/${courseId}/lessons`),
		getCategories: () =>
			request<{ categories: unknown[] }>("/courses/categories"),
	},

	progress: {
		getEnrollments: (userId: string) =>
			request<{ enrollments: unknown[] }>(
				`/progress/enrollments/${userId}`,
			),
		enroll: (userId: string, courseId: string) =>
			request<{ enrollment: unknown }>("/progress/enrollments", {
				method: "POST",
				body: JSON.stringify({ userId, courseId }),
			}),
		getLessonProgress: (userId: string) =>
			request<{ progress: unknown[] }>(
				`/progress/lessons/${userId}`,
			),
		updateLessonProgress: (data: {
			userId: string;
			lessonId: string;
			courseId: string;
			watchedSeconds: number;
			totalSeconds: number;
			lastPosition: number;
		}) =>
			request<{ progress: unknown }>("/progress/lessons", {
				method: "POST",
				body: JSON.stringify(data),
			}),
		sync: (data: {
			userId: string;
			enrollments: unknown[];
			progress: unknown[];
		}) =>
			request<{ enrollments: unknown[]; progress: unknown[] }>(
				"/progress/sync",
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			),
	},
};
