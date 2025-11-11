import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuBar from "./MenuBar";
import PerformancePage from "./PerformancePage";
import DataPage from "./DataPage";
import IdeasPage from "./IdeasPage";

const App: React.FC = () => (
  <div className="app-root">
    <MenuBar />
    <div className="page-content">
      <Routes>
        <Route path="/" element={<IdeasPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/performance" element={<PerformancePage />} />
      </Routes>
    </div>
  </div>
);

export default App;
