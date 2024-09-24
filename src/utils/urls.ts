import { Dayjs } from "dayjs";
import { returnTimes } from "./time";

type Modes = "PST" | "TMD" | "EVT" | "MUP" | "MPS" | "FAP" | "FEP";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "mup",
  "MPS" = "mps",
  "FAP" = "fap",
  "FEP" = "fex",
}

type DateTime = string | Dayjs | null;

export const constructBuyLink = ({
  selectedLocation,
  selectedEvent,
  widgetKey,
  mode,
  duration,
  times,
  agentId = "",
  salesChannelKey = "",
  rate = "",
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
  rate?: string;
}) => {
  console.log(rate);

  const cleanDuration = duration?.replace(/[MH]/g, "");
  const { start = "", end = "" } = returnTimes(times, duration);
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
    sc: salesChannelKey,
    aid: agentId,
    rid: rate,
  });

  return `https://go.lazparking.com/buynow?${params}`;
};
