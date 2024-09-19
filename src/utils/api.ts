enum Endpoints {
  locations = "locations",
  events = "events",
  time_increments = "locations/timeincrements",
}

export const fetchData = async (
  type: "locations" | "events" | "time_increments",
  params: Record<string, any>
) => {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`https://grs-external.lazparking.com/api/${Endpoints[type]}?${searchParams}`);

  if (!res.ok) {
    throw new Error("Unable to retrieve data");
  }

  return await res.json();
};
