import dayjs, { Dayjs } from "dayjs";
import { returnTimes } from "./time";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "mup",
  "MPS" = "mps",
  "FAP" = "fap",
  "FEX" = "fex",
}

export const constructBuyLink = ({
  selectedLocation,
  selectedEvent,
  widgetKey,
  mode,
  duration,
  times
}: {
  times?: {
    start: string | Dayjs | null
    end: string | Dayjs | null
  }
  selectedLocation: string;
  duration?: string;
  selectedEvent?: string;
  widgetKey?: string;
  mode?: string;
}) => {
  debugger
  const { start = "", end = "" } = returnTimes(times, duration);

  const params = new URLSearchParams({
    l: selectedLocation,
    t: selectedEvent ? "e" : "r",
    wt: selectedEvent
      ? "evt"
      : modeToWt[mode as "PST" | "TMD" | "EVT" | "MUP" | "MPS" | "FAP" | "FEX"],
    evid: selectedEvent,
    isocode: "EN",
    wk: widgetKey,
    duration,
    start: start.toString(),
    end: end.toString(),
  });

  return `https://go.lazparking.com/buynow?${params}`;
};
