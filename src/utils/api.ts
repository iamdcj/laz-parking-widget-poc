enum Endpoints {
  locations = "https://grs-external.lazparking.com/api/locations",
  events = "https://grs-external.lazparking.com/api/events",
  time_increments = "https://grs-external.lazparking.com/api/locations/timeincrements",
}

export const fetchData = async (
  type: "locations" | "events" | "time_increments",
  params: Record<string, any>
) => {
  const searchParams = new URLSearchParams(params);

  const res = await fetch(`${Endpoints[type]}?${searchParams}`);

  if (!res.ok) {
    throw new Error("Unable to retrieve data");
  }

  return await res.json();
};
