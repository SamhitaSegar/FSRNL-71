import { Route, Routes, useLocation } from "react-router-dom";
import Cart from "./components/Cart.jsx";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!isAuthRoute && <Footer />}
    </>
  );
}
