import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Chat, Wakzoo } from "../interfaces";
import { getImages, prefetchImage } from "../utils/image";
import { API_ENDPOINT } from "../utils/network";
import { sortChats } from "../utils/tools";

export interface UseExtensionChatsRequest {
  twitchId: string;
  authors: number;
  noWakzoo: boolean;
  noNotify: boolean;
}

export const UseExtensionChatsQuery = (request: UseExtensionChatsRequest) => ({
  queryKey: ["extension.chatsv2", request],
  queryFn: async ({ pageParam }: QueryFunctionContext) => {
    const queryParams = new URLSearchParams({
      ...(pageParam ? { before: (pageParam as number).toString() } : {}),
      authors: request.authors.toString(),
      noWakzoo: request.noWakzoo.toString(),
      noNotify: request.noNotify.toString(),
    }).toString();

    const response = await fetch(
      `${API_ENDPOINT}/extension/${request.twitchId}/chatsv2?${queryParams}`
    );

    const data = (await response.json()) as (Chat | Wakzoo)[];
    getImages(data).forEach((url) => prefetchImage(url));

    return sortChats(data);
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
    }),
  };
};

export default useExtensionChats;
