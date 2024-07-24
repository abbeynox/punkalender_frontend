import axios, { AxiosError } from "axios";
import { Location } from "../types/Location";

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateLocationPayload {
  data: {
    name: string;
    description?: string;
    Adresse: {
      id?: number;
      street?: string;
      city: string;
      plz?: number;
    };
    dogsAllowed?: boolean;
    email?: string;
    linklist?: {
      id: number;
      url: string;
      title: string;
    };
  };
}

export const createLocation = async (
  payload: CreateLocationPayload
): Promise<Location> => {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    throw new Error("JWT token not found. Please login again.");
  }

  try {
    const response = await axios.post(`${API_URL}/locations`, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    console.error("Error creating location:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while creating the location"
    );
  }
};
