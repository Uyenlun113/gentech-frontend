import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Trash } from "lucide-react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { CalenderIcon } from "../../icons";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import TableBasic from "../tables/BasicTables/BasicTableOne";
import { Tabs } from "../ui/tabs";

export default function GeneralForm() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [message, setMessage] = useState("");

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const [dataTable, setDataTable] = useState([]);

  const handleAddRow = (newRow) => {
    setDataTable((prev) => [
      ...prev,
      {
        ...newRow,
        user: {
          image: "/images/user/default-avatar.jpg",
          name: "Người dùng mới",
          role: "Chưa xác định",
        },
        projectName: "Dự án mới",
        team: { images: [] },
        budget: "0",
        status: "Pending",
      },
    ]);
  };

  const handleDeleteRow = (record) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá dòng "${record.user?.name || record.id}"?`)) {
      setDataTable((prev) => prev.filter((item) => item.id !== record.id));
    }
  };

  const columnsTable = [
    {
      key: "user",
      title: "Thành viên",
      fixed: "left",
      width: 240,
      render: (val) => {
        return (
          <div className="flex items-center gap-3">
            <img
              src={val?.image || "/images/user/default-avatar.jpg"}
              alt={val?.name || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-800">{val?.name || "N/A"}</div>
              <div className="text-sm text-gray-500">{val?.role || "N/A"}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "projectName",
      title: "Dự án",
      defaultValue: "Dự án mới",
      render: (val) => <Input type="text" id="inputTwo" placeholder="info@gmail.com" />,
    },
    {
      key: "team",
      title: "Team",
      defaultValue: "",
      render: (val) => <Input type="text" id="inputTwo" placeholder="info@gmail.com" />,
    },
    {
      key: "status",
      title: "Trạng thái",
      defaultValue: "Pending",
      render: (val) => <Input type="text" id="inputTwo" placeholder="info@gmail.com" />,
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleDeleteRow(record)}
          className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
          title="Xoá dòng"
        >
          <Trash size={18} />
        </button>
      ),
    },
  ];

  const demoTabs = [
    {
      label: "Hạch toán",
      content: (
        <TableBasic
          data={dataTable}
          columns={columnsTable}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          showAddButton={true}
          addButtonText="Thêm dự án mới"
        />
      ),
    },
    {
      label: "Hợp đồng thuế",
      content: (
        <TableBasic
          data={dataTable}
          columns={columnsTable}
          onAddRow={handleAddRow}
          onDeleteRow={handleDeleteRow}
          showAddButton={true}
          addButtonText="Thêm dự án mới"
        />
      ),
    },
  ];

  const handleDateChange = (date) => {
    setDateOfBirth(date[0].toLocaleDateString());
  };

  const handleSelectChange = (value) => {
    console.log("Selected value:", value);
  };

  const handleChangeTab = () => {
    setDataTable([]);
    console.log(object);
  };
  return (
    <>
      <ComponentCard title="Default Inputs">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
          <div>
            <Label>Ngày hạch toán </Label>
            <div className="relative w-full flatpickr-wrapper">
              <Flatpickr
                value={dateOfBirth}
                onChange={handleDateChange}
                options={{
                  dateFormat: "Y-m-d",
                  locale: Vietnamese,
                }}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>Ngày lập chứng từ </Label>
            <div className="relative w-full flatpickr-wrapper">
              <Flatpickr
                value={dateOfBirth}
                onChange={handleDateChange}
                options={{
                  dateFormat: "Y-m-d",
                  locale: Vietnamese,
                }}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>Quyển sổ </Label>
            <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
          </div>
          <div>
            <Label>Số chứng từ</Label>
            <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
          </div>
          <div>
            <Label>Tỷ giá</Label>
            <Input type="text" id="inputTwo" placeholder="info@gmail.com" />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
          </div>
        </div>
        <div>
          <Label>Diễn giải chung</Label>
          <TextArea value={message} onChange={(value) => setMessage(value)} rows={6} />
        </div>
      </ComponentCard>
      <ComponentCard title="Default Inputs">
        <Tabs
          tabs={demoTabs}
          className="bg-white dark:bg-gray-900 rounded-lg border p-6"
          onChangeTab={handleChangeTab}
        />
      </ComponentCard>
    </>
  );
}
