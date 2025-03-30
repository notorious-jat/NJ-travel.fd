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
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Chatbot/>
      <Router>
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserListPage />} />
          <Route path="/myorders" element={<OrderList />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/city/:id" element={<CityPage />} />
          <Route path="/package/:id" element={<PackagePage />} />
          <Route path="/cities" element={<CityListPage />} />
          <Route path="/cities/create" element={<CreateCityPage />} />
          <Route path="/cities/edit/:id" element={<UpdateCityPage />} />
          <Route path="/cities/package" element={<PackageListPage />} />
          <Route path="/cities/revenue" element={<Revenue />} />
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
