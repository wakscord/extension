import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useInView } from "react-intersection-observer";
import { getColor } from "../colors";
import Message from "./discord/Message";
import Spinner from "./discord/Spinner";

import { Chat, ChatsResponse, Wakzoo } from "../interfaces";
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

  const { ref: spinnerRef, inView } = useInView({
    threshold: 0,
  });

  const [chats, setChats] = useState<(Chat | Wakzoo)[]>([]);

  const [last, setLast] = useState<number | null>(null);
  const [before, setBefore] = useState<number | null>(null);
  const [wakzooBefore, setWakzooBefore] = useState<number | null>(null);

  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const [oldHeight, setOldHeight] = useState(0);
  const [oldScroll, setOldScroll] = useState(0);

  useEffect(() => {
    if (inView) {
      (async () => {
        const response = await fetch(
          `https://api.wakscord.xyz/extension/${twitchId}/chatsv2?chatsBefore=${
            before ? before : ""
          }&wakzooBefore=${wakzooBefore ? wakzooBefore : ""}`
        );

        const data: ChatsResponse = await response.json();

        if (!data.chats.length) {
          setIsEnd(true);
          return;
        }

        setBefore(data.chats[0].id);
        setWakzooBefore(data.wakzoo.length && data.wakzoo[0].id);
        setChats((prev) => sortChats(prev, data.chats.concat(data.wakzoo)));

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
      `https://api.wakscord.xyz/extension/${twitchId}/chatsv2`
    );

    const data: ChatsResponse = await response.json();

    setChats((prev) => sortChats(prev, data.chats.concat(data.wakzoo)));
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.wakscord.xyz/extension/${twitchId}/chatsv2`
      );

      const data: ChatsResponse = await response.json();

      setIsFirstLoaded(true);
      setBefore(data.chats[0].id);
      setWakzooBefore(data.wakzoo.length && data.wakzoo[0].id);
      setChats((prev) => sortChats(prev, data.chats.concat(data.wakzoo)));

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
