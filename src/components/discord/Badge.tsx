import { FC } from "react";
import styled from "styled-components";

interface BadgeProps {
  children: string;
}

const Badge: FC<BadgeProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.span`
  margin-right: 4px;

  font-size: 11.2px;

  height: 14.4px;
  line-height: 14.4px;
  padding: 0 4px;
  border-radius: 3px;

  box-sizing: border-box;
  margin-bottom: 1.6px;

  background-color: #5865f2;
`;

export default Badge;
