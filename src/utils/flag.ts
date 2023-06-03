import { streamers } from "../constants";

export const mergeFlag = (values: number[]): number => {
  return values.reduce((acc, cur) => acc | cur, 0);
};

export const streamerFlagList = Object.values(streamers).map(
  ({ flag }) => flag
);
