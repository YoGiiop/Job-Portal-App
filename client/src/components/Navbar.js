import React, { useState, useContext, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "./ContextProvider/Context";
import "boxicons";
import logoURL from "../assets/img/logo.jpeg";

const employerNavItems = [
  { label: "Home", path: "/" },
  { label: "Post Job", path: "/post-job" },
  { label: "Dashboard", path: "/all-jobs" },
  { label: "Candidates", path: "/shortlist" },
];
const coordinatorNavItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/coordinator/review" },
  { label: "Candidates", path: "/shortlist" },
];
const recruiterNavItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/recruiter/review" },
];
const candidateNavItems = [
  { label: "Home", path: "/" },
  { label: "All Jobs", path: "/all-posted-jobs" },
  { label: "Dashboard", path: `/my-jobs` },
];

export function Navbar() {
  //   const [loginData, setLoginData] = useState();

  const { loginData, setLoginData, setUserRole } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [navItems, setNavItems] = useState([
    { label: "Home", path: "/" },
    { label: "All Jobs", path: "/all-posted-jobs" },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handlerIsMenuOpen = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (loginData?.role) {
      switch (loginData.role) {
        case "employer":
          setNavItems(employerNavItems);
          break;
        case "coordinator":
          setNavItems(coordinatorNavItems);
          break;
        case "recruiter":
          setNavItems(recruiterNavItems);
          break;
        case "candidate":
          setNavItems(candidateNavItems);
          break;
        default:
          setNavItems([{ label: "Home", path: "/" }]);
      }
    } else {
      // Guest user
      setNavItems([
        { label: "Home", path: "/" },
        { label: "All Jobs", path: "/all-posted-jobs" },
      ]);
    }
  }, [loginData]);

  const logoutHandler = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLoginData(null);
          setUserRole(null);
          setIsMenuOpen(false);
          localStorage.removeItem("usertoken");
          localStorage.removeItem("user");
          navigate("/");
        }
      });
  };

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
      <nav className="flex items-center justify-between gap-4 py-5 md:py-6">
        {/* BRAND */}
        <NavLink
          to="/"
          className="flex min-w-0 items-center gap-3 text-[#087658]"
        >
          {/* <a
            href="/"
            class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          > */}
          <img
            src={logoURL}
            className="h-11 w-11 rounded-full object-cover md:h-14 md:w-14"
            alt="HireFlow logo"
          />
          {/* </a> */}
          <span className="truncate font-extrabold text-lg sm:text-xl md:text-3xl">HireFlow</span>
        </NavLink>

        {/* MAIN MENU - Lg device */}
        {navItems && (
          <ul className="hidden md:flex items-center gap-6 font-bold lg:gap-8 xl:gap-10">
            {navItems.map(({ label, path }) => (
              <li key={path} className="text-base text-primary">
                <NavLink
                  to={path}
                  className={({ isActive }) => (isActive ? "active " : "")}
                >
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}

        <div className="hidden md:block">
          {localStorage.getItem("usertoken") ? (
            <div className="flex items-center gap-4 text-sm lg:text-base">
              <span className="max-w-[180px] truncate font-medium text-primary">
                Hello, {loginData && loginData.userName}
              </span>
              <button
                  type="button"
                  onClick={logoutHandler}
                  className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-primary transition hover:bg-gray-200"
                >
                  Logout
                </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-base font-medium text-primary">
              <Link
                to="/login"
                className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg border border-secondary bg-secondary px-4 py-2 text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* HAMBURGER MENU */}
        <button
          type="button"
          onClick={handlerIsMenuOpen}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-primary shadow-sm md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <box-icon
            name={isMenuOpen ? "x" : "menu"}
            size="md"
            color="#141414"
          ></box-icon>
        </button>
      </nav>

      {/* MAIN MENU sm device */}
      <div className={`${isMenuOpen ? "block" : "hidden"} pb-4 md:hidden`}>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
          <ul className="flex flex-col gap-2 font-bold">
            {navItems.map(({ label, path }) => (
              <li key={path} className="text-base text-primary">
                <NavLink
                  to={path}
                  className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? "active bg-secondary/5" : ""}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-gray-200 pt-4">
            {localStorage.getItem("usertoken") ? (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-primary">
                  Hello, {loginData?.userName}
                </span>
                <button
                  type="button"
                  onClick={logoutHandler}
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-left font-medium text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-sm font-medium">
                <Link
                  to="/login"
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full rounded-lg border border-secondary bg-secondary px-4 py-2 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
