import axios from "axios";
import API_CONFIG from "../config/api.js";

// Function to send forgot password email based on role
export const sendForgotPasswordEmail = async (role, email) => {
  const endpointMap = {
    student: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.FORGOT_PASSWORD}`,
    professor: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFESSORS.FORGOT_PASSWORD}`,
    hod: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.FORGOT_PASSWORD}`,
  };

  try {
    const response = await axios.post(endpointMap[role], { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred";
  }
};

// export const sendForgotPasswordEmail = async (email) => {
//   try {
//     const response = await axios.post('/forgot-password', { email });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || 'An error occurred');
//   }
// };

// Function to verify OTP
export const verifyOTP = async (role, email, otp) => {
  const endpointMap = {
    student: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.VERIFY_OTP}`,
    professor: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFESSORS.VERIFY_OTP}`,
    hod: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.VERIFY_OTP}`,
  };

  try {
    const response = await axios.post(
      `${endpointMap[role]}?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "An error occurred");
  }
};

// Function to reset password
export const resetPassword = async (role, { email, password }) => {
  const endpointMap = {
    student: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.RESET_PASSWORD}`,
    professor: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFESSORS.RESET_PASSWORD}`,
    hod: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.RESET_PASSWORD}`,
  };

  try {
    const response = await axios.post(
      endpointMap[role],
      {
        email,
        newPassword: password,
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || "An error occurred";
    throw new Error(errorMessage);
  }
};

export const registerUser = async (role, userData) => {
  const endpointMap = {
    student: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STUDENTS.REGISTER}`,
    professor: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROFESSORS.REGISTER}`,
    hod: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.REGISTER}`,
  };

  try {
    const response = await axios.post(
      endpointMap[role],
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "An error occurred");
  }
};

// HOD Dashboard API Functions
export const getHODDashboardData = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_DASHBOARD_DATA}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch dashboard data");
  }
};

export const getDepartmentSubjects = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_DEPARTMENT_SUBJECTS}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch department subjects");
  }
};

export const getDepartmentFaculty = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_FACULTY}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch faculty data");
  }
};

export const getHODNotifications = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_NOTIFICATIONS}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch notifications");
  }
};

export const getHODSentEmails = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_SENT_EMAILS}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch sent emails");
  }
};

export const getHODDashboardStats = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_DASHBOARD_STATS}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch dashboard statistics");
  }
};

export const getFacultyCount = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_FACULTY_COUNT}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch faculty count");
  }
};

export const getStudentCount = async (hodId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HODS.GET_STUDENT_COUNT}/${hodId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch student count");
  }
};
