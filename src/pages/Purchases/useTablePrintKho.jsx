import { useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { columnsTableKho } from "../../components/UISearch_and_formData/tableKho";

export const useTablePrintKho = () => {
  const [selectedEditId, setSelectedEditId] = useState();
  const printRef = useRef();

  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  const [rangePickerValue, setRangePickerValue] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0";
    const value = Array.isArray(amount) ? amount[0] : amount;
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Xử lý in một record
  const handlePrintClick = (record, e) => {
    e.stopPropagation();
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">Chi tiết bản ghi kho</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Mã kho:</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${record.ma_kho || "-"}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Tên kho:</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${record.ten_kho || "-"}</td>
          </tr>
        </table>
      </div>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleOpenEdit = (id) => {
    setSelectedEditId(id);
    openModalEdit();
  };

  const handleDeleteClick = (record, e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản ghi kho "${record.ma_kho || record.stt_rec}"?`)) {
      console.log("Deleting record:", record);
    }
  };

  // columnsTable lấy từ file tableKho.js

  const handleRangePicker = (date) => {
    setRangePickerValue(date);
  };

  const handleChangePage = (page) => {
    console.log("Page changed to:", page);
  };

  return {
    columnsTable: columnsTableKho,
    formatDate,
    formatCurrency,
    handleRangePicker,
    handleChangePage,
    handlePrintClick,
    handleOpenEdit,
    handleDeleteClick,
    isOpenCreate,
    openModalCreate,
    closeModalCreate,
    isOpenEdit,
    openModalEdit,
    closeModalEdit,
    selectedEditId,
    setSelectedEditId,
    rangePickerValue,
    selectedRecord,
    setSelectedRecord,
    printRef,
  };
};
