import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  const baseClass = "px-4 py-2 rounded hover:bg-blue-100 transition";
  const activeClass = "text-white bg-blue-600";

  return (
    <nav className="bg-white shadow-md p-4 flex space-x-4 max-w-5xl mx-auto">
      <NavLink
        to="/"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/car"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Car
      </NavLink>
      <NavLink
        to="/slot"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Parking Slot
      </NavLink>
      <NavLink
        to="/record"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Parking Record
      </NavLink>
      <NavLink
        to="/payment"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Payment
      </NavLink>
      <NavLink
        to="/report"
        className={({ isActive }) =>
          (isActive ? activeClass : "text-blue-600") + " " + baseClass
        }
      >
        Reports
      </NavLink>
      {/* <NavLink
        to="/logout"
        className="ml-auto text-red-500 px-4 py-2 rounded hover:bg-red-100 transition"
      >
        Logout
      </NavLink> */}
    </nav>
  );
}

export default NavBar;
