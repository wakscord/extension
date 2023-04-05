import { FC } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as WakscordLogo } from "../assets/wakscord.svg";
import { Color, getColor } from "../colors";
import { Channel } from "../states/channel";

interface InfoProps {
  channel: Channel;
}

const Info: FC<InfoProps> = ({ channel }) => {
  const colors: Color = getColor(channel.name);

  return (
    <Container color={colors.bottom}>
      <Texts color={colors.text}>
        <Name>{channel.name}</Name>
        {channel.info && (
          <Text>
            {channel.info.date} 뱅온정보: {channel.info.status}
          </Text>
        )}
      </Texts>

      <LogoContainer>
        <WakscordLogo width={80} fill={colors.text} />
      </LogoContainer>
    </Container>
  );
};

const Container = styled.div<{ color: string }>`
  height: 100px;
  padding: 10px;

  display: flex;
  align-items: center;

  /* top left right border radius */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;

  ${({ color }) =>
    color &&
    css`
      /* background: linear-gradient(90deg, ${color}, #ededed); */
      background-color: ${color};
    `}
`;

const Texts = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;

const Name = styled.span`
  font-size: 2rem;
  font-weight: 800;
`;

const Text = styled.span``;

const LogoContainer = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Info;
