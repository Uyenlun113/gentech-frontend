import { useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";

export const useBaoCaoVonList = () => {
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
    // Handle array values (take first element if array)
    const value = Array.isArray(amount) ? amount[0] : amount;
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Xử lý in một record
  const handlePrintClick = (record, e) => {
    e.stopPropagation();

    // Tạo nội dung in cho một record
    const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="text-align: center; margin-bottom: 20px;">Chi tiết bản ghi</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Ngày chứng từ:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatDate(record.ngay_ct)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Số chứng từ:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${
                          record.so_ct_trim || record.so_ct || "-"
                        }</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Tên khách hàng:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.ten_kh || "-"}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Diễn giải:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${record.dien_giai || "-"}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Số tiền:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${formatCurrency(
                          record.ps_no || record.ps_co
                        )}</td>
                    </tr>
                </table>
            </div>
        `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Xử lý sửa record
  const handleOpenEdit = (id) => {
    setSelectedEditId(id);
    openModalEdit();
  };

  // Xử lý xóa record
  const handleDeleteClick = (record, e) => {
    e.stopPropagation();

    if (window.confirm(`Bạn có chắc chắn muốn xóa bản ghi "${record.so_ct_trim || record.stt_rec}"?`)) {
      console.log("Deleting record:", record);
      // deleteMutation.mutate(record.stt_rec);
    }
  };

  const columnsTable = [
    {
      key: "ngay_ct",
      title: "Ngày Ct",
      fixed: "left",
      width: 110,
      render: (val) => {
        return <div className="font-medium text-center">{formatDate(val)}</div>;
      },
    },
    {
      key: "ngay_lct",
      title: "Ngày lập c.t",
      width: 110,
      render: (val) => {
        return <div className="font-medium text-center">{formatDate(val)}</div>;
      },
    },
    {
      key: "ma_ct",
      title: "Mã c.t",
      width: 80,
      render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
    },
    {
      key: "so_ct",
      title: "Số Ct",
      width: 100,
      render: (val, record) => {
        const displayValue = record.so_ct_trim || val || "-";
        return <div className="font-medium text-center">{displayValue}</div>;
      },
    },
    {
      key: "ma_kh",
      title: "Mã khách",
      width: 100,
      render: (val) => (
        <div className="max-w-xs truncate text-center" title={val}>
          {val ? val.trim() : "-"}
        </div>
      ),
    },
    {
      key: "ten_kh",
      title: "Tên khách hàng",
      width: 150,
      render: (val) => (
        <div className="max-w-xs truncate text-center" title={val}>
          {val || "-"}
        </div>
      ),
    },
    {
      key: "dien_giai",
      title: "Diễn giải",
      width: 120,
      render: (val) => (
        <div className="max-w-xs truncate text-center" title={val}>
          {val || "-"}
        </div>
      ),
    },
    {
      key: "ps_no",
      title: "Ps nợ",
      width: 100,
      render: (val) => {
        const value = Array.isArray(val) ? val[0] : val;
        return value ? (
          <div className="text-center text-red-600 ">{formatCurrency(value)}</div>
        ) : (
          <div className="text-center">0</div>
        );
      },
    },
    {
      key: "ps_co",
      title: "Ps có",
      width: 100,
      render: (val) => {
        const value = Array.isArray(val) ? val[0] : val;
        return value ? (
          <div className="text-center text-blue-600">{formatCurrency(value)}</div>
        ) : (
          <div className="text-center">0</div>
        );
      },
    },
    {
      key: "so_ton",
      title: "Số tồn",
      width: 120,
      render: (val) => {
        const value = Array.isArray(val) ? val[0] : val;
        return <div className="text-center font-semibold text-green-600">{formatCurrency(value)}</div>;
      },
    },
    {
      key: "ten_tk",
      title: "Tên tài khoản đối ứng",
      width: 180,
      render: (val) => (
        <div className="max-w-xs truncate text-center" title={val}>
          {val || "-"}
        </div>
      ),
    },
  ];

  const handleRangePicker = (date) => {
    setRangePickerValue(date);
  };

  const handleChangePage = (page) => {
    console.log("Page changed to:", page);
  };

  return {
    columnsTable,
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
