export const returnTimes = (
    startTime: string,
    endTime: string,
    durationInMinutes: string
  ) => {
    let times = { start: startTime, end: endTime };
  
    if (startTime && endTime) {
      return times;
    } else if (durationInMinutes) {
      const now = new Date();
      const end = new Date();
      return {
        start: now.toString(),
        end: new Date(
          end.setMinutes(end.getMinutes() + Number(durationInMinutes))
        ).toString(),
      };
    }
  };
  