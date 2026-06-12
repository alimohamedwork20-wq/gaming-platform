import "./App.css";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import Category from "./Pages/Category";
import Games from "./Pages/Games";
import Wishlist from "./Pages/Wishlist";
import Friends from "./Pages/Friends";
import Profile from "./Pages/Profile";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; // 👈 استيراد حاوية الأنميشن
import GamesCategory from "./Pages/GamesCategory";
import GameDetails from "./Pages/GameDetails";
import Login from "./Auth/SignIn";
import { Toaster } from "react-hot-toast";
import Register from "./Auth/Register";
import ProtectedRoute from "./Components/ProtectedRoute";

// 🎛️ 1. المكون الداخلي لإدارة الحركات والمسارات
function AnimatedRoutes() {
  const location = useLocation(); // 👈 لقطة سحرية عشان الأنميشن يحس بتغير الـ Path

  return (
    // mode="wait" عشان يستنى الصفحة اللي ماشية تختفي الأول قبل ما يدخل الجديدة
    <AnimatePresence mode="wait">
      {/* باصينا الـ location والـ key للـ Routes عشان Framer Motion يفهم التغيير */}
      <Routes location={location} key={location.pathname}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Redirect "/" -> "/home" */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* الـ Dashboard كأب والمسارات جواه */}
        <Route path="/" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="category" element={<Category />} />
          <Route path="games" element={<Games />} />
          <Route path="games/:id" element={<GamesCategory />} />
          <Route path="game/details/:slug" element={<GameDetails />} />
          
          {/* حماية مسارات الأصدقاء، الويش ليست، والبروفايل */}
          <Route element={<ProtectedRoute />}>
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="friends" element={<Friends />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

// 🏢 2. المكون الرئيسي للأبلكيشن
function App() {
  return (
    <BrowserRouter>
      {/* التوست شغال في السقف فوق الكل */}
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* نداء مكون المسارات المتحركة جوه الـ Router بأمان */}
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;