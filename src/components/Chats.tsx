import { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { getColor } from "../colors";
import Message from "./discord/Message";
import Spinner from "./discord/Spinner";

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

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [last, setLast] = useState<Chat | null>(null);
  const [before, setBefore] = useState<number | null>(null);
  const [isFirstLoaded, setIsFirstLoaded] = useState(false);
  const [oldHeight, setOldHeight] = useState(0);
  const [oldScroll, setOldScroll] = useState(0);

  const loadChats = async (recent: boolean = false) => {
    const response = await fetch(
      `https://api.wakscord.xyz/extension/${twitchId}/chats?before=${
        !recent || before ? before : ""
      }`
    );

    const data: Chat[] = await response.json();

    setBefore(data[0].id);
    setChats((prev) => {
      return [
        ...data.filter(
          (chat: Chat) => !prev.find((prevChat) => prevChat.id === chat.id)
        ),
        ...prev,
      ].sort((a: Chat, b: Chat) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    });

    if (containerRef.current) {
      setOldHeight(containerRef.current.scrollHeight);
      setOldScroll(containerRef.current.scrollTop);
    }
  };

  const onIntersect = async ([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      loadChats();
    }
  };

  const interval = () => {
    console.log("waaa");
    loadChats(true);
  };

  useEffect(() => {
    (async () => {
      await loadChats();
      setIsFirstLoaded(true);
    })();

    const intervalId = setInterval(interval, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;

    if (spinnerRef.current) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.5,
      });

      observer.observe(spinnerRef.current);
    }

    return () => observer && observer.disconnect();
  }, [spinnerRef, onIntersect]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight - oldHeight + oldScroll;
    }
  }, [oldHeight, oldScroll]);

  useEffect(() => {
    setLast(chats[chats.length - 1]);

    if (last && last.id !== chats[chats.length - 1].id) {
      setOldScroll(containerRef.current?.scrollHeight || 0);
    }
  }, [chats, last]);

  return (
    <Container ref={containerRef} color={getColor(name).bottom}>
      {isFirstLoaded && (
        <SpinnerContainer ref={spinnerRef}>
          <Spinner />
        </SpinnerContainer>
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

  height: 100px;
`;

export default Chats;
