import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../Components/PageTransition";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rpassword, setRPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const Navigate = useNavigate();
  const RemoveImg = () => {
    setImageFile(null);
    setImagePreview("");
  };
  // دالة التعامل مع اختيار الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // عمل رابط معاينة للمتصفح
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== rpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      // طالما في ملف (صورة) بنشحن البيانات في FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      // ✅ تعديل الرابط ليكون Register وبعت الـ FormData
      const res = await axios.post(
        "https://gamingplatform.somee.com/api/Users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Success is Register");
      setTimeout(() => {
        Navigate("/login"); // بعد ما يسجل يروح للوجن
      }, 2500);
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("Email already exists or invalid data");
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>    <div className="register-container">
        <div className="register-card">
          <h2 className="login-title">
            Gaming <span className="title-bold">Boi</span>
          </h2>

        <form onSubmit={handleSubmit} className="register-form">
          {/* 📸 الـ Media Group اللي بتعرض الصورة المرفوعة */}
          <div
            className="media-group"
            style={{
              backgroundImage: imagePreview
                ? `url(${imagePreview})`
                : undefined,
            }}
          >
            <label htmlFor="img" className="upload-label">
              {imagePreview ? "Change Image" : "Select Profile Image"}
            </label>

            <input
              id="img"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          {imagePreview ? (
            <label
              style={{ transform: "translateY(-30%)" }}
              onClick={RemoveImg}
              className="upload-label"
            >
              remove image
            </label>
          ) : (
            ""
          )}
          <div className="input-group">
            <label>Name </label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={rpassword}
              onChange={(e) => setRPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        <p className="register-text">
          Already Have An Account ?!{" "}
          <Link to={"/login"}>Login With Us Now !</Link>
        </p>
      </div>
    </div></PageTransition>
  
  );
};

export default Register;
