import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as RefreshIconSVG } from "../assets/refresh.svg";
import { motion, useSpring } from "framer-motion";

const REFRESH_COOLDOWN = 800;

const Rotating = ({ rotate }: { rotate: boolean }) => {
  const rotation = useSpring(0, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    if (!rotate) {
      return;
    }

    let iteration = 1;
    rotation.set(360);

    const interval = setInterval(() => {
      iteration++;
      rotation.set(iteration * 360);
    }, 1000);

    return () => {
      setTimeout(() => {
        rotation.jump(0);
      }, 800);

      clearInterval(interval);
    };
  }, [rotate]);

  return (
    <motion.span
      style={{
        width: 24,
        height: 24,
        rotate: rotation,
      }}
    >
      <RefreshIconSVG />
    </motion.span>
  );
};

interface RefreshProps {
  onClick: () => Promise<void>;
}

const Refresh: FC<RefreshProps> = ({ onClick: onClickCallback }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (refreshing) {
      setDisabled(true);
      return;
    }
  }, [refreshing]);

  const onClick = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    await onClickCallback();
    setRefreshing(false);

    setTimeout(() => {
      setDisabled(false);
    }, REFRESH_COOLDOWN);
  };

  return (
    <RefreshButton onClick={onClick} disabled={disabled}>
      <Rotating rotate={refreshing} />
      <RefreshText>새로고침</RefreshText>
    </RefreshButton>
  );
};

const RefreshButton = styled.div<{ disabled: boolean }>`
  background-color: #37383d;
  border-radius: 32px;

  padding: 8px 16px;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 1px;
  transform: scale(1);

  transition: background-color 200ms cubic-bezier(0.19, 1, 0.22, 1),
    transform 200ms cubic-bezier(0.19, 1, 0.22, 1),
    opacity 200ms cubic-bezier(0.19, 1, 0.22, 1);

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ disabled }) =>
  disabled && `
    pointer-events: none;
    opacity: 0.5;
  `};

  cursor: pointer;

  &:hover {
    background-color: #50545b;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RefreshText = styled.span`
  margin-left: 4px;
  font-weight: 300;

  user-select: none;
`;

export default Refresh;
