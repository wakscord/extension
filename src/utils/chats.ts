import { Chat, Wakzoo } from "../interfaces";

export const sortChats = (prev: (Chat | Wakzoo)[], next: (Chat | Wakzoo)[]) => {
  return [
    ...next.filter(
      (chat: Chat | Wakzoo) => !prev.find((prevChat) => prevChat.id === chat.id)
    ),
    ...prev,
  ].sort((a: Chat | Wakzoo, b: Chat | Wakzoo) =>
    new Date(a.time) > new Date(b.time)
      ? 1
      : new Date(a.time) < new Date(b.time)
      ? -1
      : 0
  );
};
