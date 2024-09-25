/**
 * @jest-environment jsdom
 */

import { returnInitialConfig } from "./misc";

const baseProperties: any = {
  agentId: null,
  arriveOffset: null,
  clientId: null,
  currentPage: false,
  modes: null,
  modeOverwrite: false,
  departOffset: null,
  endTime: null,
  eventDriven: false,
  headerText: null,
  hideEventDateTime: false,
  isHeaderEnabled: false,
  mapLat: 0,
  mapLng: 0,
  mapTxt: null,
  mapZoom: 10,
  salesChannelKey: null,
  startTime: null,
  template: null,
  useFullWidget: false,
  useMap: false,
  widgetKey: null,
};

describe("returnInitialConfig", () => {
  it("Single Location, with Standard/Timed Rates", () => {
    document.body.innerHTML = `
    <div id="LAZ_Widget" class="parkingwidget" data-locationid="175076" data-arrive="0" data-depart="120" data-header="true" data-wk="43b31dcb07834b64b55fd8fc543762e2" style="height: 40%;"></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      locationIds: "175076",
      widgetKey: "43b31dcb07834b64b55fd8fc543762e2",
    });
  });

  it("Single Location, with Standard/Timed Rates", () => {
    document.body.innerHTML = `
    <div id="LAZ_Widget" class="parkingwidget" data-locationid="175076" data-arrive="0" data-depart="120" data-header="true" data-wk="43b31dcb07834b64b55fd8fc543762e2" style="height: 40%;"></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      locationIds: "175076",
      widgetKey: "43b31dcb07834b64b55fd8fc543762e2",
    });
  });

  it("Multiple Locations, with Standard/Timed Rates", () => {
    document.body.innerHTML = `
    <div
      id="LAZ_Widget"
      class="parkingwidget"
      data-locationid="1043,68741,68720,68702,167956,8744,149679,1214,269,3880,78833,146978"
      data-arrive="0"
      data-depart="120"
      data-header="true"
      data-wk="479d79c6c76f4d85b2e1b06e48fc09fd"
      style="height: 40%"
    ></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      locationIds:
        "1043,68741,68720,68702,167956,8744,149679,1214,269,3880,78833,146978",
      widgetKey: "479d79c6c76f4d85b2e1b06e48fc09fd",
    });
  });

  it("Single Location, with Fixed Access Passes", () => {
    document.body.innerHTML = `
   <div
      id="LAZ_Widget"
      class="parkingwidget"
      data-locationid="31668"
      data-arrive="0"
      data-depart="120"
      data-header="true"
      style="height: 40%; padding-top: 2px"
      data-currentpage="true"
      data-wk="43f0240938c64892b2efafd038297529"
    >
    </div> 
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      currentPage: true,
      isHeaderEnabled: true,
      locationIds: "31668",
      widgetKey: "43f0240938c64892b2efafd038297529",
    });
  });

  it("Single Location, with Fixed Expiry Permit", () => {
    document.body.innerHTML = `
      <div id="LAZ_Widget" 
        class="parkingwidget" 
        data-locationid="60994" 
        data-arrive="0" 
        data-depart="120" 
        data-header="true" 
        data-wk="55ed991b532645f3824ade8100f4f65a" 
        style="height: 40%;"
      >
      </div>
    `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      locationIds: "60994",
      widgetKey: "55ed991b532645f3824ade8100f4f65a",
    });
  });

  it("Single Location, with both Standard/Timed and Event Rates", () => {
    document.body.innerHTML = `
      <div
        id="LAZ_Widget"
        class="parkingwidget"
        data-locationid="173532"
        data-arrive="0"
        data-depart="120"
        data-header="true"
        data-wk="7a67991af9754471aac3956b6e44a51a"
        style="height: 40%; padding-top: 2px"
        data-currentpage="true"
      ></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      currentPage: true,
      isHeaderEnabled: true,
      locationIds: "173532",
      widgetKey: "7a67991af9754471aac3956b6e44a51a",
    });
  });

  it("Single Location, with Event Rates", () => {
    document.body.innerHTML = `
     <div
      id="LAZ_Widget"
      class="parkingwidget"
      data-locationid="173461"
      data-arrive="0"
      data-depart="120"
      data-header="true"
      data-wk="a4e6d05d8e9b45bcb4b8a068e0d72c0c"
      style="height: 40%; padding-top: 2px"
      data-currentpage="true"
      data-eventdriven="true"
    ></div>

  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      eventDriven: true,
      currentPage: true,
      locationIds: "173461",
      widgetKey: "a4e6d05d8e9b45bcb4b8a068e0d72c0c",
    });
  });

  it("Multiple Locations, with Event Rates", () => {
    document.body.innerHTML = `
    <div
      id="LAZ_Widget"
      class="parkingwidget"
      data-locationid="96529,96532,96533,96534,112137,112138,145583"
      data-arrive="0"
      data-depart="120"
      data-header="true"
      data-wk="cfa9fbe5239a41c1abff761dbe1008f0"
      style="height: 40%; padding-top: 2px"
      data-currentpage="true"
      data-eventdriven="true"
    ></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      eventDriven: true,
      currentPage: true,
      locationIds: "96529,96532,96533,96534,112137,112138,145583",
      widgetKey: "cfa9fbe5239a41c1abff761dbe1008f0",
    });
  });

  it("Overrides", () => {
    document.body.innerHTML = `
    <div id="LAZ_Widget" class="parkingwidget" data-locationid="53582" data-arrive="0" data-depart="120" data-header="true" data-wk="adfd1bb28c7544d3866eb2bbaa35bb91" style="height: 40%;" data-mode-overwrite="true" data-mode="PST/TMD/EVT/MUP/MPS/FAP/FEP/FEX" ></div>
  `;

    const _RootElement = document.getElementById("LAZ_Widget");
    const config = returnInitialConfig(_RootElement);

    expect(config).toEqual({
      ...baseProperties,
      arriveOffset: 0,
      departOffset: 120,
      isHeaderEnabled: true,
      locationIds: "53582",
      modes: ["PST", "TMD", "EVT", "MUP", "MPS", "FAP", "FEP", "FEX"],
      modeOverwrite: true,
      widgetKey: "adfd1bb28c7544d3866eb2bbaa35bb91",
    });
  });
});
