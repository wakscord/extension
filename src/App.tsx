import { FC, useEffect } from "react";
import styled from "styled-components";

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
  height: 100vh;

  display: flex;
  flex-direction: column;
`;

const ChatsConainer = styled.div`
  height: calc(100vh - 74px);

  box-sizing: border-box;
  padding-bottom: 10px;
`;

export default App;
