import { createApi } from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig } from "axios";

// axios instance configured via Vite env var
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
});

// custom baseQuery using axios to support interceptors and richer control
const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method: AxiosRequestConfig["method"];
    data?: unknown;
    params?: unknown;
  }) => {
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers["authorization"] = `Bearer ${token}`;
      const result = await axiosInstance.request({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data } as const;
    } catch (axiosError: any) {
      const err = axiosError?.response
        ? { status: axiosError.response.status, data: axiosError.response.data }
        : {
            status: 500,
            data: { message: axiosError?.message ?? "Network error" },
          };
      return { error: err } as const;
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Project", "Task"],
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});

export type ApiSlice = typeof apiSlice;
export type ApiEndpoints = ReturnType<ApiSlice["injectEndpoints"]>;
