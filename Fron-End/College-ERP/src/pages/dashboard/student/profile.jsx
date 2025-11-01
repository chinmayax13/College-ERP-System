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
  Chip,
  Progress,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";
import axios from "axios";

export function Profile() {
  const [student, setStudent] = useState(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      setStudent(JSON.parse(storedStudentData));
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
    formData.append("studName", student.studName);
    formData.append("studLastName", student.studLastName);
    formData.append("studRollNo", student.studRollNo);
    formData.append("major", student.major);
    formData.append("year", student.year);
    formData.append("username", student.username);
    formData.append("password", student.password);
    formData.append("email", student.email);
    formData.append("phone", student.phone);
    formData.append("address", student.address);

    try {
      const response = await axios.put(
        `http://localhost:8787/api/students/update-student/${student.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedStudent = response.data;
      setStudent(updatedStudent);
      localStorage.setItem("studentData", JSON.stringify(updatedStudent));
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

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Enhanced Header Section */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Typography variant="h3" className="mb-2 font-bold">
              Student Profile
            </Typography>
            <Typography variant="lead" className="opacity-80">
              Academic Information & Personal Details
            </Typography>
          </div>
        </div>
      </div>

      {/* Profile Card */}
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

          {/* Profile Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={student.imageUrl || "/img/user.png"}
                  alt={student.studName}
                  size="xxl"
                  variant="rounded"
                  className="rounded-lg shadow-lg shadow-blue-gray-500/40 border-4 border-white"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-white"></div>
                <div className="absolute -bottom-1 -right-1">
                  <Button
                    size="sm"
                    color="blue"
                    className="rounded-full p-2"
                    onClick={() => setShowImageDialog(true)}
                  >
                    <CameraIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                  {`${student.studName} ${student.studLastName}`}
                </Typography>
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                  <Typography variant="h6" className="text-blue-600 font-medium">
                    {student.major} - Year {student.year}
                  </Typography>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <Typography variant="small" className="text-gray-600">
                    Roll No: {student.studRollNo}
                  </Typography>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-col gap-3">
              <Card className="bg-blue-50 border border-blue-100">
                <CardBody className="p-3 text-center">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Academic Status
                  </Typography>
                  <Chip value="Active" color="green" size="sm" className="mt-1" />
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
                  <div className="flex items-center gap-2 mb-4">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                    <Typography variant="h5" color="blue-gray" className="font-bold">
                      Personal Information
                    </Typography>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Full Name
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {`${student.studName} ${student.studLastName}`}
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Father's Name
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studFatherName}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Date of Birth
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studentDob} ({student.studentAge} years)
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <PhoneIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Phone Number
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studPhoneNumber}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Email Address
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.email}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <AcademicCapIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Roll Number
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studRollNo}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Category
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studCategory}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <Typography variant="small" color="gray" className="font-medium">
                            Caste
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {student.studCaste}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Academic Summary */}
            <div>
              <Card className="shadow-sm border border-gray-100">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-green-600" />
                    <Typography variant="h6" color="blue-gray" className="font-bold">
                      Academic Summary
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Current CGPA
                      </Typography>
                      <Typography variant="h4" color="green" className="font-bold">
                        8.7
                      </Typography>
                      <Progress value={87} color="green" className="mt-2" />
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Credits Completed
                      </Typography>
                      <Typography variant="h6" color="blue" className="font-bold">
                        145 / 180
                      </Typography>
                      <Progress value={80} color="blue" className="mt-2" />
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <Typography variant="small" color="gray" className="font-medium mb-2">
                        Course Progress
                      </Typography>
                      <Typography variant="h6" color="purple" className="font-bold">
                        80.5% Complete
                      </Typography>
                      <Progress value={80.5} color="purple" className="mt-2" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-end">
            <Tooltip content="Edit Profile Information">
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-400">
                <CardBody className="p-3 flex items-center gap-2">
                  <PencilIcon className="h-5 w-5 text-blue-600" />
                  <Typography variant="small" color="blue" className="font-medium">
                    Edit Profile
                  </Typography>
                </CardBody>
              </Card>
            </Tooltip>
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
                  src={previewUrl || student.imageUrl || "/img/user.png"}
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
