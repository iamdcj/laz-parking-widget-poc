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
    duration,
    selectedEvent,
    widgetKey,
    mode,
    startTime,
    endTime,
  }: {
    startTime?: string;
    endTime?: string;
    selectedLocation: string;
    duration?: string;
    selectedEvent?: string;
    widgetKey?: string;
    mode?: string;
  }) => {
    const { start, end } = returnTimes(startTime, endTime, duration);
  
    const params = new URLSearchParams({
      l: selectedLocation,
      t: selectedEvent ? "e" : "r",
      wt: modeToWt[mode as "PST" | "TMD" | "EVT" | "MUP" | "MPS" | "FAP" | "FEX"],
      evid: selectedEvent,
      isocode: "EN",
      wk: widgetKey,
      duration,
      start,
      end,
    });
  
    return `https://go.lazparking.com/buynow?${params}`;
  };
  