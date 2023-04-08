import { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { useRecoilState } from "recoil";
import Chats from "./components/Chats";
import Default from "./components/Default";
import Info from "./components/Info";
import { channelState } from "./states/channel";

const App: FC = () => {
  const [channel, setChannel] = useRecoilState(channelState);

  useEffect(() => {
    Twitch.ext.onAuthorized((auth) => {
      const { channelId } = auth;

      (async () => {
        const response = await fetch(
          `https://api.wakscord.xyz/extension/${channelId}`
        );

        const data = await response.json();

        setChannel({
          twitchId: channelId,
          ...data,
        });
      })();
    });
  }, []);

  if (!channel || !channel.id) {
    return <Default />;
  }

  return (
    <Container>
      <ChatsConainer>
        <Chats
          id={channel.id}
          twitchId={channel.twitchId}
          name={channel.name}
        />
      </ChatsConainer>

      <Info channel={channel} />
    </Container>
  );
};

const Container = styled.div`
  height: 500px;

  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.div<{ color: string }>`
  height: 100px;
  padding: 8px;

  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `}
`;

const ChatsConainer = styled.div`
  height: 400px;
  padding-bottom: 12px;
`;

export default App;
