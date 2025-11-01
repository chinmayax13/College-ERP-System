import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_CONFIG from "../../../config/api.js";

export function AdminSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/auth/login`, {
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
        const adminId = data.id; // Extract admin ID from the login response
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminId", adminId);

        // Fetch admin data by adminId
        const adminResponse = await fetch(
          `${API_CONFIG.BASE_URL}/admin/auth/${adminId}`
        );

        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          localStorage.setItem("adminData", JSON.stringify(adminData));

          // Redirect to admin dashboard
          navigate("/dashboard/admin/dashboard");
          console.log("Admin login successful:", adminData);
        } else {
          // Handle the case where fetching admin data fails
          throw new Error(
            `Failed to fetch admin data: ${adminResponse.statusText}`
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
              Admin Portal
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal opacity-80"
            >
              Enter your admin credentials to access the dashboard
            </Typography>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
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
                to="/auth/admin/forgot-password" 
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
              className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300" 
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
                to="/auth/admin/sign-up" 
                className="text-purple-600 ml-2 hover:text-purple-800 transition-colors duration-200 font-semibold hover:underline"
              >
                Create admin account
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

export default AdminSignIn;
