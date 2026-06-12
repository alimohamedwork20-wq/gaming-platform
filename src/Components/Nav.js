import React from "react";
import "../Styles/Nav.css";
import { HiHome } from "react-icons/hi";
import { BiSolidCategory } from "react-icons/bi";
import { MdGames } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
export default function Nav() {
  const location = useLocation();
  return (
    <div className="nav">
      <h1>
        <span style={{ color: "red" }}>Gaming</span> Boi
      </h1>
      <ul style={{ height: "100vh" }} className="nav-list">
        <li>
          <Link
            className={location.pathname === "/home" ? "active" : ""}
            to={"/home"}
          >
            <HiHome className="icons" /> Home
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/category" ? "active" : ""}
            to={"/category"}
          >
            {" "}
            <BiSolidCategory className="icons" />
            Category
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/games" ? "active" : ""}
            to={"games"}
          >
            {" "}
            <MdGames className="icons" />
            Games
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/wishlist" ? "active" : ""}
            to={"wishlist"}
          >
            {" "}
            <FaHeart className="icons" />
            Wishlist
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/friends" ? "active" : ""}
            to={"friends"}
          >
            {" "}
            <HiUsers className="icons" />
            Friends
          </Link>
        </li>
        <li>
          <Link
            className={location.pathname === "/profile" ? "active" : ""}
            to={"profile"}
          >
            {" "}
            <img
              src={localStorage.getItem("profileImg")}
              style={{
                marginRight: "10px",
                width: "40px",
                borderRadius: "50%",
              }}
              className="icons"
            />
            {localStorage.getItem("name")}
          </Link>
        </li>
      </ul>
    </div>
  );
}
