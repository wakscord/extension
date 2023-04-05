import { atom } from "recoil";

export interface Channel {
  id: string;
  twitchId: string;
  name: string;
  info?: {
    date: string;
    idx: string;
    status: string;
  };
}

export const channelState = atom<Channel | null>({
  key: "channelState",
  default: null,
});
