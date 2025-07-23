import { Route, BrowserRouter as Router, Routes } from "react-router";
import PrivateRoute from "./components/auth/PrivateRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";

import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Blank from "./pages/Blank";
import Calendar from "./pages/Calendar";
import CashPage from "./pages/Cash/Cash";
import ListCustomerPage from "./pages/category/customer/ListCustomer";

import ListMaterialPage from "./pages/category/dmvt/ListMaterial";

import ListCustomerGroupPage from "./pages/category/dmnhkh/ListCustomerGroupPage";
import ListMaterialGroupPage from "./pages/category/material-group/ListMaterialGroup";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import CostingPage from "./pages/Costing/Costing";
import Home from "./pages/Dashboard/Home";
import DepreciationReportPage from "./pages/FixedAssets/DepreciationReport/DepreciationReport";
import DepreciationCalculationPage from "./pages/FixedAssets/ModuleReport/DepreciationCalculation/DepreciationCalculation";
import ModuleReportPage from "./pages/FixedAssets/ModuleReport/ModuleReport";
import FormElements from "./pages/Forms/FormElements";
import GeneralLedgerListPage from "./pages/GeneralLedger/GeneralLedgerList/GeneralLedgerList";
import ImportExcelPage from "./pages/ImportExcel/ImportExcel";
import InventoryPage from "./pages/Inventory/Inventory";
import NotFound from "./pages/OtherPage/NotFound";
import PayrollPage from "./pages/Payroll/Payroll";
import PurchasesPage from "./pages/Purchases/Purchases";
import SalesPage from "./pages/Sales/Sales";

import CashCapitalPage from "./pages/Cash Capital/CashCapitalPage";
import Ct46ListPage from "./pages/Cash Capital/PaymentVoucher/Ct46ListPage";
import ListAccountPage from "./pages/category/account/ListAccount";
import ListWarehousePage from "./pages/category/dmkho/ListWarehousePage";
import GiayBaoCoList from "./pages/gb-co-nganhang/GiayBaoCoList";
import GiayBaoNoList from "./pages/gb-no-nganhang/GiayBaoNoList";
import GeneralLedgerPage from "./pages/GeneralLedger/GeneralLedgerPage";
import PhieuMuaListPage from "./pages/phieu-mua/PhieuMuaListPage";
import PhieuNhapKhoList from "./pages/phieu-nhap-kho/PhieuNhapKhoList";
import PhieuXuatDcListPage from "./pages/phieu-xuat-dc/PhieuXuatDcListPage";
import PhieuXuatKhoList from "./pages/phieu-xuat-kho/PhieuXuatKhoList";
import QuickReport from "./pages/Quick Report/QuickReport";
import SoDuDauKyTable from "./pages/Sddk/SoDuDauKyTable";
import CashReceiptList from "./pages/SupportingDocuments/CashReceipt/CashReceiptList";
import SystemPage from "./pages/System/System";
import BasicTables from "./pages/Tables/BasicTables";
import CdvtListPage from "./pages/TonkhoDK/CdvtListPage";
import ToolsPage from "./pages/Tools/Tools";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";
import DonHangMuaList from "./pages/don-hang-mua/DonHangMuaList";


export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<PrivateRoute />}>
            {/* Dashboard Layout */}
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              {/* danh mục đối tượng */}
              <Route path="/category/customer" element={<ListCustomerPage />} />
              {/* danh mục tài khoản */}
              <Route path="/category/account" element={<ListAccountPage />} />
              {/* danh mục vật tư */}
              <Route path="/category/dmvt" element={<ListMaterialPage />} />
              {/* danh mục nhóm vật tư */}
              <Route path="/category/material-group" element={<ListMaterialGroupPage />} />
              {/* danh mục nhóm đối tượng */}
              <Route path="/category/dmnhkh" element={<ListCustomerGroupPage />} />
              {/* danh mục kho */}
              <Route path="/category/dmkho" element={<ListWarehousePage />} />
              {/* Báo cáo nhanh */}
              <Route path="/quick-report" element={<QuickReport />} />
              {/* Phiếu kế toán */}
              <Route path="/general-ledger" element={<GeneralLedgerPage />} />

              <Route path="/general-ledger/list" element={<GeneralLedgerListPage />} />
              {/* Vốn bằng tiền */}
              <Route path="/cash-receipt" element={<CashCapitalPage />} />
              {/* Phiếu chi tiền mặt */}
              <Route path="/phieu-chi-tien-mat" element={<Ct46ListPage />} />

              {/* Giáy bao cố ngan hang */}
              <Route path="/dau-ky/sodu-tk/table" element={<SoDuDauKyTable />} />

              <Route path="/tonkho-dk" element={<CdvtListPage />} />

              <Route path="/phieu-xuat-dc" element={<PhieuXuatDcListPage />} />

              <Route path="/phieu-mua" element={<PhieuMuaListPage />} />
              {/* Cash Page */}
              <Route path="/cash" element={<CashPage />} />
              {/* Purchases Page */}
              <Route path="/purchases" element={<PurchasesPage />} />
              {/* Sales Page */}
              <Route path="/sales" element={<SalesPage />} />
              {/* Inventory Page */}
              <Route path="/inventory" element={<InventoryPage />} />
              {/* Fixed Assets Page */}
              <Route path="/fixed-assets/module-report" element={<ModuleReportPage />} />
              <Route path="/fixed-assets/depreciation-report" element={<DepreciationReportPage />} />
              <Route
                path="/fixed-assets/module-report/depreciation-calculation"
                element={<DepreciationCalculationPage />}
              />
              {/* Tools Page */}
              <Route path="/tools" element={<ToolsPage />} />
              {/* Payroll Page */}
              <Route path="/payroll" element={<PayrollPage />} />
              {/* Costing Page */}
              <Route path="/costing" element={<CostingPage />} />
              {/* General Ledger Page */}

              {/* Import Excel Page */}
              <Route path="/import-excel" element={<ImportExcelPage />} />
              {/* System Page */}
              <Route path="/system" element={<SystemPage />} />
              {/* Others Page */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />
              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />
              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />
              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />

              {/* SupportingDocuments */}

              {/* CashReceip */}
              <Route path="/chung-tu/phieu-thu" element={<CashReceiptList />} />
              <Route path="/chung-tu/bao-co" element={<GiayBaoCoList />} />
              <Route path="/chung-tu/bao-no" element={<GiayBaoNoList />} />
              <Route path="/chung-tu/phieu-nhap-kho" element={<PhieuNhapKhoList />} />
              <Route path="/chung-tu/phieu-xuat-kho" element={<PhieuXuatKhoList />} />
              <Route path="/chung-tu/don-dat-hang-mua" element={<DonHangMuaList />} />

            </Route>
          </Route>
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

