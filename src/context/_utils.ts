import dayjs, { Dayjs } from "dayjs";

const setTime = (time: string, date: Dayjs) => {
  const [hours, minutes] = time.split(":");

  return date.set("hour", Number(hours)).set("minute", Number(minutes));
};

export const returnOverrideState = (state: any) => {
  const now = dayjs();
  let start = dayjs();
  let end = dayjs();

  if (state.arriveOffset) {
    start = dayjs().add(state.arriveOffset, "minutes");
  }

  if (state.departOffset) {
    end = dayjs().add(state.departOffset, "minutes");
  }

  if (state.startTime) {
    start = setTime(state.startTime, start);
    start = start.isBefore(now) ? now.add(state.arriveOffset, "minutes") : start;
  }

  if (state.endTime) {
    end = setTime(state.endTime, end);
    end = end.isBefore(start) ? start.add(state.departOffset, "minutes") : end;
  }

  return {
    ...state,
    times: {
      start,
      end,
    },
  };
};
