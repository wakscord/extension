import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useVirtualizer } from "@tanstack/react-virtual";

import { getColor } from "../colors";
import Message from "./discord/Message";

import { useRecoilValue } from "recoil";
import { streamers } from "../constants";
import { settingsState } from "../states/settings";
import { mergeFlag } from "../utils";
import Refresh from "./Refresh";
import useExtensionChats from "../hooks/useExtensionChats";
import MessagePlaceholder from "./MessagePlaceholder";
import { queryClient } from "../utils/network";
import { useInView } from "react-intersection-observer";
interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const SCROLL_POINT_HEIGHT = 68;

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const settings = useRecoilValue(settingsState);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topRef, inView] = useInView({ threshold: 0 });

  const [isFetchingAndScrolling, setIsFetchingAndScrolling] = useState(false);

  const authors = useMemo(() => {
    const flags = Object.entries(settings.authors[name])
      .filter(([, value]) => value)
      .map(([key]) => streamers[key].flag);

    return mergeFlag(flags);
  }, [settings.authors, name]);

  const {
    data,
    refetch,
    fetchPreviousPage,
    hasPreviousPage,
    isLoading,
    isFetching,
    queryKey,
  } = useExtensionChats({
    twitchId,
    authors,
    noWakzoo: !settings.wakzoos[name],
    noNotify: !settings.notify,
  });

  const chats = data ? data.pages.flat() : [];

  /**
   * index 0: assigned to skeleton
   * index chats.length + 1: assigned to scroll point (bottom)
   */
  const virtualizer = useVirtualizer({
    count: chats.length + 2,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => {
      if (index === 0) return 1044;
      if (index === chats.length + 1) return SCROLL_POINT_HEIGHT;
      return 36;
    },
    getItemKey: (index) => {
      if (index === 0) return "skeleton";
      if (index === chats.length + 1) return "scroll-point";
      return chats[index - 1].id;
    },
  });
  const virtualItems = virtualizer.getVirtualItems();

  window.virtualizer = virtualizer;
  // console.log(`chats`, chats);
  // console.log(`virtualItems`, virtualItems);

  const handleScrollToBottom = useCallback(() => {
    console.log(`[scroll] scroll to bottom (index: ${chats.length + 1})`);
    virtualizer.scrollToIndex(chats.length + 1, { align: "start" });
  }, [virtualizer, chats.length]);

  /**
   * 1. 최초 페이지 접속 시, 아무런 쿼리가 나가기 전에 가장 먼저 스크롤
   * 2. 첫 번째 (before=undefined) 요청을 받은 직후, 다시 한 번 아래로 스크롤
   */
  useEffect(() => {
    if (isLoading || data?.pageParams[0] === undefined) {
      console.log(`[scroll] scroll at initial state`);
      handleScrollToBottom();
    }
  }, [isLoading, data?.pageParams, handleScrollToBottom]);

  /**
   * 현재 화면에 index 0 (assigned to skeleton) 컴포넌트가 렌더링 될 때,
   * 이전 페이지를 불러옵니다.
   */
  useEffect(() => {
    if (isFetching || isFetchingAndScrolling) return;
    if (!hasPreviousPage) return;
    if (!inView) return;
    setIsFetchingAndScrolling(true);
    console.log(`[fetch] start fetch to reach index 0`);
    console.warn({
      isFetching,
      isFetchingAndScrolling,
      hasPreviousPage,
      inView,
      fetchPreviousPage,
    });
    const item = virtualizer.getVirtualItemForOffset(virtualizer.scrollOffset);
    const additionalOffset = virtualizer.scrollOffset - item.start;
    const chatsCopied = chats;
    fetchPreviousPage()
      .then((query) => {
        // const indexDiff = query.data!.pages.flat().length - chatsCopied.length;
        // const offset = item.index + indexDiff + additionalOffset;
        // console.log(`SCROLL after fetch`, {
        //   offset,
        //   index: item.index,
        //   indexDiff,
        //   additionalOffset,
        // });
        // virtualizer.scrollToOffset(offset);
        setIsFetchingAndScrolling(false);
      })
      .catch((error) => console.error(error));
  }, [
    isFetching,
    hasPreviousPage,
    inView,
    fetchPreviousPage,
    isFetchingAndScrolling,
  ]);

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
  }, [queryKey, refetch]);

  useEffect(() => {
    if (settings.autoRefresh) {
      // TODO: Change interval to 10_000
      const intervalId = setInterval(handleRefresh, 1_000);
      return () => clearInterval(intervalId);
    }
  }, [handleRefresh, settings.autoRefresh]);

  return (
    <Container ref={containerRef} color={getColor(name).bottom}>
      <InnerContainer style={{ height: virtualizer.getTotalSize() }}>
        <VirtualContainer
          style={{
            transform: `translateY(${virtualItems[0].start}px)`,
          }}
        >
          {virtualItems.map((virtualItem) => {
            if (virtualItem.index === 0) {
              return (
                <MessagePlaceholder
                  key="skeleton"
                  isEnd={!isLoading && !hasPreviousPage}
                  data-index={virtualItem.index}
                  ref={(node) => {
                    virtualizer.measureElement(node);
                    topRef(node);
                  }}
                />
              );
            }

            if (virtualItem.index === chats.length + 1) {
              return (
                <div
                  key="scroll-point"
                  style={{ height: SCROLL_POINT_HEIGHT }}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                />
              );
            }

            const chatIndex = virtualItem.index - 1;
            const chat = chats[chatIndex];

            return (
              <Message
                key={chat.id}
                id={id}
                chat={chat}
                before={chats[chatIndex - 1]}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
              />
            );
          })}
          <RefreshContainer>
            <Refresh onClick={handleRefresh} />
          </RefreshContainer>
        </VirtualContainer>
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div<{ color: string }>`
  position: relative;

  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1a1b1e;
    min-height: 40px;
  }

  &::-webkit-scrollbar-track {
    background: #2b2d31;
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
  }
`;

const InnerContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-bottom: 10px;
`;

const VirtualContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const RefreshContainer = styled.div`
  position: absolute;
  bottom: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

export default Chats;
