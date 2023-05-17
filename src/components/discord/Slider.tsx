import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import styled from "styled-components";

interface SliderProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Slider: FC<SliderProps> = ({ value, onChange }) => {
  const [active, setActive] = useState(false);

  const changeActive = () => {
    setActive(!active);
    onChange && onChange(!active);
  };

  useEffect(() => {
    if (value !== undefined) {
      setActive(!!value);
    }
  }, [value]);

  return (
    <Container
      onClick={changeActive}
      style={{
        backgroundColor: active ? "#23a55a" : "#4f545c",
        justifyContent: active ? "flex-end" : "flex-start",
      }}
    >
      <Handle
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        layout
      />
    </Container>
  );
};

const Container = styled(motion.div)`
  margin: 10px 10px;
  padding: 0 3px;

  box-sizing: border-box;

  width: 40px;
  height: 24px;
  border-radius: 60px;
  cursor: pointer;

  display: flex;
  align-items: center;

  transition: background-color 0.2s ease-in-out;
`;

const Handle = styled(motion.div)`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #fff;
`;

export default Slider;
