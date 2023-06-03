import { FC, useCallback, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { streamers } from "../constants";
import useExtensionChats from "../hooks/useExtensionChats";
import useScrollElement from "../hooks/useScrollElement";
import { settingsState } from "../states/settings";
import { mergeFlag } from "../utils";
import { queryClient } from "../utils/network";
import MessagePlaceholder from "./MessagePlaceholder";
import Refresh from "./Refresh";
import Message from "./discord/Message";

interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const settings = useRecoilValue(settingsState);
  const { ref: viewRef, inView } = useInView();

  const request = useMemo(() => {
    const flags = Object.entries(settings.authors[name])
      .filter(([, value]) => value)
      .map(([key]) => streamers[key].flag);

    return {
      twitchId,
      authors: mergeFlag(flags),
      noWakzoo: !settings.wakzoos[name],
      noNotify: !settings.notify,
    };
  }, [twitchId, name, settings]);

  const {
    queryKey,
    data,
    refetch,
    isLoading,
    isFetching,
    fetchPreviousPage,
    hasPreviousPage,
  } = useExtensionChats(request);

  const chats = useMemo(() => data?.pages.flat() ?? [], [data]);
  const pages = useMemo(() => data?.pages ?? [], [data]);

  const { scrollRef, innerRef, setHistory } = useScrollElement<
    HTMLDivElement,
    HTMLDivElement
  >({
    bottom: useMemo(() => pages.length <= 1, [pages]),
  });

  const isEnd = useMemo(
    () => !isLoading && !hasPreviousPage,
    [isLoading, hasPreviousPage]
  );

  /**
   * 마지막 페이지를 제외한 다른 모든 페이지를 삭제하고,
   * 남아있는 페이지(=마지막 페이지)를 갱신합니다.
   */
  const handleRefresh = useCallback(async () => {
    queryClient.setQueryData(queryKey, (queryData: typeof data) => {
      if (!queryData?.pages || !queryData?.pageParams) {
        return queryData;
      }

      const index = queryData.pages.length - 1;
      return { pages: [queryData.pages[index]], pageParams: [undefined] };
    });
    await refetch();
    setHistory({ height: 0, scroll: 0 });
  }, [queryKey, refetch, setHistory]);

  useEffect(() => {
    if (inView && !isFetching && hasPreviousPage) {
      fetchPreviousPage()
        .then(() => {
          if (scrollRef.current) {
            setHistory({
              height: scrollRef.current.scrollHeight,
              scroll: scrollRef.current.scrollTop,
            });
          }
        })
        .catch((error) => console.error(error));
    }
  }, [
    inView,
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
    scrollRef,
    setHistory,
  ]);

  useEffect(() => {
    if (settings.autoRefresh) {
      const intervalId = setInterval(handleRefresh, 10_000);
      return () => clearInterval(intervalId);
    }
  }, [handleRefresh, settings.autoRefresh]);

  return (
    <Container ref={scrollRef}>
      <MessagePlaceholder isEnd={isEnd} ref={viewRef} />
      <InnerContainer ref={innerRef}>
        {chats.map((chat, index) => (
          <Message
            key={chat.id}
            id={id}
            chat={chat}
            before={chats[index - 1]}
          />
        ))}
        <RefreshContainer>
          <Refresh onClick={handleRefresh} />
        </RefreshContainer>
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  padding-right: 10px;
  margin-right: 2px;
  margin: 0px 4px 0px 0px;

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1a1b1e;
    min-height: 40px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 7px;

    &:hover {
      background: #2b2d31;
    }
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    background-clip: padding-box;
    border-radius: 8px;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  padding-bottom: 10px;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 16px;
  margin-bottom: 16px;
`;

export default Chats;
