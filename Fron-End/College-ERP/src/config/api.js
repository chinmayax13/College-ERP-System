// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787/api',
  ENDPOINTS: {
    STUDENTS: {
      LOGIN: '/students/login',
      REGISTER: '/students/add-student',
      FORGOT_PASSWORD: '/students/forgot-password',
      VERIFY_OTP: '/students/verify-otp',
      RESET_PASSWORD: '/students/reset-password',
      GET_ALL: '/students',
      GET_BY_ID: '/students',
    },
    PROFESSORS: {
      LOGIN: '/professors/login',
      REGISTER: '/professors/add-prof',
      FORGOT_PASSWORD: '/professors/forgot-password',
      VERIFY_OTP: '/professors/verify-otp',
      RESET_PASSWORD: '/professors/reset-password',
      GET_ALL: '/professors/get-prof',
      GET_BY_ID: '/professors',
    },
    HODS: {
      LOGIN: '/hods/login',
      REGISTER: '/hods/add-hod',
      FORGOT_PASSWORD: '/hods/forgot-password',
      VERIFY_OTP: '/hods/verify-otp',
      RESET_PASSWORD: '/hods/reset-password',
      GET_ALL: '/hods/get-hod',
      GET_BY_ID: '/hods',
      GET_DEPARTMENT_SUBJECTS: '/hods/department/subjects',
      GET_FACULTY: '/hods/department/faculty',
      GET_NOTIFICATIONS: '/hods/notifications',
      GET_SENT_EMAILS: '/hods/sent-emails',
      GET_DASHBOARD_DATA: '/hods/dashboard',
      GET_FACULTY_COUNT: '/hods/department/faculty/count',
      GET_STUDENT_COUNT: '/hods/department/students/count',
      GET_DASHBOARD_STATS: '/hods/dashboard/stats',
    },
    ADMIN: {
      LOGIN: '/admin/auth/login',
      REGISTER: '/admin/auth/signup',
      FORGOT_PASSWORD: '/admin/auth/forgot-password',
      VERIFY_OTP: '/admin/auth/verify-otp',
      RESET_PASSWORD: '/admin/auth/reset-password',
      GET_ALL: '/admin/auth/admins',
      GET_BY_ID: '/admin/auth',
      DASHBOARD_STATS: '/admin/dashboard/stats',
      STUDENTS: '/admin/students',
      PROFESSORS: '/admin/professors',
      HODS: '/admin/hods',
      DEPARTMENTS: '/admin/departments',
      COURSES: '/admin/courses',
    }
  }
};

// Helper function for API calls with error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_CONFIG;
