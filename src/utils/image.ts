import { streamers } from "../constants";
import { Chat, Wakzoo } from "../interfaces";

export const getImages = (data: (Chat | Wakzoo)[]) => {
  return new Set(
    data
      .map((item) => {
        const images = [];

        // 임베드라면 임베드 이미지들 푸시
        if (Array.isArray(item.data)) {
          (item as Wakzoo).data
            .map((embed) => embed.image?.url || "")
            .filter((item) => !!item)
            .forEach((url) => images.push(url));
        }

        // 이모트들 이미지 푸시
        else {
          Object.keys((item as Chat).data || {}).forEach((id) => {
            images.push(
              `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/3.0`
            );
          });
        }

        // 프로필 사진 이미지 푸시
        images.push(
          Object.keys(streamers).includes(item.author)
            ? `https://api.wakscord.xyz/avatar/${streamers[item.author].id}.png`
            : `https://api.wakscord.xyz/avatar/${item.author}`
        );

        return images;
      })
      .flat()
  );
};

export const prefetchImage = (url: string) => {
  const img = new Image();

  img.referrerPolicy = "no-referrer";
  img.src = url;
};
