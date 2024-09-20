import React from "react";
import ReactDOM from "react-dom/client";
import { returnInitialConfig } from "./utils/misc";
import App from "./App";
import './styles.css'

const _RootElement = document.getElementById("LAZ_Widget");

if (!_RootElement) {
  throw new Error("Unable to mount application");
}

const config = returnInitialConfig(_RootElement!);
const root = ReactDOM.createRoot(_RootElement!);

root.render(<App {...config} />);
