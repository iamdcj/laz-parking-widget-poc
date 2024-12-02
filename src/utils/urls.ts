import { returnTimeFromDuration, transformDuration } from "./time";
import { Modes, ModesTable } from "../../types";

enum modeToWt {
  "PST" = "tmd",
  "TMD" = "tmd",
  "EVT" = "evt",
  "MUP" = "pass",
  "FAP" = "fap",
  "FEP" = "fex",
  "FEX" = "fex",
}

export const constructBuyLink = (data: any) => {
  const { mode, wk, l, aid, sc, ...state } = data;

  const urlParams = new URLSearchParams({
    t: mode === "EVT" ? "e" : "r",
    wt: modeToWt[mode as Modes],
    isocode: "EN",
    wk,
    l,
    ...(aid && { aid }),
    ...(sc && { sc }),
    ...returnParams(state, mode),
  });

  return `https://go.lazparking.com/buynow?${urlParams}`;
};

export const cleanObject = (object: Record<string, any>) =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => value));

export const returnParams = (data: any, mode: string): Record<string, any> => {
  let params = cleanObject(data);

  switch (mode) {
    case ModesTable.TMD:
      let start = null;
      let end = null;

      if (params.times.start) {
        start = params.times.start.toString();
      }

      if (params.times.end) {
        end = params.times.end.toString();
      }

      return {
        start,
        end,
      };
    case ModesTable.PST:
      if (!params?.duration) return;

      const { duration, times } = returnTimeFromDuration(
        transformDuration(params.duration)
      );

      return {
        duration,
        start: times.start,
        end: times.end,
      };
    case ModesTable.EVT:
      return {
        evid: params.selectedEvent,
      };
    case ModesTable.MUP:
    case ModesTable.FEP:
    case ModesTable.FEX:
      return {
        rid: params.pass?.Id,
      };
    case ModesTable.FAP: {
      if (!params.pass) {
        return params;
      }

      const { duration, times } = returnTimeFromDuration(
        params.pass.Duration,
        params.times.start
      );

      return {
        start: times.start,
        end: times.end,
        duration,
        rid: params.pass.Id,
        fst: params.pass.IsFixedStartTime,
      };
    }
    default:
      return params;
  }
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

export const openWindow = (url: string, currentPage: boolean) => {
  const width = 800;
  const height = 600;
  const left = screen.width / 2 - width / 2;
  const top = screen.height / 2 - height / 2;
  const features =
    currentPage === false
      ? `width=${width},
      height=${height},
      top=${top},
      left=${left},
      toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=no,
      modal=yes,
      alwaysRaised=yes`
      : "";

  window.open(url, "lazparking", features);
};
