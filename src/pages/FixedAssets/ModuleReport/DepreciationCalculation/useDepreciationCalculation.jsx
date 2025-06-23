import { Eye, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import Badge from "../../../../components/ui/badge/Badge";
import { useModal } from "../../../../hooks/useModal";

export const useDepreciationCalculation = () => {
  const [rangePickerValue, setRangePickerValue] = useState("");
  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

  const handleSaveCreate = () => {
    console.log("Saving changes...");
    closeModalCreate();
  };

  const handleSaveEdit = () => {
    console.log("Saving changes...");
    closeModalEdit();
  };

  const dataTable = [
    {
      id: 1,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Lindsey Curtis",
        role: "Web Designer",
      },
      projectName: "Agency Website",
      team: {
        images: ["/images/user/user-22.jpg", "/images/user/user-23.jpg", "/images/user/user-24.jpg"],
      },
      budget: "3.9K",
      status: "Active",
    },
    {
      id: 2,
      user: {
        image: "/images/user/user-18.jpg",
        name: "Kaiya George",
        role: "Project Manager",
      },
      projectName: "Technology",
      team: {
        images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
      },
      budget: "24.9K",
      status: "Pending",
    },
    {
      id: 3,
      user: {
        image: "/images/user/user-17.jpg",
        name: "Zain Geidt",
        role: "Content Writing",
      },
      projectName: "Blog Writing",
      team: {
        images: ["/images/user/user-27.jpg"],
      },
      budget: "12.7K",
      status: "Active",
    },
    {
      id: 4,
      user: {
        image: "/images/user/user-20.jpg",
        name: "Abram Schleifer",
        role: "Digital Marketer",
      },
      projectName: "Social Media",
      team: {
        images: ["/images/user/user-28.jpg", "/images/user/user-29.jpg", "/images/user/user-30.jpg"],
      },
      budget: "2.8K",
      status: "Cancel",
    },
    {
      id: 5,
      user: {
        image: "/images/user/user-21.jpg",
        name: "Carla George",
        role: "Front-end Developer",
      },
      projectName: "Website",
      team: {
        images: ["/images/user/user-31.jpg", "/images/user/user-32.jpg", "/images/user/user-33.jpg"],
      },
      budget: "4.5K",
      status: "Active",
    },
  ];

  const columnsTable = [
    {
      key: "user",
      title: "Thành viên",
      fixed: "left",
      width: 240,
      render: (val) => {
        return (
          <div className="flex items-center gap-3">
            <img src={val.image} alt={val.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium text-gray-800">{val.name}</div>
              <div className="text-sm text-gray-500">{val.role}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "projectName",
      title: "Dự án",
      fixed: "left",
    },
    {
      key: "team",
      title: "Team",
      render: (val) => (
        <div className="flex -space-x-2">
          {val.images.map((img, index) => (
            <img key={index} src={img} alt={`member-${index}`} className="w-6 h-6 rounded-full border-2 border-white" />
          ))}
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (val) => (
        <Badge size="sm" color={val === "Active" ? "success" : val === "Pending" ? "warning" : "error"}>
          {val}
        </Badge>
      ),
    },
    {
      key: "budget",
      title: "Ngân sách",
    },
    {
      key: "budget",
      title: "Ngân sách",
    },
    {
      key: "budget",
      title: "Ngân sách",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-blue-500" title="Xem chi tiết" onClick={openModalDetail}>
            <Eye size={18} />
          </button>
          <button className="text-gray-500 hover:text-amber-500" title="Sửa" onClick={openModalEdit}>
            <Pencil size={18} />
          </button>
          <button onClick={() => console.log("Xoá:", record)} className="text-gray-500 hover:text-red-500" title="Xoá">
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleRangePicker = (date) => {
    setRangePickerValue(date[0].toLocaleDateString()); // Handle selected date and format it
  };

  const handleChangePage = () => {
    console.log(123123);
  };

  return {
    isOpenCreate,
    isOpenEdit,
    isOpenDetail,
    dataTable,
    columnsTable,
    rangePickerValue,
    openModalCreate,
    closeModalCreate,
    closeModalEdit,
    closeModalDetail,
    handleRangePicker,
    handleChangePage,
    handleSaveCreate,
    handleSaveEdit,
  };
};
