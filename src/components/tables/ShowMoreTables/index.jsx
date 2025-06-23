import { useState } from "react";
import Pagination from "../../pagination/Pagination";
import TableBasic from "../BasicTables/BasicTableOne";

export const ShowMoreTables = ({ dataTable, columnsTable, columnsSubTable, handleChangePage }) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);

  const handleRowClick = (row) => {
    console.log(row);
    if (!isShowMore) {
      setIsShowMore(true);
    }
    setSelectedRow(row);
  };

  return (
    <>
      <div className={`${isShowMore ? "h-[40vh] overflow-scroll" : "h-full"}`}>
        <TableBasic data={dataTable} columns={columnsTable} onRowClick={handleRowClick} />
      </div>
      <Pagination currentPage={1} totalItems={80} onPageChange={handleChangePage} />
      <div className="w-full flex justify-center mt-4">
        <button
          onClick={() => {
            setIsShowMore(!isShowMore);
            if (!isShowMore) setSelectedRow(null);
          }}
        >
          {isShowMore ? "Thu gọn" : "Mở rộng"}
        </button>
      </div>

      {isShowMore && selectedRow?.children && (
        <div className="mt-4">
          <TableBasic data={selectedRow.children} columns={columnsSubTable} />
        </div>
      )}
    </>
  );
};
