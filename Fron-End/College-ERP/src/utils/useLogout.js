import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const useLogout = () => {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.clear();
    navigate("/");
  };

  const initiateLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return {
    initiateLogout,
    confirmLogout,
    cancelLogout,
    showLogoutDialog,
    logout // Keep the direct logout for backward compatibility
  };
};
