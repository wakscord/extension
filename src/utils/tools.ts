import { Chat, Wakzoo } from "../interfaces";

export const decodeText = (text: string): string => {
  return (
    new DOMParser().parseFromString(decodeURI(text), "text/html")
      .documentElement.textContent || ""
  );
};

export const sortChats = (data: (Chat | Wakzoo)[]) => {
  return [...data].sort((prev, next) => {
    const prevTime = new Date(prev.time);
    const nextTime = new Date(next.time);

    if (prevTime > nextTime) return 1;
    if (prevTime < nextTime) return -1;
    if (prev.id > next.id) return 1;
    if (prev.id < next.id) return -1;
    return 0;
  });
};
