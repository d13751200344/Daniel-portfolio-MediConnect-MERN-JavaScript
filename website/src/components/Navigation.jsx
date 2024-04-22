import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { useAuth } from "../App";

const Navigation = () => {
  const { user } = useAuth(); // Retrieve the user from the context
  const pageLinks = [
    { label: "Home", link: "/" },
    { label: "Hospitals", link: "/hospitals" },
    { label: "Doctors", link: "/doctors" },

    //use the spread operator to expand the objects in the array [] and connect them with others
    ...(user
      ? [
          { label: "Profile", link: "/profile" },
          { label: "Logout", link: "/logout" },
        ]
      : [
          { label: "Login", link: "/login" },
          { label: "Register", link: "/register" },
        ]),
  ];

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white ${styles.brand}" to="/">
          MediConnect
        </Link>

        <button className={`navbar-toggler ${styles.navbarTogglerIcon}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {pageLinks.map(({ label, link }, index) => (
              <li className="nav-item" key={index}>
                <Link className={`nav-link ${styles.navLink}`} to={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
