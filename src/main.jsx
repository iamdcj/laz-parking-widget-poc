import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const _RootElement = document.getElementById("LAZ_Widget");

const returnProps = () => {
  if (!_RootElement) {
    return
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
