import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const _RootElement = document.getElementById("LAZ_Widget");

const returnProps = () => {
  if (!_RootElement) {
    return;
  }

  return {
    locationId: _RootElement.dataset.locationid,
    arrive: _RootElement.dataset.arrive,
    depart: _RootElement.dataset.depart,
    header: _RootElement.dataset.header,
    widgetKey: _RootElement.dataset.wk,
    currentPage: _RootElement.dataset.currentpage,
    eventDriven: _RootElement.dataset.eventdriven,
    variant: _RootElement.dataset.variant || "basic",
    title: _RootElement.dataset.title || "Reserve Parking Now",
    width: _RootElement.dataset.width,
  };
};

returnProps();

const root = ReactDOM.createRoot(document.getElementById("LAZ_Widget"));

root.render(<App {...returnProps()} />);
