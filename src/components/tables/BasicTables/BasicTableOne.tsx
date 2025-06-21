import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";

export interface ColumnConfig<T> {
  key: keyof T | string;
  title: string;
  render?: (value: never, record: T) => React.ReactNode;
  className?: string;
}

interface ReusableTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
}

const TableBasic = <T extends { id: number }>({ data, columns }: ReusableTableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="w-full overflow-x-auto">
        <Table className="">
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  isHeader
                  className={`px-4 py-4 text-start text-xs font-medium bg-gray-50 text-gray-500 dark:text-gray-400 ${
                    col.className || ""
                  }`}
                >
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col, colIdx) => {
                  const value = (row as never)[col.key];
                  return (
                    <TableCell key={colIdx} className="px-4 py-5 text-sm font-light text-start leading-tight">
                      {col.render ? col.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableBasic;
