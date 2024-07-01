import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  identifier: string;
  password: string;
}

export const login = async (
  payload: LoginPayload
): Promise<{ jwt: string; user: any }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/local`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    console.error("Error logging in:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "An error occurred while logging in"
    );
  }
};
