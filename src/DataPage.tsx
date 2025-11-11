import React, { useState, useEffect } from "react";
import axios from 'axios';
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ColGroupDef, SideBarDef } from "ag-grid-enterprise";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-balham.css";
import { themeBalham } from 'ag-grid-community';
import "./DataPage.css";

const menuBarHeight = 34;
const toolbarHeight = 46;
const balTheme = themeBalham.withParams({ columnBorder: { style: "solid", color: "lightgrey" }, headerFontSize: "11px" });
  const baseUrl = "https://localhost:44336/SynthIdea/GetIdeaInputs";

  const textMaxLength = 99999999;
  const textNumRows = 20;
// sample column / row data
const columnDefs = [
  { headerName: "ID", field: "id", sortable: true, filter: true },
  { headerName: "Name", field: "name", sortable: true, filter: true },
  { headerName: "Owner", field: "owner", sortable: true, filter: true },
  { headerName: "Value", field: "value", sortable: true, filter: true }
];

const rowDataSample = [
  { id: 1, name: "Alpha", owner: "Alice", value: 123 },
  { id: 2, name: "Bravo", owner: "Bob", value: 456 },
  { id: 3, name: "Charlie", owner: "Clara", value: 789 },
  { id: 4, name: "Delta", owner: "Drew", value: 1011 }
];

function getWeekToDate() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 - 6 (Sun - Sat)
  // compute Monday as start (if you prefer Sunday, adjust)
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(today);
  monday.setDate(diff);
  return { start: monday.toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) };
}
function getMonthToDate() {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  return { start: first.toISOString().slice(0, 10), end: today.toISOString().slice(0, 10) };
}
function getYearToDate() {
  const today = new Date();
  const first = new Date(today.getFullYear(), 0, 1);
  return { start: first.toISOString().slice(0, 10), end: today.toISOString().slice(0, 10) };
}

