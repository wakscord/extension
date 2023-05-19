import { FC } from "react";

import moment from "moment";
import "moment/dist/locale/ko";
import styled, { css } from "styled-components";

import { Chat, Wakzoo } from "../../interfaces";
import Content from "./Content";
import Embed from "./Embed";

interface MessageProp {
  id: string;
  name: string;
  chat: Chat | Wakzoo;
  before?: Chat | Wakzoo;
}

const Message: FC<MessageProp> = ({ id, name, chat, before }) => {
  const isCompact = before
    ? new Date(chat.time).getTime() - new Date(before.time).getTime() <
      5 * 60 * 1000
      ? true
      : false
    : false;

  return (
    <Container isCompact={isCompact}>
      {isCompact ? (
        <HoverInfo>{moment(chat.time).format("a h:mm")}</HoverInfo>
      ) : (
        <>
          <Avatar src={`https://api.wakscord.xyz/avatar/${id}.png`} />

          <Header>
            <Username>{name}</Username>
            <Info>
              {new Date().getTime() - new Date(chat.time).getTime() >
              24 * 60 * 60 * 1000
                ? moment(chat.time).format("yyyy.MM.DD. a h:mm")
                : moment(chat.time).calendar()}{" "}
            </Info>
          </Header>
        </>
      )}

      <ContentContainer>
        <Content
          content={"content" in chat ? chat.content : chat.url}
          emotes={"emotes" in chat ? chat.emotes : undefined}
        />

        {"embeds" in chat &&
          chat.embeds.map((embed, idx) => <Embed key={idx} embed={embed} />)}
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div<{ isCompact: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 0 0 10px;
  padding-left: 10px;

  background: #313338;

  ${(props) =>
    !props.isCompact &&
    css`
      margin-top: 1rem;
      padding: 3px 0 3px 10px;
    `}

  &:hover {
    background: #2e3035;
  }
`;

const HoverInfo = styled.div`
  position: absolute;

  left: -7.5px;

  width: 73px;
  height: 1.4rem;
  line-height: 1.4rem;
  text-align: center;
  font-size: 0.7rem;
  color: #b9bbbe;

  opacity: 0;

  ${Container}:hover & {
    opacity: 1;
  }
`;

const Avatar = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  pointer-events: none;

  top: 2px;
`;

const Header = styled.div`
  padding-left: 50px;
`;

const Username = styled.span`
  color: white;
  font-weight: 500;
`;

const Info = styled.span`
  vertical-align: center;

  color: #a3a6aa;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const ContentContainer = styled.div`
  padding-left: 50px;
  color: white;
  font-weight: 300;
`;

export default Message;
