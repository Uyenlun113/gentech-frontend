import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Eye, FilePlus, Pencil, Search, Trash } from "lucide-react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import ComponentCard from "../../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Pagination from "../../../../components/pagination/Pagination";
import TableBasic from "../../../../components/tables/BasicTables/BasicTableOne";
import Badge from "../../../../components/ui/badge/Badge";
import Button from "../../../../components/ui/button/Button";
import { Modal } from "../../../../components/ui/modal";
import { useModal } from "../../../../hooks/useModal";
import { CalenderIcon } from "../../../../icons";

export default function DepreciationCalculationPage() {
  const [dateRange, setRange] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  const tableData = [
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

  const columns = [
    {
      key: "user",
      title: "Thành viên",
      render: (val: any) => (
        <div className="flex items-center gap-3">
          <img src={val.image} alt={val.name} className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-medium text-gray-800">{val.name}</div>
            <div className="text-sm text-gray-500">{val.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: "projectName",
      title: "Dự án",
    },
    {
      key: "team",
      title: "Team",
      render: (val: any) => (
        <div className="flex -space-x-2">
          {val.images.map((img: string, index: number) => (
            <img key={index} src={img} alt={`member-${index}`} className="w-6 h-6 rounded-full border-2 border-white" />
          ))}
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (val: string) => (
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
      key: "action",
      title: "Thao tác",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-blue-500" title="Xem chi tiết" onClick={openModal}>
            <Eye size={18} />
          </button>
          <button className="text-gray-500 hover:text-amber-500" title="Sửa" onClick={openModal}>
            <Pencil size={18} />
          </button>
          <button onClick={() => console.log("Xoá:", record)} className="text-gray-500 hover:text-red-500" title="Xoá">
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const onPageChange = () => {
    console.log(123123);
  };

  const handleRangeChange = (date: Date[]) => {
    setRange(date[0].toLocaleDateString()); // Handle selected date and format it
  };

  return (
    <>
      <PageMeta title="Bảng tính khấu hao tài sản" description="Bảng tính khấu hao tài sản" />
      <PageBreadcrumb pageTitle="Bảng tính khấu hao tài sản" />
      <div className="space-y-6">
        <ComponentCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Button */}
            <div>
              <Button onClick={openModal} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                Thêm mới
              </Button>
            </div>

            {/* Right: Search + Date Range */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <form className="w-full sm:max-w-xs">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search size={18} className="text-gray-500 dark:text-white/50" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  />
                </div>
              </form>

              {/* Date Range Picker */}
              <div className="relative w-full sm:w-[360px]">
                <Flatpickr
                  value={dateRange}
                  onChange={handleRangeChange}
                  options={{
                    mode: "range",
                    dateFormat: "d/m/Y",
                    locale: Vietnamese,
                  }}
                  placeholder="Chọn khoảng ngày"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <CalenderIcon className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>
          <TableBasic data={tableData} columns={columns} />
          <Pagination currentPage={1} totalItems={80} onPageChange={onPageChange} />
        </ComponentCard>
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <form className="flex flex-col">
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div>
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Social Links</h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Label>Facebook</Label>
                      <Input type="text" value="https://www.facebook.com/PimjoHQ" />
                    </div>

                    <div>
                      <Label>X.com</Label>
                      <Input type="text" value="https://x.com/PimjoHQ" />
                    </div>

                    <div>
                      <Label>Linkedin</Label>
                      <Input type="text" value="https://www.linkedin.com/company/pimjo" />
                    </div>

                    <div>
                      <Label>Instagram</Label>
                      <Input type="text" value="https://instagram.com/PimjoHQ" />
                    </div>
                  </div>
                </div>
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Personal Information
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>First Name</Label>
                      <Input type="text" value="Musharof" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Last Name</Label>
                      <Input type="text" value="Chowdhury" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Email Address</Label>
                      <Input type="text" value="randomuser@pimjo.com" />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Phone</Label>
                      <Input type="text" value="+09 363 398 46" />
                    </div>

                    <div className="col-span-2">
                      <Label>Bio</Label>
                      <Input type="text" value="Team Manager" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
}
