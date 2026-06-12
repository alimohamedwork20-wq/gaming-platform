import React, { useState, useRef } from "react";
import Axios from "../Api/Axios";
import toast from "react-hot-toast";
import PageTransition from "../Components/PageTransition";
import { FaCamera, FaUser, FaLock, FaSave } from "react-icons/fa";
import "../Styles/Profile.css";
import { MdEmail } from "react-icons/md";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // States for user data
  const [userData, setUserData] = useState({
    name: localStorage.getItem("name") || "", // 🌟 تم توحيد المفتاح هنا ليطابق الـ localStorage بالأسفل
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [previewImage, setPreviewImage] = useState(localStorage.getItem("profileImg") || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Unified change handler
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. التحقق من طول كلمة السر الجديدة (يجب ألا تقل عن 8 حروف لو كُتبت)
      if (userData.newPassword) {
        if (userData.newPassword.length < 8) {
          toast.error("Password must be at least 8 characters long!");
          setLoading(false);
          return;
        }

        // 2. التحقق من تطابق كلمة السر الجديدة مع التأكيد
        if (userData.newPassword !== userData.confirmPassword) {
          toast.error("Passwords do not match!");
          setLoading(false);
          return;
        }

        // 3. التأكد من إدخال كلمة السر الحالية لإتمام التغيير للأمان
        if (!userData.currentPassword) {
          toast.error("Please enter your current password to update security settings!");
          setLoading(false);
          return;
        }
      }

      // 🌟 تعديل المسار لـ Users بدلاً من Auth تماشياً مع الـ UsersController
      await Axios.put("/Users/update-profile", {
        name: userData.name,
        currentPassword: userData.currentPassword,
        newPassword: userData.newPassword
      });

      // 🌟 رفع الصورة إلى Cloudinary عبر الـ EndPoint الجديدة في الـ UsersController
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const imgRes = await Axios.post("/Users/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        
        // حفظ رابط الـ Cloudinary الراجع من السيرفر في الـ LocalStorage
        localStorage.setItem("profileImg", imgRes.data.url);
      }

      // حفظ الاسم الجديد في الـ LocalStorage
      localStorage.setItem("name", userData.name);
      setTimeout(() => {window.location.reload(); }, 2000); // تأخير بسيط قبل إعادة تحميل الصفحة
      toast.success("Profile updated successfully! 🔥");
      // إعادة تحميل الصفحة لتحديث البيانات المعروضة
      // تصفير حقول الباسورد بعد النجاح
      setUserData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="profile-page-container">
        <div className="profile-card">
          <h2 style={{ color: "white", marginBottom: "30px", textAlign: "center" }}>
            👤 My Gamer Identity
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="profile-grid">
            {/* Avatar Section */}
            <div className="avatar-section">
              <div className="avatar-wrapper">
                <img 
                  src={previewImage || "https://api.dicebear.com/7.x/bottts/svg"} 
                  className="avatar-img" 
                  alt="Profile" 
                />
              </div>
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*"
              />
              <button 
                type="button" 
                className="upload-btn" 
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera /> Change Avatar
              </button>
            </div>

            {/* Form Section */}
            <div className="form-section">
              {/* Display Name Input */}
              <div className="input-group">
                <label><FaUser /> Display Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userData.name} 
                  onChange={handleChange} 
                  placeholder="Enter your name"
                   
                />
              </div>

              <hr style={{ border: "0.5px solid rgba(255,255,255,0.1)" }} />
              
              {/* Email Input (Read Only) */}
              <div className="input-group">
                <label><MdEmail /> Display Email</label>
                <input 
                  disabled
                  type="text" 
                  name="email" 
                  value={localStorage.getItem("email") || ""} 
                  style={{ backgroundColor: "#33333338", color: "#919191", cursor: "not-allowed" }}
                  placeholder="Enter your email"
                />
              </div>

              <hr style={{ border: "0.5px solid rgba(255,255,255,0.1)" }} />

              {/* Current Password Input */}
              <div className="input-group">
                <label><FaLock /> Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={userData.currentPassword}
                  onChange={handleChange} 
                  placeholder="••••••••"
                />
              </div>

              {/* New Password Input */}
              <div className="input-group">
                <label><FaLock /> New Password (Optional)</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={userData.newPassword}
                  onChange={handleChange} 
                  placeholder="Minimum 8 characters"
                />
              </div>

              {/* Confirm Password Input */}
              <div className="input-group">
                <label><FaLock /> Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={userData.confirmPassword}
                  onChange={handleChange} 
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}