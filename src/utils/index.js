export const returnInitialConfig = () => {
  const _RootElement = document.getElementById("LAZ_Widget");

  if (!_RootElement) {
    return;
  }

  const settings = {
    locationIds: _RootElement.dataset.locationid,
    arriveOffset: _RootElement.dataset.arrive,
    departOffset: _RootElement.dataset.depart,
    clientId: _RootElement.dataset.clientid,
    agentId: _RootElement.dataset.agentid,
    template: _RootElement.dataset.template,
    isHeaderEnabled: _RootElement.dataset.header,
    headerText: _RootElement.dataset.headerText,
    useFullWidget: _RootElement.dataset.fullwidget,
    hideEventDateTime: _RootElement.dataset.hideEventDate,
    dataModeOverwrite: _RootElement.dataset.modeOverwrite,
    dataMode: _RootElement.dataset.mode,
    widgetKey: _RootElement.dataset.wk,
    useMap: _RootElement.dataset.map,
    mapZoom: _RootElement.dataset.mapzoom,
    mapLat: _RootElement.dataset.mapplacelat,
    mapLng: _RootElement.dataset.mapplacelng,
    mapTxt: _RootElement.dataset.mapplacetxt,
    startTime: _RootElement.dataset.starttime,
    endTime: _RootElement.dataset.endtime,
    currentPage: _RootElement.dataset.currentpage,
    eventDriven: _RootElement.dataset.eventdriven,
    salesChannelKey: _RootElement.dataset.sc
  };

  return [_RootElement, settings];
};
