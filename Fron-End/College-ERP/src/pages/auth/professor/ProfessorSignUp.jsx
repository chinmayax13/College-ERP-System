import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import profileImg from "/img/user.png";

export function ProfessorSignUp() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [professorId, setProfessorId] = useState("");
  const [name, setName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [subject, setSubject] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    if (!name || !departmentName || !username || !password || !email || !phone || !professorId) {
      setError("Please fill in all required fields.");
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

    const formData = new FormData();
    formData.append("file", imageUrl);
    formData.append("professorId", professorId);
    formData.append("name", name);
    formData.append("departmentName", departmentName);
    formData.append("subject", subject);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("phone", phone);

    // Debug logging
    console.log("Form data being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      console.log("Sending Professor registration data...");
      const response = await axios.post(
        "http://localhost:8787/api/professors/add-prof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Success:", response.data);
      setSuccess("Professor registered successfully! Redirecting to login page...");
      setError("");
      
      // Reset form and redirect to login page after 3 seconds
      setTimeout(() => {
        setProfessorId("");
        setName("");
        setDepartmentName("");
        setSubject("");
        setUsername("");
        setPassword("");
        setEmail("");
        setPhone("");
        setImageUrl(null);
        setPreviewUrl(null);
        navigate('/auth/professor/sign-in', { 
          state: { message: 'Registration successful! Please sign in with your credentials.' }
        });
      }, 3000);
      
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Error uploading professor data. Please try again.";
      
      if (error.response && error.response.status === 409) {
        errorMessage = error.response.data;
      } else if (error.response && error.response.data) {
        // Handle different error response formats
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="m-8 flex justify-center">
      <Card className="w-full max-w-lg p-6">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Professor Sign Up
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your details to register.
          </Typography>
        </div>
        <form className="mt-8" onSubmit={handleSignUp}>
          <div className="mb-4 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewUrl || profileImg}
                alt="Profile"
                className="w-24 h-24 text-center rounded-full object-cover border"
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Professor profile photo"
              />
            </div>
            <Typography variant="small" color="blue-gray">
              Upload your Profile Photo
            </Typography>
            <Input
              size="lg"
              placeholder="Professor ID"
              value={professorId}
              onChange={(e) => setProfessorId(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Department Name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              size="lg"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              size="lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            className={`mt-6 ${loading ? "bg-green-500" : "bg-blue-500"}`}
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
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
          {success && (
            <Typography
              variant="small"
              color="green"
              className="mt-4 text-center"
            >
              Professor registered successfully!
            </Typography>
          )}
          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div>
          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Already have an account?
            <Link to="/auth/professor/sign-in" className="text-gray-900 ml-1">
              Sign In
            </Link>
          </Typography>
        </form>
      </Card>
    </section>
  );
}

export default ProfessorSignUp;
