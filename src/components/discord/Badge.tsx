import { FC } from "react";
import styled from "styled-components";

interface BadgeProps {
  children: string;
}

const Badge: FC<BadgeProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

const Container = styled.span`
  margin-right: 0.25rem;

  font-size: 0.7rem;

  height: 0.9rem;
  line-height: 0.9rem;
  padding: 0 0.25rem;
  border-radius: 0.1875rem;

  box-sizing: border-box;
  margin-bottom: 0.1rem;

  background-color: #5865f2;
`;

export default Badge;
