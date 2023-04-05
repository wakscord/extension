import { atom } from "recoil";

export interface Chat {
  content: string;
  time: string;
  emotes?: {
    [key: string]: string[];
  };
}

export const chatsState = atom<Chat[]>({
  key: "chatsState",
  default: [],
});
