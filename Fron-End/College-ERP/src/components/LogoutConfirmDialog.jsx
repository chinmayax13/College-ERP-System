import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const LogoutConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      handler={onClose}
      className="bg-white dark:bg-gray-800"
      size="sm"
    >
      <DialogHeader className="flex items-center gap-3 pb-2">
        <ExclamationTriangleIcon className="h-8 w-8 text-amber-500" />
        <Typography variant="h5" color="blue-gray" className="dark:text-white">
          Confirm Logout
        </Typography>
      </DialogHeader>
      
      <DialogBody className="py-4">
        <Typography 
          variant="paragraph" 
          color="blue-gray" 
          className="font-normal dark:text-gray-300"
        >
          Are you sure you want to logout? You will need to sign in again to access your account.
        </Typography>
      </DialogBody>
      
      <DialogFooter className="space-x-2 pt-2">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={onConfirm}
          className="px-6"
        >
          Logout
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default LogoutConfirmDialog;