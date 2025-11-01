import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Chip,
  Progress,
  Alert,
  IconButton,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  CameraIcon,
  UserIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  KeyIcon,
  UsersIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import axios from "axios";
import API_CONFIG from "../../../config/api.js";

export function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  // Load Admin data from localStorage
  useEffect(() => {
    const loadAdminData = () => {
      try {
        const storedData = localStorage.getItem("adminData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setAdminData(parsedData);
          setEditedData(parsedData);
        } else {
          setError("No admin data available. Please log in again.");
        }
      } catch (err) {
        console.error("Error parsing admin data:", err);
        setError("Error loading profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        setError("Image size should be less than 5MB");
        return;
      }
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setShowImageDialog(true);
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", newImage);
    formData.append("name", adminData.name);
    formData.append("username", adminData.username);
    formData.append("password", adminData.password || "defaultPassword");
    formData.append("email", adminData.email);
    formData.append("phone", adminData.phone);

    try {
      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/admin/auth/${adminData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedAdmin = { ...adminData, imageUrl: response.data.imageUrl || previewUrl };
        setAdminData(updatedAdmin);
        localStorage.setItem("adminData", JSON.stringify(updatedAdmin));
        setSuccess("Profile image updated successfully!");
        setShowImageDialog(false);
        setNewImage(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      console.error("Response data:", err.response?.data);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedData(adminData);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedData.name);
      formData.append("username", editedData.username);
      formData.append("password", adminData.password || "defaultPassword");
      formData.append("email", editedData.email);
      formData.append("phone", editedData.phone);
      
      // Add existing image if no new image is being uploaded
      if (adminData.imageUrl) {
        try {
          const response = await fetch(adminData.imageUrl);
          const blob = await response.blob();
          formData.append("file", blob, "admin-image.jpg");
        } catch (imgError) {
          console.log("Could not fetch existing image, using default");
          const response = await fetch('/img/user.png');
          const blob = await response.blob();
          formData.append("file", blob, "default-admin.png");
        }
      } else {
        const response = await fetch('/img/user.png');
        const blob = await response.blob();
        formData.append("file", blob, "default-admin.png");
      }

      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/admin/auth/${adminData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedAdmin = { ...adminData, ...editedData };
        setAdminData(updatedAdmin);
        localStorage.setItem("adminData", JSON.stringify(updatedAdmin));
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      console.error("Response data:", err.response?.data);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="text-center py-8">
        <Typography variant="h6" color="red">
          No admin data available. Please log in again.
        </Typography>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Header */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Typography variant="h3" className="mb-2 font-bold">
              Admin Profile
            </Typography>
            <Typography variant="lead" className="opacity-80">
              System Administration & Management
            </Typography>
          </div>
        </div>
      </div>

      {/* Enhanced Profile Card */}
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 shadow-xl">
        <CardBody className="p-6">
          {/* Error/Success Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Typography variant="small" color="green">
                {success}
              </Typography>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Typography variant="small" color="red">
                {error}
              </Typography>
            </div>
          )}

          {/* Enhanced Profile Header */}
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={adminData.imageUrl || "/img/user.png"}
                  alt={adminData.name}
                  size="xxl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40 border-4 border-white"
                />
                <Tooltip content="Update Profile Picture">
                  <IconButton
                    size="sm"
                    color="blue"
                    className="!absolute bottom-2 right-2 rounded-full"
                    onClick={() => document.getElementById("admin-image-input").click()}
                  >
                    <CameraIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
                <input
                  id="admin-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              
              <div>
                <Typography variant="h4" color="blue-gray" className="mb-2 font-bold">
                  {adminData.name}
                  <Chip
                    className="ml-3"
                    color="red"
                    size="sm"
                    value="Admin"
                    icon={<ShieldCheckIcon className="h-4 w-4" />}
                  />
                </Typography>
                <Typography variant="paragraph" className="text-gray-600 mb-2">
                  System Administrator
                </Typography>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600">
                    Username: {adminData.username}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <div className="w-96">
              <Tabs value={activeTab}>
                <TabsHeader>
                  <Tab value="info" onClick={() => setActiveTab("info")}>
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Personal Info
                  </Tab>
                  <Tab value="admin" onClick={() => setActiveTab("admin")}>
                    <ShieldCheckIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Admin Panel
                  </Tab>
                  <Tab value="settings" onClick={() => setActiveTab("settings")}>
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {/* Enhanced Tab Content */}
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            {activeTab === "info" && (
              <>
                {/* Personal Information Card */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-6 w-6 text-red-600" />
                        <Typography variant="h6" color="blue-gray" className="font-bold">
                          Personal Information
                        </Typography>
                      </div>
                      <Button
                        size="sm"
                        variant={isEditing ? "filled" : "outlined"}
                        color="blue"
                        onClick={handleEdit}
                        className="flex items-center gap-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {isEditing ? (
                        <>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1 font-medium">
                              Full Name
                            </Typography>
                            <Input
                              value={editedData.name || ""}
                              onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                              className="!border-gray-300 focus:!border-blue-500"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1 font-medium">
                              Username
                            </Typography>
                            <Input
                              value={editedData.username || ""}
                              onChange={(e) => setEditedData({...editedData, username: e.target.value})}
                              className="!border-gray-300 focus:!border-blue-500"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1 font-medium">
                              Email
                            </Typography>
                            <Input
                              value={editedData.email || ""}
                              onChange={(e) => setEditedData({...editedData, email: e.target.value})}
                              className="!border-gray-300 focus:!border-blue-500"
                            />
                          </div>
                          <div>
                            <Typography variant="small" color="gray" className="mb-1 font-medium">
                              Phone
                            </Typography>
                            <Input
                              value={editedData.phone || ""}
                              onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                              className="!border-gray-300 focus:!border-blue-500"
                            />
                          </div>
                          <Button onClick={handleSave} color="green" className="w-full">
                            Save Changes
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <UserIcon className="h-5 w-5 text-gray-600" />
                            <div className="flex-1">
                              <Typography variant="small" color="gray" className="font-medium">
                                Full Name
                              </Typography>
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {adminData.name}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                            <div className="flex-1">
                              <Typography variant="small" color="gray" className="font-medium">
                                Email Address
                              </Typography>
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {adminData.email}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <PhoneIcon className="h-5 w-5 text-gray-600" />
                            <div className="flex-1">
                              <Typography variant="small" color="gray" className="font-medium">
                                Phone Number
                              </Typography>
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {adminData.phone}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <KeyIcon className="h-5 w-5 text-gray-600" />
                            <div className="flex-1">
                              <Typography variant="small" color="gray" className="font-medium">
                                Username
                              </Typography>
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {adminData.username}
                              </Typography>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Admin Statistics */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ChartBarIcon className="h-6 w-6 text-red-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        System Overview
                      </Typography>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <Typography variant="small" color="gray" className="font-medium mb-2">
                          Total Users Managed
                        </Typography>
                        <Typography variant="h4" color="red" className="font-bold">
                          500+
                        </Typography>
                        <Progress value={85} color="red" className="mt-2" />
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Typography variant="small" color="gray" className="font-medium mb-2">
                          System Uptime
                        </Typography>
                        <Typography variant="h6" color="blue" className="font-bold">
                          99.9%
                        </Typography>
                        <Progress value={99} color="blue" className="mt-2" />
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <Typography variant="small" color="gray" className="font-medium mb-2">
                          Active Sessions
                        </Typography>
                        <Typography variant="h6" color="green" className="font-bold">
                          150 Users
                        </Typography>
                        <Progress value={75} color="green" className="mt-2" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {activeTab === "admin" && (
              <>
                {/* Admin Panel Overview */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Admin Privileges
                      </Typography>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-5 w-5 text-blue-600" />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            User Management
                          </Typography>
                        </div>
                        <Chip color="green" size="sm" value="Active" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Department Control
                          </Typography>
                        </div>
                        <Chip color="green" size="sm" value="Active" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ChartBarIcon className="h-5 w-5 text-orange-600" />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            System Analytics
                          </Typography>
                        </div>
                        <Chip color="green" size="sm" value="Active" />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            System Configuration
                          </Typography>
                        </div>
                        <Chip color="green" size="sm" value="Active" />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Recent Activities */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarDaysIcon className="h-6 w-6 text-red-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Recent Activities
                      </Typography>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Created 15 student accounts
                          </Typography>
                          <Typography variant="small" color="gray">
                            2 hours ago
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Updated department settings
                          </Typography>
                          <Typography variant="small" color="gray">
                            Yesterday
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            System maintenance completed
                          </Typography>
                          <Typography variant="small" color="gray">
                            3 days ago
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {activeTab === "settings" && (
              <div className="col-span-full">
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cog6ToothIcon className="h-6 w-6 text-red-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Account Settings
                      </Typography>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <Typography variant="h6" color="blue-gray" className="mb-3">
                          Notifications
                        </Typography>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Email Notifications
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            System Alerts
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Security Notifications
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <Typography variant="h6" color="blue-gray" className="mb-3">
                          Privacy & Security
                        </Typography>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Two-Factor Authentication
                          </Typography>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Activity Logging
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Session Timeout
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} handler={() => setShowImageDialog(false)} size="sm">
        <DialogHeader>Update Profile Picture</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col items-center gap-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 rounded-lg object-cover border"
              />
            )}
            <Typography variant="small" color="gray">
              Are you sure you want to update your profile picture?
            </Typography>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setShowImageDialog(false);
              setNewImage(null);
              setPreviewUrl(null);
            }}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleImageUpload}
            loading={uploadingImage}
          >
            Upload
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default AdminProfile;