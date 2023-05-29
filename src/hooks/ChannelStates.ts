import { useCallback, useEffect, useState } from "react";
import { Channel, ChannelState } from "../states/channel";

function isValidChannelStateResponse(value: unknown): value is ChannelState {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "info" in value &&
    typeof value.info === "object" &&
    value.info !== null &&
    "date" in value.info &&
    typeof value.info.date === "string" &&
    "idx" in value.info &&
    typeof value.info.idx === "string" &&
    "status" in value.info &&
    typeof value.info.status === "string"
  );
}

/**
 * 채널 상태 (뱅온 정보) 등을 API 서버에서 받아오는 함수입니다.
 *
 * @param channelId Twitch 채널 ID 값
 */
async function fetchChannelState(channelId: string) {
  return fetch(`https://api.wakscord.xyz/extension/${channelId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("API 서버에서 채널 상태를 받아오지 못했습니다.");
      }

      return res.json();
    })
    .then((data) => {
      if (!isValidChannelStateResponse(data)) {
        throw new Error("API 서버에서 받아온 채널 상태가 올바르지 않습니다.");
      }

      return data;
    });
}

/**
 * API 서버에서 채널 상태 (뱅온 정보) 를 받아오는 훅입니다.
 * @param channelId Twitch 채널 ID 값
 */
export const useChannelState = (channelId: string | null) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<Error | null>(null);
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
      .catch((e: Error) => setError(e))
      .finally(() => setIsLoading(false));
  }, [channelId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { channel, isLoading, error, refresh: load };
};
