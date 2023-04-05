import { FC, Fragment, ReactElement } from "react";
import styled, { css } from "styled-components";
import Emote, { EmoteImage } from "./Emote";

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

  content.split(" ").forEach((word) => {
    const start = index;
    const end = index + word.length - 1;
    const idx = `${start}-${end}`;

    index += word.length + 1;

    if (emotes[idx]) {
      if (words) {
        render.push(<TextFragment>{words}</TextFragment>);

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
    render.push(<TextFragment>{words}</TextFragment>);
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
`;

export default Content;
