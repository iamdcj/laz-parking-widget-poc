import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { returnInitialConfig } from "./utils";


const [element, settings] = returnInitialConfig()

const root = ReactDOM.createRoot(element);

root.render(<App {...settings} />);
