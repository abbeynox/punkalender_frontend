import axios from "axios";
import type { Event } from "../types/Event";
import type { Location } from "../types/Location";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface EventsResponse {
  data: Event[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface EventResponse {
  data: Event;
}

export const fetchEvents = async (
  sort?: string,
  page: number = 1,
  pageSize: number = 25,
  fields?: string,
  populate: string = "*",
  filters?: object,
  locale?: string
): Promise<EventsResponse> => {
  const params: Record<string, any> = {};
  if (sort) params.sort = sort;
  if (page) params["pagination[page]"] = page;
  if (pageSize) params["pagination[pageSize]"] = pageSize;
  if (fields) params.fields = fields;
  if (populate) params.populate = populate;
  if (filters) params.filters = filters;
  if (locale) params.locale = locale;

  try {
    const response = await axios.get<EventsResponse>(`${API_URL}/events`, {
      params,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching events:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching events"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchEvent = async (id: number): Promise<EventResponse> => {
  try {
    const response = await axios.get<EventResponse>(`${API_URL}/events/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching event:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching the event"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchLocation = async (id: number): Promise<Location> => {
  try {
    const response = await axios.get<{ data: Location }>(
      `${API_URL}/locations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching location:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching the location"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
