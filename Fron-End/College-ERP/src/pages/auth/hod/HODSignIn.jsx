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

export function HODSignIn() {
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
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.LOGIN}`, {
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
        const hodId = data.id;
        localStorage.setItem("userRole", "hod");
        localStorage.setItem("hodId", hodId);

        const hodResponse = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_BY_ID}/${hodId}`
        );

        if (hodResponse.ok) {
          const hodData = await hodResponse.json();
          localStorage.setItem("hodData", JSON.stringify(hodData));
          navigate("/dashboard/hod/home");
          console.log("Login successful:", hodData);
        } else {
          // Handle the case where fetching HOD data fails
          throw new Error(
            `Failed to fetch HOD data: ${hodResponse.statusText}`
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
              HOD Portal
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal opacity-80"
            >
              Enter your credentials to access administrative dashboard
            </Typography>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <Typography variant="small" color="green" className="font-medium">
                {successMessage}
              </Typography>
            </div>
          )}
          
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your username
            </Typography>
            <Input
              size="lg"
              placeholder="HODUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
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
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>
          {error && (
            <Typography
              variant="small"
              color="red"
              className="mt-4 text-center"
            >
              {error}
            </Typography>
          )}
          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <Link to="/auth/forgot-password">Forgot Password</Link>
            </Typography>
          </div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Not registered?
            <Link to="/auth/hod/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default HODSignIn;
