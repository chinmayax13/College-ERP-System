import { useLogout } from "@/utils/useLogout";
import LogoutConfirmDialog from "@/components/LogoutConfirmDialog";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";

function ProfileMenu({ openMenu, setOpenMenu }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const [user, setUser] = useState(null);

  const { initiateLogout, confirmLogout, cancelLogout, showLogoutDialog } = useLogout();

  useEffect(() => {
    const storedData =
      localStorage.getItem("studentData") ||
      localStorage.getItem("professorData") ||
      localStorage.getItem("hodData") ||
      localStorage.getItem("adminData");

    if (storedData) {
      try {
        const parsedUser = JSON.parse(storedData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Menu open={openMenu} handler={setOpenMenu} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
        >
          {/* Avatar for medium to large screens */}
          <Avatar
            src={user.imageUrl || "/img/user.png"}
            alt={"User"}
            className="rounded-full w-10 h-10 md:w-12 md:h-12 ring-2 ring-blue-200 ring-offset-2"
          />
          {/* Username for medium to large screens */}
          <div className="flex flex-col items-start">
            <Typography
              variant="small"
              className="text-gray-800 font-semibold text-sm md:text-base whitespace-nowrap"
            >
              {user.studName || user.name || "John Doe"}
            </Typography>
            <Typography
              variant="small"
              className="text-gray-500 text-xs capitalize"
            >
              {userRole || "User"}
            </Typography>
          </div>
        </Button>
      </MenuHandler>
      <MenuList className="w-44 p-2 shadow-lg">
        <MenuItem>
          <Link
            to={`/dashboard/${userRole}/${userRole === 'admin' ? 'profile' : 'information'}`}
            className="flex items-center gap-2"
          >
            <AiOutlineUser className="text-gray-600 h-5 w-5" />
            <span className="">Profile</span>
          </Link>
        </MenuItem>
        <MenuItem onClick={initiateLogout} className="flex items-center gap-2">
          <AiOutlineLogout className="text-gray-600 h-5 w-5" />
          <span className="">Logout</span>
        </MenuItem>
      </MenuList>
      
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </Menu>
  );
}

export default ProfileMenu;
