import { FC, useState } from "react";
import styled from "styled-components";
import { ReactComponent as RefreshIconSVG } from "../assets/refresh.svg";

interface RefreshProps {
  onClick: () => Promise<void>;
}

const Refresh: FC<RefreshProps> = ({ onClick: onClickCallback }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    await onClickCallback();

    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <RefreshButton onClick={onClick}>
      <RefreshIcon className={loading ? "loading" : ""} />
      <RefreshText>새로고침</RefreshText>
    </RefreshButton>
  );
};

const RefreshButton = styled.div`
  background-color: #37383d;
  border-radius: 32px;

  padding: 8px 16px;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 1px;
  transform: scale(1);

  transition: background-color 200ms cubic-bezier(0.19, 1, 0.22, 1), transform 200ms cubic-bezier(0.19, 1, 0.22, 1);

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    background-color: #50545b;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RefreshIcon = styled(RefreshIconSVG)`
  &.loading {
    animation: spin 300ms ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

const RefreshText = styled.span`
  margin-left: 4px;
  font-weight: 300;

  user-select: none;
`;

export default Refresh;
