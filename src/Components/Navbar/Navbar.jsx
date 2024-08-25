import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header>
      <div className="container">
        <h1 className="logo"></h1>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/add-card">Add Card</Link>
            </li>
            <li>
              <Link to="/edit-card">Edit Card</Link>
            </li>
            <li>
              <Link to="/generate-card">Generate Card</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
