import { FC } from "react";

import moment from "moment";
import "moment/dist/locale/ko";
import styled, { css } from "styled-components";

import { streamers } from "../../constants";
import { Chat, Wakzoo } from "../../interfaces";
import Badge from "./Badge";
import Content from "./Content";
import Embed from "./Embed";

interface MessageProp {
  id: string;
  chat: Chat | Wakzoo;
  before?: Chat | Wakzoo;
}

const Message: FC<MessageProp> = ({ id, chat, before }) => {
  const isCompact = before
    ? new Date(chat.time).getTime() - new Date(before.time).getTime() <
        5 * 60 * 1000 && chat.author === before.author
    : false;

  return (
    <Container isCompact={isCompact}>
      {isCompact ? (
        <HoverInfo>
          <time dateTime={chat.time}>{moment(chat.time).format("a h:mm")}</time>
        </HoverInfo>
      ) : (
        <>
          <Avatar
            src={
              Object.keys(streamers).includes(chat.author)
                ? `https://api.wakscord.xyz/avatar/${
                    streamers[chat.author].id
                  }.png`
                : `https://api.wakscord.xyz/avatar/${chat.author}`
            }
            onError={(event) => {
              event.currentTarget.src = `https://api.wakscord.xyz/avatar/${id}.png`;
            }}
          />

          <Header>
            <Title>
              <Username>{chat.author}</Username>

              {!Object.keys(streamers).includes(chat.author) && (
                <Badge>알림</Badge>
              )}
            </Title>

            <Info>
              <time dateTime={chat.time}>
                {new Date().getTime() - new Date(chat.time).getTime() >
                24 * 60 * 60 * 1000
                  ? moment(chat.time).format("yyyy.MM.DD. a h:mm")
                  : moment(chat.time).calendar()}{" "}
              </time>
            </Info>
          </Header>
        </>
      )}

      <ContentContainer>
        <Content
          content={chat.content}
          emotes={Array.isArray(chat.data) ? undefined : (chat as Chat).data}
        />

        {Array.isArray(chat.data) &&
          (chat as Wakzoo).data.map((embed, idx) => (
            <Embed key={idx} embed={embed} />
          ))}
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
      margin-top: 16px;
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
  height: 22.4px;
  line-height: 22.4px;
  text-align: center;
  font-size: 11.2px;
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

  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Title = styled.div`
  margin-right: 4px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Username = styled.span`
  margin-right: 4px;

  color: white;
  font-weight: 500;
`;

const Info = styled.span`
  color: #a3a6aa;
  font-size: 12.8px;
`;

const ContentContainer = styled.div`
  padding-left: 50px;
  color: white;
  font-weight: 300;
`;

export default Message;
