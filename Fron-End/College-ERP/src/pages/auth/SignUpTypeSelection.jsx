import { Button, Typography, Card, Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpTypeSelection() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUpType = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/auth/${type}/sign-up`);
      setIsLoading(false);
    }, 500); // Simulate a brief loading state
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
            <Typography variant="h2" className="font-bold text-gray-800 mb-2">
              Join Our College
            </Typography>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal opacity-80"
            >
              Select your role to create an account and become part of our academic community.
            </Typography>
          </div>
          
          <div className="space-y-4">
            <Button
              color="purple"
              size="lg"
              fullWidth
              onClick={() => handleSignUpType("hod")}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-purple-600 to-purple-700 py-4"
              aria-label="Sign up as HOD"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {isLoading ? <Spinner className="h-5 w-5" /> : "Head of Department"}
                </span>
              </div>
            </Button>
            
            <Button
              color="blue"
              size="lg"
              fullWidth
              onClick={() => handleSignUpType("professor")}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 py-4"
              aria-label="Sign up as Professor"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <span className="font-semibold">
                  {isLoading ? <Spinner className="h-5 w-5" /> : "Professor"}
                </span>
              </div>
            </Button>
            
            <Button
              color="teal"
              size="lg"
              fullWidth
              onClick={() => handleSignUpType("student")}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-teal-600 to-teal-700 py-4"
              aria-label="Sign up as Student"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                </svg>
                <span className="font-semibold">
                  {isLoading ? <Spinner className="h-5 w-5" /> : "Student"}
                </span>
              </div>
            </Button>

            <Button
              color="orange"
              size="lg"
              fullWidth
              onClick={() => handleSignUpType("admin")}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-orange-600 to-orange-700 py-4"
              aria-label="Sign up as Admin"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">
                  {isLoading ? <Spinner className="h-5 w-5" /> : "Admin"}
                </span>
              </div>
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Typography
              variant="small"
              color="blue-gray"
              className="text-center font-medium"
            >
              Already have an account?
              <Link 
                to="/" 
                className="text-blue-600 ml-2 hover:text-blue-800 transition-colors duration-200 font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </Typography>
          </div>
        </Card>
      </div>
    </div>
  );
}
