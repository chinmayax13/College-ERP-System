import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Alert,
  Progress,
  Chip,
  IconButton,
  Textarea,
} from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import API_CONFIG from "../../../config/api.js";

const BulkAddHODs = () => {
  const [hods, setHods] = useState([
    {
      hodId: "",
      name: "",
      departmentName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPasswords, setShowPasswords] = useState({});

  const departments = [
    "Computer Science Engineering",
    "Information Technology", 
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Chemical Engineering",
    "CSIT",
    "BCA",
    "MCA",
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Administration",
  ];

  const addHodRow = () => {
    setHods([
      ...hods,
      {
        hodId: "",
        name: "",
        departmentName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      },
    ]);
  };

  const removeHodRow = (index) => {
    if (hods.length > 1) {
      const newHods = hods.filter((_, i) => i !== index);
      setHods(newHods);
    }
  };

  const updateHod = (index, field, value) => {
    const newHods = [...hods];
    newHods[index] = { ...newHods[index], [field]: value };
    setHods(newHods);
  };

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const validateHod = (hod) => {
    const errors = [];
    
    if (!hod.hodId) errors.push("HOD ID is required");
    if (!hod.name) errors.push("Name is required");
    if (!hod.departmentName) errors.push("Department is required");
    if (!hod.email) errors.push("Email is required");
    if (!hod.phone) errors.push("Phone is required");
    if (!hod.username) errors.push("Username is required");
    if (!hod.password) errors.push("Password is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (hod.email && !emailRegex.test(hod.email)) {
      errors.push("Invalid email format");
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (hod.phone && !phoneRegex.test(hod.phone)) {
      errors.push("Phone number must be 10 digits");
    }
    
    return errors;
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    setResults([]);
    setProgress(0);
    
    const totalHods = hods.length;
    const results = [];
    
    for (let i = 0; i < hods.length; i++) {
      const hod = hods[i];
      const errors = validateHod(hod);
      
      if (errors.length > 0) {
        results.push({
          index: i + 1,
          hod: hod.name || `HOD ${i + 1}`,
          status: "error",
          message: errors.join(", "),
        });
        setProgress(((i + 1) / totalHods) * 100);
        continue;
      }
      
      try {
        // Create FormData for multipart request
        const formData = new FormData();
        formData.append("hodId", hod.hodId);
        formData.append("name", hod.name);
        formData.append("departmentName", hod.departmentName);
        formData.append("email", hod.email);
        formData.append("phone", hod.phone);
        formData.append("username", hod.username);
        formData.append("password", hod.password);
        
        // Add a default placeholder image
        const response = await fetch('/img/user.png');
        const blob = await response.blob();
        formData.append("file", blob, "default-user.png");
        
        const apiResponse = await fetch(`${API_CONFIG.BASE_URL}/hods/add-hod`, {
          method: "POST",
          body: formData,
        });
        
        if (apiResponse.ok) {
          results.push({
            index: i + 1,
            hod: hod.name,
            status: "success",
            message: "HOD created successfully",
          });
        } else {
          const errorText = await apiResponse.text();
          results.push({
            index: i + 1,
            hod: hod.name,
            status: "error",
            message: errorText || "Failed to create HOD",
          });
        }
      } catch (error) {
        results.push({
          index: i + 1,
          hod: hod.name,
          status: "error",
          message: "Network error: " + error.message,
        });
      }
      
      setProgress(((i + 1) / totalHods) * 100);
    }
    
    setResults(results);
    setShowResults(true);
    setLoading(false);
  };

  const clearAllHods = () => {
    setHods([
      {
        hodId: "",
        name: "",
        departmentName: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      },
    ]);
    setResults([]);
    setShowResults(false);
  };

  const successCount = results.filter(r => r.status === "success").length;
  const errorCount = results.filter(r => r.status === "error").length;

  return (
    <div className="mt-12">
      <div className="mb-8">
        <Typography variant="h2" color="blue-gray" className="mb-2">
          Bulk Add HODs
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg">
          Add multiple Head of Departments to the system with their administrative information
        </Typography>
      </div>

      {/* Enhanced Header Card */}
      <Card className="mb-6 border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  HOD Registration System
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Fill in Head of Department details below. All fields are required for account creation.
                </Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="purple"
                variant="outlined"
                onClick={addHodRow}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Row
              </Button>
              <Button
                size="sm"
                color="red"
                variant="outlined"
                onClick={clearAllHods}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* HODs Input Form */}
      <div className="space-y-6">
        {hods.map((hod, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardHeader floated={false} shadow={false} className="rounded-none pb-2">
              <div className="flex items-center justify-between">
                <Typography variant="h6" color="blue-gray">
                  HOD #{index + 1}
                </Typography>
                <IconButton
                  size="sm"
                  color="red"
                  variant="text"
                  onClick={() => removeHodRow(index)}
                  disabled={hods.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    HOD ID *
                  </Typography>
                  <Input
                    placeholder="Enter HOD ID"
                    value={hod.hodId}
                    onChange={(e) => updateHod(index, "hodId", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Full Name *
                  </Typography>
                  <Input
                    placeholder="Dr. Jane Doe"
                    value={hod.name}
                    onChange={(e) => updateHod(index, "name", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Department *
                  </Typography>
                  <Select
                    value={hod.departmentName}
                    onChange={(value) => updateHod(index, "departmentName", value)}
                    placeholder="Select Department"
                    className="w-full"
                  >
                    {departments.map((dept) => (
                      <Option key={dept} value={dept}>
                        {dept}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Email Address *
                  </Typography>
                  <Input
                    type="email"
                    placeholder="jane@college.edu"
                    value={hod.email}
                    onChange={(e) => updateHod(index, "email", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Phone Number *
                  </Typography>
                  <Input
                    placeholder="1234567890"
                    value={hod.phone}
                    onChange={(e) => updateHod(index, "phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Username *
                  </Typography>
                  <Input
                    placeholder="Enter Username"
                    value={hod.username}
                    onChange={(e) => updateHod(index, "username", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-1">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Password *
                  </Typography>
                  <div className="relative">
                    <Input
                      type={showPasswords[index] ? "text" : "password"}
                      placeholder="Enter Password"
                      value={hod.password}
                      onChange={(e) => updateHod(index, "password", e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(index)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPasswords[index] ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Submit Section */}
      <Card className="mb-6">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Ready to Submit?
              </Typography>
              <Typography variant="small" color="gray">
                Review all HOD information before creating accounts
              </Typography>
            </div>
            <Button
              size="lg"
              color="purple"
              onClick={handleBulkSubmit}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <BuildingOfficeIcon className="h-5 w-5" />
                  Create HODs ({hods.length})
                </>
              )}
            </Button>
          </div>
          
          {loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="small" color="blue-gray">
                  Processing HODs...
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {Math.round(progress)}%
                </Typography>
              </div>
              <Progress value={progress} color="purple" />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Results Section */}
      {showResults && (
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex items-center justify-between">
              <Typography variant="h6" color="blue-gray">
                Processing Results
              </Typography>
              <div className="flex gap-2">
                <Chip value={`${successCount} Success`} color="green" />
                <Chip value={`${errorCount} Error`} color="red" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto p-0">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      #
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      HOD Name
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      Status
                    </Typography>
                  </th>
                  <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      Message
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography variant="small" color="blue-gray">
                        {result.index}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {result.hod}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-center gap-2">
                        {result.status === "success" ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                        <Chip
                          value={result.status}
                          color={result.status === "success" ? "green" : "red"}
                          size="sm"
                        />
                      </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography variant="small" color="blue-gray">
                        {result.message}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default BulkAddHODs;