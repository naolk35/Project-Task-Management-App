import { apiSlice } from "../../store/apiSlice.ts";
import type { User } from "../../types/index.ts";

interface LoginRequest {
  email: string;
  password: string;
}
interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.token);
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
