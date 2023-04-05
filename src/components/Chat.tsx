import { FC, Fragment, ReactElement } from "react";
import styled from "styled-components";
import { getColor } from "../colors";
import Emote from "./discord/Emote";

interface ChatProps {
  name: string;
  chat: {
    content: string;
    time: string;
    emotes?: {
      [key: string]: string[];
    };
  };
}

const Chat: FC<ChatProps> = ({ name, chat }) => {
  const date = new Date(chat.time);
  const render: Array<ReactElement> = [];
  const emotes: any = {};

  if (chat.emotes) {
    for (const [id, indexes] of Object.entries(chat.emotes)) {
      for (const index of indexes) {
        emotes[index] = id;
      }
    }
  }

  let index = 0;
  let words = "";

  chat.content.split(" ").forEach((word) => {
    const start = index;
    const end = index + word.length - 1;
    const idx = `${start}-${end}`;

    index += word.length + 1;

    if (emotes[idx]) {
      if (words) {
        console.log(words);
        render.push(<TextFragment>{words}</TextFragment>);

        words = "";
      }

      render.push(<Emote id={emotes[idx]} name={word} key={idx} />);
      render.push(<TextFragment> </TextFragment>);
    } else {
      words += `${word} `;
    }
  });

  if (words) {
    render.push(<TextFragment>{words}</TextFragment>);
  }

  return (
    <Container>
      <Time>
        {date.getHours().toString().padStart(2, "0")}:
        {date.getMinutes().toString().padStart(2, "0")}
      </Time>
      <Name>
        <ColoredName color={getColor(name).name}>{name}</ColoredName>:{" "}
      </Name>
      <Content>
        {render.map((element, index) => {
          return <Fragment key={index}>{element}</Fragment>;
        })}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 24px;
`;

const Time = styled.span`
  color: #ababab;
  font-size: 0.7rem;
  margin-right: 0.2rem;

  vertical-align: middle;
`;

const ColoredName = styled.span<{ color: string }>`
  /* color: ${(props) => props.color}; */
  font-weight: 600;
`;

const Name = styled.span`
  vertical-align: middle;
`;

const Content = styled.span`
  vertical-align: middle;
  font-weight: 300;
  line-height: 1.3;
`;

const TextFragment = styled.span`
  vertical-align: middle;
`;

export default Chat;
