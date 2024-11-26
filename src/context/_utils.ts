import dayjs, { Dayjs } from "dayjs";

const setTime = (time: string, date: Dayjs) => {
  const [hours, minutes] = time.split(":");

  return date.set("hour", Number(hours)).set("minute", Number(minutes));
};

export const returnOverrideState = (state: any) => {
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
  }

  if (state.endTime) {
    end = setTime(state.endTime, end);
  }

  return {
    ...state,
    times: {
      start,
      end,
    },
  };
};
