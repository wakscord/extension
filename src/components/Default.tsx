import { FC } from "react";
import styled from "styled-components";
import { ReactComponent as WakscordLogo } from "../assets/wakscord.svg";

const Default: FC = () => {
  return (
    <Container>
      <LogoContainer href="https://wakscord.xyz" target="_blank">
        <WakscordLogo width={350} fill="#6db69e" />
      </LogoContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  background-color: #ededed;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.a`
  text-decoration: none;
  cursor: pointer;
`;

export default Default;
