import { Archive, BookOpenCheck, Calendar, CheckCircle, Database, Edit, FileText, Image, Layers, RotateCcw, Settings, Share2, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { useListDmstt, useUpdateDmstt } from '../../hooks/useDmstt';

// Modal Component - Đã sửa
const KhaiBaoKiMoSoModal = ({ isOpen, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');

  const { data: dmsttData, isLoading } = useListDmstt();
  const { mutate: updateDmstt, isPending } = useUpdateDmstt();

  useEffect(() => {
    if (isOpen && dmsttData?.length > 0 && dmsttData[0]?.ngay_ky1) {
      const currentYear = new Date(dmsttData[0].ngay_ky1).getFullYear();
      setSelectedYear(currentYear);
      setSelectedDate(getDateForPeriod(currentYear, selectedPeriod));
    }
  }, [isOpen, dmsttData]);
  useEffect(() => {
    setSelectedDate(getDateForPeriod(selectedYear, selectedPeriod));
  }, [selectedYear, selectedPeriod]);
  const getDateForPeriod = (year, period) => {
    const month = period.toString().padStart(2, '0');
    return `01-${month}-${year}`;
  };

  const handleSubmit = () => {
    let dateToSubmit;
    if (selectedDate) {
      const [day, month, year] = selectedDate.split('-').map(num => parseInt(num));
      dateToSubmit = new Date(year, month - 1, day);
    } else {
      dateToSubmit = new Date(selectedYear, selectedPeriod - 1, 1);
    }

    const updateData = {
      ngay_ky1: dateToSubmit
    };

    updateDmstt({
      stt_rec: dmsttData?.[0]?.stt_rec || 1,
      data: updateData
    });

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-md">
        {/* Header */}
        <div className="bg-blue-200 text-black px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpenCheck className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Khai báo kỳ mở sổ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-blue-50">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {/* Năm */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Năm
                </label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right "
                  min="2020"
                  max="2030"
                />
              </div>

              {/* Kỳ */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kỳ
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                    className="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    min="1"
                    max="12"
                  />
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-center"
                    placeholder="dd-mm-yyyy"
                    disabled
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-blue-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Đang xử lý...' : 'Nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};
// SystemModuleCard Component
const SystemModuleCard = ({ icon: Icon, title, description, onClick, color }) => (
  <div
    className={`bg-gradient-to-br ${color.gradient} rounded-lg shadow-md border border-white/30 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group aspect-square w-28 h-28`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center justify-center text-center h-full space-y-1.5">
      <div className={`p-1.5 ${color.iconBg} rounded group-hover:scale-105 transition-transform duration-200`}>
        <Icon className={`w-8 h-8 ${color.icon}`} />
      </div>
      <div>
        <h3 className={`font-medium ${color.text} text-xs leading-tight`}>{title}</h3>
        {description && (
          <p className={`text-xs ${color.textSecondary} mt-1`}>{description}</p>
        )}
      </div>
    </div>
  </div>
);

// Main SystemPage Component
export default function SystemPage() {
  const [isKhaiBaoKiMoSoModalOpen, setIsKhaiBaoKiMoSoModalOpen] = useState(false);

  const colors = [
    { gradient: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-100', icon: 'text-blue-600', text: 'text-blue-800', textSecondary: 'text-blue-600' },
    { gradient: 'from-purple-50 to-purple-100', iconBg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-800', textSecondary: 'text-purple-600' },
    { gradient: 'from-pink-50 to-pink-100', iconBg: 'bg-pink-100', icon: 'text-pink-600', text: 'text-pink-800', textSecondary: 'text-pink-600' },
    { gradient: 'from-indigo-50 to-indigo-100', iconBg: 'bg-indigo-100', icon: 'text-indigo-600', text: 'text-indigo-800', textSecondary: 'text-indigo-600' },
    { gradient: 'from-teal-50 to-teal-100', iconBg: 'bg-teal-100', icon: 'text-teal-600', text: 'text-teal-800', textSecondary: 'text-teal-600' },
    { gradient: 'from-green-50 to-green-100', iconBg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-800', textSecondary: 'text-green-600' },
    { gradient: 'from-orange-50 to-orange-100', iconBg: 'bg-orange-100', icon: 'text-orange-600', text: 'text-orange-800', textSecondary: 'text-orange-600' },
    { gradient: 'from-red-50 to-red-100', iconBg: 'bg-red-100', icon: 'text-red-600', text: 'text-red-800', textSecondary: 'text-red-600' },
    { gradient: 'from-cyan-50 to-cyan-100', iconBg: 'bg-cyan-100', icon: 'text-cyan-600', text: 'text-cyan-800', textSecondary: 'text-cyan-600' },
    { gradient: 'from-emerald-50 to-emerald-100', iconBg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-800', textSecondary: 'text-emerald-600' },
    { gradient: 'from-violet-50 to-violet-100', iconBg: 'bg-violet-100', icon: 'text-violet-600', text: 'text-violet-800', textSecondary: 'text-violet-600' },
    { gradient: 'from-rose-50 to-rose-100', iconBg: 'bg-rose-100', icon: 'text-rose-600', text: 'text-rose-800', textSecondary: 'text-rose-600' },
    { gradient: 'from-amber-50 to-amber-100', iconBg: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-800', textSecondary: 'text-amber-600' },
    { gradient: 'from-lime-50 to-lime-100', iconBg: 'bg-lime-100', icon: 'text-lime-600', text: 'text-lime-800', textSecondary: 'text-lime-600' },
    { gradient: 'from-sky-50 to-sky-100', iconBg: 'bg-sky-100', icon: 'text-sky-600', text: 'text-sky-800', textSecondary: 'text-sky-600' }
  ];

  const systemModules = [
    {
      icon: Settings,
      title: "Khai báo tham số hệ thống",
      description: null
    },
    {
      icon: BookOpenCheck,
      title: "Khai báo kì mở sổ",
      description: null
    },
    {
      icon: CheckCircle,
      title: "Kiểm tra số liệu",
      description: null
    },
    {
      icon: Users,
      title: "Quản lý người sử dụng",
      description: null
    },
    {
      icon: FileText,
      title: "Nhật ký sử dụng chương trình",
      description: null
    },
    {
      icon: RotateCcw,
      title: "Nhật ký cập nhật (Update) chương trình",
      description: null
    },
    {
      icon: Image,
      title: "Sao chép số liệu",
      description: null
    },
    {
      icon: Share2,
      title: "Truyền nhận dữ liệu",
      description: null
    },
    {
      icon: Settings,
      title: "Công việc",
      description: null
    },
    {
      icon: Layers,
      title: "Cài đặt phông chữ",
      description: null
    },
    {
      icon: Settings,
      title: "Chọn đơn vị cơ sở",
      description: null
    },
    {
      icon: Edit,
      title: "Chọn năm làm việc & khóa dữ liệu",
      description: null
    },
    {
      icon: Calendar,
      title: "Tạo năm làm việc mới",
      description: null
    },
    {
      icon: Database,
      title: "Chuyển số dư sang năm sau",
      description: null
    },
    {
      icon: Archive,
      title: "Dọn dẹp số liệu & reindex",
      description: null
    }
  ];

  const handleModuleClick = (moduleTitle) => {
    console.log(`Clicked on: ${moduleTitle}`);

    // Xử lý mở modal cho "Khai báo kì mở sổ"
    if (moduleTitle === "Khai báo kì mở sổ") {
      setIsKhaiBaoKiMoSoModalOpen(true);
    }

    // Thêm logic xử lý cho các module khác
  };

  return (
    <div className="px-6">
      <PageMeta title="Hệ thống" description="Hệ thống" />
      <PageBreadcrumb pageTitle="Hệ thống" />
      <div className="grid grid-cols-5 gap-14 px-8 pt-20 justify-items-center">
        {systemModules.map((module, index) => (
          <SystemModuleCard
            key={index}
            icon={module.icon}
            title={module.title}
            description={module.description}
            color={colors[index % colors.length]}
            onClick={() => handleModuleClick(module.title)}
          />
        ))}
      </div>

      {/* Modal Khai báo kì mở sổ */}
      <KhaiBaoKiMoSoModal
        isOpen={isKhaiBaoKiMoSoModalOpen}
        onClose={() => setIsKhaiBaoKiMoSoModalOpen(false)}
      />
    </div>
  );
}