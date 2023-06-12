import { atom } from "recoil";
import { streamerNames } from "../constants";

export interface Settings {
  autoRefresh: boolean;
  wakzoos: Wakzoos;
  notify: boolean;
  authors: Authors;
}

type Authors = Record<string, Record<string, boolean>>;
type Wakzoos = Record<string, boolean>;

const authors = localStorage.getItem("authors");
const wakzoos = localStorage.getItem("wakzoos");
const notify = localStorage.getItem("notify");

const initialAuthorsValue = Object.fromEntries(
  streamerNames.map((name) => [
    name,
    Object.fromEntries(
      streamerNames.map((subName) => [subName, name === subName] as const)
    ),
  ])
) as Authors;

const initialWakzoosValue = Object.fromEntries(
  streamerNames.map((name) =>
    ["뢴트게늄", "천양"].includes(name) ? [name, false] : [name, true]
  )
) as Wakzoos;

export const settingsState = atom<Settings>({
  key: "settingsState",
  default: {
    autoRefresh: localStorage.getItem("autoRefresh") === "true",
    wakzoos: wakzoos ? (JSON.parse(wakzoos) as Wakzoos) : initialWakzoosValue,
    notify: notify ? notify === "true" : true,
    authors: authors ? (JSON.parse(authors) as Authors) : initialAuthorsValue,
  },
});

export const settingsOpenState = atom<boolean>({
  key: "settingsOpenState",
  default: false,
});
