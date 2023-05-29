import styled from "styled-components";
import skeletons from "../../assets/skeletons.svg";

const Skeleton = () => (
  <Inner>
    <SkeletonImage src={skeletons} />
  </Inner>
);

const Inner = styled.div`
  position: relative;
  display: inline-block;
  height: 1039px;
  left: 10px;
  contain: paint;
`;

const SkeletonImage = styled.img`
  user-select: none;

  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

export default Skeleton;
