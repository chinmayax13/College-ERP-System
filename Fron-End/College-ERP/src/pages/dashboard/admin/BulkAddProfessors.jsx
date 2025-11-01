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
  AcademicCapIcon,
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

const BulkAddProfessors = () => {
  const [professors, setProfessors] = useState([
    {
      professorId: "",
      name: "",
      departmentName: "",
      subject: "",
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
    "General",
  ];

  const subjects = [
    // Computer Science subjects
    "Data Structures and Algorithms",
    "Object Oriented Programming",
    "Database Management Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Graphics",
    // IT subjects
    "Information Systems",
    "Network Security",
    "Cloud Computing",
    "Mobile Application Development",
    // Core subjects
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Engineering Drawing",
    "Engineering Mechanics",
    "Thermodynamics",
    "Digital Electronics",
    "Analog Electronics",
    "Control Systems",
    // General
    "Other",
  ];

  const addProfessorRow = () => {
    setProfessors([
      ...professors,
      {
        professorId: "",
        name: "",
        departmentName: "",
        subject: "",
        email: "",
        phone: "",
        username: "",
        password: "",
      },
    ]);
  };

  const removeProfessorRow = (index) => {
    if (professors.length > 1) {
      const newProfessors = professors.filter((_, i) => i !== index);
      setProfessors(newProfessors);
    }
  };

  const updateProfessor = (index, field, value) => {
    const newProfessors = [...professors];
    newProfessors[index] = { ...newProfessors[index], [field]: value };
    setProfessors(newProfessors);
  };

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const validateProfessor = (professor) => {
    const errors = [];
    
    if (!professor.professorId) errors.push("Professor ID is required");
    if (!professor.name) errors.push("Name is required");
    if (!professor.departmentName) errors.push("Department is required");
    if (!professor.subject) errors.push("Subject is required");
    if (!professor.email) errors.push("Email is required");
    if (!professor.phone) errors.push("Phone is required");
    if (!professor.username) errors.push("Username is required");
    if (!professor.password) errors.push("Password is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (professor.email && !emailRegex.test(professor.email)) {
      errors.push("Invalid email format");
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (professor.phone && !phoneRegex.test(professor.phone)) {
      errors.push("Phone number must be 10 digits");
    }
    
    return errors;
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    setResults([]);
    setProgress(0);
    
    const totalProfessors = professors.length;
    const results = [];
    
    for (let i = 0; i < professors.length; i++) {
      const professor = professors[i];
      const errors = validateProfessor(professor);
      
      if (errors.length > 0) {
        results.push({
          index: i + 1,
          professor: professor.name || `Professor ${i + 1}`,
          status: "error",
          message: errors.join(", "),
        });
        setProgress(((i + 1) / totalProfessors) * 100);
        continue;
      }
      
      try {
        // Create FormData for multipart request
        const formData = new FormData();
        formData.append("professorId", professor.professorId);
        formData.append("name", professor.name);
        formData.append("departmentName", professor.departmentName);
        formData.append("subject", professor.subject);
        formData.append("email", professor.email);
        formData.append("phone", professor.phone);
        formData.append("username", professor.username);
        formData.append("password", professor.password);
        
        // Add a default placeholder image
        const response = await fetch('/img/user.png');
        const blob = await response.blob();
        formData.append("file", blob, "default-user.png");
        
        const apiResponse = await fetch(`${API_CONFIG.BASE_URL}/professors/add-prof`, {
          method: "POST",
          body: formData,
        });
        
        if (apiResponse.ok) {
          results.push({
            index: i + 1,
            professor: professor.name,
            status: "success",
            message: "Professor created successfully",
          });
        } else {
          const errorText = await apiResponse.text();
          results.push({
            index: i + 1,
            professor: professor.name,
            status: "error",
            message: errorText || "Failed to create professor",
          });
        }
      } catch (error) {
        results.push({
          index: i + 1,
          professor: professor.name,
          status: "error",
          message: "Network error: " + error.message,
        });
      }
      
      setProgress(((i + 1) / totalProfessors) * 100);
    }
    
    setResults(results);
    setShowResults(true);
    setLoading(false);
  };

  const clearAllProfessors = () => {
    setProfessors([
      {
        professorId: "",
        name: "",
        departmentName: "",
        subject: "",
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
          Bulk Add Professors
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg">
          Add multiple professors to the system with their academic information
        </Typography>
      </div>

      {/* Enhanced Header Card */}
      <Card className="mb-6 border border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Professor Registration System
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Fill in professor details below. All fields are required for account creation.
                </Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="blue"
                variant="outlined"
                onClick={addProfessorRow}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Row
              </Button>
              <Button
                size="sm"
                color="red"
                variant="outlined"
                onClick={clearAllProfessors}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Professors Input Form */}
      <div className="space-y-6">
        {professors.map((professor, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardHeader floated={false} shadow={false} className="rounded-none pb-2">
              <div className="flex items-center justify-between">
                <Typography variant="h6" color="blue-gray">
                  Professor #{index + 1}
                </Typography>
                <IconButton
                  size="sm"
                  color="red"
                  variant="text"
                  onClick={() => removeProfessorRow(index)}
                  disabled={professors.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Professor ID *
                  </Typography>
                  <Input
                    placeholder="Enter Professor ID"
                    value={professor.professorId}
                    onChange={(e) => updateProfessor(index, "professorId", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Full Name *
                  </Typography>
                  <Input
                    placeholder="Dr. John Smith"
                    value={professor.name}
                    onChange={(e) => updateProfessor(index, "name", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Department *
                  </Typography>
                  <Select
                    value={professor.departmentName}
                    onChange={(value) => updateProfessor(index, "departmentName", value)}
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
                    Subject *
                  </Typography>
                  <Select
                    value={professor.subject}
                    onChange={(value) => updateProfessor(index, "subject", value)}
                    placeholder="Select Subject"
                    className="w-full"
                  >
                    {subjects.map((subject) => (
                      <Option key={subject} value={subject}>
                        {subject}
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
                    placeholder="john@college.edu"
                    value={professor.email}
                    onChange={(e) => updateProfessor(index, "email", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Phone Number *
                  </Typography>
                  <Input
                    placeholder="1234567890"
                    value={professor.phone}
                    onChange={(e) => updateProfessor(index, "phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Username *
                  </Typography>
                  <Input
                    placeholder="Enter Username"
                    value={professor.username}
                    onChange={(e) => updateProfessor(index, "username", e.target.value)}
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
                      value={professor.password}
                      onChange={(e) => updateProfessor(index, "password", e.target.value)}
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
                Review all professor information before creating accounts
              </Typography>
            </div>
            <Button
              size="lg"
              color="blue"
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
                  <AcademicCapIcon className="h-5 w-5" />
                  Create Professors ({professors.length})
                </>
              )}
            </Button>
          </div>
          
          {loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="small" color="blue-gray">
                  Processing professors...
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {Math.round(progress)}%
                </Typography>
              </div>
              <Progress value={progress} color="blue" />
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
                      Professor Name
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
                        {result.professor}
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

export default BulkAddProfessors;