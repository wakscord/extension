import { FC } from "react";
import styled from "styled-components";
import { ReactComponent as WarningSign } from "../assets/warning.svg";
import Refresh from "./Refresh";

interface ErrorProps {
  onRefresh: () => Promise<void>;
}

const Error: FC<ErrorProps> = ({ onRefresh: onRefreshCallback }) => {
  return (
    <Container>
      <WarningSign width={110} fill="#6db69e" />

      <ErrorTitle>오류 발생</ErrorTitle>
      <ErrorText>정보를 불러오던 중 오류가 발생했습니다.</ErrorText>

      <RefreshContainer>
        <Refresh onClick={onRefreshCallback} />
      </RefreshContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-color: #ededed;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h2`
  color: #1a1b1e;

  margin-top: 1em;
  margin-bottom: 0.25em;
  line-height: 1.5em;
`;

const ErrorText = styled.span`
  color: #1a1b1e;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 2em;
`;

export default Error;
