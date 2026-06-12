import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
export default function ProtectedRoute() {
  // التشيك على الـ Token في الـ LocalStorage (أو الـ State حسب نظامك)
  const token = Cookies.get("token"); 

  // لو الـ Token موجود، أظهر الشاشة المطلوبة (Outlet)، لو مش موجود رجعه لصفحة الـ login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}