import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { useState } from "react";
import ProfileMenu from "../Profile/ProfileMenu";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  // const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [openMenu, setOpenMenu] = useState(false);
  const userRole = localStorage.getItem("userRole");

  const pathnames = pathname
    .split("/")
    .filter((el) => el !== "" && el !== userRole);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-2xl transition-all duration-300 ease-in-out ${
        fixedNavbar
          ? "sticky top-4 z-40 py-4 shadow-xl shadow-blue-gray-500/10 bg-white/95 backdrop-blur-lg border border-blue-gray-100/50"
          : "px-0 py-2 bg-transparent"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        {/* Left side - Breadcrumbs and title */}
        <div className="flex-1">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all duration-200 ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return isLast ? (
                <Typography
                  key={name}
                  variant="small"
                  color="blue-gray"
                  className="font-semibold capitalize dark:text-white"
                >
                  {name}
                </Typography>
              ) : (
                <Link key={name} to={routeTo}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium capitalize dark:text-white opacity-60 dark:opacity-100 transition-all duration-200 hover:text-blue-600 hover:opacity-100"
                  >
                    {name}
                  </Typography>
                </Link>
              );
            })}
          </Breadcrumbs>
          <div className="flex items-center gap-2 mt-1">
            <Typography
              variant="h5"
              color="blue-gray"
              className="font-bold capitalize dark:text-white"
            >
              {pathnames[pathnames.length - 1]}
            </Typography>
            <div className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Typography variant="small" className="text-white font-medium text-xs">
                Live
              </Typography>
            </div>
          </div>
        </div>
        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden hover:bg-blue-50 transition-colors duration-200"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={2.5} className="h-6 w-6 text-blue-gray-600" />
          </IconButton>

          {/* Mobile Profile Button */}
          <div className="xl:hidden">
            <IconButton
              variant="text"
              color="blue-gray"
              className="hover:bg-blue-50 transition-colors duration-200"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-600" />
            </IconButton>
          </div>

          {/* Profile Menu */}
          <div className="hidden xl:block">
            <ProfileMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
          </div>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
