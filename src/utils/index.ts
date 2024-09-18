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

export const returnInitialConfig = () => {
  const _RootElement = document.getElementById("LAZ_Widget");

  if (!_RootElement) {
    return;
  }

  const settings: Settings = {
    isHeaderEnabled: !!_RootElement.dataset.header, // show header or not
    headerText: _RootElement.dataset.headerText || "", // title text
    widgetKey: _RootElement.dataset.wk || "", // query param
    clientId: _RootElement.dataset.clientid || "", // query param
    locationIds: _RootElement.dataset.locationid || "", // query param
    useMap: !!_RootElement.dataset.map, // show/hide map
    mapZoom: Number(_RootElement.dataset.mapzoom || 10), // default map zoom
    mapLat: Number(_RootElement.dataset.mapplacelat || 0), // default map lat
    mapLng: Number(_RootElement.dataset.mapplacelng || 0), // default map lng
    hideEventDateTime: !!_RootElement.dataset.hideEventDate, // hide event listing date-time
    arriveOffset: Number(_RootElement.dataset.arrive), //! tbd
    departOffset: Number(_RootElement.dataset.depart), //! tbd
    agentId: _RootElement.dataset.agentid || "", //! tbd
    template: _RootElement.dataset.template || "", //! tbd
    useFullWidget: !!_RootElement.dataset.fullwidget, //! tbd
    dataModeOverwrite: _RootElement.dataset.modeOverwrite || "", //! tbd
    dataMode: _RootElement.dataset.mode || "", //! tbd
    mapTxt: _RootElement.dataset.mapplacetxt || "", //! tbd
    startTime: _RootElement.dataset.starttime || "", //! tbd
    endTime: _RootElement.dataset.endtime || "", //! tbd
    currentPage: _RootElement.dataset.currentpage || "", //! tbd
    eventDriven: !!_RootElement.dataset.eventdriven, //! tbd
    salesChannelKey: _RootElement.dataset.sc || "", //! tbd
  };

  return [_RootElement, settings];
};
