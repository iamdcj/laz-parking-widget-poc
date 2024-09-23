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
    const end = new Date();
    let durationCalculatuon = 0;

    if (duration.includes("M")) {
      durationCalculatuon = Number(duration.replace("M", ""));
    } else if (duration.includes("H")) {
      durationCalculatuon = Number(duration.replace("H", "")) * 60;
    }

    return {
      start: now,
      end: new Date(end.setMinutes(end.getMinutes() + durationCalculatuon)),
    };
  } else if (times) {
    return times;
  }

  return {
    start: "",
    end: "",
  };
};
