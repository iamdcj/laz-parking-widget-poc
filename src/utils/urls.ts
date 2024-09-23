import { Dayjs } from "dayjs";
import { returnTimes } from "./time";

type Modes = "PST" | "TMD" | "EVT" | "MUP" | "MPS" | "FAP" | "FEX";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "mup",
  "MPS" = "mps",
  "FAP" = "fap",
  "FEX" = "fex",
}

type DateTime = string | Dayjs | null;

export const constructBuyLink = ({
  selectedLocation,
  selectedEvent,
  widgetKey,
  mode,
  duration,
  times,
  agentId,
  salesChannelKey
}: {
  times?: {
    start: DateTime;
    end: DateTime;
  };
  selectedLocation: string;
  duration?: string;
  selectedEvent?: string;
  widgetKey?: string;
  mode?: string;
  salesChannelKey?: string;
  agentId?: string;
}) => {
  const cleanDuration = duration?.replace("M", "");
  const { start = "", end = "" } = returnTimes(times, cleanDuration);
  const params = new URLSearchParams({
    l: selectedLocation,
    t: selectedEvent ? "e" : "r",
    wt: selectedEvent ? "evt" : modeToWt[mode as Modes],
    evid: selectedEvent,
    isocode: "EN",
    wk: widgetKey,
    duration: cleanDuration || "",
    start: start?.toString() || "",
    end: end?.toString() || "",
    sc: salesChannelKey || "",
    aid: agentId || "",
  });

  return `https://go.lazparking.com/buynow?${params}`;
};
