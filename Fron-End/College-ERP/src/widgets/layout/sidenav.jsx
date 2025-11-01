import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useEffect, useState } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [userRole, setUserRole] = useState("student");
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900",
    white: "bg-gradient-to-br from-white to-blue-gray-50 shadow-xl",
    transparent: "bg-white/95 backdrop-blur-sm",
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole") || "student"; // Retrieve userRole
    const stringRole = storedUserRole.toString();
    setUserRole(stringRole.toLocaleUpperCase());
    // Reduced logging to prevent console clutter
    if (process.env.NODE_ENV === 'development') {
      console.log('User role set to:', stringRole);
    }
  }, []);
  // Close sidebar function
  const closeSidebar = () => {
    setOpenSidenav(dispatch, false);
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-3 ml-3 h-[calc(100vh-24px)] w-80 rounded-2xl transition-all duration-300 ease-in-out xl:translate-x-0 border border-blue-gray-100/50 backdrop-blur-sm shadow-2xl`}
    >
      <div className="relative border-b border-blue-gray-100/20 pb-4">
        <Link to="/" className="py-8 px-8 text-center block">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Typography variant="h5" className="text-white font-bold">
                TAT
              </Typography>
            </div>
            <Typography
              variant="h6"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
              className="font-semibold"
            >
              {`${userRole} Portal`}
            </Typography>
            <Typography
              variant="small"
              color={sidenavType === "dark" ? "blue-gray" : "blue-gray"}
              className="font-normal opacity-80"
            >
              TAT Dashboard
            </Typography>
          </div>
        </Link>
        <IconButton
          variant="text"
          color={sidenavType === "dark" ? "white" : "blue-gray"}
          size="sm"
          ripple={false}
          className="absolute right-2 top-2 grid rounded-lg xl:hidden hover:bg-blue-gray-50/50"
          onClick={closeSidebar}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="px-4 py-6 flex-1 overflow-y-auto">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-6 flex flex-col gap-2">
            {title && (
              <li className="mx-2 mt-6 mb-4">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "blue-gray-300" : "blue-gray-600"}
                  className="font-bold uppercase tracking-wider text-xs"
                >
                  {title}
                </Typography>
                <div className="mt-2 h-px bg-gradient-to-r from-blue-gray-200/50 to-transparent"></div>
              </li>
            )}
            {pages.map(({ icon, name, path }) => (
              <li key={name}>
                <NavLink to={`/${layout}${path}`} onClick={closeSidebar}>
                  {({ isActive }) => {
                    return (
                      <div
                        className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                            : sidenavType === "dark"
                            ? "text-white hover:bg-white/10 hover:text-blue-200"
                            : "text-blue-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <div className={`${isActive ? "text-white" : "text-blue-gray-400 group-hover:text-blue-500"} transition-colors duration-200`}>
                          {icon}
                        </div>
                        <Typography
                          className={`font-medium capitalize transition-all duration-200 ${
                            isActive ? "text-white" : "group-hover:font-semibold"
                          }`}
                        >
                          {name}
                        </Typography>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </div>
                    );
                  }}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
        
        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-blue-gray-100/20">
          <div className="px-4 py-3 text-center">
            <Typography
              variant="small"
              color={sidenavType === "dark" ? "blue-gray" : "blue-gray"}
              className="font-normal opacity-80"
            >
              TAT ERP System
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/tat-logo.png",
  brandName: "TAT Dashboard",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
