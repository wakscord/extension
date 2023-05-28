import { FC, useEffect } from "react";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import { Controller, useForm } from "react-hook-form";
import { ReactComponent as CloseIconSVG } from "../assets/close.svg";
import { streamerNames } from "../constants";
import { Channel } from "../states/channel";
import { Settings, settingsOpenState, settingsState } from "../states/settings";
import Slider from "./discord/Slider";

interface SettingsProps {
  channel: Channel;
}

const Settings: FC<SettingsProps> = ({ channel }) => {
  const [isOpen, setIsOpen] = useRecoilState(settingsOpenState);
  const [defaultValues, setSettings] = useRecoilState(settingsState);

  const { control, watch, handleSubmit } = useForm<Settings>({
    defaultValues,
  });

  useEffect(() => {
    function onSubmit(data: Settings) {
      setSettings((settings) => ({ ...settings, ...data }));

      localStorage.setItem("autoRefresh", JSON.stringify(data.autoRefresh));
      localStorage.setItem("wakzoos", JSON.stringify(data.wakzoos));
      localStorage.setItem("notify", JSON.stringify(data.notify));
      localStorage.setItem("authors", JSON.stringify(data.authors));
    }

    const subscription = watch(() => handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <Container isOpen={isOpen}>
      <CloseButtonContainer>
        <CloseIcon
          width={20}
          height={20}
          onClick={() => setIsOpen(false)}
        />
      </CloseButtonContainer>
      <InnerContainer>
        <Title>설정</Title>
        <Controller
          control={control}
          name="autoRefresh"
          render={({ field: { value, onChange } }) => (
            <FormControl>
              <FormGroup>
                <FormLabel style={{ marginBottom: "8px" }}>
                  자동 새로고침
                </FormLabel>
                <FormHelperText>채팅 내용을 상시 불러옵니다.</FormHelperText>
              </FormGroup>
              <Slider value={value} onChange={onChange} />
            </FormControl>
          )}
        />
        <Hr />
        <Controller
          control={control}
          name={`wakzoos.${channel.name}`}
          render={({ field: { value, onChange } }) => (
            <FormControl>
              <FormGroup>
                <FormLabel style={{ marginBottom: "8px" }}>
                  왁물원 글 보여주기
                </FormLabel>
                <FormHelperText>왁물원 글을 채팅에 보여줍니다.</FormHelperText>
              </FormGroup>
              <Slider value={value} onChange={onChange} />
            </FormControl>
          )}
        />
        <Hr />
        <Controller
          control={control}
          name="notify"
          render={({ field: { value, onChange } }) => (
            <FormControl>
              <FormGroup>
                <FormLabel style={{ marginBottom: "8px" }}>추가 알림</FormLabel>
                <FormHelperText>
                  추가적인 알림을 채팅에 보여줍니다.
                </FormHelperText>
              </FormGroup>
              <Slider value={value} onChange={onChange} />
            </FormControl>
          )}
        />
        <Hr />
        <FormHelperText>채팅 표시 여부</FormHelperText>
        {streamerNames.map((name) => (
          <Controller
            key={name}
            control={control}
            name={`authors.${channel.name}.${name}`}
            render={({ field: { value, onChange } }) => (
              <FormControl>
                <FormLabel style={{ marginBottom: "8px" }}>{name}</FormLabel>
                <Slider value={value} onChange={onChange} />
              </FormControl>
            )}
          />
        ))}
      </InnerContainer>
    </Container>
  );
};

const Container = styled.div<{ isOpen: boolean }>`
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: #313338;

  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition: visibility 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: ${(props) => (props.isOpen ? "auto" : "none")};

  animation: ${(props) => (props.isOpen ? fadeinAnimation : fadeoutAnimation)}
    0.4s cubic-bezier(0.19, 1, 0.22, 1);
`;

const fadeinAnimation = keyframes`
  from {
    transform: scale(1.2);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeoutAnimation = keyframes`
  to {
    transform: scale(1.3);
    opacity: 0;
  }

  from {
    transform: scale(1);
    opacity: 1;
  }
`;

const CloseButtonContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 10;

  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
`;

const CloseIcon = styled(CloseIconSVG)`
  cursor: pointer;
`;

const InnerContainer = styled.div`
  padding: 0px 20px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  user-select: none;

  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1a1b1e;
    min-height: 40px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    transition: background 0.2s cubic-bezier(0.19, 1, 0.22, 1);

    &:hover {
      background: #2b2d31;
    }
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    background-clip: padding-box;
    border-radius: 8px;
  }

  & > *:first-child {
    margin-top: 10px;
  }

  & > *:last-child {
    margin-bottom: 10vh;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  line-height: 40px;
  font-weight: bold;
  margin: 0;
`;

const FormControl = styled.label`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const FormGroup = styled.div`
  flex: 1;
`;

const FormLabel = styled.h2`
  font-size: 16px;
  font-weight: medium;
  margin: 0;
`;

const FormHelperText = styled.div`
  font-size: 14px;
  font-weight: regular;
  color: #b5bac1;
`;

const Hr = styled.hr`
  border: 0.5px solid #3f4147;
  margin: 0;
`;

export default Settings;
