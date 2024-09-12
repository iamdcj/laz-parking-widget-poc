import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const _RootElement = document.getElementById("LAZ_Widget");

const returnProps = () => {
  if (!_RootElement) {
  }

  return {
    locationId: _RootElement.dataset.locationid,
    arrive: _RootElement.dataset.arrive,
    depart: _RootElement.dataset.depart,
    header: _RootElement.dataset.header,
    widgetKey: _RootElement.dataset.wk,
    currentPage: _RootElement.dataset.currentpage,
    eventDriven: _RootElement.dataset.eventdriven,
    variant: _RootElement.dataset.variant,
    title: _RootElement.dataset.title,
    width: _RootElement.dataset.width,
  };
};

returnProps();

// style="height: 40%; padding-top: 2px;"
const root = ReactDOM.createRoot(document.getElementById("LAZ_Widget"));

root.render(<App {...returnProps()} />);

// root.render(
//   <React.StrictMode>
//     <App {...returnProps()} />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
