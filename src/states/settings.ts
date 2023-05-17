import { atom } from "recoil";

export interface Settings {
  isOpen: boolean;
}

export const settingsState = atom<Settings>({
  key: "settingsState",
  default: {
    isOpen: false,
  },
});
