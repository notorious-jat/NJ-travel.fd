// src/App.js
import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CityPage from "./pages/CityPage";
import PackagePage from "./pages/PackagePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CityListPage from "./pages/CityListPage";
import CreateCityPage from "./pages/CreateCityPage";
import UpdateCityPage from "./pages/UpdateCityPage";
import PackageListPage from "./pages/PackageListPage";
import CreatePackagePage from "./pages/CreatePackagePage";
import EditPackagePage from "./pages/EditPackagePage";
import RegisterPage from "./pages/RegistrationPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderList from "./pages/OrderList";
import Revenue from "./pages/Revenue";
import UserListPage from "./pages/UserListPage";
import Explore from "./pages/Explore";
import OrderDetail from "./pages/OrderDetail";
import RevenueDetails from "./pages/RevenueDetails";
import RevenueReport from "./pages/Report";
import ReportDetailPage from "./pages/TravelPackageReportDetail";
import UserReport from "./pages/UserReport";
import VendorReport from "./pages/VendorReport";
import UserReportDetails from "./pages/UserReportDetails";
import VendorReportDetails from "./pages/VendorReportDetails";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/explore" element={<Explore/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserListPage />} />
          <Route path="/myorders" element={<OrderList />} />
          <Route path="/myorders/:id" element={<OrderDetail />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/city/:id" element={<CityPage />} /> */}
          <Route path="/package/:id" element={<PackagePage />} />
          <Route path="/cities" element={<CityListPage />} />
          <Route path="/cities/create" element={<CreateCityPage />} />
          <Route path="/cities/edit/:id" element={<UpdateCityPage />} />
          <Route path="/cities/package" element={<PackageListPage />} />
          <Route path="/cities/revenue" element={<Revenue />} />
          <Route path="/cities/revenue/:id" element={<RevenueDetails/>}/>
          <Route path="/cities/package/report" element={<RevenueReport />} />
          <Route path="/cities/package/report/:id" element={<ReportDetailPage />} />
          <Route path="/cities/user/report" element={<UserReport />} />
          <Route path="/cities/user/report/:id" element={<UserReportDetails />} />
          <Route path="/cities/vendor/report" element={<VendorReport />} />
          <Route path="/cities/vendor/report/:id" element={<VendorReportDetails />} />
          <Route
            path="/cities/package/create"
            element={<CreatePackagePage />}
          />
          <Route
            path="/cities/package/edit/:id"
            element={<EditPackagePage />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
