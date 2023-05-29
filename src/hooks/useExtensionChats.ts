import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import { API_ENDPOINT } from "../utils/network";
import { Chat, Wakzoo } from "../interfaces";

export interface UseExtensionChatsRequest {
  twitchId: string;
  authors: number;
  noWakzoo: boolean;
  noNotify: boolean;
}

export const UseExtensionChatsQuery = (request: UseExtensionChatsRequest) => ({
  queryKey: ["extension.chatsv2", request],
  queryFn: async ({ pageParam }: QueryFunctionContext) => {
    if (pageParam <= 26_000) {
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

    return (await response.json()) as (Chat | Wakzoo)[];
  },
});

const useExtensionChats = (request: UseExtensionChatsRequest) => {
  return useInfiniteQuery({
    ...UseExtensionChatsQuery(request),
    staleTime: 10_000,
    keepPreviousData: true,
    getPreviousPageParam: (lastPage) =>
      lastPage.length ? lastPage[0].id : undefined,
  });
};

export default useExtensionChats;
