import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  const userRole = localStorage.getItem("userRole");

  // Enhanced role-based filtering with better matching
  const filteredRoutes = routes.filter((route) => {
    if (route.layout !== "dashboard") return false;
    
    // If route has explicit role, match it
    if (route.role && route.role !== userRole) return false;
    
    // Otherwise, check if any pages match the user role
    return route.pages.some((page) => page.path.includes(`/${userRole}/`));
  });

  // Add role-specific titles and descriptions
  const getDashboardTitle = (role) => {
    const titles = {
      hod: "Head of Department Dashboard",
      professor: "Professor Dashboard", 
      student: "Student Portal",
      admin: "Administration Panel"
    };
    return titles[role] || "Dashboard";
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 bg-blue-gray-50/50">
      <Sidenav
        routes={filteredRoutes}
        brandName={getDashboardTitle(userRole)}
        brandImg={
          sidenavType === "dark" ? "/img/tat-logo.png" : "/img/tat-logo.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {filteredRoutes.map(({ pages }, routeIndex) =>
            pages.map(({ path, element }, pageIndex) => (
              <Route key={`route-${routeIndex}-page-${pageIndex}-${path}`} exact path={path} element={element} />
            ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
