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
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import CostingPage from "./pages/Costing/Costing";
import Home from "./pages/Dashboard/Home";
import DepreciationReportPage from "./pages/FixedAssets/DepreciationReport/DepreciationReport";
import DepreciationCalculationPage from "./pages/FixedAssets/ModuleReport/DepreciationCalculation/DepreciationCalculation";
import ModuleReportPage from "./pages/FixedAssets/ModuleReport/ModuleReport";
import FormElements from "./pages/Forms/FormElements";
import GeneralLedgerCreate from "./pages/GeneralLedger/GeneralLedgerCreate";
import GeneralLedgerListPage from "./pages/GeneralLedger/GeneralLedgerList/GeneralLedgerList";
import ImportExcelPage from "./pages/ImportExcel/ImportExcel";
import InventoryPage from "./pages/Inventory/Inventory";
import NotFound from "./pages/OtherPage/NotFound";
import PayrollPage from "./pages/Payroll/Payroll";
import PurchasesPage from "./pages/Purchases/Purchases";
import SalesPage from "./pages/Sales/Sales";
import SystemPage from "./pages/System/System";
import BasicTables from "./pages/Tables/BasicTables";
import ToolsPage from "./pages/Tools/Tools";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";
import GeneralLedgerUpdate from "./pages/GeneralLedger/GeneralLedgerList/GeneralLedgerEdit";

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
              <Route path="/category/customer" element={<ListCustomerPage />} />
              {/* Dashboard Page */}
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
              <Route path="/general-ledger/create" element={<GeneralLedgerCreate />} />
              <Route path="/general-ledger/update/:stt_rec" element={<GeneralLedgerUpdate />} />
              <Route path="/general-ledger/list" element={<GeneralLedgerListPage />} />

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
