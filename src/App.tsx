import { FC } from "react";
import styled from "styled-components";

import Default from "./components/Default";
import Error from "./components/Error";
import Info from "./components/Info";

import Chats from "./components/Chats";
import Settings from "./components/Settings";
import {
  SettingsOpenIcon,
  TopRightIconContainer,
} from "./components/SettingsIcon";
import { useChannelId } from "./hooks/useChannelId";
import { useChannelState } from "./hooks/useChannelState";

const App: FC = () => {
  const channelId = useChannelId();
  const { channel, error, is404, refresh } = useChannelState(channelId);

  if (error) {
    return <Error is404={is404} onRefresh={refresh} />;
  }

  if (!channel) {
    return <Default />;
  }

  return (
    <>
      <Default show={false} />
      <Settings channel={channel} />

      <Container>
        <TopRightIconContainer>
          <SettingsOpenIcon />
        </TopRightIconContainer>

        <ChatsConainer>
          <Chats
            id={channel.id}
            twitchId={channel.twitchId}
            name={channel.name}
          />
        </ChatsConainer>

        <Info channel={channel} />
      </Container>
    </>
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
`;

export default App;
