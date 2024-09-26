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
  modes: null | string[];
  hideEventDateTime: boolean;
  arriveOffset: number;
  departOffset: number;
  agentId: string;
  useFullWidget: boolean;
  modeOverwrite: boolean;
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

  return {
    isHeaderEnabled: !!element?.dataset?.header,
    headerText: element?.dataset?.headerText || null,
    widgetKey: params.wk ? params.wk : element?.dataset?.wk,
    clientId: element?.dataset?.clientid || null,
    locationIds: params.l ? params.l : element?.dataset?.locationid,
    useMap: !!element?.dataset?.map,
    mapZoom: Number(element?.dataset?.mapzoom || 10),
    mapLat: Number(element?.dataset?.mapplacelat || 0),
    mapLng: Number(element?.dataset?.mapplacelng || 0),
    evid: params.evid || null,
    hideEventDateTime:
      params.hed === "true" ? true : !!element?.dataset?.hideEventDate,
    modeOverwrite: !!element?.dataset?.modeOverwrite,
    modes: params.wt
      ? params.wt.split("/")
      : element?.dataset?.mode?.split("/"),
    salesChannelKey: params.sc ? params.sc : element?.dataset?.sc,
    agentId: params.aid ? params.aid : element?.dataset?.agentid,
    eventDriven: !!element?.dataset?.eventdriven,
    language: params.isocode === "FR" ? "FR" : "EN",
    // ---- TODO: determine the use cases for the following: //
    startTime: params.start ? params.start : element?.dataset?.starttime, // set the default start time of the widget (what is the format)
    endTime: params.end ? params.end : element?.dataset?.endtime, // set the default end time of the widget (what is the format)
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
