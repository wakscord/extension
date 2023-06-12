import { forwardRef } from "react";
import styled from "styled-components";
import Skeleton from "./discord/Skeleton";

interface MessagePlaceholderProps {
  isEnd: boolean;
  "data-index"?: number;
}

const MessagePlaceholder = forwardRef<HTMLDivElement, MessagePlaceholderProps>(
  ({ isEnd, ...props }, ref) => {
    if (isEnd) {
      return (
        <EndMessage {...props} ref={ref}>
          <span>기록된 모든 채팅을 읽으셨군요!</span>
        </EndMessage>
      );
    }

    return (
      <SkeletonContainer {...props} ref={ref}>
        <InnerContainer>
          <Skeleton />
        </InnerContainer>
      </SkeletonContainer>
    );
  }
);

const EndMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;
`;

const SkeletonContainer = styled.div`
  height: 1044px;
`;

const InnerContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 2px;

  padding-bottom: 10px;
`;

MessagePlaceholder.displayName = "MessagePlaceholder";
export default MessagePlaceholder;
