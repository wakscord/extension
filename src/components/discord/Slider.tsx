import { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";

import styled from "styled-components";

interface SliderProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Slider: FC<SliderProps> = ({ value, onChange }) => {
  return (
    <Container
      style={{
        backgroundColor: value ? color.active : color.inactive,
        justifyContent: value ? "flex-end" : "flex-start",
      }}
    >
      <Handle
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        layout
      >
        <motion.svg viewBox="0 0 20 20" fill="none">
          {pathList.map((path, index) => (
            <motion.path
              key={index}
              animate={value ? "active" : "inactive"}
              variants={path}
            />
          ))}
        </motion.svg>
      </Handle>
      <Input
        type="checkbox"
        role="switch"
        defaultChecked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
    </Container>
  );
};

const color = {
  active: "#23a55a",
  inactive: "#4f545c",
};

const pathList: Variants[] = [
  {
    active: {
      fill: color.active,
      d: "M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z",
    },
    inactive: {
      fill: color.inactive,
      d: "M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z",
    },
  },
  {
    active: {
      fill: color.active,
      d: "M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z",
    },
    inactive: {
      fill: color.inactive,
      d: "M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z",
    },
  },
];

const Container = styled(motion.div)`
  position: relative;

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

const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
`;

export default Slider;
