import React from "react";
import "../Styles/Dashboard.css";
import Nav from "../Components/Nav";
import { Outlet } from "react-router-dom";
import PageTransition from "../Components/PageTransition";

export default function Dashboard() {
  return (
    <PageTransition>
      <div className="row">
        <div className="col-3 left-content">
          <Nav></Nav>
        </div>
        <div className="col-9 right-content">
          <Outlet></Outlet>
        </div>
      </div>
    </PageTransition>
  );
}
