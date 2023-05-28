import { FC, Fragment, ReactElement } from "react";
import styled, { css } from "styled-components";
import Emote, { EmoteImage } from "./Emote";

const urlRegex = /https?:\/\/[^\s]+/g;

interface ContentProps {
  content: string;
  emotes?: {
    [key: string]: string[];
  };
}

const Content: FC<ContentProps> = ({ content, emotes: rawEmotes }) => {
  const render: Array<ReactElement> = [];
  const emotes: any = {};

  let bigEmote = true;

  if (rawEmotes) {
    for (const [id, indexes] of Object.entries(rawEmotes)) {
      for (const index of indexes) {
        emotes[index] = id;
      }
    }
  }

  let index = 0;
  let words = "";

  const createTextFragment = (text: string) => {
    if (text.match(urlRegex)) {
      return (
        <UrlFragment href={text} target="_blank">
          {text}
        </UrlFragment>
      );
    }

    return <TextFragment>{text}</TextFragment>;
  };

  content.split(" ").forEach((word) => {
    const start = index;
    const end = index + word.length - 1;
    const idx = `${start}-${end}`;

    index += word.length + 1;

    if (emotes[idx]) {
      if (words) {
        render.push(createTextFragment(words));

        words = "";
        bigEmote = false;
      }

      render.push(<Emote id={emotes[idx]} name={word} key={idx} />);
      render.push(<TextFragment> </TextFragment>);
    } else {
      words += `${word} `;
    }
  });

  if (words) {
    render.push(createTextFragment(words));
    bigEmote = false;
  }

  return (
    <Container small={!bigEmote}>
      {render.map((element, index) => {
        return <Fragment key={index}>{element}</Fragment>;
      })}
    </Container>
  );
};

const Container = styled.span<{ small: boolean }>`
  vertical-align: middle;
  font-weight: 300;
  line-height: 1.3;

  ${(props) =>
    props.small &&
    css`
      ${EmoteImage} {
        width: 24px !important;
        height: 24px !important;
      }
    `}
`;

const TextFragment = styled.span`
  vertical-align: middle;

  word-wrap: break-word;
`;

const UrlFragment = styled.a`
  vertical-align: middle;
  color: rgb(0, 168, 252);
  text-decoration: none;

  word-wrap: break-word;

  &:hover {
    text-decoration: underline;
  }
`;

export default Content;
