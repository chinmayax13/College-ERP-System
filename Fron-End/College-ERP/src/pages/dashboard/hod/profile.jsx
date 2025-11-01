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
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  CameraIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard } from "@/widgets/cards";
import { useState, useEffect } from "react";
import axios from "axios";

export function Profile() {
  const [hodData, setHodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Edit Profile Dialog State
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: []
  });
  const [editLoading, setEditLoading] = useState(false);

  // Load HOD data from localStorage or fetch from API
  useEffect(() => {
    const loadHODData = () => {
      try {
        const storedData = localStorage.getItem("hodData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setHodData(parsedData);
        } else {
          // If no data in localStorage, redirect to login
          window.location.href = "/auth/hod/sign-in";
        }
      } catch (error) {
        console.error("Error loading HOD data:", error);
        setError("Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    loadHODData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const openEditDialog = () => {
    setEditForm({
      name: hodData.name || "",
      email: hodData.email || "",
      phone: hodData.phone || "",
      department: hodData.department || "",
      subjects: hodData.subjects || []
    });
    setShowEditDialog(true);
    setError("");
    setSuccess("");
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...editForm.subjects];
    newSubjects[index] = value;
    setEditForm(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  const addSubject = () => {
    setEditForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, ""]
    }));
  };

  const removeSubject = (index) => {
    const newSubjects = editForm.subjects.filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      subjects: newSubjects
    }));
  };

  const handleUpdateProfile = async () => {
    if (!editForm.name || !editForm.email || !editForm.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setEditLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        department: editForm.department,
        subjects: editForm.subjects.filter(subject => subject.trim() !== "")
      };

      const response = await axios.put(
        `http://localhost:8787/api/hods/${hodData.id}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local data
      const updatedData = { ...hodData, ...updateData };
      setHodData(updatedData);
      localStorage.setItem("hodData", JSON.stringify(updatedData));
      
      setSuccess("Profile updated successfully!");
      setShowEditDialog(false);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error updating profile");
      } else {
        setError("Error updating profile. Please try again.");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) {
      setError("Please select an image first");
      return;
    }

    setUploadingImage(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", newImage);
    formData.append("name", hodData.name);
    formData.append("department", hodData.department);
    formData.append("username", hodData.username);
    formData.append("password", hodData.password);
    formData.append("email", hodData.email);
    formData.append("phone", hodData.phone);
    
    // Handle subjects array
    if (hodData.subjects && hodData.subjects.length > 0) {
      formData.append("subjects", hodData.subjects.join(","));
    }

    try {
      const response = await axios.put(
        `http://localhost:8787/api/hods/update/${hodData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedData = response.data;
      setHodData(updatedData);
      localStorage.setItem("hodData", JSON.stringify(updatedData));
      setSuccess("Profile picture updated successfully!");
      setShowImageDialog(false);
      setNewImage(null);
      setPreviewUrl(null);
      
    } catch (error) {
      console.error("Error updating profile picture:", error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Error updating profile picture. Please try again.");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!hodData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Typography variant="h4" color="red">
          Error loading profile data
        </Typography>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Header Section */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Typography variant="h3" className="mb-2 font-bold">
              Head of Department
            </Typography>
            <Typography variant="lead" className="opacity-80">
              Department Administration & Leadership
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
                  src={hodData.imageUrl || "/img/user.png"}
                  alt={hodData.name}
                  size="xxl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40 border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-500 border-4 border-white"></div>
                <div className="absolute -bottom-1 -right-1">
                  <Button
                    size="sm"
                    color="purple"
                    className="rounded-full p-2"
                    onClick={() => setShowImageDialog(true)}
                  >
                    <CameraIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {hodData.name}
                </Typography>
                <div className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                  <Typography variant="h6" className="text-purple-600 font-medium">
                    Head of {hodData.department} Department
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600">
                    Username: {hodData.username}
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
                  <Tab value="subjects" onClick={() => setActiveTab("subjects")}>
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Subjects
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
                    <div className="flex items-center gap-2 mb-4">
                      <UserIcon className="h-6 w-6 text-purple-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Personal Information
                      </Typography>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Full Name
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {hodData.name}
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Department
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {hodData.department}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Username
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {hodData.username}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Contact Information Card */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <EnvelopeIcon className="h-6 w-6 text-purple-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Contact Information
                      </Typography>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Email Address
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {hodData.email}
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
                            {hodData.phone}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Department Overview */}
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ChartBarIcon className="h-6 w-6 text-purple-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Department Overview
                      </Typography>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <Typography variant="small" color="gray" className="font-medium mb-2">
                          Role Status
                        </Typography>
                        <Chip value="Active HOD" color="purple" size="sm" />
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <Typography variant="small" color="gray" className="font-medium mb-2">
                          Department Rating
                        </Typography>
                        <Typography variant="h6" color="blue" className="font-bold">
                          4.8/5.0
                        </Typography>
                        <Progress value={96} color="blue" className="mt-2" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </>
            )}

            {activeTab === "subjects" && (
              <div className="col-span-full">
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpenIcon className="h-6 w-6 text-purple-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Assigned Subjects
                      </Typography>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hodData.subjects && hodData.subjects.length > 0 ? (
                        hodData.subjects.map((subject, index) => (
                          <Card key={index} className="p-4 border border-purple-100 bg-purple-50">
                            <div className="flex items-center gap-2">
                              <BookOpenIcon className="h-5 w-5 text-purple-600" />
                              <Typography variant="h6" color="blue-gray">
                                {subject}
                              </Typography>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center p-8">
                          <Typography variant="small" color="blue-gray">
                            No subjects assigned
                          </Typography>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="col-span-full">
                <Card className="shadow-sm border border-gray-100">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cog6ToothIcon className="h-6 w-6 text-purple-600" />
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        Account Settings
                      </Typography>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Email Notifications
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            SMS Notifications
                          </Typography>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            Profile Visibility
                          </Typography>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      {/* Edit Profile Section */}
                      <div className="mt-6">
                        <Card className="shadow-sm border border-purple-100 bg-purple-50">
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Typography variant="h6" color="purple" className="font-bold">
                                  Edit Profile Information
                                </Typography>
                                <Typography variant="small" color="gray" className="mt-1">
                                  Update your personal details and contact information
                                </Typography>
                              </div>
                              <Button
                                color="purple"
                                variant="gradient"
                                className="flex items-center gap-2"
                                onClick={openEditDialog}
                              >
                                <PencilIcon className="h-4 w-4" />
                                Edit Profile
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="lg">
        <DialogHeader className="flex items-center gap-2">
          <PencilIcon className="h-6 w-6 text-purple-600" />
          Edit Profile Information
        </DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={editForm.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
                icon={<UserIcon className="h-5 w-5" />}
              />
              <Input
                label="Department *"
                value={editForm.department}
                onChange={(e) => handleEditFormChange("department", e.target.value)}
                icon={<BuildingOfficeIcon className="h-5 w-5" />}
              />
            </div>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address *"
                type="email"
                value={editForm.email}
                onChange={(e) => handleEditFormChange("email", e.target.value)}
                icon={<EnvelopeIcon className="h-5 w-5" />}
              />
              <Input
                label="Phone Number *"
                value={editForm.phone}
                onChange={(e) => handleEditFormChange("phone", e.target.value)}
                icon={<PhoneIcon className="h-5 w-5" />}
              />
            </div>
            
            {/* Subjects Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Typography variant="h6" className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-purple-600" />
                  Subjects
                </Typography>
                <Button
                  size="sm"
                  color="purple"
                  variant="outlined"
                  onClick={addSubject}
                  className="flex items-center gap-1"
                >
                  + Add Subject
                </Button>
              </div>
              <div className="space-y-2">
                {editForm.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      label={`Subject ${index + 1}`}
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                      className="flex-1"
                    />
                    {editForm.subjects.length > 1 && (
                      <Button
                        size="sm"
                        color="red"
                        variant="text"
                        onClick={() => removeSubject(index)}
                        className="p-2"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {editForm.subjects.length === 0 && (
                  <Typography variant="small" color="gray" className="text-center p-4">
                    No subjects added. Click "Add Subject" to add subjects.
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between">
          <Typography variant="small" color="gray">
            * Required fields
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="text"
              color="red"
              onClick={() => setShowEditDialog(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="purple"
              onClick={handleUpdateProfile}
              disabled={editLoading}
              className="flex items-center gap-2"
            >
              {editLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Updating...
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4" />
                  Update Profile
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Original Image Upload Dialog - Functionality Preserved */}
      <Dialog open={showImageDialog} handler={() => setShowImageDialog(false)} size="md">
        <DialogHeader>Update Profile Picture</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  src={previewUrl || hodData.imageUrl || "/img/user.png"}
                  alt="Profile Preview"
                  size="xxl"
                  variant="rounded"
                  className="rounded-lg"
                />
              </div>
              <div className="w-full">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  label="Select Profile Picture"
                  className="w-full"
                />
              </div>
            </div>
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
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleImageUpload}
            disabled={!newImage || uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Update Picture"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;