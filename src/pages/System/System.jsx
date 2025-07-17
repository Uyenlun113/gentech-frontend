import { Archive, Calendar, CheckCircle, Database, Edit, FileText, Image, Layers, RotateCcw, Settings, Share2, Users } from 'lucide-react';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const SystemModuleCard = ({ icon: Icon, title, description, onClick, color }) => (
  <div
    className={`bg-gradient-to-br ${color.gradient} rounded-lg shadow-md border border-white/30 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group aspect-square w-28 h-28`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center justify-center text-center h-full space-y-1.5">
      <div className={`p-1.5 ${color.iconBg} rounded group-hover:scale-105 transition-transform duration-200`}>
        <Icon className={`w-5 h-5 ${color.icon}`} />
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

export default function SystemPage() {
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
      icon: Edit,
      title: "Khai báo tham số chứng từ",
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
    // Thêm logic xử lý khi click vào module
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
    </div>
  );
}