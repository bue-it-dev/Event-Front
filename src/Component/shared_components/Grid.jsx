import * as React from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
//const VISIBLE_FIELDS = ['name', 'rating', 'country', 'dateCreated', 'isAdmin'];

export default function MyDataGrid(props) {
  // const { data } = useDemoData({
  //   dataSet: 'Employee',
  //   visibleFields: VISIBLE_FIELDS,
  //   rowLength: 100,
  // });
  const [pageSize, setPageSize] = React.useState(25);

  return (
    <DataGrid
      rows={props.rows}
      columns={props.columns}
      autoHeight
      pageSize={pageSize}
      onPageSizeChange={(newPage) => setPageSize(newPage)}
      pagination
      disableSelectionOnClick
      components={{ Toolbar: GridToolbar }}
      style={{
        // minWidth: "100%",
        // fontFamily: "Segoe UI, sans-serif",
        fontSize: "0.7rem",
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
    />
  );
}
