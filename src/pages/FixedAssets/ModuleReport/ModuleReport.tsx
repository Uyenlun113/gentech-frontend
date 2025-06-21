import {
  BarChart2,
  BookMarked,
  ClipboardList,
  FileBarChart2,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Layers,
  LayoutList,
  NotebookPen,
  PieChart,
} from "lucide-react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ListWithButton, { ListItem } from "../../../components/list/ListWithButton";

export default function ModuleReportPage() {
  const listItems: ListItem[] = [
    {
      id: "depreciation-calculation",
      icon: <FileBarChart2 className="w-5 h-5" />,
      label: "Bảng tính khấu hao tài sản",
      path: "/fixed-assets/module-report/depreciation-calculation",
      isLink: true,
    },
    {
      id: "depreciation-source",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      label: "Bảng tính khấu hao theo nguồn vốn [Cột]",
      path: "/fixed-assets/module-report/depreciation-source",
      isLink: true,
    },
    {
      id: "depreciation-report-1",
      icon: <FileText className="w-5 h-5" />,
      label: "Bảng phân bổ khấu hao tài sản (Mẫu 1)",
      path: "/fixed-assets/module-report/depreciation-report-1",
      isLink: true,
    },
    {
      id: "depreciation-report-2",
      icon: <FileText className="w-5 h-5" />,
      label: "Bảng phân bổ khấu hao tài sản (Mẫu 2)",
      path: "/fixed-assets/module-report/depreciation-report-2",
      isLink: true,
    },
    {
      id: "depreciation-details",
      icon: <LayoutList className="w-5 h-5" />,
      label: "Bảng chi tiết phân bổ khấu hao tài sản",
      path: "/fixed-assets/module-report/depreciation-details",
      isLink: true,
    },
    {
      id: "depreciation-summary",
      icon: <PieChart className="w-5 h-5" />,
      label: "Bảng tổng hợp trích khấu hao cơ bản tài sản",
      path: "/fixed-assets/module-report/depreciation-summary",
      isLink: true,
    },
    {
      id: "increase-decrease",
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Báo cáo tăng giảm tài sản",
      path: "/fixed-assets/module-report/increase-decrease",
      isLink: true,
    },
    {
      id: "increase-decrease-source",
      icon: <BookMarked className="w-5 h-5" />,
      label: "Báo cáo tăng giảm tài sản theo nguồn vốn [Cột]",
      path: "/fixed-assets/module-report/increase-decrease-source",
      isLink: true,
    },
    {
      id: "increase-summary",
      icon: <Layers className="w-5 h-5" />,
      label: "Bảng tổng hợp tình hình tăng giảm tài sản",
      path: "/fixed-assets/module-report/increase-summary",
      isLink: true,
    },
    {
      id: "increase-report-1",
      icon: <FileText className="w-5 h-5" />,
      label: "Báo cáo tăng giảm tài sản (Mẫu 1 - Theo tài khoản)",
      path: "/fixed-assets/module-report/increase-report-1",
      isLink: true,
    },
    {
      id: "increase-report-2",
      icon: <FileText className="w-5 h-5" />,
      label: "Báo cáo tăng giảm tài sản (Mẫu 2 - Theo nguồn vốn)",
      path: "/fixed-assets/module-report/increase-report-2",
      isLink: true,
    },
    {
      id: "asset-card",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "Thẻ tài sản",
      path: "/fixed-assets/module-report/asset-card",
      isLink: true,
    },
    {
      id: "asset-book",
      icon: <FileCheck2 className="w-5 h-5" />,
      label: "Sổ tài sản",
      path: "/fixed-assets/module-report/asset-book",
      isLink: true,
    },
    {
      id: "asset-summary",
      icon: <NotebookPen className="w-5 h-5" />,
      label: "Báo cáo tổng hợp tài sản",
      path: "/fixed-assets/module-report/asset-summary",
      isLink: true,
    },
    {
      id: "asset-summary-source",
      icon: <BookMarked className="w-5 h-5" />,
      label: "Báo cáo tổng hợp tài sản theo nguồn vốn [Cột]",
      path: "/fixed-assets/module-report/asset-summary-source",
      isLink: true,
    },
    {
      id: "asset-detail",
      icon: <FileText className="w-5 h-5" />,
      label: "Báo cáo chi tiết tài sản",
      path: "/fixed-assets/module-report/asset-detail",
      isLink: true,
    },
    {
      id: "asset-check",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "Báo cáo chi tiết kiểm kê tài sản",
      path: "/fixed-assets/module-report/asset-check",
      isLink: true,
    },
    {
      id: "asset-check-source",
      icon: <FileSpreadsheet className="w-5 h-5" />,
      label: "Báo cáo kiểm kê tài sản theo nguồn vốn [Cột]",
      path: "/fixed-assets/module-report/asset-check-source",
      isLink: true,
    },
    {
      id: "asset-overview",
      icon: <FileBarChart2 className="w-5 h-5" />,
      label: "Bảng tổng hợp tình hình tài sản",
      path: "/fixed-assets/module-report/asset-overview",
      isLink: true,
    },
    {
      id: "custom-report",
      icon: <FileText className="w-5 h-5" />,
      label: "Bảng kê chứng từ (Người dùng định nghĩa)",
      path: "/fixed-assets/module-report/custom-report",
      isLink: true,
    },
  ];

  return (
    <>
      <PageMeta title="Báo cáo phân hệ" description="Báo cáo phân hệ" />
      <PageBreadcrumb pageTitle="Báo cáo phân hệ" />
      <div className="space-y-6">
        <ListWithButton items={listItems} />

        {/* <ComponentCard title="Báo cáo phân hệ"></ComponentCard> */}
      </div>
    </>
  );
}
