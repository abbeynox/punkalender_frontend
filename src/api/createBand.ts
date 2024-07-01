import axios, { AxiosError } from "axios";
import { Band } from "../types/Band";

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateBandPayload {
  data: {
    bandname: string;
    country: string;
    musicstyle: {
      id: number;
      Punk: boolean;
      Metal: boolean;
      Rock: boolean;
      Ska: boolean;
    };
    description: string;
    bandphoto: string | number;
    linklist: {
      id: number;
      url: string;
      title: string;
    }[];
    events: (string | number)[];
  };
}

export const createBand = async (payload: CreateBandPayload): Promise<Band> => {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    throw new Error("JWT token not found. Please login again.");
  }

  try {
    const response = await axios.post(`${API_URL}/bands`, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    console.error("Error creating band:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while creating the band"
    );
  }
};
