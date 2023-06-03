import { useSetRecoilState } from "recoil";
import { ReactComponent as SettingsIconSVG } from "../assets/settings.svg";
import { ReactComponent as CloseIconSVG } from "../assets/close.svg";
import styled from "styled-components";
import { settingsOpenState } from "../states/settings";

export const SettingsOpenIcon = () => {
  const setter = useSetRecoilState(settingsOpenState);

  return (
    <SettingsIconSVG width={20} height={20} onClick={() => setter(true)} />
  );
};

export const SettingsCloseIcon = () => {
  const setter = useSetRecoilState(settingsOpenState);

  return <CloseIconSVG width={20} height={20} onClick={() => setter(false)} />;
};

export const TopRightIconContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;

  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;

  svg {
    cursor: pointer;
  }
`;
