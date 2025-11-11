import React from "react";
import { AgGridReact } from "ag-grid-react";
import { defaultGetRowClass } from "../utils/agGridDefaults";

/**
 * AgGridWrapper
 * - Automatically injects a default getRowClass for reliable striping under virtualization.
 * - Pass-through for all AgGridReact props; if a consumer passes getRowClass it overrides the default.
 *
 * Usage:
 * import AgGrid from '../components/AgGridWrapper';
 * <div className="ag-theme-balham" style={{height: 400}}>
 *   <AgGrid columnDefs={...} rowData={...} />
 * </div>
 */
type AnyProps = Record<string, any>;

export default function AgGridWrapper(props: AnyProps) {
  const { getRowClass, ...rest } = props;
  const mergedGetRowClass = getRowClass ?? defaultGetRowClass;

  return <AgGridReact getRowClass={mergedGetRowClass} {...rest} />;
}
