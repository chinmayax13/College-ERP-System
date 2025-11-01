import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Button,
  Input,
  Chip,
  Progress,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
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
  ClockIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import axios from "axios";

export function Profile() {
  const [professor, setProfessor] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);

  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");
    if (storedProfessorData) {
      const professorData = JSON.parse(storedProfessorData);
      setProfessor(professorData);
      setEditedData(professorData);
    }
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

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    if (!professor.id) {
      setError("Professor ID is missing. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Updating professor with ID:", professor.id);
      console.log("Update data:", editedData);
      
      const response = await axios.put(
        `http://localhost:8787/api/professors/${professor.id}`,
        editedData
      );

      const updatedProfessor = response.data;
      setProfessor(updatedProfessor);
      localStorage.setItem("professorData", JSON.stringify(updatedProfessor));
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating professor:", error);
      setError(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
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

    // For now, we'll show a message that image upload needs backend support
    // TODO: Backend needs an endpoint that accepts multipart form data for image updates
    try {
      setError("Image upload feature requires backend support. Please contact the administrator.");
      
      // Temporary: Just update the preview locally until backend is ready
      // In production, you would upload to a separate image service or 
      // the backend would need an image upload endpoint
      
    } catch (error) {
      console.error("Error updating profile image:", error);
      setError("Failed to update profile image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!professor) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Enhanced Header Section */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Typography variant="h3" className="mb-2 font-bold">
              Professor Profile
            </Typography>
            <Typography variant="lead" className="opacity-80">
              Teaching Information & Academic Details
            </Typography>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100 shadow-xl">
        <CardBody className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Typography variant="small" color="red">
                {error}
              </Typography>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Typography variant="small" color="green">
                {success}
              </Typography>
            </div>
          )}

          {/* Profile Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={previewUrl || professor.imageUrl || "/img/user.png"}
                  alt={professor.name}
                  size="xxl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40 border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-white"></div>
                <div className="absolute -bottom-1 -right-1">
                  <Button
                    size="sm"
                    color="green"
                    className="rounded-full p-2"
                    onClick={() => setShowImageDialog(true)}
                  >
                    <CameraIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {professor.name}
                </Typography>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-green-600" />
                  <Typography variant="h6" className="text-green-600 font-medium">
                    {professor.departmentName} Department
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-4 w-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600">
                    Subject: {professor.subject}
                  </Typography>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col gap-3">
              <Card className="bg-green-50 border border-green-100">
                <CardBody className="p-3 text-center">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Status
                  </Typography>
                  <Chip value="Active Faculty" color="green" size="sm" className="mt-1" />
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border border-gray-100">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-6 w-6 text-green-600" />
                      <Typography variant="h5" color="blue-gray" className="font-bold">
                        Personal Information
                      </Typography>
                    </div>
                    <Button
                      size="sm"
                      variant={isEditing ? "filled" : "outlined"}
                      color="blue"
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-1"
                    >
                      <PencilIcon className="h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Full Name
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.name || ""}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.name}
                            </Typography>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Department
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.departmentName || ""}
                              onChange={(e) => handleInputChange("departmentName", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.departmentName}
                            </Typography>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <BookOpenIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Subject
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.subject || ""}
                              onChange={(e) => handleInputChange("subject", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.subject}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Email Address
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.email || ""}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.email}
                            </Typography>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Phone Number
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.phone || ""}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.phone}
                            </Typography>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <Typography variant="small" color="gray" className="font-medium">
                            Username
                          </Typography>
                          {isEditing ? (
                            <Input
                              value={editedData.username || ""}
                              onChange={(e) => handleInputChange("username", e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Typography variant="small" color="blue-gray" className="font-bold">
                              {professor.username}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        variant="outlined"
                        color="gray"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedData(professor);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="filled"
                        color="green"
                        onClick={handleSaveChanges}
                        disabled={loading}
                        className="flex items-center gap-1"
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Teaching Summary */}
            <div>
              <Card className="shadow-sm border border-gray-100">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpenIcon className="h-6 w-6 text-blue-600" />
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      Teaching Summary
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Teaching Experience
                      </Typography>
                      <Typography variant="h4" color="blue" className="font-bold">
                        5+ Years
                      </Typography>
                      <Progress value={85} color="blue" className="mt-2" />
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Current Students
                      </Typography>
                      <Typography variant="h6" color="green" className="font-bold">
                        120 Students
                      </Typography>
                      <Progress value={75} color="green" className="mt-2" />
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Weekly Hours
                      </Typography>
                      <Typography variant="h6" color="purple" className="font-bold">
                        18 Hours/Week
                      </Typography>
                      <Progress value={90} color="purple" className="mt-2" />
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <Typography variant="small" color="gray" className="font-medium mb-1">
                        Student Rating
                      </Typography>
                      <Typography variant="h6" color="orange" className="font-bold">
                        4.6/5.0
                      </Typography>
                      <Typography variant="small" color="gray" className="mt-1">
                        Based on feedback
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Image Upload Dialog */}
      <Dialog open={showImageDialog} handler={() => setShowImageDialog(false)} size="md">
        <DialogHeader>Update Profile Picture</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar
                  src={previewUrl || professor.imageUrl || "/img/user.png"}
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