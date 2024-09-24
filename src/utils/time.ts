import { Dayjs } from "dayjs";

export const returnTimes = (
  times: {
    start: string | Dayjs | null;
    end: string | Dayjs | null;
  },
  duration: string
) => {
  if (duration) {
    const now = new Date();
    let end = new Date();
    let durationCalculatuon = 0;

    if (duration.includes("M")) {
      durationCalculatuon = Number(duration.replace("M", ""));
    } else if (duration.includes("H")) {
      durationCalculatuon = Number(duration.replace("H", "")) * 60;
    }

    end = new Date(end.setMinutes(end.getMinutes() + durationCalculatuon));

    return {
      start: now,
      end,
    };
  } else if (times.start && !times.end) {
    let end = new Date(times.start as string);
    end = new Date(end.setMinutes(end.getMinutes() + 120));

    return {
      start: times.start,
      end,
    };
  } else if (times.start && times.end) {
    return times;
  }

  return {
    start: "",
    end: "",
  };
};
