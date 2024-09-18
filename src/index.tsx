import React from "react";
import ReactDOM from "react-dom/client";
import { returnInitialConfig } from "./utils";
import App from "./App";

try {
  const _RootElement = document.getElementById("LAZ_Widget");
  console.log(_RootElement);
  
debugger
  if (!_RootElement) {
    throw new Error("Unable to mount applicatioj");
  }
  const config = returnInitialConfig(_RootElement!);
  const root = ReactDOM.createRoot(_RootElement!);

  root.render(<App {...config} />);
} catch (error) {
  console.error(error.message);
}
