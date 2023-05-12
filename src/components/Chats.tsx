import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useInView } from "react-intersection-observer";
import { getColor } from "../colors";
import Message from "./discord/Message";
import Spinner from "./discord/Spinner";

import Refresh from "./Refresh";

interface Chat {
  id: number;
  content: string;
  time: string;
  emotes?: {
    [key: string]: string[];
  };
}

interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const sortChats = (prev: Chat[], next: Chat[]) => {
  return [
    ...next.filter(
      (chat: Chat) => !prev.find((prevChat) => prevChat.id === chat.id)
    ),
    ...prev,
  ].sort((a: Chat, b: Chat) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
};

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: spinnerRef, inView } = useInView({
    threshold: 0,
  });

  const [chats, setChats] = useState<Chat[]>([]);

  const [last, setLast] = useState<number | null>(null);
  const [before, setBefore] = useState<number | null>(null);

  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const [oldHeight, setOldHeight] = useState(0);
  const [oldScroll, setOldScroll] = useState(0);

  useEffect(() => {
    if (inView) {
      (async () => {
        const response = await fetch(
          `https://api.wakscord.xyz/extension/${twitchId}/chats?before=${
            before ? before : ""
          }`
        );

        const data: Chat[] = await response.json();

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

  const loadRecent = async (manual = false) => {
    if (!manual && localStorage.getItem("autoRefresh") !== "true") return;

    const response = await fetch(
      `https://api.wakscord.xyz/extension/${twitchId}/chats`
    );

    const data: Chat[] = await response.json();

    setChats((prev) => sortChats(prev, data));
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.wakscord.xyz/extension/${twitchId}/chats`
      );

      const data: Chat[] = await response.json();

      setIsFirstLoaded(true);
      setBefore(data[0].id);
      setChats((prev) =>
        [
          ...data.filter(
            (chat: Chat) => !prev.find((prevChat) => prevChat.id === chat.id)
          ),
          ...prev,
        ].sort((a: Chat, b: Chat) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
      );

      if (containerRef.current) {
        setOldHeight(containerRef.current.scrollHeight);
        setOldScroll(containerRef.current.scrollTop);
      }
    })();

    const intervalId = setInterval(loadRecent, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
      {isFirstLoaded && !isEnd && (
        <SpinnerContainer ref={spinnerRef}>
          <Spinner />
        </SpinnerContainer>
      )}

      {isEnd && (
        <EndMessage>
          <span>기록된 모든 채팅을 읽으셨군요!</span>
        </EndMessage>
      )}

      <InnerContainer>
        {chats.map((chat, index) => (
          <Message
            key={index}
            id={id}
            name={name}
            chat={chat}
            before={chats[index - 1]}
          />
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 100px;
  height: 100px;
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