const DataPage: React.FC = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const initialWTD = getWeekToDate();
  const [dateStart, setDateStart] = useState(initialWTD.start);
  const [dateEnd, setDateEnd] = useState(initialWTD.end);
  const [owner, setOwner] = useState("option1");

  const [rowData, setRowData] = useState(null);
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get(baseUrl).then((response) => {
      setRowData(response.data);
    });
  }, []);

  const sideBar = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: true,
          suppressSyncLayoutWithGrid: true,
          suppressColumnFilter: false,
          suppressColumnSelectAll: false,
          suppressColumnExpandAll: false
        }
      }
    ]
  };

  const defaultColDef: ColDef = {
    editable: false,
    sortable: true,
    flex: 1,
    menuTabs: ["filterMenuTab", "columnsMenuTab"],
    minWidth: 170,
    filter: false,
    resizable: false,
    autoHeaderHeight: true,
    wrapHeaderText: true,
    columnGroupShow: "closed"
  };

  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>(
  [
    {
      headerName: "Symbol",
      field: "symbol",
      pinned: "left",
      editable: false,
      suppressColumnsToolPanel: true,
      //cellStyle: tickerStatusStyle,
      // link: data => `/tearsheet/${data.Symbol.toLowerCase()}`,
      // //cellRendererFramework: TickerCell,
      //suppressColumnsToolPanel: true,
      minWidth: 70,
      width: 90
    },
    {
      headerName: "Owner",
      field: "ownerUserName",
      editable: false,
      width: 110,
      minWidth: 110,
      suppressColumnsToolPanel: true,
      pinned: "left"
    },
    {
      hide: false,
      field: "currentGmv",
      headerName: "Current $ GMV",
      editable: false,
      width: 120,
      minWidth: 60,
      cellClass: "number-cell highlight",
      //cellStyle: boldFinancialCcyStyle,
      //comparator: customNumberComparator,
      //valueFormatter: gridPositionFormatter("$", 0),
      suppressColumnsToolPanel: true,
      pinned: "left"
    },
    {
      hide: false,
      field: "targetGmv",
      headerName: "Target $ GMV",
      editable: false,
      width: 120,
      minWidth: 60,
      cellClass: "number-cell highlight",
      //cellStyle: boldFinancialCcyStyle,
      //comparator: customNumberComparator,
      //valueFormatter: gridPositionFormatter("$", 0),
      suppressColumnsToolPanel: true,
      pinned: "left"
    },
    {
      initialHide: true,
      headerName: "General Information",
      // width: 2000,
      //groupId: "GeneralInformation",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          headerName: "Last Update",
          editable: false,
          field: "effectiveUpdatedDate",
          width: 140,
          //comparator: dateComparator,
          //cellRendererFramework: LastUpdateCell,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Next Earnings Date",
          field: "EarningsMetrics.NextEarningsDate",
          width: 170,
          editable: false,
          //comparator: dateComparator,
          //valueFormatter: dateFormatter(),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          editable: false,
          headerName: "Position Age",
          field: "PositionAge",
          cellClass: "number-cell",
          minWidth: 100,
          maxWidth: 100,
          width: 100,
          //columnGroupShow: null
        },
        {
          initialHide: true,
          editable: false,
          headerName: "Idea Type",
          field: "ideaTypeDescription",
          width: 170,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          editable: false,
          headerName: "Idea Conviction",
          field: "ideaConvictionDescription",
          width: 170,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          editable: false,
          headerName: "Idea Tier",
          field: "ideaTierDescription",
          width: 170,
          //columnGroupShow: "closed"
        },
        // {
        //   initialHide: false,
        //   editable: false,
        //   headerName: "Dummy",
        //   field: "dumbbell.dumDum",
        //   width: 170,
        //   //columnGroupShow: "closed"
        // },
        {
          initialHide: true,
          editable: false,
          headerName: "GICS Sector",
          field: "SecurityMetrics.SectorDesc",
          width: 170,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "PM Custom Sector",
          field: "ownerSubSector",
          width: 170,
          //columnGroupShow: "closed"
        },
        {
          headerName: "Company Background",
          field: "companyBackground",
          //headerTooltip: constants.placeholders.companyDescription,
          editable: true,
          cellEditorPopup: true,
          cellEditorParams: {
            maxLength: textMaxLength,
            rows: textNumRows
          },
          cellEditor: "agLargeTextCellEditor",
          width: 180,
          //columnGroupShow: "closed"
        },
        {
          field: "thesis",
          //headerTooltip: constants.placeholders.thesis,
          editable: true,
          cellEditorPopup: true,
          // //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          field: "keyFactors",
          //headerTooltip: constants.placeholders.keyFactors,
          editable: true,
          cellEditorPopup: true,
          // //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Scores",
      //groupId: "Scores",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          headerName: "Overall Sector Score",
          field: "CalculatedMetrics.OverallSectorScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: null
        },
        {
          initialHide: true,
          headerName: "Overall Fundamental Score",
          field: "CalculatedMetrics.OverallFundamentalScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //headerTooltip: constants.placeholders.singleOverallFundamentalScore,
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Overall Setup Score",
          field: "CalculatedMetrics.OverallSectorSetupScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Overall Net Event Score",
          field: "CalculatedMetrics.OverallNetCatalystScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Overall Catalyst Score",
          field: "CatalystMetrics.OverallCatalystScore",
          //headerTooltip: constants.placeholders.singleCatalystScore,
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Overall Risk Score",
          field: "RiskMetrics.OverallCatalystScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //headerTooltip: constants.placeholders.singleRiskScore,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Overall Valuation Score",
          field: "CalculatedMetrics.OverallSectorValuationScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Fundamentals",
      //groupId: "Fundamentals",
      //marryChildren: true,
      children: [
        {
          headerName: "Overall Fundamental Score",
          field: "CalculatedMetrics.OverallFundamentalScore",
          //headerTooltip: constants.placeholders.singleOverallFundamentalScore,
          // //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true,
          //columnGroupShow: null
        },
        {
          field: "MacroStrengthScore",
          //headerTooltip: constants.placeholders.singleMacroStrengthScore,
          // //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          field: "IndustryStrengthScore",
          //headerTooltip: constants.placeholders.singleIndustryStrengthScore,
          // //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          field: "CompanyQualityScore",
          //headerTooltip: constants.placeholders.singleCompanyQualityScore,
          // //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          field: "ManagementQualityScore",
          //headerTooltip: constants.placeholders.singleManagementQualityScore,
          // //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "China/Taiwan Conflict Score",
          field: "CustomFactor1Score",
          //headerTooltip: constants.placeholders.singleChinaTaiwanScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "AI Theme Score",
          field: "CustomFactor2Score",
          //headerTooltip: constants.placeholders.singleAiScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "Tariffs Score",
          field: "CustomFactor3Score",
          //headerTooltip: constants.placeholders.singleTariffsScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "Russia/Ukraine Conflict Score",
          field: "CustomFactor4Score",
          //headerTooltip: constants.placeholders.singleRussiaUkraineScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "Rate Cuts Score",
          field: "CustomFactor5Score",
          //headerTooltip: constants.placeholders.singleRateCutsScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "DOGE Cuts Score",
          field: "CustomFactor6Score",
          //headerTooltip: constants.placeholders.singleDogeCutsScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          headerName: "US/Iran Conflict Score",
          field: "CustomFactor7Score",
          //headerTooltip: constants.placeholders.singleUsIranScore,
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          field: "CustomFactor8Score",
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          field: "CustomFactor9Score",
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        },
        {
          field: "CustomFactor10Score",
          cellClass: "number-cell highlight editable-cell",
          //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: scoreCellEditorParams,
          editable: true
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Setup",
      //groupId: "Setup",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          //headerName: user.isAdmin ? "Overall Setup Score (Team)" : "Overall Setup Score",
          //field: user.isAdmin ? "CalculatedMetrics.OverallSetupScore" : "CalculatedMetrics.OverallSectorSetupScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          precision: 1,
          //columnGroupShow: null
        },
        {
          initialHide: true,
          headerName: "Sellside Rating Score",
          field: "SetupMetrics.SellsideRatingScore",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 1 }),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Active Fund Count",
          field: "SetupMetrics.NoOfFunds",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Long Fund Count",
          field: "SetupMetrics.NoOfFundsLong",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Fund Count",
          field: "SetupMetrics.NoOfFundsShort",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Net Fund Count",
          field: "SetupMetrics.NetNoOfFunds",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Long Score",
          field: "SetupMetrics.LongHoldersScore",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Score",
          field: "SetupMetrics.ShortHoldersScore",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "MV Long",
          field: "SetupMetrics.MvLong",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "MV Short",
          field: "SetupMetrics.MvShort",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Long/Short Ratio",
          field: "SetupMetrics.MvLongShortRatio",
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 }),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Utilization",
          field: "SetupMetrics.ActiveUtilisationByQuantity",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Squeeze Score",
          field: "SetupMetrics.ShortSqueezeScore",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Shares Short",
          field: "SetupMetrics.QuantityOnLoan",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        //STOP HERE
        {
          initialHide: true,
          headerName: "Buy Ratings",
          field: "SetupMetrics.BuyRatings",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Buy Ratings",
          field: "SetupMetrics.PctBuyRatings",
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 }),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Sell Ratings",
          field: "SetupMetrics.SellRatings",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Sell Ratings",
          field: "SetupMetrics.PctSellRatings",
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 }),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Hold Ratings",
          field: "SetupMetrics.HoldRatings",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Hold Ratings",
          field: "SetupMetrics.PctHoldRatings",
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 }),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Ratings",
          field: "SetupMetrics.TotalRatings",
          cellClass: "number-cell",
          //valueFormatter: numberFormatter(),
          width: 150,
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Sellside Earnings Change (1 month)",
          field: "SetupMetrics.SellsideEarningsChange1M",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1, defaultVal: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Sellside Earnings Change (3 month)",
          field: "SetupMetrics.SellsideEarningsChange3M",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1, defaultVal: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Interest (Days to Cover)",
          field: "SetupMetrics.ShortInterestDaysToCover",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Performance Average",
          field: "SetupMetrics.AveragePctReturn",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Short Interest (% of Free Float)",
          field: "SetupMetrics.ShortInterestFreeFloat",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "52W High",
          field: "SetupMetrics.High52W",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "52W Low",
          field: "SetupMetrics.Low52W",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "52W High % Delta",
          field: "SetupMetrics.HighDelta52W",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "52W Low % Delta",
          field: "SetupMetrics.LowDelta52W",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "RSI",
          field: "SetupMetrics.RSI",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: rsiCssRules,
          //valueFormatter: numberFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "50D Moving Avg",
          field: "SetupMetrics.MovingAvg50D",
          width: 150,
          cellClass: "number-cell",
          //cellClassRules: scoreCssRules,
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "100D Moving Avg",
          field: "SetupMetrics.MovingAvg100D",
          width: 150,
          cellClass: "number-cell",
          //cellClassRules: scoreCssRules,
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "200D Moving Avg",
          field: "SetupMetrics.MovingAvg200D",
          width: 150,
          cellClass: "number-cell",
          //cellClassRules: scoreCssRules,
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "50D Moving Avg % Delta",
          field: "SetupMetrics.MovingAvgDelta50D",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "100D Moving Avg % Delta",
          field: "SetupMetrics.MovingAvgDelta100D",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "200D Moving Avg % Delta",
          field: "SetupMetrics.MovingAvgDelta200D",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (1d)",
          field: "SetupMetrics.PctReturn_1d",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "1d Z-Score",
          field: "SetupMetrics.PctReturn_1d_zscore",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: numberFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (5d)",
          field: "SetupMetrics.PctReturn_5d",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (MTD)",
          field: "SetupMetrics.PctReturn_MTD",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (1m)",
          field: "SetupMetrics.PctReturn_1m",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (3m)",
          field: "SetupMetrics.PctReturn_3m",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (6m)",
          field: "SetupMetrics.PctReturn_6m",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (1y)",
          field: "SetupMetrics.PctReturn_1y",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (YTD)",
          field: "SetupMetrics.PctReturn_YTD",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "% Return (YTD Relative)",
          field: "SetupMetrics.PctReturnRelative_YTD",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ scale: 100, precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      //initialHide: true,
      headerName: "Catalysts",
      //groupId: "Catalyst",
      //marryChildren: true,
      children: [
        {
          //initialHide: true,
          headerName: "Catalyst Date (1)",
          field: "Catalyst1.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Catalyst Quadrant (1)",
          field: "Catalyst1.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          // cellClass: "number-cell highlight editable-cell",
          // //cellEditor: "catalystQuadrantEditor",
          // //cellEditorParams: { errorHandler: scoreErrorHandler },
          // //cellClassRules: scoreCssRules,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst1.CatalystDesc",
          headerName: "Catalyst Description (1)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst1.CatalystBet",
          headerName: "Catalyst Bet (1)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Probability (1)",
          field: "Catalyst1.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Power (1)",
          field: "Catalyst1.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: catalystPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Date (2)",
          field: "Catalyst2.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Catalyst Quadrant (2)",
          field: "Catalyst2.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst2.CatalystDesc",
          headerName: "Catalyst Description (2)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst2.CatalystBet",
          headerName: "Catalyst Bet (2)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Probability (2)",
          field: "Catalyst2.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Power (2)",
          field: "Catalyst2.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: catalystPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Date (3)",
          field: "Catalyst3.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Catalyst Quadrant (3)",
          field: "Catalyst3.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst3.CatalystDesc",
          headerName: "Catalyst Description (3)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Catalyst3.CatalystBet",
          headerName: "Catalyst Bet (3)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Probability (3)",
          field: "Catalyst3.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Catalyst Power (3)",
          field: "Catalyst3.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: catalystPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      //initialHide: true,
      headerName: "Risks",
      //groupId: "Risk",
      //marryChildren: true,
      children: [
        {
          //initialHide: true,
          headerName: "Risk Date (1)",
          field: "Risk1.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Risk Quadrant (1)",
          field: "Risk1.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk1.CatalystDesc",
          headerName: "Risk Description (1)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk1.CatalystBet",
          headerName: "Risk Bet (1)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Probability (1)",
          field: "Risk1.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Power (1)",
          field: "Risk1.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: riskPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Date (2)",
          field: "Risk2.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Risk Quadrant (2)",
          field: "Risk2.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk2.CatalystDesc",
          headerName: "Risk Description (2)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk2.CatalystBet",
          headerName: "Risk Bet (2)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Probability (2)",
          field: "Risk2.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Power (2)",
          field: "Risk2.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: riskPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Date (3)",
          field: "Risk3.CatalystDate",
          editable: true,
          //valueFormatter: params => (params.value && moment(params.value).format("M/D/YY")) || null,
          //columnGroupShow: null
        },
        {
          //initialHide: true,
          headerName: "Risk Quadrant (3)",
          field: "Risk3.QuadrantId",
          width: 170,
          //headerTooltip: constants.placeholders.catalystQuadrant,
          //tooltipComponent: MultilineTooltip,
          //cellEditor: "agRichSelectCellEditor",
          //valueFormatter: quadrantValueFormatter,
          cellEditorPopup: true,
          //cellEditorParams: quadrantCellEditorParams,
          editable: true,
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk3.CatalystDesc",
          headerName: "Risk Description (3)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          field: "Risk3.CatalystBet",
          headerName: "Risk Bet (3)",
          editable: true,
          cellEditorPopup: true,
          //cellEditorParams: {
          //   maxLength: textMaxLength,
          //   rows: textNumRows
          // },
          //cellEditor: "agLargeTextCellEditor",
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Probability (3)",
          field: "Risk3.CatalystProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          //initialHide: true,
          headerName: "Risk Power (3)",
          field: "Risk3.CatalystPower",
          width: 170,
          //headerTooltip: constants.placeholders.catalystPower,
          //tooltipComponent: MultilineTooltip,
          cellClass: "number-cell highlight editable-cell",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: riskPowerCellEditorParams,
          //cellClassRules: scoreCssRules,
          editable: true,
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Valuation",
      //groupId: "Valuation",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          //headerName: user.isAdmin ? "Overall Valuation Score (Team)" : "Overall Valuation Score",
          //field: user.isAdmin
            // ? "CalculatedMetrics.OverallValuationScore"
            // : "CalculatedMetrics.OverallSectorValuationScore",
          width: 170,
          cellClass: "score-cell editable-cell",
          //cellClassRules: scoreCssRules,
          editable: false,
          //cellRendererFramework: NumberCell,
          // precision: 1,
          //columnGroupShow: null
        },
        {
          headerName: "Price",
          field: "ValuationMetrics.Price",
          width: 100,
          cellClass: "number-cell",
          editable: false,
          //valueFormatter: currencyFormatter(),
          //columnGroupShow: null
        },
        {
          headerName: "Downside Price Target",
          field: "ValuationMetrics.DownsidePriceTarget",
          width: 100,
          cellClass: "number-cell",
          editable: true,
          //valueFormatter: currencyFormatter()
        },
        {
          headerName: "Downside Probability",
          field: "ValuationMetrics.DownsideProbability",
          cellClass: "number-cell",
          //valueGetter: probabilityGetter,
          editable: false,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Downside % Return",
          field: "ValuationMetrics.DownsidePercentageReturn",
          cellClass: "number-cell",
          //valueGetter: lowPercentageGetter,
          editable: false,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Downside Rationale",
          field: "ValuationMetrics.DownsideRationale",
          editable: true,
          cellEditorPopup: true,
          //cellEditor: "agLargeTextCellEditor"
        },
        {
          headerName: "Base Price Target",
          field: "ValuationMetrics.BasePriceTarget",
          width: 100,
          cellClass: "number-cell",
          editable: true,
          //valueFormatter: currencyFormatter()
        },
        {
          headerName: "Base Probability",
          field: "ValuationMetrics.BaseProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellClass: "number-cell",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Base % Return",
          field: "ValuationMetrics.BasePercentageReturn",
          cellClass: "number-cell",
          //valueGetter: basePercentageGetter,
          editable: false,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Base Rationale",
          field: "ValuationMetrics.BaseRationale",
          editable: true,
          cellEditorPopup: true,
          //cellEditor: "agLargeTextCellEditor"
        },
        {
          headerName: "Upside Price Target",
          field: "ValuationMetrics.UpsidePriceTarget",
          cellClass: "number-cell",
          editable: true,
          //valueFormatter: currencyFormatter()
        },
        {
          headerName: "Upside Probability",
          field: "ValuationMetrics.UpsideProbability",
          //cellEditor: "agRichSelectCellEditor",
          cellEditorPopup: true,
          //cellEditorParams: percentageCellEditorParams,
          editable: true,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Upside % Return",
          field: "ValuationMetrics.UpsidePercentageReturn",
          cellClass: "number-cell",
          //valueGetter: highPercentageGetter,
          editable: false,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          headerName: "Upside Rationale",
          field: "ValuationMetrics.UpsideRationale",
          editable: true,
          cellEditorPopup: true,
          //cellEditor: "agLargeTextCellEditor"
        },
        {
          headerName: "Expected Time to Reach Price Target",
          field: "ValuationMetrics.TimeToReachPriceTarget",
          editable: true,
          cellClass: "number-cell"
        },
        {
          headerName: "Probability & Time Weighted Exp. Return",
          field: "ValuationMetrics.ProbabilityExpectedReturn",
          cellClass: "number-cell",
          editable: false,
          // //valueGetter: timeWeightedReturnGetter,
          //valueFormatter: percentFormatter({ precision: 0 })
        },
        {
          initialHide: true,
          headerName: "Stock Sharpe",
          field: "ValuationMetrics.StockSharpe",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Simple Short Risk Reward",
          field: "ValuationMetrics.ShortRiskReward",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Simple Long Risk-Reward",
          field: "ValuationMetrics.LongRiskReward",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Earnings Data",
      //groupId: "EarningsData",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          headerName: "FQ1 Sales (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 Sales (Consensus)",
          field: "EarningsMetrics.FQ1_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 Sales (Delta %)",
          field: "EarningsMetrics.FQ1_Diff_Sales",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EBITDA (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EBITDA (Consensus)",
          field: "EarningsMetrics.FQ1_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EBITDA (Delta %)",
          field: "EarningsMetrics.FQ1_Diff_EBITDA",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EPS (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EPS (Consensus)",
          field: "EarningsMetrics.FQ1_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EPS (Delta %)",
          field: "EarningsMetrics.FQ1_Diff_EPS",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 Sales (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 Sales (Consensus)",
          field: "EarningsMetrics.FQ2_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 Sales (Delta %)",
          field: "EarningsMetrics.FQ2_Diff_Sales",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EBITDA (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EBITDA (Consensus)",
          field: "EarningsMetrics.FQ2_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EBITDA (Delta %)",
          field: "EarningsMetrics.FQ2_Diff_EBITDA",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EPS (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EPS (Consensus)",
          field: "EarningsMetrics.FQ2_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EPS (Delta %)",
          field: "EarningsMetrics.FQ2_Diff_EPS",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 Sales (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 Sales (Consensus)",
          field: "EarningsMetrics.FY1_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 Sales (Delta %)",
          field: "EarningsMetrics.FY1_Diff_Sales",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EBITDA (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EBITDA (Consensus)",
          field: "EarningsMetrics.FY1_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EBITDA (Delta %)",
          field: "EarningsMetrics.FY1_Diff_EBITDA",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EPS (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EPS (Consensus)",
          field: "EarningsMetrics.FY1_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EPS (Delta %)",
          field: "EarningsMetrics.FY1_Diff_EPS",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 Sales (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 Sales (Consensus)",
          field: "EarningsMetrics.FY2_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 Sales (Delta %)",
          field: "EarningsMetrics.FY2_Diff_Sales",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EBITDA (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EBITDA (Consensus)",
          field: "EarningsMetrics.FY2_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EBITDA (Delta %)",
          field: "EarningsMetrics.FY2_Diff_EBITDA",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EPS (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EPS (Consensus)",
          field: "EarningsMetrics.FY2_EPS",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EPS (Delta %)",
          field: "EarningsMetrics.FY2_Diff_EPS",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 YoY Sales Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_YoYSalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 QoQ Sales Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_QoQSalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 YoY Sales Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_YoYSalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 QoQ Sales Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_QoQSalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 Sales Growth (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_SalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 Sales Growth (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_SalesGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 YoY EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_YoYEBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 QoQ EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_QoQEBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 YoY EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_YoYEBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 QoQ EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_QoQEBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_EBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EBITDA Growth (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_EBITDAGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 YoY EPS Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_YoYEPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 QoQ EPS Growth (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_QoQEPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 YoY EPS Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_YoYEPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 QoQ EPS Growth (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_QoQEPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EPS Growth (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_EPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EPS Growth (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_EPSGrowth",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ1 EBITDA Margin (Synthesis)",
          field: "EarningsMetrics.FQ1_BAM_EBITDAMargin",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FQ2 EBITDA Margin (Synthesis)",
          field: "EarningsMetrics.FQ2_BAM_EBITDAMargin",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EBITDA Margin (Synthesis)",
          field: "EarningsMetrics.FY1_BAM_EBITDAMargin",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EBITDA Margin (Synthesis)",
          field: "EarningsMetrics.FY2_BAM_EBITDAMargin",
          width: 150,
          cellClass: "number-cell highlight",
          //cellClassRules: scoreCssRules,
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Other Financials",
      //groupId: "OtherFinancials",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          headerName: "Current Price",
          field: "ValuationMetrics.Price",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: null
        },
        {
          initialHide: true,
          headerName: "Shares Out (Synthesis)",
          field: "OtherMetrics.BAM_SharesOutstanding",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Shares Out (Consensus)",
          field: "OtherMetrics.SharesOutstanding",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Market Cap (Synthesis)",
          field: "OtherMetrics.BAM_MarketCapitalization",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Market Cap (Consensus)",
          field: "OtherMetrics.MarketCap",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Debt (Synthesis)",
          field: "OtherMetrics.BAM_TotalDebt",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Debt (Consensus)",
          field: "OtherMetrics.TotalDebt",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Cash (Synthesis)",
          field: "OtherMetrics.BAM_TotalCash",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Cash (Consensus)",
          field: "OtherMetrics.TotalCash",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Net Debt (Synthesis)",
          field: "OtherMetrics.BAM_NetDebt",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Net Debt (Consensus)",
          field: "OtherMetrics.NetDebt",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Preferred Eq (Synthesis)",
          field: "OtherMetrics.BAM_PreferredEquity",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Preferred Eq (Consensus)",
          field: "OtherMetrics.PreferredEquity",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Minority Int (Synthesis)",
          field: "OtherMetrics.BAM_MinorityInterest",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Minority Int (Consensus)",
          field: "OtherMetrics.MinorityInterest",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Other Adjustments (Synthesis)",
          field: "OtherMetrics.BAM_OtherAdjustments",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Other Adjustments (Consensus)",
          field: "OtherMetrics.OtherAdjustments",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0, defaultVal: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Enterprise Val (Synthesis)",
          field: "OtherMetrics.BAM_EnterpriseValue",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Enterprise Val (Consensus)",
          field: "OtherMetrics.EnterpriseValue",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 P/E (Synthesis)",
          field: "OtherMetrics.FY1_BAM_PE",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 P/E (Synthesis)",
          field: "OtherMetrics.FY2_BAM_PE",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EV/EBITDA (Synthesis)",
          field: "OtherMetrics.FY1_BAM_EV_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EV/EBITDA (Synthesis)",
          field: "OtherMetrics.FY2_BAM_EV_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EV/Sales (Synthesis)",
          field: "OtherMetrics.FY1_BAM_EV_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EV/Sales (Synthesis)",
          field: "OtherMetrics.FY2_BAM_EV_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 P/E (Consensus)",
          field: "OtherMetrics.FY1_PE",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 P/E (Consensus)",
          field: "OtherMetrics.FY2_PE",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EV/EBITDA (Consensus)",
          field: "OtherMetrics.FY1_EV_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EV/EBITDA (Consensus)",
          field: "OtherMetrics.FY2_EV_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY1 EV/Sales (Consensus)",
          field: "OtherMetrics.FY1_EV_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "FY2 EV/Sales (Consensus)",
          field: "OtherMetrics.FY2_EV_Sales",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Book Equity (Synthesis)",
          field: "OtherMetrics.BAM_BookEquity",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: currencyFormatter({ precision: 0 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Price / Book Equity (Synthesis)",
          field: "OtherMetrics.BAM_PriceBookEquity",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Dividend Yield",
          field: "OtherMetrics.DividendYield",
          width: 150,
          cellClass: "number-cell",
          editable: false,
          // default the value to 0
          //valueGetter: params =>
            // (params.data && params.data.OtherMetrics && params.data.OtherMetrics.DividendYield) || 0,
          //valueFormatter: percentFormatter({ scale: 1, precision: 1, defaultVal: 0 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Predicted Beta",
          field: "RiskFactorExposures.pred_beta",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Volatility (20-day)",
          field: "OtherMetrics.Volatility",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Liquidity (20-day ADTV)",
          field: "OtherMetrics.Liquidity20DayADTV",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 0 })(params);
          //   return val !== "-" ? `$ ${val}M` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Debt / Equity (Synthesis)",
          field: "OtherMetrics.BAM_DebtEquity",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Debt / Cap (Synthesis)",
          field: "OtherMetrics.BAM_DebtCap",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Net Debt / Cap (Synthesis)",
          field: "OtherMetrics.BAM_NetDebtCap",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Net Debt / FY1 EBITDA (Synthesis)",
          field: "OtherMetrics.BAM_NetDebt_FY1_EBITDA",
          width: 150,
          cellClass: "number-cell",
          //valueFormatter: params => {
          //   const val = numberFormatter({ precision: 1 })(params);
          //   return val !== "-" ? `${val}x` : val;
          // },
          editable: false,
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Idio Vol",
          field: "RiskFactorExposures.spec_risk_pct",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Total Vol",
          field: "RiskFactorExposures.total_risk_pct",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 1 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "Idio Vol Ratio",
          field: "OtherMetrics.IdioVolRatio",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: percentFormatter({ precision: 0 }),
          //columnGroupShow: "closed"
        }
      ]
    },
    {
      initialHide: true,
      headerName: "Risk Factor Data",
      //groupId: "RiskFactorData",
      //marryChildren: true,
      children: [
        {
          initialHide: true,
          headerName: "exp_sty_1drevrsl",
          field: "RiskFactorExposures.exp_sty_1drevrsl",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_divyild",
          field: "RiskFactorExposures.exp_sty_divyild",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_dwnrisk",
          field: "RiskFactorExposures.exp_sty_dwnrisk",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_earnqlty",
          field: "RiskFactorExposures.exp_sty_earnqlty",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_earnyild",
          field: "RiskFactorExposures.exp_sty_earnyild",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_growth",
          field: "RiskFactorExposures.exp_sty_growth",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_indmom",
          field: "RiskFactorExposures.exp_sty_indmom",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_leverage",
          field: "RiskFactorExposures.exp_sty_leverage",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_liquidty",
          field: "RiskFactorExposures.exp_sty_liquidty",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_ltrevrsl",
          field: "RiskFactorExposures.exp_sty_ltrevrsl",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_mgmtqlty",
          field: "RiskFactorExposures.exp_sty_mgmtqlty",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_midcap",
          field: "RiskFactorExposures.exp_sty_midcap",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_momentum",
          field: "RiskFactorExposures.exp_sty_momentum",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_profit",
          field: "RiskFactorExposures.exp_sty_profit",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_prospect",
          field: "RiskFactorExposures.exp_sty_prospect",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_regmom",
          field: "RiskFactorExposures.exp_sty_regmom",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_resvol",
          field: "RiskFactorExposures.exp_sty_resvol",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_season",
          field: "RiskFactorExposures.exp_sty_season",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_sentmt",
          field: "RiskFactorExposures.exp_sty_sentmt",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_shortint",
          field: "RiskFactorExposures.exp_sty_shortint",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_size",
          field: "RiskFactorExposures.exp_sty_size",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_strevrsl",
          field: "RiskFactorExposures.exp_sty_strevrsl",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        },
        {
          initialHide: true,
          headerName: "exp_sty_value",
          field: "RiskFactorExposures.exp_sty_value",
          width: 150,
          editable: false,
          cellClass: "number-cell",
          //valueFormatter: numberFormatter({ precision: 2 }),
          //columnGroupShow: "closed"
        }
      ]
    }
  ]);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleWTD = () => {
    const { start, end } = getWeekToDate();
    setDateStart(start);
    setDateEnd(end);
  };
  const handleMTD = () => {
    const { start, end } = getMonthToDate();
    setDateStart(start);
    setDateEnd(end);
  };
  const handleYTD = () => {
    const { start, end } = getYearToDate();
    setDateStart(start);
    setDateEnd(end);
  };

  return (
    <div className="data-viewport">
      <div className="page-toolbar" role="toolbar" aria-label="Data page toolbar">
        <div className="toolbar-group toolbar-left">
           <input
            type="text"
            placeholder="Search..."
            className="search-input"/>
          <select
            id="owner-select"
            className="toolbar-dropdown"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <div className="toolbar-group toolbar-center">
        </div>

        <div className="toolbar-group toolbar-right">
          <button className="toolbar-btn">Export</button>
          <button className="toolbar-btn toolbar-btn-primary">Save</button>
        </div>
      </div>

      <div className="data-grid-container">
        {/* ag-grid fills remaining viewport; ag-theme-balham used */}
        <div style={{height: "100%", width: "100%"}}>
          <AgGridReact
            columnDefs={colDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            domLayout="normal"
            animateRows={true}
            sideBar={sideBar}
            theme={balTheme}
            // defaultColDef={{ resizable: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default DataPage;
