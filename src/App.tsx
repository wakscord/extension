import { FC } from "react";
import styled from "styled-components";

import Chats from "./components/Chats";
import Default from "./components/Default";
import Error from "./components/Error";
import Info from "./components/Info";

import Settings from "./components/Settings";
import { useChannelState } from "./hooks/ChannelStates";
import { useChannelId } from "./hooks/ChannelId";
import {
  SettingsOpenIcon,
  TopRightIconContainer,
} from "./components/SettingsIcon";

const App: FC = () => {
  const channelId = useChannelId();
  const { channel, error, refresh } = useChannelState(channelId);

  if (error) {
    return <Error onRefresh={refresh} />;
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
