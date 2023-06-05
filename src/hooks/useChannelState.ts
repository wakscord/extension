import { useCallback, useEffect, useState } from "react";
import { Channel } from "../states/channel";
import { fetchChannelState } from "../utils/network";

/**
 * API 서버에서 채널 상태 (뱅온 정보) 를 받아오는 훅입니다.
 * @param channelId Twitch 채널 ID 값
 */
export const useChannelState = (channelId: string | null) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [is404, setIs404] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(() => {
    if (!channelId) {
      return Promise.resolve();
    }

    setIsLoading(true);
    setError(null);

    return fetchChannelState(channelId)
      .then((channelState) => {
        setError(null);
        setChannel({
          twitchId: channelId,
          ...channelState,
        });
      })
      .catch((e: Error) => {
        console.error(e);
        setError(e);

        if (e.cause === 404) {
          setIs404(true);
        }
      })
      .finally(() => setIsLoading(false));
  }, [channelId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { channel, isLoading, error, is404, refresh: load };
};
