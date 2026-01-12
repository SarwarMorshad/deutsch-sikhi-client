import { HiOutlinePlus, HiOutlineTrash, HiOutlineX } from "react-icons/hi";
import toast from "react-hot-toast";

const TableBlockEditor = ({ data, onChange }) => {
  // Initialize with default data if empty
  const tableData = {
    title_en: data.title_en || "",
    title_bn: data.title_bn || "",
    headers: data.headers || ["Column 1", "Column 2", "Column 3"],
    rows: data.rows || [
      ["", "", ""],
      ["", "", ""],
    ],
  };

  const updateTable = (updates) => {
    onChange({ ...tableData, ...updates });
  };

  const addColumn = () => {
    const newHeaders = [...tableData.headers, `Column ${tableData.headers.length + 1}`];
    const newRows = tableData.rows.map((row) => [...row, ""]);
    updateTable({ headers: newHeaders, rows: newRows });
  };

  const removeColumn = (colIndex) => {
    if (tableData.headers.length <= 2) {
      toast.error("Table must have at least 2 columns");
      return;
    }
    const newHeaders = tableData.headers.filter((_, i) => i !== colIndex);
    const newRows = tableData.rows.map((row) => row.filter((_, i) => i !== colIndex));
    updateTable({ headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRow = new Array(tableData.headers.length).fill("");
    updateTable({ rows: [...tableData.rows, newRow] });
  };

  const removeRow = (rowIndex) => {
    if (tableData.rows.length <= 1) {
      toast.error("Table must have at least 1 row");
      return;
    }
    const newRows = tableData.rows.filter((_, i) => i !== rowIndex);
    updateTable({ rows: newRows });
  };

  const updateHeader = (colIndex, value) => {
    const newHeaders = [...tableData.headers];
    newHeaders[colIndex] = value;
    updateTable({ headers: newHeaders });
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = tableData.rows.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    );
    updateTable({ rows: newRows });
  };

  return (
    <div className="space-y-4">
      {/* Table Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Table Title (English) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={tableData.title_en}
            onChange={(e) => updateTable({ title_en: e.target.value })}
            placeholder="e.g., Conjugation of 'sein' (to be)"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Table Title (Bengali) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={tableData.title_bn}
            onChange={(e) => updateTable({ title_bn: e.target.value })}
            placeholder="যেমন: 'sein' ক্রিয়ার রূপ"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
          />
        </div>
      </div>

      {/* Table Editor */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Headers */}
          <thead>
            <tr>
              {tableData.headers.map((header, colIndex) => (
                <th key={colIndex} className="p-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => updateHeader(colIndex, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-ds-surface border border-ds-border/50 text-ds-text font-semibold text-center focus:outline-none focus:border-ds-border"
                    />
                    <button
                      onClick={() => removeColumn(colIndex)}
                      className="p-1 text-ds-muted hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
                      title="Remove column"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
              <th className="p-1 w-10">
                <button
                  onClick={addColumn}
                  className="p-2 text-ds-muted hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Add column"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                </button>
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      placeholder="..."
                      className="w-full px-3 py-2 rounded-lg bg-ds-bg/50 border border-ds-border/30 text-ds-text text-center focus:outline-none focus:border-ds-border"
                    />
                  </td>
                ))}
                <td className="p-1">
                  <button
                    onClick={() => removeRow(rowIndex)}
                    className="p-2 text-ds-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove row"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <button
        onClick={addRow}
        className="w-full py-2 border-2 border-dashed border-ds-border/30 rounded-xl text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <HiOutlinePlus className="w-4 h-4" />
        Add Row
      </button>

      {/* Preview Info */}
      <p className="text-xs text-ds-muted text-center">
        {tableData.headers.length} columns × {tableData.rows.length} rows
      </p>
    </div>
  );
};

export default TableBlockEditor;
