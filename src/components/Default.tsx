import styled from "styled-components";
import { ReactComponent as WakscordLogo } from "../assets/wakscord.svg";
import { AnimatePresence, motion } from "framer-motion";

const Default = ({ show = true }: { show?: boolean }) => {
  return (
    <AnimatePresence>
      {show && (
        <Container
          initial={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <LogoContainer href="https://wakscord.xyz" target="_blank">
            <WakscordLogo width={150} fill="#6db69e" />
          </LogoContainer>
        </Container>
      )}
    </AnimatePresence>
  );
};

const Container = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  width: 100%;
  height: 100%;

  background-color: #313338;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.a`
  text-decoration: none;
  cursor: pointer;
`;

export default Default;
