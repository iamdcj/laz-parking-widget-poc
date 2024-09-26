import { getUrlParam } from "./urls";

export interface AppDefaults {
  widgetKey: string;
  clientId: string;
  locationIds: string;
  useMap: boolean;
  mapZoom: number;
  mapLat: number;
  mapLng: number;
  mapTxt: string;
  modesOverride: null | string[];
  hideEventDateTime: boolean;
  arriveOffset: number;
  departOffset: number;
  agentId: string;
  useFullWidget: boolean;
  startTime: string;
  endTime: string;
  currentPage: boolean;
  eventDriven: boolean;
  salesChannelKey: string;
  evid: string;
}

export interface Settings extends AppDefaults {
  isHeaderEnabled: boolean;
  headerText: string;
  language: "EN" | "FR";
}

export const returnInitialConfig = (element: HTMLElement): Settings => {
  const params = getUrlParam();
  const modeOverwrite = !!element?.dataset?.modeOverwrite;
  const modes = modeOverwrite ? element?.dataset?.mode : params.wt;

  return {
    modesOverride: modes?.split("/"),
    widgetKey: params.wk || element?.dataset?.wk,
    locationIds: params.l || element?.dataset?.locationid,
    salesChannelKey: params.sc || element?.dataset?.sc,
    agentId: params.aid || element?.dataset?.agentid,
    hideEventDateTime: !!params.hed || !!element?.dataset?.hideEventDate,
    language: (params.isocode as "FR" | "EN") || "EN",
    evid: params.evid || null,
    isHeaderEnabled: !!element?.dataset?.header,
    headerText: element?.dataset?.headerText || null,
    clientId: element?.dataset?.clientid || null,
    useMap: !!element?.dataset?.map,
    mapZoom: Number(element?.dataset?.mapzoom || 10),
    mapLat: Number(element?.dataset?.mapplacelat || 0),
    mapLng: Number(element?.dataset?.mapplacelng || 0),
    eventDriven: !!element?.dataset?.eventdriven,
    // ---- TODO: determine the use cases for the following: //
    startTime: params.start || element?.dataset?.starttime, // set the default start time of the widget (what is the format)
    endTime: params.end || element?.dataset?.endtime, // set the default end time of the widget (what is the format)
    arriveOffset: element?.dataset?.arrive
      ? Number(element.dataset.arrive)
      : null, // offset in minutes (need use case)
    departOffset: element?.dataset?.depart
      ? Number(element.dataset.depart)
      : null, // offset in minutes (need use case)
    useFullWidget: !!element?.dataset?.fullwidget, // set whether or not to open the full widget url in a new window or to change the current url (example)
    mapTxt: element?.dataset?.mapplacetxt || null, //! tbd
    currentPage: !!element?.dataset?.currentpage, // Get the widget key (not sure about this one)
    // template: element?.dataset?.template || null, // load template and stub style sheet based on iso language code (need examples)
  };
};

export const returnModes = (locations: any[], selectedLocation: string) =>
  locations
    .find(({ ID }: { ID: any }) => ID === selectedLocation)
    .DefaultWidgetType.split("|");
