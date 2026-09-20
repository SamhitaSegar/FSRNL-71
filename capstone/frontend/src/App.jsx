import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cart from "./components/Cart.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Checkout from "./pages/Checkout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Signup from "./pages/Signup.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageKitchen from "./pages/admin/ManageKitchen.jsx";
import ManageMenu from "./pages/admin/ManageMenu.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";

export default function App() {
  const { pathname } = useLocation();
  // hide the public navbar/footer on auth screens and the admin area
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isAdminRoute = pathname.startsWith("/admin");
  const hideChrome = isAuthRoute || isAdminRoute;

  return (
    <>
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin area with nested routes rendered inside AdminDashboard */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Navigate to="kitchens" replace />} />
          <Route path="kitchens" element={<ManageKitchen />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
      {!hideChrome && <Footer />}
    </>
  );
}
