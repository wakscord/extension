import { useEffect, useState } from "react";

/**
 * Twitch 확장 프로그램에서 채널 ID를 가져오거나 개발 환경에서는 기본 개발 채널 ID를 가져와 반환하는 훅입니다.
 * @returns 채널 ID
 */
export const useChannelId = () => {
  const [channelId, setChannelId] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.PROD) {
      Twitch.ext.onAuthorized(({ channelId }) => {
        setChannelId(channelId);
      });

      return;
    }

    // 개발 환경인 경우 기본 개발 채널 ID를 사용합니다.
    setChannelId(
      (import.meta.env.VITE_CHANNEL_ID as string | undefined) ?? "195641865"
    );
  }, []);

  return channelId;
};
