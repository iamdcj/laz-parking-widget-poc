import { Dayjs } from "dayjs";
import { returnTimes } from "./time";
import { LinkParams, Modes } from "../../types";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "pass",
  "FAP" = "fap",
  "FEP" = "fex",
  "FEX" = "fex",
}

export const constructBuyLink = (data: LinkParams) => {
  const { times, mode, ...params } = data;
  const { start = "", end = "" } = returnTimes(times, params.duration);

  const urlParams = new URLSearchParams({
    t: mode === "EVT" ? "e" : "r",
    wt: modeToWt[mode as Modes],
    isocode: "EN",
    ...returnParams({ ...params, start, end }),
  });

  return `https://go.lazparking.com/buynow?${urlParams}`;
};

interface UrlParams extends LinkParams {
  start: string | Dayjs | Date;
  end: string | Dayjs | Date;
}

export const transformDuration = (duration: string) => {
  const cleanDuration = duration?.replace(/[MH]/g, "");

  if (duration.includes("H")) {
    return (Number(cleanDuration) * 60).toString();
  } else {
    return cleanDuration;
  }
};

export const cleanObject = (object: Record<string, any>) =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => value));

export const returnParams = (
  data: UrlParams
): Record<string, any> => {
  let params = cleanObject(data);

  if (params.duration) {
    params = {
      ...params,
      duration: transformDuration(params.duration),
    };
  }

  if (params.start) {
    params = {
      ...params,
      start: params.start.toString(),
    };
  }

  if (params.end) {
    params = {
      ...params,
      end: params.end.toString(),
    };
  }

  return params;
};

export const getUrlParam = (): Record<string, string> => {
  let searchParams = new URLSearchParams(window.location.search);
  let urlParams = {};

  for (const [key, value] of searchParams.entries()) {
    urlParams = {
      ...urlParams,
      [key]: value,
    };
  }

  return urlParams;
};
