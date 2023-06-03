import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { streamers } from "../constants";
import { Chat, Wakzoo } from "../interfaces";
import { prefetchImage } from "../utils/image";
import { API_ENDPOINT } from "../utils/network";

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
  return new Set(
    data
      .map((item) => {
        const images = [];

        // 임베드라면 임베드 이미지들 푸시
        if (Array.isArray(item.data)) {
          (item as Wakzoo).data
            .map((embed) => embed.image?.url || "")
            .filter((item) => !!item)
            .forEach((url) => images.push(url));
        }

        // 이모트들 이미지 푸시
        else {
          Object.keys((item as Chat).data || {}).forEach((id) => {
            images.push(
              `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/3.0`
            );
          });
        }

        // 프로필 사진 이미지 푸시
        images.push(
          Object.keys(streamers).includes(item.author)
            ? `https://api.wakscord.xyz/avatar/${streamers[item.author].id}.png`
            : `https://api.wakscord.xyz/avatar/${item.author}`
        );

        return images;
      })
      .flat()
  );
};

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
    console.log(getImages(data));
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
