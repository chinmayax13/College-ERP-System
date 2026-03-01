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

// ============ Payment API Functions ============

// Get payment summary for a student
export const getPaymentSummary = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_SUMMARY}/${studentId}/summary`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch payment summary");
  }
};

// Get pending payments for a student
export const getPendingPayments = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_PENDING}/${studentId}/pending`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch pending payments");
  }
};

// Get payment history for a student
export const getPaymentHistory = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_HISTORY}/${studentId}/history`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch payment history");
  }
};

// Get all payments for a student
export const getAllPayments = async (studentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_BY_STUDENT}/${studentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch payments");
  }
};

// Initialize semester fee for a student
export const initializeSemesterFee = async (studentId, semester, academicYear, residentialType = 'DAY_SCHOLAR') => {
  try {
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.INITIALIZE_SEMESTER_FEE}`,
      null,
      {
        params: {
          studentId,
          semester,
          academicYear,
          residentialType
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to initialize semester fee");
  }
};

// Process a payment
export const processPayment = async (paymentId, paymentMethod, remarks = "") => {
  try {
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.PROCESS_PAYMENT}/${paymentId}`,
      null,
      {
        params: {
          paymentMethod,
          remarks
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to process payment");
  }
};

// Get fee structure
export const getFeeStructure = async () => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_FEE_STRUCTURE}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch fee structure");
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_BY_ID}/${paymentId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch payment details");
  }
};

// Get payment by transaction ID
export const getPaymentByTransactionId = async (transactionId) => {
  try {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS.GET_BY_TRANSACTION}/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Failed to fetch payment by transaction ID");
  }
};

