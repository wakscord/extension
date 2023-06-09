import { FC } from "react";
import styled from "styled-components";
import { ReactComponent as WarningSign } from "../assets/warning.svg";
import Refresh from "./Refresh";

interface ErrorProps {
  is404?: boolean;
  onRefresh: () => Promise<void>;
}

const Error: FC<ErrorProps> = ({ is404, onRefresh: onRefreshCallback }) => {
  return (
    <Container>
      <WarningSign width={75} fill="#6db69e" />

      <ErrorTitle>오류 발생</ErrorTitle>
      <ErrorText>
        {is404
          ? "지원하지 않는 채널입니다."
          : "정보를 불러오던 중 오류가 발생했습니다."}
      </ErrorText>

      {!is404 && (
        <RefreshContainer>
          <Refresh onClick={onRefreshCallback} />
        </RefreshContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-color: #313338;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`;

const ErrorTitle = styled.h2`
  color: white;

  margin-top: 1em;
  margin-bottom: 0.25em;
  line-height: 1.5em;
`;

const ErrorText = styled.span`
  color: white;
  opacity: 0.5;
`;

const RefreshContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 2em;
`;

export default Error;
