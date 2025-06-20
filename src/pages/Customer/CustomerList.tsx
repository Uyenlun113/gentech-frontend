import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function CustomerList() {
  return (
    <>
      <PageMeta title="Danh mục khách hàng" description="Danh mục khách hàng" />
      <PageBreadcrumb pageTitle="Danh mục khách hàng" />
      <div className="space-y-6">
        <ComponentCard title="Tìm kiếm ">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
