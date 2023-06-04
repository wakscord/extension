import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Chat, ChatQueryResult, Wakzoo } from "../interfaces";
import { getImages, prefetchImage } from "../utils/image";
import { API_ENDPOINT, queryClient } from "../utils/network";
import { sortChats } from "../utils/tools";

export interface UseExtensionChatsRequest {
  twitchId: string;
  authors: number;
  noWakzoo: boolean;
  noNotify: boolean;
}

const getLastChatId = (result: ChatQueryResult | undefined) => {
  if (!result || !result.pages.length) {
    return;
  }

  const chats = result?.pages.flat();
  return chats[chats.length - 1]?.id;
};

export const UseExtensionChatsQuery = (request: UseExtensionChatsRequest) => ({
  queryKey: ["extension.chatsv2", request],
  queryFn: async ({ queryKey, pageParam }: QueryFunctionContext) => {
    const result = pageParam
      ? ({} as ChatQueryResult)
      : queryClient.getQueryData<ChatQueryResult>(queryKey);

    const queryParams = new URLSearchParams({
      ...(pageParam ? { before: (pageParam as number).toString() } : {}),
      authors: request.authors.toString(),
      noWakzoo: request.noWakzoo.toString(),
      noNotify: request.noNotify.toString(),
    }).toString();

    const response = await fetch(
      `${API_ENDPOINT}/extension/${request.twitchId}/chatsv2?${queryParams}`
    );

    const data = sortChats((await response.json()) as (Chat | Wakzoo)[]);
    getImages(data).forEach((url) => prefetchImage(url));

    if (!pageParam) {
      const lastChatId = getLastChatId(result);
      if (lastChatId === data[data.length - 1]?.id) {
        return [];
      } else {
        const ids = result?.pages.flat().map((chat) => chat.id) || [];
        return data.filter((item) => !ids.includes(item.id));
      }
    }

    return data;
  },
});

const useExtensionChats = (request: UseExtensionChatsRequest) => {
  const query = useMemo(() => UseExtensionChatsQuery(request), [request]);

  return {
    queryKey: query.queryKey,
    ...useInfiniteQuery({
      ...query,
      staleTime: 10_000,
      getPreviousPageParam: (firstPage) =>
        firstPage.length ? firstPage[0].id : undefined,
      getNextPageParam: () => 0,
    }),
  };
};

export default useExtensionChats;
