export interface AppDefaults {
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
  useFullWidget: boolean;
  dataModeOverwrite: boolean;
  dataMode: string[] | string;
  startTime: string;
  endTime: string;
  currentPage: string;
  eventDriven: boolean;
  salesChannelKey: string;
}

export interface Settings extends AppDefaults {
  isHeaderEnabled: boolean;
  headerText: string;
  styles?: string;
  template: string;
}

export const returnInitialConfig = (element: HTMLElement): Settings => ({
  isHeaderEnabled: !!element?.dataset?.header, // show header or not
  headerText: element?.dataset?.headerText || null, // title text
  widgetKey: element?.dataset?.wk || null, // query param
  clientId: element?.dataset?.clientid || null, // query param
  locationIds: element?.dataset?.locationid || null, // query param
  useMap: !!element?.dataset?.map, // show/hide map
  mapZoom: Number(element?.dataset?.mapzoom || 10), // default map zoom
  mapLat: Number(element?.dataset?.mapplacelat || 0), // default map lat
  mapLng: Number(element?.dataset?.mapplacelng || 0), // default map lng
  hideEventDateTime: !!element?.dataset?.hideEventDate, // hide event listing date-time
  dataModeOverwrite: !!element?.dataset?.modeOverwrite, // use dataMode
  dataMode: element?.dataset?.mode?.split("/") || null, // specify the mode
  salesChannelKey: element?.dataset?.sc || null, // pass as sc param to checkout
  agentId: element?.dataset?.agentid || null, // pass as aid param to checkout
  // ---- TODO: determine the use cases for the following: //
  startTime: element?.dataset?.starttime || null, // set the default start time of the widget (what is the format)
  endTime: element?.dataset?.endtime || null, // set the default end time of the widget (what is the format)
  arriveOffset: Number(element?.dataset?.arrive), // offset in minutes (need use case)
  departOffset: Number(element?.dataset?.depart), // offset in minutes (need use case)
  template: element?.dataset?.template || null, // load template and stub style sheet based on iso language code (need examples)
  useFullWidget: !!element?.dataset?.fullwidget, // set whether or not to open the full widget url in a new window or to change the current url (example)
  mapTxt: element?.dataset?.mapplacetxt || null, //! tbd
  currentPage: element?.dataset?.currentpage || null, // Get the widget key (not sure about this one)
  eventDriven: !!element?.dataset?.eventdriven, // need use case
});

export const returnModes = (locations: any[], selectedLocation: string) =>
  locations
    .find(({ ID }: { ID: any }) => ID === selectedLocation)
    .DefaultWidgetType.split("|");
