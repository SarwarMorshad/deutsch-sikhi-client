const AdminTable = ({ columns, data, onRowClick, emptyMessage = "No data found" }) => {
  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ds-border/30 bg-ds-bg/30">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`py-4 px-4 text-ds-muted font-medium ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-ds-border/20 hover:bg-ds-bg/20 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-4 px-4 ${column.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-ds-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
