export interface Chat {
  id: number;
  author: string;
  content: string;
  data?: {
    [key: string]: string[];
  };
  time: string;
}

export interface Wakzoo {
  id: number;
  author: string;
  content: string;
  data: Embed[];
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
