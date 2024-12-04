import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export type APITimezones =
  | "Eastern Standard Time"
  | "Mountain Standard Time"
  | "Central Standard Time"
  | "Pacific Standard Time"
  | "Alaska Standard Time"
  | "Hawaiian Standard Time";

export type TimeZoneCodes =
  "America/New_York"
  | "America/Denver"
  | "America/Chicago"
  | "America/Los_Angeles"
  | "America/Anchorage"
  | "Pacific/Honolulu";

export enum FormattedTimezones {
  "Eastern Standard Time" = "America/New_York",
  "Mountain Standard Time" = "America/Denver",
  "Central Standard Time" = "America/Chicago",
  "Pacific Standard Time" = "America/Los_Angeles",
  "Alaska Standard Time" = "America/Anchorage",
  "Hawaiian Standard Time" = "Pacific/Honolulu",
}

export enum TimezoneCodeToString {
  "America/New_York" = "Eastern Standard Time",
  "America/Denver" = "Mountain Standard Time",
  "America/Chicago" = "Central Standard Time",
  "America/Los_Angeles" = "Pacific Standard Time",
  "America/Anchorage" = "Alaska Standard Time",
  "Pacific/Honolulu" = "Hawaiian Standard Time",
}

export const returnDate = (date: any, timezone: string) => {
  return dayjs(date).tz(timezone);
};

export const transformDuration = (duration: string) => {
  let value = Number(duration?.replace(/[MHD]/gi, ""));
  let unit = duration.charAt(duration.length - 1);

  switch (unit.toUpperCase()) {
    case "M":
      value = value;
      break;
    case "H":
      value = value * 60;
      unit = "M";
      break;
    case "D":
      value = value * 24 * 60;
      unit = "M";
      break;
  }

  return value;
};

export const returnTimeFromDuration = (duration: number, startDate?: Dayjs) => {
  let start = null;
  let end = null;

  if (startDate) {
    start = startDate;
    end = startDate.add(duration, "minutes");
  } else {
    start = dayjs();
    end = start.add(duration, "minutes");
  }

  return {
    duration,
    times: {
      start: start,
      end: end,
    },
  };
};

export const retrieveTimeDiff = (appStartTime: Dayjs) => {
  const currentDate = appStartTime.toLocaleString();

  return dayjs().diff(currentDate, "minutes");
};

// } else if (times?.start && !times?.end) {
//   let end = new Date(times.start as string);
//   end = new Date(end.setMinutes(end.getMinutes() + 120));

//   return {
//     start: times.start,
//     end,
//   };
// } else if (times?.start && times?.end) {
//   return times;
// }

// return {
//   start: "",
//   end: "",
// };
