import { atom } from "recoil";
import { streamers, streamerNames } from "../constants";

export interface Settings {
  isOpen: boolean;
  autoRefresh: boolean;
  wakzoo: boolean;
  authors: Authors;
}

type Authors = Record<string, Record<string, boolean>>;

const authors = localStorage.getItem("authors");

const initialAuthorsValue = Object.fromEntries(
  streamerNames.map((name) => [
    name,
    Object.fromEntries(
      streamerNames.map((subName) => [subName, name === subName] as const)
    ),
  ])
) as Authors;

export const settingsState = atom<Settings>({
  key: "settingsState",
  default: {
    isOpen: false,
    autoRefresh: localStorage.getItem("autoRefresh") === "true",
    wakzoo: localStorage.getItem("noWakzoo") === "true",
    authors: authors ? (JSON.parse(authors) as Authors) : initialAuthorsValue,
  },
});
