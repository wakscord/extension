import styled from 'styled-components';
import skeletons from '../../assets/skeletons.svg';

export default function Spinner() {
  return (
    <Inner>
      <img src={skeletons} />
    </Inner>
  );
}

const Inner = styled.div`
  position: relative;
  display: inline-block;
  height: 1039px;
  left: 10px;
  contain: paint;
`;
