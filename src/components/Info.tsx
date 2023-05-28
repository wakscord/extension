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
          <Link
            href={`https://cafe.naver.com/steamindiegame/${channel.info.idx}`}
            target="_blank"
          >
            {channel.info.date} 뱅온정보: {channel.info.status}
          </Link>
        )}
      </Texts>

      <LogoContainer href="https://wakscord.xyz" target="_blank">
        <WakscordLogo width={65} fill={colors.text} />
      </LogoContainer>
    </Container>
  );
};

const Container = styled.div<{ color: string }>`
  height: 74px;
  padding: 15px 18px;
  z-index: 10;

  display: flex;
  align-items: center;

  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  box-sizing: border-box;
  user-select: none;

  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `}
`;

const Texts = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;

  margin-left: 3px;

  ${({ color }) =>
    color &&
    css`
      color: ${color};
    `}
`;

const Name = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
`;

const Link = styled.a`
  font-size: 0.9rem;
  opacity: 0.9;

  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  text-decoration: underline;
  color: white;
`;

const LogoContainer = styled.a`
  text-decoration: none;

  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

export default Info;
