import React from "react";
import { NavLink } from "react-router-dom";
import logo from "./assets/images/eglv.png";
import "./MenuBar.css";

const MenuBar: React.FC = () => (
  <nav className="menu-bar">
    <div className="menu-logo"><img src={logo} alt="Synthesis" /></div>
    <NavLink to="/" className="menu-link" end>Ideas</NavLink>
    <NavLink to="/data" className="menu-link">Data</NavLink>
    <NavLink to="/performance" className="menu-link">Performance</NavLink>
  </nav>
);

export default MenuBar;
