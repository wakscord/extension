import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { API_ENDPOINT } from "../utils/network";
import { Chat, Wakzoo } from "../interfaces";
import { useMemo } from "react";
import { prefetchImage } from "../utils/image";
import { streamers } from "../constants";

export interface UseExtensionChatsRequest {
  twitchId: string;
  authors: number;
  noWakzoo: boolean;
  noNotify: boolean;
}

const sort = (data: (Chat | Wakzoo)[]) => {
  return [...data].sort((prev, next) => {
    const prevTime = new Date(prev.time);
    const nextTime = new Date(next.time);

    if (prevTime > nextTime) return 1;
    if (prevTime < nextTime) return -1;
    if (prev.id > next.id) return 1;
    if (prev.id < next.id) return -1;
    return 0;
  });
};

const getImages = (data: (Chat | Wakzoo)[]) => {
  return data
    .map((item) => {
      if (Array.isArray(item.data)) {
        return (item as Wakzoo).data
          .map((embed) => embed.image?.url || "")
          .filter((item) => !!item);
      }
      if (item.data !== null) {
        return [
          ...Object.keys((item as Chat).data || {}).map(
            (id) =>
              `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/3.0`
          ),
          ...(Object.keys(streamers).includes(item.author)
            ? `https://api.wakscord.xyz/avatar/${streamers[item.author].id}.png`
            : `https://api.wakscord.xyz/avatar/${item.author}`),
        ];
      }
      return [];
    })
    .flat();
};

export const UseExtensionChatsQuery = (request: UseExtensionChatsRequest) => ({
  queryKey: ["extension.chatsv2", request],
  queryFn: async ({ pageParam }: QueryFunctionContext) => {
    // TODO: Remove test condition
    if (pageParam <= 26_500) {
      console.log("finished!");
      return [];
    }

    const queryParams = new URLSearchParams({
      ...(pageParam ? { before: (pageParam as number).toString() } : {}),
      authors: request.authors.toString(),
      noWakzoo: request.noWakzoo.toString(),
      noNotify: request.noNotify.toString(),
    }).toString();

    console.log(`fetching ${queryParams}`);

    const response = await fetch(
      `${API_ENDPOINT}/extension/${request.twitchId}/chatsv2?${queryParams}`
    );

    const data = (await response.json()) as (Chat | Wakzoo)[];
    getImages(data).forEach((url) => prefetchImage(url));
    return sort(data);
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
