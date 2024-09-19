import { Dayjs } from "dayjs";

export const returnTimes = (
  times: {
    start: string | Dayjs | null
    end: string | Dayjs | null
  },
  durationInMinutes: string
) => {
  if (durationInMinutes) {
    const now = new Date();
    const end = new Date();

    return {
      start: now.toString(),
      end: new Date(
        end.setMinutes(end.getMinutes() + Number(durationInMinutes))
      ).toString(),
    };
  }

  return times;
};
