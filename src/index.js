import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import { StateProvider } from "./StateProvider.js";
import reportWebVitals from "./reportWebVitals.js";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
