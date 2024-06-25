import axios, { AxiosError } from "axios";
import { Location } from "../types/Location";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface CreateLocationPayload {
  data: {
    name: string;
    description: string;
    Adresse: {
      id: number;
      street: string;
      city: string;
      plz: number;
    };
    dogsAllowed: boolean;
    email: string;
    linklist: {
      id: number;
      url: string;
      title: string;
    };
  };
}

export const createLocation = async (
  payload: CreateLocationPayload
): Promise<Location> => {
  try {
    const response = await axios.post(`${API_URL}/locations`, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
