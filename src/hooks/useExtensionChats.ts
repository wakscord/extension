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
      select: (data) => {
        // 마지막 페이지를 임시 공간으로 사용하게 만드는 로직
        if (data.pages.length > 1) {
          const lastPageIndex = data.pages.length - 1;
          const last2PageIndex = data.pages.length - 2;

          // 마지막 페이지를 마지막 전 페이지에 중복 제거 후, 합침
          data.pages[last2PageIndex] = data.pages[last2PageIndex].concat(
            data.pages[lastPageIndex].filter(
              (x) => !data.pages[last2PageIndex].map((x) => x.id).includes(x.id)
            )
          );

          // 마지막 페이지를 비움
          data.pages[lastPageIndex] = [];
        }

        return {
          pages: data.pages,
          pageParams: data.pageParams,
        };
      },
    }),
  };
};

export default useExtensionChats;
