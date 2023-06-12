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

export type ChannelState = Omit<Channel, "twitchId">;
