import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

import { useInView } from "react-intersection-observer";
import { getColor } from "../colors";
import Message from "./discord/Message";
import Skeleton from "./discord/Skeleton";

import { useRecoilValue } from "recoil";
import { streamers } from "../constants";
import { settingsState } from "../states/settings";
import { mergeFlag } from "../utils";
import Refresh from "./Refresh";
import useExtensionChats from "../hooks/useExtensionChats";

interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: skeletonRef, inView } = useInView({
    threshold: 0,
  });

  const [oldHeight, setOldHeight] = useState(0);
  const [oldScroll, setOldScroll] = useState(0);

  const settings = useRecoilValue(settingsState);

  const authors = useMemo(() => {
    const flags = Object.entries(settings.authors[name])
      .filter(([, value]) => value)
      .map(([key]) => streamers[key].flag);

    return mergeFlag(flags);
  }, [settings.authors, name]);

  const { data, refetch, fetchPreviousPage, hasPreviousPage } =
    useExtensionChats({
      twitchId,
      authors,
      noWakzoo: !settings.wakzoos[name],
      noNotify: !settings.notify,
    });

  useEffect(() => {
    if (inView) {
      fetchPreviousPage()
        .then(() => {
          if (containerRef.current) {
            setOldHeight(containerRef.current.scrollHeight);
            setOldScroll(containerRef.current.scrollTop);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [inView, fetchPreviousPage]);

  const loadRecentChats = useCallback(
    async (manual = false) => {
      if (!manual && !settings.autoRefresh) {
        return;
      }

      const result = await refetch();
      console.log(`refetched ${JSON.stringify(result)}`);
    },
    [settings.autoRefresh, refetch]
  );

  useEffect(() => {
    const intervalId = setInterval(loadRecentChats, 1_000);
    return () => clearInterval(intervalId);
  }, [loadRecentChats]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - oldHeight + oldScroll;
    }
  }, [oldHeight, oldScroll]);

  return (
    <Container ref={containerRef} color={getColor(name).bottom}>
      {!hasPreviousPage ? (
        <EndMessage>
          <span>기록된 모든 채팅을 읽으셨군요!</span>
        </EndMessage>
      ) : (
        <SkeletonContainer>
          <InnerContainer>
            <Skeleton />
          </InnerContainer>
          <div ref={skeletonRef} />
        </SkeletonContainer>
      )}

      <InnerContainer>
        {data?.pages.flat().map((chat, index, chats) => (
          <Message
            key={chat.id}
            id={id}
            chat={chat}
            before={chats[index - 1]}
          />
        ))}
        <RefreshContainer>
          <Refresh onClick={async () => await loadRecentChats(true)} />
        </RefreshContainer>
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div<{ color: string }>`
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

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
  display: flex;
  flex-direction: column;
  gap: 2px;

  padding-bottom: 10px;
`;

const SkeletonContainer = styled.div`
  height: 1044px;
`;

const EndMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 16px;
`;

export default Chats;
