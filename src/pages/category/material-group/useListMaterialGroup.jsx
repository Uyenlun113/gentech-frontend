import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteMaterialGroup, useMaterialGroups } from "../../../hooks/useMaterialGroup";
import { useModal } from "../../../hooks/useModal";

export const useListMaterialGroup = () => {
  const [rangePickerValue, setRangePickerValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState(null);

  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  // Parse date range
  const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
  const dateFrom = dateRange[0] || undefined;
  const dateTo = dateRange[1] || undefined;
  const [loaiTk, setLoaiTk] = useState("");

  // Query params
  const queryParams = {
    search: searchValue || undefined,
    dateFrom,
    dateTo,
    page: currentPage,
    limit: 15,
    nh_tk: loaiTk || undefined,
  };

  // Fetch data
  const { data: materialGroupsData, isLoading, error, refetch } = useMaterialGroups(queryParams);
  const deleteMaterialGroupMutation = useDeleteMaterialGroup();

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    materialGroup: null,
  });

  // Edit confirmation state
  const [confirmEdit, setConfirmEdit] = useState({
    open: false,
    materialGroup: null,
  });

  const handleSaveCreate = () => {
    closeModalCreate();
  };

  const handleSaveEdit = () => {
    closeModalEdit();
  };

  const handleEditMaterialGroup = (record) => {
    setConfirmEdit({
      open: true,
      materialGroup: record,
    });
  };

  const confirmEditMaterialGroup = () => {
    setSelectedMaterialGroup(confirmEdit.materialGroup);
    setConfirmEdit({ open: false, materialGroup: null });
    openModalEdit();
  };

  const cancelEditMaterialGroup = () => {
    setConfirmEdit({ open: false, materialGroup: null });
  };

  const handleDeleteMaterialGroup = (record) => {
    setConfirmDelete({
      open: true,
      materialGroup: record,
    });
  };

  const confirmDeleteMaterialGroup = async () => {
    try {
      await deleteMaterialGroupMutation.mutateAsync({
        ma_nh: confirmDelete.materialGroup.ma_nh,
        loai_nh: confirmDelete.materialGroup.loai_nh
      });
    } catch (error) {
      console.error("Xoá thất bại:", error);
    } finally {
      setConfirmDelete({ open: false, materialGroup: null });
    }
  };

  const cancelDeleteMaterialGroup = () => {
    setConfirmDelete({ open: false, materialGroup: null });
  };

  const columnsTable = [
    {
      key: "loai_nh",
      title: "Loại nhóm",
      fixed: "left",
      align: "center",
      width: 120,
      render: (_, record) => {
        return <div className="text-center">{record?.loai_nh}</div>;
      },
    },
    {
      key: "ma_nh",
      title: "Mẫu nhóm vật tư",
      fixed: "left",
      width: 300,
      render: (_, record) => {
        return <div className="text-left">{record?.ma_nh}</div>;
      },
    },
    {
      key: "ten_nh",
      title: "Tên nhóm vật tư",
      render: (_, record) => {
        return <div className="text-left">{record?.ten_nh}</div>;
      },
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-3 justify-center">
          <button
            className="text-gray-500 hover:text-amber-500"
            title="Sửa"
            onClick={() => handleEditMaterialGroup(record)}
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleDeleteMaterialGroup(record)}
            className="text-gray-500 hover:text-red-500"
            title="Xoá"
            disabled={deleteMaterialGroupMutation.isLoading}
          >
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleRangePicker = (date) => {
    if (date && date.length === 2) {
      const formattedRange = `${date[0].toLocaleDateString()} to ${date[1].toLocaleDateString()}`;
      setRangePickerValue(formattedRange);
    } else {
      setRangePickerValue("");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  return {

    isOpenCreate,
    isOpenEdit,
    selectedMaterialGroup,
    dataTable: materialGroupsData?.data || [],
    columnsTable,
    pagination: materialGroupsData?.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },
    rangePickerValue,
    searchValue,
    isLoading,
    error,
    isDeleting: deleteMaterialGroupMutation.isLoading,
    openModalCreate,
    closeModalCreate,
    closeModalEdit,
    handleRangePicker,
    handleSearch,
    handleChangePage,
    handleSaveCreate,
    handleSaveEdit,
    refetch,
    loaiTk,
    setLoaiTk,
    confirmDelete,
    confirmDeleteMaterialGroup,
    cancelDeleteMaterialGroup,

    // Edit confirmation
    confirmEdit,
    confirmEditMaterialGroup,
    cancelEditMaterialGroup,
  };
};
