import { FC, useEffect } from "react";
import styled from "styled-components";

import { useRecoilState } from "recoil";
import { getColor } from "../colors";
import { chatsState } from "../states/chats";
import Message from "./discord/Message";

interface ChatsProps {
  id: string;
  twitchId: string;
  name: string;
}

const Chats: FC<ChatsProps> = ({ id, twitchId, name }) => {
  const [chats, setChats] = useRecoilState(chatsState);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.wakscord.xyz/extension/${twitchId}/chats`
      );

      const data = await response.json();

      setChats(data);
    })();
  }, []);

  return (
    <Container color={getColor(name).bottom}>
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
`;

const Text = styled.span`
  margin: 0;
`;

export default Chats;
