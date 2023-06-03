import { QueryClient } from "@tanstack/react-query";
import { isValidChannelStateResponse } from "./check";

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

/**
 * 채널 상태 (뱅온 정보) 등을 API 서버에서 받아오는 함수입니다.
 *
 * @param channelId Twitch 채널 ID 값
 */
export const fetchChannelState = async (channelId: string) => {
  return fetch(`https://api.wakscord.xyz/extension/${channelId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("API 서버에서 채널 상태를 받아오지 못했습니다.");
      }

      return res.json();
    })
    .then((data) => {
      if (!isValidChannelStateResponse(data)) {
        throw new Error("API 서버에서 받아온 채널 상태가 올바르지 않습니다.");
      }

      return data;
    });
};
