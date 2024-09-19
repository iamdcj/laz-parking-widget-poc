export interface Settings {
  isHeaderEnabled: boolean;
  headerText: string;
  widgetKey: string;
  clientId: string;
  locationIds: string;
  useMap: boolean;
  mapZoom: number;
  mapLat: number;
  mapLng: number;
  mapTxt: string;
  hideEventDateTime: boolean;
  arriveOffset: number;
  departOffset: number;
  agentId: string;
  template: string;
  useFullWidget: boolean;
  dataModeOverwrite: string;
  dataMode: string;
  startTime: string;
  endTime: string;
  currentPage: string;
  eventDriven: boolean;
  salesChannelKey: string;
}

export const returnInitialConfig = (element: HTMLElement): Settings => ({
  isHeaderEnabled: !!element?.dataset?.header, // show header or not
  headerText: element?.dataset?.headerText || "", // title text
  widgetKey: element?.dataset?.wk || "", // query param
  clientId: element?.dataset?.clientid || "", // query param
  locationIds: element?.dataset?.locationid || "", // query param
  useMap: !!element?.dataset?.map, // show/hide map
  mapZoom: Number(element?.dataset?.mapzoom || 10), // default map zoom
  mapLat: Number(element?.dataset?.mapplacelat || 0), // default map lat
  mapLng: Number(element?.dataset?.mapplacelng || 0), // default map lng
  hideEventDateTime: !!element?.dataset?.hideEventDate, // hide event listing date-time
  // ---- TODO: determine the use cases for the following: //
  arriveOffset: Number(element?.dataset?.arrive), //! tbd
  departOffset: Number(element?.dataset?.depart), //! tbd
  agentId: element?.dataset?.agentid || "", //! tbd
  template: element?.dataset?.template || "", //! tbd
  useFullWidget: !!element?.dataset?.fullwidget, //! tbd
  dataModeOverwrite: element?.dataset?.modeOverwrite || "", //! tbd
  dataMode: element?.dataset?.mode || "", //! tbd
  mapTxt: element?.dataset?.mapplacetxt || "", //! tbd
  startTime: element?.dataset?.starttime || "", //! tbd
  endTime: element?.dataset?.endtime || "", //! tbd
  currentPage: element?.dataset?.currentpage || "", //! tbd
  eventDriven: !!element?.dataset?.eventdriven, //! tbd
  salesChannelKey: element?.dataset?.sc || "", //! tbd
});

enum Endpoints {
  locations = "https://grs-external.lazparking.com/api/locations",
  events = "https://grs-external.lazparking.com/api/events",
}

export const fetchData = async (
  type: "locations" | "events",
  params: Record<string, any>
) => {
  const searchParams = new URLSearchParams(params);

  const res = await fetch(`${Endpoints[type]}?${searchParams}`);

  if (!res.ok) {
    throw new Error("Unable to retrieve data");
  }

  return await res.json();
};

export const constructBuyLink = ({
  selectedLocation,
  selectedEvent,
  widgetKey,
}: {
  selectedLocation: string;
  selectedEvent: string;
  widgetKey: string;
}) => {
  return `https://go.lazparking.com/buynow?l=${selectedLocation}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=${widgetKey}`;
};


export const returnModes = (locations: any[], selectedLocation: string) =>
  locations
    .find(({ ID }: { ID: any }) => ID === selectedLocation)
    .DefaultWidgetType.split("|");
