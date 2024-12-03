import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

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
