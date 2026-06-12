import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PageTransition from "../Components/PageTransition";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("https://gamingplatform.somee.com/api/Users/signin", {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        toast.success("Success is Login");

        // 🌟 التعديل هنا: قراءة الـ token والـ user مباشرة بعد ما فرشيرناهم في الباك إند
        Cookies.set("token", res.data.token, {
          expires: 7,
          secure: true,
        });

        localStorage.setItem("name", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("profileImg", res.data.user.profileImageUrl);
        localStorage.setItem("friendCode", res.data.user.friendCode);
        setTimeout(() => {
          Navigate("/");
        }, 2500);
      }
    } catch (err) {
      // 🌟 التعديل هنا: قراءة الـ status code الصح في الـ Axios بيكون من err.response
      if (
        err.response &&
        (err.response.status === 404 || err.response.status === 400)
      ) {
        toast.error(
          err.response.data.message || "Check your email or password",
        );
      } else {
        toast.error("Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          Gaming <span className="title-bold">Boi</span>
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        <p className="register-text">
          Do Not Have An Account ?!{" "}
          <Link to={"/register"}>Register With Us Now !</Link>
        </p>
      </div>
    </div></PageTransition>

  );
};

export default Login;
