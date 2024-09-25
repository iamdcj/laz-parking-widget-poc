import { Dayjs } from "dayjs";
import { returnTimes } from "./time";

type Modes = "PST" | "TMD" | "EVT" | "MUP" | "FAP" | "FEP" | "FEX";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "mup",
  "FAP" = "fap",
  "FEP" = "fex",
  "FEX" = "fex",
}

type DateTime = string | Dayjs | null;

interface Params {
  times?: {
    start: DateTime;
    end: DateTime;
  };
  duration?: string;
  widgetKey?: string;
  mode?: string;
  rate?: string;
  l?: string;
  evid?: string;
  wk?: string;
  aid?: string;
  sc?: string;
}

export const constructBuyLink = (data: Params) => {
  const { times, mode, ...params } = data;
  const { start = "", end = "" } = returnTimes(times, params.duration);

  const urlParams = new URLSearchParams({
    t: params.evid ? "e" : "r",
    wt: params.evid ? "evt" : modeToWt[mode as Modes],
    isocode: "EN",
    ...returnParams({ ...params, start, end }),
  });

  return `https://go.lazparking.com/buynow?${urlParams}`;
};

interface UrlParams extends Params {
  start: string | Dayjs | Date;
  end: string | Dayjs | Date;
}

const transformDuration = (duration: string) => {
  const cleanDuration = duration?.replace(/[MH]/g, "");

  if (duration.includes("H")) {
    return Number(cleanDuration) * 60;
  } else {
    return cleanDuration;
  }
};

const returnParams = (data: UrlParams): Record<string, any> => {
  let params = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value)
  );

  debugger;

  if (params.duration) {
    params = {
      ...params,
      duration: transformDuration(params.duration),
    };
  }

  if (params.start) {
    params = {
      ...params,
      start: params.start?.toString(),
    };
  }

  if (params.end) {
    params = {
      ...params,
      end: params.end?.toString(),
    };
  }

  return params;
};
