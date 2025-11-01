import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import API_CONFIG from "../../../config/api.js";

export function StudentSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location.state]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const studentId = data.studentId; // Extract studentId from the login response
        localStorage.setItem("userRole", "student");
        localStorage.setItem("studentId", studentId);

        // Fetch student data by studentId
        const studentResponse = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.GET_BY_ID}/${studentId}`
        );

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          localStorage.setItem("studentData", JSON.stringify(studentData));

          // Redirect based on role
          navigate("/dashboard/student/home");
          console.log("Login successful:", studentData);
        } else {
          // Handle the case where fetching student data fails
          throw new Error(
            `Failed to fetch student data: ${studentResponse.statusText}`
          );
        }
      } else {
        const errorData = await response.text();
        setError(errorData || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/img/tat1.jpg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="w-full p-8 shadow-2xl backdrop-blur-sm bg-white/95 border border-white/20">
          <div className="text-center mb-8">
            <div className="mb-4">
              <img 
                src="/img/tat-logo.png" 
                alt="College Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>
            <Typography variant="h2" className="font-bold mb-2 text-gray-800">
              Student Portal
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal opacity-80"
            >
              Enter your credentials to access your dashboard
            </Typography>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <Typography variant="small" color="green" className="font-medium">
                  {successMessage}
                </Typography>
              </div>
            )}
            
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Username
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>
            
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center justify-start font-medium"
                  >
                    Remember Me
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Typography variant="small" color="red" className="font-medium">
                  {error}
                </Typography>
              </div>
            )}

            <Button 
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300" 
              fullWidth 
              type="submit"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium"
            >
              Not registered?
              <Link 
                to="/auth/student/sign-up" 
                className="text-blue-600 ml-2 hover:text-blue-800 transition-colors duration-200 font-semibold hover:underline"
              >
                Create account
              </Link>
            </Typography>
            <Typography
              variant="small"
              className="text-center text-blue-gray-500 font-medium mt-2"
            >
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium hover:underline"
              >
                ← Back to role selection
              </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudentSignIn;
