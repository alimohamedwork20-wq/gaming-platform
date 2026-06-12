import React from "react";
import "../Styles/Home.css";
import { FaSearch } from "react-icons/fa";
import MySwiper from "../Components/MySwiper";
import Slider1 from "../Components/Slider";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

export default function Home() {
  return (
    <div className="body-home">
      <div className="home-nav">
        {" "}
        <div className="search">
          <h1 style={{ color: "white", fontSize: "50px" }}>
            First <span style={{ color: "#ff0000" }}>Games</span>
          </h1>
        </div>
        <div className="buttons">
          {Cookies.get("token") ? (
            <button
              onClick={(e) => {
                Cookies.remove("token");
                window.location.reload();
                localStorage.clear();
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to={"/login"}>
                <button>Login</button>
              </Link>
              <Link to={"/register"}>
                <button>Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="swiper">
        <MySwiper></MySwiper>
      </div>

      <div className="slider1">
        <Slider1
          url={"page=1&pageSize=8&genreId=1"}
          title="Top Games for PS5"
        ></Slider1>
      </div>
      <div className="slider2">
        <Slider1
          url={"page=1&pageSize=8&genreId=4"}
          title="Top Games"
        ></Slider1>
      </div>
      <div style={{ paddingBottom: "20px" }} className="slider3">
        <Slider1
          url={"page=1&pageSize=8&genreId=3"}
          title="Top PC Games"
        ></Slider1>
      </div>
    </div>
  );
}
