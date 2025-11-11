import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-enterprise";
import { themeBalham } from 'ag-grid-community';
import axios from 'axios';
import { currencyFormatter } from "./utils/grid/formatters";
import "./PerformancePage.css";

const balTheme = themeBalham.withParams({ columnBorder: { style: "solid", color: "lightgrey" }, headerFontSize: "11px" });

const mainLayout: Layout[] = [
  { i: "a", x: 0, y: 0, w: 8, h: 8, minW: 2, minH: 2 },
  { i: "b", x: 0, y: 8, w: 8, h: 4, minW: 2, minH: 2 }
];

const COLS = 8;
const ROWS = 12;
const nestedPanelsCount = 5;

const agGridColumns = [
  { headerName: "Make", field: "make" },
  { headerName: "Model", field: "model" },
  { headerName: "Price", field: "price" }
];

const agGridRowsB = [
  { make: "Honda", model: "Accord", price: 28000 },
  { make: "Chevrolet", model: "Impala", price: 26000 },
  { make: "BMW", model: "X5", price: 58000 }
];

const menuBarHeight = 34;
const toolbarHeight = 46;

function getWeekToDate() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as start
  const monday = new Date(today.setDate(diff));
  return {
    start: monday.toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  };
}

function getMonthToDate() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstDay.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  };
}

function getInceptionDate() {
  const inceptionDate = new Date(2025, 3, 7);
  return inceptionDate;
}

function getYearToDate() {
  const today = new Date();
  const inceptionDate = getInceptionDate();
  var firstDay = new Date(today.getFullYear(), 0, 1);
  firstDay = firstDay < inceptionDate ? inceptionDate : firstDay;
  return {
    start: firstDay.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  };
}

function getInceptionToDate() {
  const today = new Date();
  const firstDay = getInceptionDate();
  return {
    start: firstDay.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10)
  };
}

const PerformancePage: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>(mainLayout);
  const [width, setWidth] = useState(window.innerWidth);
  const [dateStart, setDateStart] = useState(getWeekToDate().start);
  const [dateEnd, setDateEnd] = useState(getWeekToDate().end);

  // track which range button is selected for styling
