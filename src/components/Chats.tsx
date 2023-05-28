import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { useInView } from "react-intersection-observer";
import { getColor } from "../colors";
import Message from "./discord/Message";
import Skeleton from "./discord/Skeleton";

import { useRecoilValue } from "recoil";
import { streamers } from "../constants";
import { Chat, Wakzoo } from "../interfaces";
import { settingsState } from "../states/settings";
import { mergeFlag } from "../utils";
import Refresh from "./Refresh";

interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const sortChats = (prev: (Chat | Wakzoo)[], next: (Chat | Wakzoo)[]) => {
  return [
    ...next.filter(
      (chat: Chat | Wakzoo) => !prev.find((prevChat) => prevChat.id === chat.id)
    ),
    ...prev,
  ].sort((a: Chat | Wakzoo, b: Chat | Wakzoo) =>
    new Date(a.time) > new Date(b.time)
      ? 1
      : new Date(a.time) < new Date(b.time)
      ? -1
      : 0
  );
};

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: skeletonRef, inView } = useInView({
    threshold: 0,
  });

  const [chats, setChats] = useState<(Chat | Wakzoo)[]>([]);

  const [last, setLast] = useState<number | null>(null);
  const [before, setBefore] = useState<number | null>(null);

  const [isEnd, setIsEnd] = useState(false);

  const [oldHeight, setOldHeight] = useState(0);
  const [oldScroll, setOldScroll] = useState(0);

  const settings = useRecoilValue(settingsState);

  const authors = useMemo(() => {
    const flags = Object.entries(settings.authors[name])
      .filter(([, value]) => value)
      .map(([key]) => streamers[key].flag);

    return mergeFlag(flags);
  }, [settings.authors]);

  useEffect(() => {
    if (inView) {
      (async () => {
        const response = await fetch(
          `https://api.wakscord.xyz/extension/${twitchId}/chatsv2?before=${
            before ? before : ""
          }&authors=${authors}&noWakzoo=${!settings.wakzoos[
            name
          ]}&noNotify=${!settings.notify}`
        );

        const data: (Chat | Wakzoo)[] = await response.json();

        if (!data.length) {
          setIsEnd(true);
          return;
        }

        setBefore(data[0].id);
        setChats((prev) => sortChats(prev, data));

        if (containerRef.current) {
          setOldHeight(containerRef.current.scrollHeight);
          setOldScroll(containerRef.current.scrollTop);
        }
      })();
    }
  }, [inView]);

  const loadRecent = useCallback(
    async (manual = false) => {
      if (!manual && !settings.autoRefresh) return;

      const response = await fetch(
        `https://api.wakscord.xyz/extension/${twitchId}/chatsv2?authors=${authors}&noWakzoo=${!settings
          .wakzoos[name]}&noNotify=${!settings.notify}`
      );

      const data = await response.json();

      setChats((prev) => sortChats(prev, data));
    },
    [settings.autoRefresh]
  );

  useEffect(() => {
    const intervalId = setInterval(loadRecent, 10000);

    return () => clearInterval(intervalId);
  }, [loadRecent]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.wakscord.xyz/extension/${twitchId}/chatsv2?authors=${authors}&noWakzoo=${!settings
          .wakzoos[name]}&noNotify=${!settings.notify}`
      );

      const data: (Chat | Wakzoo)[] = await response.json();

      setIsEnd(false);

      if (data.length === 0) {
        setBefore(null);
        setChats([]);
        return;
      }

      setBefore(data[0].id);
      setChats(data);

      if (containerRef.current) {
        setOldHeight(containerRef.current.scrollHeight);
        setOldScroll(containerRef.current.scrollTop);
      }
    })();
  }, [authors, settings.wakzoos[name], settings.notify]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - oldHeight + oldScroll;
    }
  }, [oldHeight, oldScroll]);

  useEffect(() => {
    if (!chats.length) return;

    if (chats[chats.length - 1].id !== last && containerRef.current) {
      setOldHeight(containerRef.current.scrollHeight);
      setOldScroll(containerRef.current.scrollHeight);
    }

    setLast(chats[chats.length - 1].id);
  }, [chats, last]);

  return (
    <Container ref={containerRef} color={getColor(name).bottom}>
      {isEnd ? (
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
        {chats.map((chat, index) => (
          <Message key={index} id={id} chat={chat} before={chats[index - 1]} />
        ))}

        <RefreshContainer>
          <Refresh
            onClick={async () => {
              await loadRecent(true);
            }}
          />
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
  margin-bottom: 16px;
`;

export default Chats;
