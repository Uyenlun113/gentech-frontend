import { Plus, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";

const TableBasic = ({
  data,
  columns,
  onAddRow,
  onDeleteRow,
  showAddButton = false,
  addButtonText = "Thêm dòng mới",
  onRowClick,
}) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const scrollContainerRef = useRef(null);

  // Tách columns thành các nhóm
  const leftFixedColumns = columns.filter((col) => col.fixed === "left");
  const rightFixedColumns = columns.filter((col) => col.fixed === "right");
  const scrollableColumns = columns.filter((col) => !col.fixed);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setScrollLeft(scrollLeft);
        setScrollWidth(scrollWidth);
        setClientWidth(clientWidth);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Initial measurements
      handleScroll();

      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Check if we should show shadows
  const showLeftShadow = scrollLeft > 0;
  const showRightShadow = scrollLeft < scrollWidth - clientWidth - 1;

  // Tính toán width cho các fixed columns
  const getLeftOffset = (index) => {
    return leftFixedColumns.slice(0, index).reduce((acc, col) => {
      const width = typeof col.width === "number" ? col.width : 150;
      return acc + width;
    }, 0);
  };

  const getRightOffset = (index) => {
    return rightFixedColumns.slice(index + 1).reduce((acc, col) => {
      const width = typeof col.width === "number" ? col.width : 150;
      return acc + width;
    }, 0);
  };

  // Handle add new row
  const handleAddRow = () => {
    if (onAddRow) {
      // Tạo ID mới (có thể cải thiện logic này)
      const newId = Math.max(...data.map((item) => item.id || 0)) + 1;

      // Tạo object mới với các field mặc định
      const newRow = {
        id: newId,
        // Khởi tạo các field mặc định dựa trên columns
        ...columns.reduce((acc, col) => {
          if (col.key && col.key !== "action") {
            acc[col.key] = col.defaultValue || "";
          }
          return acc;
        }, {}),
      };

      onAddRow(newRow);
    }
  };

  // Handle delete row
  const handleDeleteRow = (record) => {
    if (onDeleteRow) {
      onDeleteRow(record);
    }
  };

  const renderTableCell = (col, colIdx, value, row, isHeader = false) => {
    let cellStyle = {};
    let cellClassName = `px-4 py-0 text-sm ${col.className || ""}`;

    if (col.fixed === "left") {
      const leftColumnIndex = leftFixedColumns.indexOf(col);
      const leftOffset = getLeftOffset(leftColumnIndex);
      const isLastLeftFixed = leftColumnIndex === leftFixedColumns.length - 1;

      cellStyle = {
        position: "sticky",
        left: leftOffset,
        zIndex: col.fixed ? 10 : 1,
        backgroundColor: isHeader
          ? "rgb(249 250 251)" // bg-gray-50
          : "white",
      };

      if (isLastLeftFixed) {
        cellClassName += " border-r border-gray-200 dark:border-white/[0.05]";
        // Add shadow when scrolling
        if (showLeftShadow) {
          cellStyle.boxShadow = "2px 0 4px -2px rgba(0, 0, 0, 0.1)";
        }
      }
    } else if (col.fixed === "right") {
      const rightColumnIndex = rightFixedColumns.indexOf(col);
      const rightOffset = getRightOffset(rightColumnIndex);
      const isFirstRightFixed = rightColumnIndex === 0;

      cellStyle = {
        position: "sticky",
        right: rightOffset,
        zIndex: col.fixed ? 10 : 1,
        backgroundColor: isHeader
          ? "rgb(249 250 251)" // bg-gray-50
          : "white",
      };

      if (isFirstRightFixed) {
        cellClassName += " border-l border-gray-200 dark:border-white/[0.05]";
        // Add shadow when scrolling
        if (showRightShadow) {
          cellStyle.boxShadow = "-2px 0 4px -2px rgba(0, 0, 0, 0.1)";
        }
      }
    }

    if (col.width) {
      cellStyle.width = col.width;
      cellStyle.minWidth = col.width;
    } else if (col.minWidth) {
      cellStyle.minWidth = col.minWidth;
    }

    let content = isHeader ? col.title : col.render && row ? col.render(value, row) : value;

    // Nếu là column action và không phải header, thêm nút xoá mặc định
    if (!isHeader && col.key === "action" && !col.render) {
      content = (
        <button
          onClick={() => handleDeleteRow(row)}
          className="text-gray-500 hover:text-red-500 transition-colors"
          title="Xoá dòng"
        >
          <Trash size={18} />
        </button>
      );
    }

    return (
      <TableCell key={colIdx} isHeader={isHeader} className={cellClassName} style={cellStyle}>
        {content}
      </TableCell>
    );
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      {showAddButton && (
        <div className="flex justify-end">
          <button
            onClick={handleAddRow}
            className="flex items-center text-sm gap-2 px-4 py-3 bg-white text-black rounded-xl hover:bg-blue-700 transition-colors border border-black"
          >
            <Plus size={16} />
            {addButtonText}
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div ref={scrollContainerRef} className="w-full overflow-x-auto relative" style={{ scrollBehavior: "smooth" }}>
          <Table>
            <TableHeader>
              <TableRow >
                {/* Left Fixed Columns */}
                {leftFixedColumns.map((col, idx) => renderTableCell(col, idx, null, undefined, true))}

                {/* Scrollable Columns */}
                {scrollableColumns.map((col, idx) => (
                  <TableCell
                    key={`scrollable-${idx}`}
                    isHeader
                    className={`px-4 py-4 text-center text-xs font-medium bg-gray-50 dark:text-gray-400 ${col.className || ""
                      }`}
                    style={{
                      width: col.width,
                      minWidth: col.minWidth || col.width,
                    }}
                  >
                    {col.title}
                  </TableCell>
                ))}

                {/* Right Fixed Columns */}
                {rightFixedColumns.map((col, idx) =>
                  renderTableCell(col, idx + leftFixedColumns.length + scrollableColumns.length, null, undefined, true)
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row) => (
                <TableRow key={row.id} onClick={() => onRowClick?.(row)} className="cursor-pointer hover:bg-gray-50">
                  {/* Left Fixed Columns */}
                  {leftFixedColumns.map((col, colIdx) => {
                    const value = row[col.key];
                    return renderTableCell(col, colIdx, value, row);
                  })}

                  {/* Scrollable Columns */}
                  {scrollableColumns.map((col, colIdx) => {
                    const value = row[col.key];
                    return (
                      <TableCell
                        key={`scrollable-${colIdx}`}
                        className="px-4 py-4 text-sm text-center leading-tight"
                        style={{
                          width: col.width,
                          minWidth: col.minWidth || col.width,
                        }}
                      >
                        {col.render ? col.render(value, row) : value}
                      </TableCell>
                    );
                  })}

                  {/* Right Fixed Columns */}
                  {rightFixedColumns.map((col, colIdx) => {
                    const value = row[col.key];
                    return renderTableCell(
                      col,
                      colIdx + leftFixedColumns.length + scrollableColumns.length,
                      value,
                      row
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableBasic;
