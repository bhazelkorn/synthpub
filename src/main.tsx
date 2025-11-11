import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import { LicenseManager } from "ag-grid-enterprise";
import { AllEnterpriseModule, ModuleRegistry } from "ag-grid-enterprise";

LicenseManager.setLicenseKey("");
ModuleRegistry.registerModules([AllEnterpriseModule]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
