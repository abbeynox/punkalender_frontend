import axios from "axios";
import type { Location } from "../types/Location";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface LocationsResponse {
  data: Location[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface LocationResponse {
  data: Location;
}

export const fetchLocations = async (
  sort?: string,
  page?: number,
  pageSize?: number,
  fields?: string,
  populate?: string,
  filters?: object,
  locale?: string
): Promise<LocationsResponse> => {
  const params: Record<string, any> = {};
  if (sort) params.sort = sort;
  if (page) params["pagination[page]"] = page;
  if (pageSize) params["pagination[pageSize]"] = pageSize;
  if (fields) params.fields = fields;
  if (populate) params.populate = populate;
  if (filters) params.filters = filters;
  if (locale) params.locale = locale;

  try {
    const response = await axios.get<LocationsResponse>(
      `${API_URL}/locations`,
      {
        params,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching locations:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching locations"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchLocation = async (id: number): Promise<LocationResponse> => {
  try {
    const response = await axios.get<LocationResponse>(
      `${API_URL}/locations/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data;
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
