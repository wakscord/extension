import { FC, useState } from "react";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import { ReactComponent as CloseIconSVG } from "../assets/close.svg";
import { settingsState } from "../states/settings";
import Slider from "./discord/Slider";

interface SettingsProps {}

const Settings: FC<SettingsProps> = ({}) => {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [toggle, setToggle] = useState(false);

  return (
    <Container isOpen={settings.isOpen}>
      <CloseButtonContainer>
        <CloseIcon
          width={20}
          height={20}
          onClick={() => {
            setSettings({
              ...settings,
              isOpen: false,
            });
          }}
        />
      </CloseButtonContainer>
      <InnerContainer>
        <Title>설정</Title>
        <Slider value={toggle} onChange={setToggle} />
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non elit
          ut mauris laoreet vestibulum. Suspendisse at sem aliquet, laoreet
          metus accumsan, iaculis elit. Praesent mi eros, mattis vel vulputate
          eu, luctus vitae metus. Aenean consectetur ipsum mauris, quis ornare
          metus tincidunt eget. Mauris rutrum blandit diam rutrum malesuada.
          Phasellus pharetra eros purus, at maximus justo tempus nec.
          Suspendisse commodo in urna ac semper. Sed id sem dapibus, pretium
          nulla a, sollicitudin tellus. Cras blandit pellentesque tortor, sit
          amet euismod nisi aliquet quis. Aliquam vel magna libero. Sed nisl
          diam, tincidunt sed ex sit amet, faucibus interdum tortor. Phasellus
          consequat, odio a sodales condimentum, est dolor consectetur nisi, non
          commodo nisl dolor eget orci. Suspendisse at magna metus. Quisque sed
          lobortis mi. Donec congue nec nulla non hendrerit. Morbi venenatis,
          nisl sit amet dignissim blandit, arcu metus scelerisque quam, sed
          fermentum nisl purus eget eros. Vestibulum mollis laoreet lectus a
          consectetur. Curabitur ultricies eu magna vel laoreet. Vestibulum
          placerat gravida nisl quis tempor. Integer posuere luctus gravida.
          Integer id quam nibh. Integer nec finibus odio. Morbi nec augue
          tortor. Nulla luctus bibendum facilisis. Cras sollicitudin odio sem,
          et bibendum metus porttitor id. Etiam ac rutrum mauris. Praesent et
          sapien suscipit, sodales est vel, egestas mauris. Integer at mauris
          sollicitudin, placerat nunc quis, accumsan metus. Quisque vitae nulla
          et dolor laoreet tincidunt. Vivamus ultricies metus ut lorem ultricies
          finibus vitae non arcu. Maecenas ut augue vitae tortor egestas posuere
          sed non risus. Aenean feugiat ultrices placerat. Ut ac facilisis dui.
          Sed commodo rhoncus arcu sit amet congue. Vivamus malesuada
          consectetur libero. Morbi consequat felis vel orci interdum, ac varius
          nibh laoreet. Curabitur ligula augue, tincidunt non sodales id,
          sagittis at risus. Integer in malesuada lacus. Suspendisse sed
          vehicula magna. Maecenas non molestie augue. Sed a mattis nisi. Sed
          accumsan, felis ut dictum bibendum, sapien eros fringilla est, ac
          tincidunt diam nulla sit amet quam. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Integer diam
          augue, cursus semper tincidunt nec, placerat tempor nisl. Aenean quis
          tortor a lorem convallis laoreet. Suspendisse potenti. Donec malesuada
          ante faucibus, feugiat nisi in, convallis quam. Sed quam metus, auctor
          in ipsum at, condimentum vulputate tortor. Mauris dui ligula,
          hendrerit ac nibh sit amet, rutrum auctor purus. In a vehicula eros,
          non elementum arcu. Nam id aliquet nibh. Pellentesque ullamcorper erat
          non nisl suscipit ultricies. Aliquam erat volutpat. Etiam vitae justo
          ac elit rutrum fermentum. Nulla facilisi. Suspendisse elementum quam
          vel mauris vulputate mattis. Nullam rutrum mattis velit in placerat.
          Fusce eget purus et nisl volutpat malesuada at vitae ligula. Ut
          sodales sem et ex tempor, non finibus sem consequat. Aliquam pharetra
          mattis sapien. Cras at pulvinar massa. Donec quis faucibus nibh. In
          tempus sagittis tortor, vel condimentum massa malesuada quis. Proin
          mattis ac elit in dictum. Etiam non purus vitae neque vestibulum
          lobortis. Nunc feugiat leo ullamcorper, mattis dui vel, egestas neque.
          Phasellus luctus lectus quis finibus laoreet. Etiam ut maximus enim,
          eget posuere dolor. Mauris feugiat porta cursus. Suspendisse a nibh
          justo. Donec nec sapien rhoncus, finibus dui sed, convallis mi. Sed
          non venenatis nibh, quis lobortis odio. Quisque ut erat enim. Nam in
          cursus dui. Nunc bibendum et orci ut accumsan. Cras eu arcu feugiat,
          rhoncus ex ultrices, lacinia orci. Etiam eros nibh, ornare eu ligula
          pharetra, tincidunt sodales sem. Donec fermentum mollis nisl id
          bibendum. Nullam vulputate at sem sed scelerisque. Phasellus id ex
          tortor. Nam sapien diam, faucibus vitae ligula id, egestas rhoncus
          purus. Quisque posuere purus eu quam pulvinar sagittis. Sed sed quam
          at nisl aliquam luctus eu id felis. Ut rutrum rhoncus neque, quis
          semper odio dignissim et. In ipsum urna, pharetra sagittis hendrerit
          at, hendrerit et sapien. Quisque aliquam placerat efficitur. Ut id
          sapien sem. Donec ut pellentesque ante, at bibendum risus. Vivamus
          ultricies nisl in justo auctor, at varius magna faucibus. Curabitur
          faucibus pulvinar lorem, non posuere ligula faucibus at. Nunc leo
          massa, iaculis et ullamcorper convallis, pharetra at nisl. Nulla ut
          nibh tincidunt, pharetra ante mattis, suscipit nibh. Donec vitae
          porttitor massa. Praesent laoreet nisi et enim cursus egestas. Sed
          fermentum eleifend luctus. Praesent faucibus vitae nisl sed gravida.
          Ut auctor magna condimentum, lacinia orci quis, eleifend odio. Donec
          elit nisl, efficitur vitae enim eu, pellentesque bibendum dolor. Orci
          varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Quisque nec bibendum arcu. Mauris volutpat, tortor
          vitae porta laoreet, nunc magna commodo sem, ullamcorper eleifend leo
          augue sed ex. Nam pharetra fringilla magna a cursus. Maecenas
          porttitor non lectus a consequat. Maecenas porta lorem non velit
          iaculis, ut sagittis sem pulvinar. In varius metus at quam posuere, ut
          pulvinar lectus dictum. Curabitur consequat semper felis, ac suscipit
          dui imperdiet eu. Sed nec est dui. Etiam at feugiat lacus. Suspendisse
          ac pulvinar enim. Sed sem justo, laoreet sed sapien quis, aliquet
          pulvinar nunc. In consectetur suscipit libero sit amet imperdiet. Cras
          rhoncus felis eros, non tempus urna efficitur a. In turpis leo,
          vulputate vel ultrices vitae, tempus eget purus.
        </span>
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
  transition: visibility 0.2s ease-in-out;

  animation: ${(props) => (props.isOpen ? fadeinAnimation : fadeoutAnimation)}
    0.2s ease-in-out;
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
  display: flex;
  justify-content: flex-end;

  padding: 5px;
  box-sizing: border-box;
  height: 30px;
`;

const CloseIcon = styled(CloseIconSVG)`
  cursor: pointer;
`;

const InnerContainer = styled.div`
  padding: 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  user-select: none;

  height: calc(100% - 30px);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  &::-webkit-scrollbar-corner {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #1a1b1e;
    min-height: 40px;
  }

  &::-webkit-scrollbar-track {
    background: #2b2d31;
  }

  &::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-track {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 8px;
  }
`;

const Title = styled.span`
  font-size: 2rem;
  font-weight: bold;
`;

export default Settings;
