import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";

const TableBasic = ({
  data,
  columns,
  onDeleteRow,
  onRowClick,
  maxHeight = "max-h-[500px]",
  scrollThreshold = 4,
  className = "",
}) => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  const scrollContainerRef = useRef(null);

  // Tách columns thành các nhóm
  const leftFixedColumns = columns.filter((col) => col.fixed === "left");
  const rightFixedColumns = columns.filter((col) => col.fixed === "right");
  const scrollableColumns = columns.filter((col) => !col.fixed);

  // Kiểm tra có cần scroll không - fix cứng 4 dòng
  const shouldEnableScroll = data.length > scrollThreshold;

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
    if (scrollContainer && shouldEnableScroll) {
      scrollContainer.addEventListener("scroll", handleScroll);
      // Initial measurements
      handleScroll();

      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [shouldEnableScroll]);

  // Check if we should show shadows
  const showLeftShadow = shouldEnableScroll && scrollLeft > 0;
  const showRightShadow = shouldEnableScroll && scrollLeft < scrollWidth - clientWidth - 1;

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


  // Handle delete row
  const handleDeleteRow = (record) => {
    if (onDeleteRow) {
      onDeleteRow(record);
    }
  };

  const renderTableCell = (col, colIdx, value, row, isHeader = false) => {
    let cellStyle = {};
    let cellClassName = `px-3 py-1.5 text-sm ${col.className || ""}`;

    // Thêm font-bold cho header
    if (isHeader) {
      cellClassName += " font-bold text-gray-800 dark:text-gray-300";
    }

    if (col.fixed === "left") {
      const leftColumnIndex = leftFixedColumns.indexOf(col);
      const leftOffset = getLeftOffset(leftColumnIndex);
      const isLastLeftFixed = leftColumnIndex === leftFixedColumns.length - 1;

      cellStyle = {
        position: "sticky",
        left: leftOffset,
        top: isHeader ? 0 : "auto", // Thêm top: 0 cho header
        zIndex: isHeader ? 50 : 10, // Z-index cao nhất cho fixed left header
        backgroundColor: isHeader
          ? "rgb(243 244 246)" // bg-gray-100 - đậm hơn
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
        top: isHeader ? 0 : "auto", // Thêm top: 0 cho header
        zIndex: isHeader ? 50 : 10, // Z-index cao nhất cho fixed right header
        backgroundColor: isHeader
          ? "rgb(243 244 246)" // bg-gray-100 - đậm hơn
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
          className="text-gray-500 hover:text-red-500 transition-colors p-1" // Thêm p-1 để button nhỏ gọn hơn
          title="Xoá dòng"
        >
          <Trash size={16} /> {/* Giảm size từ 18 xuống 16 */}
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
    <div className={`space-y-3 ${className}`}> {/* Giảm space từ space-y-4 xuống space-y-3 */}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]"> {/* Giảm rounded từ rounded-xl xuống rounded-lg */}
        <div
          ref={scrollContainerRef}
          className={`w-full overflow-x-auto ${shouldEnableScroll ? 'overflow-y-auto' : 'overflow-y-hidden'} ${shouldEnableScroll ? maxHeight : ''} relative h-full`}
          style={{ scrollBehavior: "smooth" }}
        >
          <Table>
            <TableHeader className="sticky top-0 z-30 bg-gray-100 dark:bg-gray-800 shadow-sm">
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                {/* Left Fixed Columns */}
                {leftFixedColumns.map((col, idx) => renderTableCell(col, idx, null, undefined, true))}

                {/* Scrollable Columns */}
                {scrollableColumns.map((col, idx) => (
                  <TableCell
                    key={`scrollable-${idx}`}
                    isHeader
                    className={`px-3 py-2.5 text-center text-xs font-medium bg-gray-100 dark:text-gray-400 ${col.className || ""}`} // Giảm padding từ px-4 py-4 xuống px-3 py-2.5
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
                <TableRow key={row.id} onClick={() => onRowClick?.(row)} className="cursor-pointer hover:bg-gray-50 h-10">
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
                        className="px-3 py-1.5 text-sm text-center leading-tight"
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