const [selectedRange, setSelectedRange] = useState<"WTD" | "MTD" | "YTD" | "ITD">("WTD");

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate available height for grid container
  // 100vh - menuBarHeight - toolbarHeight - 10px (for 5px margin top and bottom)
  const gridContainerHeight = `calc(100vh - ${menuBarHeight}px - ${toolbarHeight}px - 10px)`;
  const rowHeight = Math.floor((window.innerHeight - menuBarHeight - toolbarHeight - 10) / ROWS);

  // Height for the top panel (dashboard panel "a")
  const topPanelHeight = rowHeight * 8;
  const nestedPanelHeightPx = topPanelHeight / 2;
  const scrollbarSpacing = 5;

  const nestedPanels = Array.from({ length: nestedPanelsCount }, (_, idx) => (
    <div
      key={`p${idx + 1}`}
      className="nested-panel"
      style={{
        height: `${nestedPanelHeightPx}px`,
        minHeight: 0,
        marginBottom: idx === nestedPanelsCount - 1 ? 0 : "5px",
        width: `calc(100% - ${scrollbarSpacing}px)`
      }}
    >
      Panel {idx + 1}
    </div>
  ));

  // Date range button handlers — update selectedRange so styling follows user action
  const handleWeekToDate = () => {
    const { start, end } = getWeekToDate();
    setDateStart(start);
    setDateEnd(end);
    setSelectedRange("WTD");
  };
  const handleMonthToDate = () => {
    const { start, end } = getMonthToDate();
    setDateStart(start);
    setDateEnd(end);
    setSelectedRange("MTD");
  };
  const handleYearToDate = () => {
    const { start, end } = getYearToDate();
    setDateStart(start);
    setDateEnd(end);
    setSelectedRange("YTD");
  };

  const handleInceptionToDate = () => {
    const { start, end } = getInceptionToDate();
    setDateStart(start);
    setDateEnd(end);
    setSelectedRange("ITD");
  };

  const baseUrl = "https://localhost:44336/Api/Performance/GetDailyPnLByDirection";

  const [rowData, setRowData] = useState<any>(null);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "symbol",
      headerName: "Ticker",
      cellClass: "text-cell",
      pinned: "left",
      suppressHeaderMenuButton: false,
      suppressMovable: true,
      filter: "agTextColumnFilter"
    },
    {
      field: "ownerUserName",
      headerName: "Account",
      cellClass: "text-cell",
      pinned: "left",
      suppressHeaderMenuButton: false,
      filter: "agTextColumnFilter"
    },
    {
      field: "direction",
      headerName: "Side",
      cellClass: "text-cell",
      pinned: "left",
      suppressHeaderMenuButton: false,
      filter: "agTextColumnFilter"
    },
    {
      field: "totalPnl",
      headerName: "Total",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "tradingPnl",
      headerName: "Other",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "alpha",
      headerName: "Alpha",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "industry",
      headerName: "Industry",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "style",
      headerName: "Style",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "market",
      headerName: "Market",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "exMarket",
      headerName: "Ex-Market",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "alphaIndustry",
      headerName: "A + I",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "positionPnl",
      headerName: "Position P&L",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    {
      field: "sector",
      headerName: "Sector",
      cellClass: "text-cell",
      width: 360,
      suppressHeaderMenuButton: false,
      filter: "agTextColumnFilter"
    },
    { field: "ind_aerodef", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_airlines", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_alumstel", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_apparel", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_auto", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_banks", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_bevtob", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_biolife", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_bldgprod", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_chem", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_cnsteng", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_cnstmach", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_cnstmatl", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_commeqp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_compelec", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_comsvcs", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_conglom", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_containr", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_distrib", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_divfin", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_eleceqp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_elecutil", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_foodprod", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_foodret", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_gasutil", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_hltheqp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_hlthsvcs", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_homebldg", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_housedur", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_indmach", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_insurnce", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_internet", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_leisprod", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_leissvcs", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_lifeins", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_media", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_mgdhlth", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_multutil", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_netret", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_oilgscon", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_oilgsdrl", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_oilgseqp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_oilgsexp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_paper", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_pharma", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_precmtls", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_psnlprod", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_realest", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_restaur", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_roadrail", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_semicond", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_semieqp", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_software", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_spltyret", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_sptychem", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_sptystor", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_telecom", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_tradeco", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_transprt", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "ind_wireless", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "mkt_country", valueFormatter: currencyFormatter({ precision: 0 }) },
    {
      headerName: "Mkt_beta",
      field: "sty_beta",
      valueFormatter: currencyFormatter({ precision: 0 })
    },
    { field: "sty_1drevrsl", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_divyild", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_dwnrisk", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_earnqlty", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_earnyild", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_growth", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_indmom", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_leverage", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_liquidty", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_ltrevrsl", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_mgmtqlty", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_midcap", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_momentum", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_profit", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_prospect", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_regmom", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_resvol", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_season", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_sentmt", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_shortint", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_size", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_strevrsl", valueFormatter: currencyFormatter({ precision: 0 }) },
    { field: "sty_value", valueFormatter: currencyFormatter({ precision: 0 }) },
  ]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get(baseUrl).then((response) => {
      const data = response.data;
      setRowData(data);
    });
  }, []);

  const defaultColDef: ColDef = {
    width: 110,
    minWidth: 110,
    menuTabs: ["generalMenuTab"],
    sortable: true,
    cellClass: "number-cell",
    flex: 1,
  };

  return (
    <div className="performance-viewport">
      <div className="page-toolbar">
        {/* Left group: Dropdown */}
        <div className="toolbar-group toolbar-group-left">
          <label htmlFor="dropdown-select" className="toolbar-label">Owner:</label>
          <select id="dropdown-select" className="toolbar-dropdown" defaultValue="option1">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>
        {/* Center group: Buttons (flush) + date range */}
        <div className="toolbar-group toolbar-group-center">
          <div className="toolbar-btn-group" role="tablist" aria-label="date ranges">
            <button
              className={`toolbar-btn ${selectedRange === "WTD" ? "active" : ""}`}
              onClick={handleWeekToDate}
              aria-pressed={selectedRange === "WTD"}
            >
              WTD
            </button>
            <button
              className={`toolbar-btn ${selectedRange === "MTD" ? "active" : ""}`}
              onClick={handleMonthToDate}
              aria-pressed={selectedRange === "MTD"}
            >
              MTD
            </button>
            <button
              className={`toolbar-btn ${selectedRange === "YTD" ? "active" : ""}`}
              onClick={handleYearToDate}
              aria-pressed={selectedRange === "YTD"}
            >
              YTD
            </button>
            <button
              className={`toolbar-btn ${selectedRange === "ITD" ? "active" : ""}`}
              onClick={handleInceptionToDate}
              aria-pressed={selectedRange === "ITD"}
            >
              ITD
            </button>
          </div>
          <label className="toolbar-label" htmlFor="date-start">Start:</label>
          <input
            id="date-start"
            type="date"
            className="toolbar-date"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
          />
          <span className="toolbar-date-sep">–</span>
          <label className="toolbar-label" htmlFor="date-end">End:</label>
          <input
            id="date-end"
            type="date"
            className="toolbar-date"
            value={dateEnd}
            onChange={e => setDateEnd(e.target.value)}
          />
        </div>
        {/* Right group: Single button */}
        <div className="toolbar-group toolbar-group-right">
          <button className="toolbar-btn toolbar-btn-primary">Export</button>
        </div>
      </div>
      <div
        className="performance-grid-container"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          marginTop: "5px",
          marginBottom: "5px",
          width: "100vw",
          background: "#f0f0f0",
          boxSizing: "border-box",
          display: "block"
        }}
      >
        {width > 0 && (
          <GridLayout
            className="performance-grid"
            layout={layout}
            onLayoutChange={setLayout}
            cols={COLS}
            rowHeight={rowHeight}
            width={width}
            isResizable={false}
            isDraggable
            autoSize={false}
            margin={[5, 0]}
            containerPadding={[5, 0]}
          >
            <div key="a" className="performance-panel" style={{ minHeight: 0, display: "flex", flexDirection: "column", height: "100%" }}>
              <div
                className="panel-body nested-panels-scroll"
                style={{
                  padding: 0,
                  height: "100%",
                  width: "100%",
                  minHeight: 0,
                  overflowY: "auto"
                }}
              >
                {nestedPanels}
              </div>
            </div>
            <div key="b" className="performance-panel">
              <div className="panel-body" style={{ marginTop: "5px", padding: 0, height: "100%", width: "100%" }}>
                <div style={{ height: "100%", width: "100%" }}>
                  <AgGridReact
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    theme={balTheme}
                    rowData={rowData}
                    domLayout="normal"
                  />
                </div>
              </div>
            </div>
          </GridLayout>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
