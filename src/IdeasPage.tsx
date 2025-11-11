import React, { useEffect, useRef, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { AgGridReact } from "ag-grid-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "./IdeasPage.css";

const columnDefs = [
  { headerName: "ID", field: "id", sortable: true, filter: true },
  { headerName: "Title", field: "title", sortable: true, filter: true },
  { headerName: "Owner", field: "owner", sortable: true, filter: true },
  { headerName: "Score", field: "score", sortable: true, filter: true }
];

function makeRows(prefix: string, start = 1, count = 6) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${start + i}`,
    title: `${prefix} Idea ${start + i}`,
    owner: ["Alice", "Bob", "Clara", "Drew"][i % 4],
    score: Math.floor(Math.random() * 100)
  }));
}

// Layout with 12 columns x 12 rows. Left column uses w=4 (1/3).
const mainLayout: Layout[] = [
  { i: "a", x: 0, y: 0, w: 4, h: 12, minW: 3, minH: 4, static: true },
  { i: "b", x: 4, y: 0, w: 4, h: 6, minW: 2, minH: 3, static: true },
  { i: "c", x: 8, y: 0, w: 4, h: 6, minW: 2, minH: 3, static: true },
  { i: "d", x: 4, y: 6, w: 4, h: 6, minW: 2, minH: 3, static: true },
  { i: "e", x: 8, y: 6, w: 4, h: 6, minW: 2, minH: 3, static: true }
];

const COLS = 12;
const ROWS = 12;

export default function IdeasPage(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState({
    width: window.innerWidth,
    containerHeight: window.innerHeight - 34,
    rowHeight: 30
  });

  // horizontal and vertical margins between panels
  const marginX = 2; // reduced horizontal gap (half of previous)
  const marginY = 5; // vertical gap
  const containerPadding = 4; // top/bottom padding for GridLayout

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = Math.max(200, Math.floor(rect.height));
      const containerWidth = Math.max(300, Math.floor(rect.width));

      // compute rowHeight so that rows + vertical margins + top/bottom padding approximately fill containerHeight
      const totalVerticalMargins = marginY * (ROWS - 1);
      const availableForRows = Math.max(0, containerHeight - containerPadding * 2 - totalVerticalMargins);

      // round to nearest integer to minimize leftover slack (use Math.round instead of floor)
      const computedRowHeight = Math.max(18, Math.round(availableForRows / ROWS));

      setMeasured({
        width: containerWidth,
        containerHeight,
        rowHeight: computedRowHeight
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (containerRef.current) ro.disconnect();
    };
  }, [marginY, containerPadding]);

  const rowsA = makeRows("A", 1, 12);
  const rowsB = makeRows("B", 1, 8);
  const rowsC = makeRows("C", 1, 8);
  const rowsD = makeRows("D", 1, 8);
  const rowsE = makeRows("E", 1, 8);

  return (
    <div className="ideas-viewport" role="main">
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

        {/* Right group: Single button */}
        <div className="toolbar-group toolbar-group-right">
          <button className="toolbar-btn toolbar-btn-primary">Export</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="ideas-grid-container"
        style={{
          // container fills remaining viewport space; CSS margins are smaller now
          flex: "1 1 0",
          minHeight: 0,
          padding: 0,
          boxSizing: "border-box",
        }}
      >
        <GridLayout
          className="ideas-grid"
          layout={mainLayout}
          cols={COLS}
          rowHeight={measured.rowHeight}
          width={measured.width}
          isResizable={false}
          isDraggable={false}
          compactType={null}
          preventCollision={true}
          autoSize={false}
          margin={[marginX, marginY]}
          containerPadding={[containerPadding, containerPadding]}
          // set the GridLayout height to the measured containerHeight so panels fill vertical space
          style={{
            height: `${measured.containerHeight}px`
          }}
        >
          <div key="a" className="ideas-panel">
            <div className="ideas-panel-header">Portfolio Overview</div>
            <div className="ideas-panel-body">
              <div className="ag-theme-balham ideas-ag">
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowsA}
                  domLayout="normal"
                  defaultColDef={{ resizable: true }}
                />
              </div>
            </div>
          </div>

          <div key="b" className="ideas-panel">
            <div className="ideas-panel-header">Book Overview</div>
            <div className="ideas-panel-body">
              <div className="ag-theme-balham ideas-ag">
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowsB}
                  domLayout="normal"
                  defaultColDef={{ resizable: true }}
                />
              </div>
            </div>
          </div>

          <div key="c" className="ideas-panel">
            <div className="ideas-panel-header">Risk Decomposition</div>
            <div className="ideas-panel-body">
              <div className="ag-theme-balham ideas-ag">
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowsC}
                  domLayout="normal"
                  defaultColDef={{ resizable: true }}
                />
              </div>
            </div>
          </div>

          <div key="d" className="ideas-panel">
            <div className="ideas-panel-header">Sector Overview</div>
            <div className="ideas-panel-body">
              <div className="ag-theme-balham ideas-ag">
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowsD}
                  domLayout="normal"
                  defaultColDef={{ resizable: true }}
                />
              </div>
            </div>
          </div>

          <div key="e" className="ideas-panel">
            <div className="ideas-panel-header">Factor Overview</div>
            <div className="ideas-panel-body">
              <div className="ag-theme-balham ideas-ag">
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowsE}
                  domLayout="normal"
                  defaultColDef={{ resizable: true }}
                />
              </div>
            </div>
          </div>
        </GridLayout>
      </div>
    </div>
  );
}