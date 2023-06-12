import { ChannelState } from "../states/channel";

export const isValidChannelStateResponse = (
  value: unknown
): value is ChannelState => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "name" in value &&
    typeof value.name === "string" &&
    "info" in value &&
    (typeof value.info === "object" || value.info === null) &&
    (value.info === null ||
      ("date" in value.info &&
        typeof value.info.date === "string" &&
        "idx" in value.info &&
        typeof value.info.idx === "string" &&
        "status" in value.info &&
        typeof value.info.status === "string"))
  );
};
