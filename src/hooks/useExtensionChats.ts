import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "../utils/network";
import { Chat, Wakzoo } from "../interfaces";
import { useState } from "react";
import { sortChats } from "../utils/chats";

export interface UseExtensionChatsRequest {
  twitchId: string;
  before?: number | null;
  authors: number;
  noWakzoo: boolean;
  noNotify: boolean;
}

export const UseExtensionChatsQuery = (request: UseExtensionChatsRequest) => ({
  queryKey: ["extension.chatsv2", request],
  queryFn: async () => {
    const queryParams = new URLSearchParams({
      ...(request.before ? { before: request.before.toString() } : {}),
      authors: request.authors.toString(),
      noWakzoo: request.noWakzoo.toString(),
      noNotify: request.noNotify.toString(),
    }).toString();

    const response = await fetch(
      `${API_ENDPOINT}/extension/${request.twitchId}/chatsv2?${queryParams}`
    );

    return (await response.json()) as (Chat | Wakzoo)[];
  },
});

const useExtensionChats = (request: UseExtensionChatsRequest) => {
  const [chats, setChats] = useState<(Chat | Wakzoo)[]>([]);

  const query = useQuery({
    ...UseExtensionChatsQuery(request),
    staleTime: 10000,
    onSuccess: (data) => {
      setChats((prev) => sortChats(prev, data));
    },
  });

  return { chats, setChats, query };
};

export default useExtensionChats;
