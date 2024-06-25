import axios, { AxiosError } from "axios";
import { Band } from "../types/Band";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface BandsResponse {
  data: Band[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const fetchBands = async (
  sort?: string,
  page?: number,
  pageSize?: number,
  fields?: string,
  populate?: string,
  filters?: object,
  locale?: string
): Promise<BandsResponse> => {
  const params: Record<string, any> = {};
  if (sort) params.sort = sort;
  if (page) params["pagination[page]"] = page;
  if (pageSize) params["pagination[pageSize]"] = pageSize;
  if (fields) params.fields = fields;
  if (populate) params.populate = populate;
  if (filters) params.filters = filters;
  if (locale) params.locale = locale;

  try {
    const response = await axios.get<BandsResponse>(`${API_URL}/bands`, {
      params,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(import.meta.env.VITE_API_URL);
      console.error("Error fetching bands:", error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching bands"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
