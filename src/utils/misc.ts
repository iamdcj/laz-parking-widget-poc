import { Settings } from "../../types";
import { defaultLanguageLabels } from "./language";
import { getUrlParam } from "./urls";

export const returnInitialConfig = (element: HTMLElement): Settings => {
  const params = getUrlParam();
  const modeOverwrite = !!element.dataset.modeOverwrite;
  const modes = modeOverwrite ? element.dataset.mode : params.wt;
  const isMap = element.dataset.variant === "map";
  const eventDriven = params.wt === "evt" || element.dataset.eventdriven === "true"
  const isHeaderEnabled = isMap
    ? false
    : element.dataset.header
    ? element.dataset.header === "true"
    : true;

  return {
    buttonText: element.dataset.buttonText
      ? element.dataset.buttonText
      : "Get Rates",
    theme: element.dataset.theme ? JSON.parse(element.dataset.theme) : null,
    variant: isMap ? "map" : "basic",
    apiKey: element.dataset.key || null,
    modesOverride: modes ? modes?.split("/") : null,
    useMap: element.dataset.map ? element.dataset.map === "true" : false,
    isHeaderEnabled,
    widgetKey: params.wk || element.dataset.wk,
    locationIds: params.l || element.dataset.locationid,
    salesChannelKey: params.sc || element.dataset.sc || null,
    agentId: params.aid || element.dataset.agentid || null,
    hideEventDateTime:
      element.dataset.hideEventDate === "true" || params.hed === "true",
    language: (params.isocode as "FR" | "EN") || "EN",
    evid: params.evid || null,
    headerText: element.dataset.headerText || null,
    clientId: element.dataset.clientid || null,
    mapZoom: element.dataset.mapzoom ? Number(element.dataset.mapzoom) : 12,
    mapLocationLat: element.dataset.mapplacelat
      ? Number(element.dataset.mapplacelat)
      : 0,
    mapLocationLng: element.dataset.mapplacelng
      ? Number(element.dataset.mapplacelng)
      : 0,
    mapLocationText: element.dataset.mapplacetxt || null,
    eventDriven,
    // ---- TODO: determine the use cases for the following: //
    startTime: params.start || element.dataset.starttime || null, // set the default start time of the widget (what is the format)
    endTime: params.end || element.dataset.endtime || null, // set the default end time of the widget (what is the format)
    arriveOffset: element.dataset.arrive
      ? Number(element.dataset.arrive)
      : null, // offset in minutes (need use case)
    departOffset: element.dataset.depart
      ? Number(element.dataset.depart)
      : null, // offset in minutes (need use case)
    useFullWidget: element.dataset.fullwidget
      ? element.dataset.fullwidget === "true"
      : false, // set whether or not to open the full widget url in a new window or to change the current url (example)
    currentPage: !!element.dataset.currentpage, // Get the widget key (not sure about this one)
    // template: element.dataset.template || null, // load template and stub style sheet based on iso language code (need examples)
    labels: defaultLanguageLabels,
    selectedMode: eventDriven ? 'EVT' : null
  };
};

export const returnModes = (locations: any[], selectedLocation: string) => {
  console.log(locations);
  
  if (!selectedLocation) {
    return null;
  }

  const location = locations.find(
    ({ id }: { id: any; modes: string }) => id === selectedLocation
  );

  if (!location) {
    return null;
  }

  const modes = location?.modes?.split("|");

  return modes;
};
