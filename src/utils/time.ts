import { Dayjs } from "dayjs";

const timeSettings = {
  dateFormatLib: "ddd, mmm d, yyyy",
  timeFormatLib: "h:MM TT",
  dateFormat: "D, M d, yy",
  timeFormat: "g:i A",
}

export const transformDuration = (duration: string) => {
  const cleanDuration = duration?.replace(/[MH]/g, "");

  if (duration?.includes("H")) {
    return Number(cleanDuration) * 60;
  } else {
    return Number(cleanDuration);
  }
};

export const returnTimeFromDuration = (duration: number, startDate?: Dayjs) => {
  let start = null;
  let end = null;

  if (startDate) {
    start = startDate;
    end = startDate.add(duration, "minutes");
  } else {
    start = new Date();
    end = new Date(start.setMinutes(start.getMinutes() + duration));
  }

  return {
    duration,
    times: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
  };
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
