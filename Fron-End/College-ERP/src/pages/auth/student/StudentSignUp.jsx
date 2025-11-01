import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
  Alert,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import profileImg from "/img/user.png";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export function StudentSignUp() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [studName, setstudName] = useState("");
  const [studFatherName, setstudFatherName] = useState("");
  const [studLastName, setstudLastName] = useState("");
  const [studentAge, setstudentAge] = useState("");
  const [studentDob, setstudentDob] = useState("");
  const [studCaste, setstudCaste] = useState("");
  const [studCategory, setstudCategory] = useState("");
  const [studRollNo, setstudRollNo] = useState("");
  const [year, setYear] = useState("");
  const [studPhoneNumber, setstudPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    // Provide manual branch options since backend might not have departments
    const availableBranches = [
      "Computer Science Engineering",
      "Information Technology",
      "Computer Science and AIML",
      "Computer Science and Technology",
      "Data Science",
      "Electronics and Telecommunication",
      "Mechanical Engineering", 
      "Civil Engineering",
      "Electrical Engineering",
      "Chemical Engineering",
      "Biotechnology",
      "Aeronautical Engineering"
    ];
    
    setBranches(availableBranches);
    
    // Also try to fetch from API as backup
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8787/api/departments/get-dept"
        );
        if (response.data && response.data.length > 0) {
          // If API has data, use it; otherwise keep manual branches
          const departmentNames = response.data.map((dept) => dept.name);
          setBranches(departmentNames);
          console.log("Loaded branches from API:", departmentNames);
        } else {
          console.log("No departments from API, using manual branches");
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        // Keep the manual branches, don't show error since we have fallback
        console.log("Using manual branches as fallback");
      }
    };

    fetchDepartments();
  }, []);

  const resetForm = () => {
    setImageUrl(null);
    setPreviewUrl(null);
    setStudentId("");
    setUsername("");
    setPassword("");
    setEmail("");
    setstudName("");
    setstudFatherName("");
    setstudLastName("");
    setstudentAge("");
    setstudentDob("");
    setstudCaste("");
    setstudCategory("");
    setstudRollNo("");
    setYear("");
    setstudPhoneNumber("");
    setSelectedBranch("");
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageUrl(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic form validation
    if (
      !username ||
      !password ||
      !email ||
      !studName ||
      !studentId ||
      !selectedBranch ||
      !year ||
      !studRollNo ||
      !studentAge ||
      !studentDob ||
      !studPhoneNumber
    ) {
      setError("Please fill in all required fields including age, date of birth, and phone number.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (!imageUrl) {
      setError("Please upload a profile picture.");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(studPhoneNumber.replace(/\D/g, ''))) {
      setError("Please enter a valid 10-digit phone number.");
      setLoading(false);
      return;
    }

    // Skip duplicate checking due to authorization issues
    // The backend will handle duplicate validation and return appropriate errors

    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("studentId", studentId.trim());
    formData.append("username", username.trim());
    formData.append("password", password);
    formData.append("email", email.trim().toLowerCase());
    formData.append("name", studName.trim());
    formData.append("fatherName", studFatherName.trim());
    formData.append("lastName", studLastName.trim());
    formData.append("age", studentAge);
    formData.append("dob", studentDob);
    formData.append("caste", studCaste.trim());
    formData.append("category", studCategory.trim());
    formData.append("major", selectedBranch); // Changed from 'branch' to 'major'
    formData.append("roll-no", studRollNo);
    formData.append("year", year);
    formData.append("phone-number", studPhoneNumber.replace(/\D/g, '')); // Remove non-digits

    try {
      const response = await axios.post(
        "http://localhost:8787/api/students/add-student",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 second timeout
        }
      );
      console.log("Success:", response.data);
      setSuccess("Student account created successfully! Redirecting to login page...");
      setError("");
      
      // Reset form and redirect to login page after 3 seconds
      setTimeout(() => {
        resetForm();
        navigate('/auth/student/sign-in', { 
          state: { message: 'Registration successful! Please sign in with your credentials.' }
        });
      }, 3000);
      
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Error uploading student data. Please try again.";
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your internet connection and try again.";
      } else if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid data provided. Please check all fields and try again.";
            break;
          case 401:
            errorMessage = "Authentication failed. Please refresh the page and try again.";
            break;
          case 409:
            // Conflict - student already exists
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else {
              errorMessage = "A student with the same Student ID, Roll Number, Username, or Email already exists. Please use different values.";
            }
            break;
          case 413:
            errorMessage = "File size too large. Please upload a smaller image.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            if (typeof error.response.data === 'string') {
              errorMessage = error.response.data;
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data?.error) {
              errorMessage = error.response.data.error;
            }
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "No response from server. Please check if the server is running and try again.";
      }
      
      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex justify-center">
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4 text-blue-gray-800">
            Student Registration
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Create your student account to get started.
          </Typography>
        </div>

        {/* Enhanced Alert Messages */}
        {error && (
          <Alert 
            color="red" 
            className="mb-4" 
            icon={<XCircleIcon className="h-6 w-6" />}
            dismissible={{
              onClose: () => setError(""),
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            color="green" 
            className="mb-4" 
            icon={<CheckCircleIcon className="h-6 w-6" />}
            dismissible={{
              onClose: () => setSuccess(""),
            }}
          >
            {success}
          </Alert>
        )}

        <form className="mt-8" onSubmit={handleSignUp}>
          {/* Profile Photo Section */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={previewUrl || profileImg}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-gray-200 group-hover:border-blue-400 transition-colors duration-300"
              />
              <label
                htmlFor="profile-photo-upload"
                className="absolute inset-0 w-full h-full rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center cursor-pointer"
              >
                <Typography
                  variant="small"
                  color="white"
                  className="opacity-0 group-hover:opacity-100 font-medium"
                >
                  {previewUrl ? "Change" : "Upload"}
                </Typography>
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                onChange={handleImageChange}
                className="sr-only"
                title="Upload student profile photo"
                accept="image/*"
              />
            </div>
            <Typography variant="small" color="blue-gray" className="text-center">
              Click to upload profile photo
            </Typography>
          </div>
          {/* Personal Information Section */}
          <Typography variant="h5" className="mb-4 font-medium text-blue-gray-700 border-b border-blue-gray-200 pb-2">
            Personal Information
          </Typography>
          <div className="mb-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                size="lg"
                label="First Name"
                value={studName}
                onChange={(e) => {
                  setstudName(e.target.value);
                  if (error || success) {
                    setError("");
                    setSuccess("");
                  }
                }}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
              <Input
                size="lg"
                label="Last Name"
                value={studLastName}
                onChange={(e) => setstudLastName(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <Input
              size="lg"
              label="Father's Name"
              value={studFatherName}
              onChange={(e) => setstudFatherName(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Date of Birth *
              </Typography>
              <Input
                size="lg"
                type="date"
                value={studentDob}
                onChange={(e) => setstudentDob(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                size="lg"
                label="Age"
                type="number"
                value={studentAge}
                onChange={(e) => setstudentAge(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
              <Input
                size="lg"
                label="Phone Number"
                value={studPhoneNumber}
                onChange={(e) => setstudPhoneNumber(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                size="lg"
                label="Caste"
                value={studCaste}
                onChange={(e) => setstudCaste(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Input
                size="lg"
                label="Nationality"
                value={studCategory}
                onChange={(e) => setstudCategory(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
          </div>

          {/* Academic Information Section */}
          <Typography variant="h5" className="mb-4 font-medium text-blue-gray-700 border-b border-blue-gray-200 pb-2">
            Academic Information
          </Typography>
          <div className="mb-6 flex flex-col gap-4">
            <Input
              size="lg"
              label="Student ID"
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (error || success) {
                  setError("");
                  setSuccess("");
                }
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
            <Select
              label="Branch"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e)}
              required
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            >
              {branches.map((branch, index) => (
                <Option key={index} value={branch}>
                  {branch}
                </Option>
              ))}
            </Select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Year"
                value={year}
                onChange={(e) => setYear(e)}
                required
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              >
                <Option value="1">First Year</Option>
                <Option value="2">Second Year</Option>
                <Option value="3">Third Year</Option>
                <Option value="4">Fourth Year</Option>
              </Select>
              <Input
                size="lg"
                label="Roll Number"
                value={studRollNo}
                onChange={(e) => setstudRollNo(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>
          </div>

          {/* User Information Section */}
          <Typography variant="h5" className="mb-4 font-medium text-blue-gray-700 border-b border-blue-gray-200 pb-2">
            Account Information
          </Typography>
          <div className="mb-6 flex flex-col gap-4">
            <Input
              size="lg"
              label="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error || success) {
                  setError("");
                  setSuccess("");
                }
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
            <Input
              size="lg"
              label="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error || success) {
                  setError("");
                  setSuccess("");
                }
              }}
              type="email"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
            <Input
              size="lg"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error || success) {
                  setError("");
                  setSuccess("");
                }
              }}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              required
            />
            <Typography variant="small" color="blue-gray" className="font-normal">
              Password must be at least 6 characters long
            </Typography>
          </div>
          {/* Terms and Conditions */}
          <div className="mb-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-blue-500 transition-colors hover:text-blue-700 underline"
                  >
                    Terms and Conditions
                  </a>
                  &nbsp;and&nbsp;
                  <a
                    href="#"
                    className="font-normal text-blue-500 transition-colors hover:text-blue-700 underline"
                  >
                    Privacy Policy
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            fullWidth
            type="submit"
            disabled={loading || checking}
            size="lg"
          >
            {checking ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Checking Existing Data...
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                  ></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              "Create Student Account"
            )}
          </Button>
        </form>
        
        <Typography
          variant="small"
          color="gray"
          className="mt-6 flex justify-center items-center gap-1"
        >
          Already have an account?
          <Link
            to="/auth/student/sign-in"
            className="ml-1 font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300"
          >
            Sign In
          </Link>
        </Typography>
      </Card>
    </section>
  );
}

export default StudentSignUp;
