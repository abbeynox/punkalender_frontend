import axios, { AxiosError } from "axios";
import { Band } from "../types/Band";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
  try {
    const response = await axios.post(`${API_URL}/bands`, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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
