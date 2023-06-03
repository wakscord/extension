import { QueryClient } from "@tanstack/react-query";

export const API_ENDPOINT = "https://api.wakscord.xyz";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
