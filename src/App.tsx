import { FC, useEffect } from "react";
import styled, { css } from "styled-components";

import { useRecoilState } from "recoil";
import Chats from "./components/Chats";
import Info from "./components/Info";
import { channelState } from "./states/channel";

const App: FC = () => {
  const [channel, setChannel] = useRecoilState(channelState);

  useEffect(() => {
    (async () => {
      const id = [
        "702754423",
        "237570548",
        "169700336",
        "203667951",
        "707328484",
        "195641865",
        "49045679",
        "132782743",
        "137881582",
      ][5];

      const response = await fetch(`https://api.wakscord.xyz/extension/${id}`);

      const data = await response.json();

      setChannel({
        twitchId: id,
        ...data,
      });
    })();

    // Twitch.ext.onAuthorized((auth) => {
    //   const { channelId } = auth;

    //   (async () => {
    //     const response = await fetch(
    //       `https://api.wakscord.xyz/extension/${channelId}`
    //     );

    //     const data = await response.json();

    //     setChannel(data);
    //   })();
    // });
  }, []);

  if (!channel) {
    return null;
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
