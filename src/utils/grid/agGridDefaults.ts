// Shared AG Grid defaults (getRowClass and any shared GridOptions/props)
import { GridOptions } from "ag-grid-community";

export const defaultGetRowClass = (params: any) => {
  // don't stripe pinned rows or group headers
  if (params.node?.rowPinned) return "";
  if (params.node?.group) return ""; // optional: skip group rows
  const rowIdx = params.node?.rowIndex ?? params.rowIndex;
  if (typeof rowIdx !== "number") return "";
  return rowIdx % 2 === 0 ? "striped-even" : "striped-odd";
};

// You can export a GridOptions object if you prefer to pass gridOptions={...}
export const defaultGridOptions: Partial<GridOptions> = {
  getRowClass: defaultGetRowClass,
  // add other defaults here if needed
};
