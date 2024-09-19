export const returnTimes = (
  startTime: string = "",
  endTime: string = "",
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

  return { start: startTime, end: endTime };
};
