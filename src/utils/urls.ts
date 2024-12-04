import { returnTimeFromDuration, transformDuration } from "./time";
import { Modes, ModesTable } from "../../types";
import dayjs from "dayjs";

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
    isocode: "EN",
    l: l.id,
    ...(wk && { wk }),
    ...(aid && { aid }),
    ...(sc && { sc }),
    ...returnParams({ ...state, location: l }, mode),
  });

  return `https://go.lazparking.com/buynow?${urlParams}`;
};

export const cleanObject = (object: Record<string, any>) =>
  Object.fromEntries(Object.entries(object).filter(([_, value]) => value));

export const returnParams = (data: any, mode: string): Record<string, any> => {
  const defautStartDate = data.location?.currentDate;
  let params = data;

  switch (mode) {
    case ModesTable.TMD:
      const initialDateWithOffset = defautStartDate?.add(
        data.timeDiff,
        "minutes"
      );

      let start = null;
      let end = null;

      if (data.times.start) {
        start = data.times.start;
      }

      if (data.times.end) {
        end = data.times.end;
      }

      if (initialDateWithOffset > start) {
        start = initialDateWithOffset;
      }

      params = {
        start: start.utc(),
        end: end.utc(),
      };
      break;
    case ModesTable.PST:
      if (data?.duration) {
        const { duration, times } = returnTimeFromDuration(
          transformDuration(data.duration)
        );

        params = {
          duration,
          start: times.start.add(data.timeDiff, "minutes").utc(),
          end: times.end.add(data.timeDiff, "minutes").utc(),
        };
      }
      break;
    case ModesTable.EVT:
      params = {
        evid: data.selectedEvent,
      };
      break;
    case ModesTable.MUP:
      {
        let start = dayjs(
          `${dayjs(defautStartDate).format("YYYY/MM/DD")} ${
            data.pass.StartTime
          }`
        );

        if (defautStartDate > start) {
          start = defautStartDate;
        }

        params = {
          rid: data.pass.RateId,
          start: start.utc(),
          end: start.add(data.pass.Duration, "minutes").utc(),
        };
      }
      break;
    case ModesTable.FEX:
    case ModesTable.FEP:
      params = {
        rid: data.pass,
      };
      break;
    case ModesTable.FAP: {
      if (data.pass) {
        const { duration, times } = returnTimeFromDuration(
          data.pass.Duration,
          data.times.start
        );

        data = {
          start: times.start.add(data.timeDiff, "minutes"),
          end: times.end.add(data.timeDiff, "minutes"),
          duration,
          rid: data.pass.Id,
          fst: data.pass.IsFixedStartTime,
        };
      }
      break;
    }
  }

  return cleanObject(params);
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
