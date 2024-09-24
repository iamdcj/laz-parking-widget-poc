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
  dataModeOverwrite: boolean;
  dataMode: string;
  startTime: string;
  endTime: string;
  currentPage: string;
  eventDriven: boolean;
  salesChannelKey: string;
  styles?: string;
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
  dataModeOverwrite: !!element?.dataset?.modeOverwrite, // use dataMode 
  dataMode: element?.dataset?.mode || "", // specify the mode
  salesChannelKey: element?.dataset?.sc || "", // pass as sc param to checkout
  agentId: element?.dataset?.agentid || "", // pass as aid param to checkout 
  // ---- TODO: determine the use cases for the following: //
  startTime: element?.dataset?.starttime || "", // set the default start time of the widget (what is the format)
  endTime: element?.dataset?.endtime || "", // set the default end time of the widget (what is the format)
  arriveOffset: Number(element?.dataset?.arrive), // offset in minutes (need use case)
  departOffset: Number(element?.dataset?.depart), // offset in minutes (need use case)
  template: element?.dataset?.template || "", // load template and stub style sheet based on iso language code (need examples)
  useFullWidget: !!element?.dataset?.fullwidget, // set whether or not to open the full widget url in a new window or to change the current url (example) 
  mapTxt: element?.dataset?.mapplacetxt || "", //! tbd
  currentPage: element?.dataset?.currentpage || "", // Get the widget key (not sure about this one)
  eventDriven: !!element?.dataset?.eventdriven, // need use case
});

export const returnModes = (locations: any[], selectedLocation: string) =>
  locations
    .find(({ ID }: { ID: any }) => ID === selectedLocation)
    .DefaultWidgetType.split("|");
