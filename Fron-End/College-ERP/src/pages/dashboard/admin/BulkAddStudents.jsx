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
  UserGroupIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import API_CONFIG from "../../../config/api.js";

const BulkAddStudents = () => {
  const [students, setStudents] = useState([
    {
      registrationNumber: "",
      rollNumber: "",
      studName: "",
      branch: "",
      section: "",
      email: "",
      phone: "",
      semester: "",
      username: "",
      password: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPasswords, setShowPasswords] = useState({});

  const branches = [
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
  ];

  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const addStudentRow = () => {
    setStudents([
      ...students,
      {
        registrationNumber: "",
        rollNumber: "",
        studName: "",
        branch: "",
        section: "",
        email: "",
        phone: "",
        semester: "",
        username: "",
        password: "",
      },
    ]);
  };

  const removeStudentRow = (index) => {
    if (students.length > 1) {
      const newStudents = students.filter((_, i) => i !== index);
      setStudents(newStudents);
    }
  };

  const updateStudent = (index, field, value) => {
    const newStudents = [...students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setStudents(newStudents);
  };

  const togglePasswordVisibility = (index) => {
    setShowPasswords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const validateStudent = (student) => {
    const errors = [];
    
    if (!student.registrationNumber) errors.push("Registration number is required");
    if (!student.rollNumber) errors.push("Roll number is required");
    if (!student.studName) errors.push("Name is required");
    if (!student.branch) errors.push("Branch is required");
    if (!student.email) errors.push("Email is required");
    if (!student.phone) errors.push("Phone is required");
    if (!student.semester) errors.push("Semester is required");
    if (!student.username) errors.push("Username is required");
    if (!student.password) errors.push("Password is required");
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (student.email && !emailRegex.test(student.email)) {
      errors.push("Invalid email format");
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (student.phone && !phoneRegex.test(student.phone)) {
      errors.push("Phone number must be 10 digits");
    }
    
    return errors;
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    setResults([]);
    setProgress(0);
    
    const totalStudents = students.length;
    const results = [];
    
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const errors = validateStudent(student);
      
      if (errors.length > 0) {
        results.push({
          index: i + 1,
          student: student.studName || `Student ${i + 1}`,
          status: "error",
          message: errors.join(", "),
        });
        setProgress(((i + 1) / totalStudents) * 100);
        continue;
      }
      
      try {
        // Create FormData for multipart request
        const formData = new FormData();
        formData.append("registrationNumber", student.registrationNumber);
        formData.append("rollNumber", student.rollNumber);
        formData.append("studName", student.studName);
        formData.append("branch", student.branch);
        formData.append("section", student.section || "");
        formData.append("email", student.email);
        formData.append("phone", student.phone);
        formData.append("semester", student.semester);
        formData.append("username", student.username);
        formData.append("password", student.password);
        
        // Add a default placeholder image
        const response = await fetch('/img/user.png');
        const blob = await response.blob();
        formData.append("file", blob, "default-user.png");
        
        const apiResponse = await fetch(`${API_CONFIG.BASE_URL}/students/add-student`, {
          method: "POST",
          body: formData,
        });
        
        if (apiResponse.ok) {
          results.push({
            index: i + 1,
            student: student.studName,
            status: "success",
            message: "Student created successfully",
          });
        } else {
          const errorText = await apiResponse.text();
          results.push({
            index: i + 1,
            student: student.studName,
            status: "error",
            message: errorText || "Failed to create student",
          });
        }
      } catch (error) {
        results.push({
          index: i + 1,
          student: student.studName,
          status: "error",
          message: "Network error: " + error.message,
        });
      }
      
      setProgress(((i + 1) / totalStudents) * 100);
    }
    
    setResults(results);
    setShowResults(true);
    setLoading(false);
  };

  const clearAllStudents = () => {
    setStudents([
      {
        registrationNumber: "",
        rollNumber: "",
        studName: "",
        branch: "",
        section: "",
        email: "",
        phone: "",
        semester: "",
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
          Bulk Add Students
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg">
          Add multiple students to the system with their academic information
        </Typography>
      </div>

      {/* Enhanced Header Card */}
      <Card className="mb-6 border border-green-100 bg-gradient-to-r from-green-50 to-blue-50">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-full">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Student Registration System
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  Fill in student details below. Section is optional, all other fields are required.
                </Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="green"
                variant="outlined"
                onClick={addStudentRow}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Row
              </Button>
              <Button
                size="sm"
                color="red"
                variant="outlined"
                onClick={clearAllStudents}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Students Input Form */}
      <div className="space-y-6">
        {students.map((student, index) => (
          <Card key={index} className="border border-gray-200 shadow-sm">
            <CardHeader floated={false} shadow={false} className="rounded-none pb-2">
              <div className="flex items-center justify-between">
                <Typography variant="h6" color="blue-gray">
                  Student #{index + 1}
                </Typography>
                <IconButton
                  size="sm"
                  color="red"
                  variant="text"
                  onClick={() => removeStudentRow(index)}
                  disabled={students.length === 1}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Registration Number *
                  </Typography>
                  <Input
                    placeholder="REG1289000"
                    value={student.registrationNumber}
                    onChange={(e) => updateStudent(index, "registrationNumber", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Roll Number *
                  </Typography>
                  <Input
                    placeholder="ROLL001"
                    value={student.rollNumber}
                    onChange={(e) => updateStudent(index, "rollNumber", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Full Name *
                  </Typography>
                  <Input
                    placeholder="John Doe"
                    value={student.studName}
                    onChange={(e) => updateStudent(index, "studName", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Branch *
                  </Typography>
                  <Select
                    value={student.branch}
                    onChange={(value) => updateStudent(index, "branch", value)}
                    placeholder="Select Branch"
                    className="w-full"
                  >
                    {branches.map((branch) => (
                      <Option key={branch} value={branch}>
                        {branch}
                      </Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Section (Optional)
                  </Typography>
                  <Input
                    placeholder="A"
                    value={student.section}
                    onChange={(e) => updateStudent(index, "section", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Semester *
                  </Typography>
                  <Select
                    value={student.semester}
                    onChange={(value) => updateStudent(index, "semester", value)}
                    placeholder="Select Semester"
                    className="w-full"
                  >
                    {semesters.map((sem) => (
                      <Option key={sem} value={sem}>
                        Semester {sem}
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
                    placeholder="john@example.com"
                    value={student.email}
                    onChange={(e) => updateStudent(index, "email", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Phone Number *
                  </Typography>
                  <Input
                    placeholder="1234567890"
                    value={student.phone}
                    onChange={(e) => updateStudent(index, "phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Username *
                  </Typography>
                  <Input
                    placeholder="Enter Username"
                    value={student.username}
                    onChange={(e) => updateStudent(index, "username", e.target.value)}
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
                      value={student.password}
                      onChange={(e) => updateStudent(index, "password", e.target.value)}
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
                Review all student information before creating accounts
              </Typography>
            </div>
            <Button
              size="lg"
              color="green"
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
                  Create Students ({students.length})
                </>
              )}
            </Button>
          </div>
          
          {loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="small" color="blue-gray">
                  Processing students...
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {Math.round(progress)}%
                </Typography>
              </div>
              <Progress value={progress} color="green" />
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
                      Student Name
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
                        {result.student}
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

export default BulkAddStudents;