export interface ChatsResponse {
  chats: Chat[];
  wakzoo: any;
}

export interface Chat {
  id: number;
  content: string;
  time: string;
  emotes?: {
    [key: string]: string[];
  };
}

export interface Wakzoo {
  id: number;
  url: string;
  embeds: Embed[];
  time: string;
}

export interface Embed {
  url?: string;
  title?: string;
  color?: number;
  timestamp?: string;
  description?: string;
  image?: { url: string };
  author?: { name: string };
  footer?: { text: string };
  fields?: { name: string; value: string; inline: boolean }[];
}
