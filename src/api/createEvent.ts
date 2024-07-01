import axios, { AxiosError } from "axios";
import { Event } from "../types/Event";

const API_URL = import.meta.env.VITE_API_URL;

export interface CreateEventPayload {
  data: {
    name: string;
    type: string;
    musicstyle: {
      id: number;
      Punk: boolean;
      Metal: boolean;
      Rock: boolean;
      Ska: boolean;
    };
    eventtext: string;
    eventstart: number;
    eventend: number;
    bands: string[] | number[];
    location: string | number;
    ticket: {
      id: number;
      type: string;
      ticketlink: string;
      chf: number;
    };
  };
}

export const createEvent = async (
  payload: CreateEventPayload
): Promise<Event> => {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    throw new Error("JWT token not found. Please login again.");
  }

  try {
    const response = await axios.post(`${API_URL}/events`, payload, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: AxiosError | any) {
    console.error("Error creating event:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        "An error occurred while creating the event"
    );
  }
};
