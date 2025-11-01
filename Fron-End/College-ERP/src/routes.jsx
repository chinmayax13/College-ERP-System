import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  EnvelopeIcon,
  PencilIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";
import { lazy, Suspense } from "react";

const HODHome = lazy(() => import("@/pages/dashboard/hod/Home"));
const HODProfile = lazy(() => import("@/pages/dashboard/hod/Profile"));
const Email = lazy(() => import("@/components/email/MailSender"));
const HODSemesterTable = lazy(() =>
  import("@/pages/dashboard/hod/SemesterTable")
);
const HODNotifications = lazy(() =>
  import("@/pages/dashboard/hod/Notifications")
);

const ProfessorHome = lazy(() => import("@/pages/dashboard/professor/Home"));
const ProfessorProfile = lazy(() =>
  import("@/pages/dashboard/professor/Profile")
);
const ProfessorNotifications = lazy(() =>
  import("@/pages/dashboard/professor/Notifications")
);

const AttendancePage = lazy(() =>
  import("@/pages/dashboard/professor/Attendance/AttendanceFlow")
);

const StudentAttendanceView = lazy(() =>
  import("@/pages/dashboard/student/StudentAttendanceView")
);

const StudentHome = lazy(() => import("@/pages/dashboard/student/Home"));
const StudentProfile = lazy(() => import("@/pages/dashboard/student/Profile"));
const StudentNotifications = lazy(() =>
  import("@/pages/dashboard/student/Notifications")
);
const StudentSemesterTable = lazy(() =>
  import("@/pages/dashboard/student/SemesterTable")
);

const HODSignIn = lazy(() => import("@/pages/auth/hod/HODSignIn"));
const HODSignUp = lazy(() => import("@/pages/auth/hod/HODSignUp"));

const ProfessorSignIn = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignIn")
);
const ProfessorSignUp = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignUp")
);

const StudentSignIn = lazy(() => import("@/pages/auth/student/StudentSignIn"));
const StudentSignUp = lazy(() => import("@/pages/auth/student/StudentSignUp"));

const AdminSignIn = lazy(() => import("@/pages/auth/admin/AdminSignIn"));
const AdminSignUp = lazy(() => import("@/pages/auth/admin/AdminSignUp"));

const ForgotPasswordFlow = lazy(() =>
  import("./pages/forgotPassword/ForgotPasswordFlow")
);

const AdminDashboard = lazy(() =>
  import("./pages/dashboard/admin/AdminDashboard")
);
const BulkAddStudents = lazy(() =>
  import("./pages/dashboard/admin/BulkAddStudents")
);
const BulkAddProfessors = lazy(() =>
  import("./pages/dashboard/admin/BulkAddProfessors")
);
const BulkAddHODs = lazy(() =>
  import("./pages/dashboard/admin/BulkAddHODs")
);
const AdminProfile = lazy(() =>
  import("./pages/dashboard/admin/AdminProfile")
);

const icon = {
  className: "w-5 h-5 text-inherit",
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
    </div>
  </div>
);

export const routes = [
  // HOD Dashboard Routes
  {
    layout: "dashboard",
    role: "hod", // Add role specification
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "HOD dashboard",
        path: "/hod/home",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "HOD Information",
        path: "/hod/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODProfile />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Department Faculty",
        path: "/hod/semesters",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSemesterTable />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Send Notifications",
        path: "/hod/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODNotifications />
          </Suspense>
        ),
      },
      {
        icon: <EnvelopeIcon {...icon} />,
        name: "Department E-Mail",
        path: "/hod/email",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Email />
          </Suspense>
        ),
      },
      // Note: Removed attendance access for HOD
    ],
  },
  // Professor Dashboard Routes
  {
    layout: "dashboard",
    role: "professor", // Add role specification
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Professor dashboard",
        path: "/professor/home",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "My Information",
        path: "/professor/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorProfile />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "My notifications",
        path: "/professor/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorNotifications />
          </Suspense>
        ),
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Take Attendance",
        path: "/professor/attendance",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AttendancePage />
          </Suspense>
        ),
      },
    ],
  },
  // Student Dashboard Routes
  {
    layout: "dashboard",
    role: "student", // Add role specification
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Student dashboard",
        path: "/student/home",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "My Information",
        path: "/student/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentProfile />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "My notifications",
        path: "/student/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentNotifications />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "My Academic Records",
        path: "/student/semestertable",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSemesterTable />
          </Suspense>
        ),
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: "View My Attendance",
        path: "/student/attendance",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentAttendanceView />
          </Suspense>
        ),
      },
    ],
  },
  // Admin Dashboard Routes
  {
    layout: "dashboard",
    title: "Admin Management",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "Admin Dashboard",
        path: "/admin/dashboard",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "Add Students",
        path: "/admin/add-students",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BulkAddStudents />
          </Suspense>
        ),
      },
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Add Professors",
        path: "/admin/add-professors",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BulkAddProfessors />
          </Suspense>
        ),
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "Add HODs",
        path: "/admin/add-hods",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <BulkAddHODs />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "My Profile",
        path: "/admin/profile",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminProfile />
          </Suspense>
        ),
      },
    ],
  },
  // Auth Routes
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Student sign-in",
        path: "student/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Student sign-up",
        path: "student/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSignUp />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPasswordFlow />
          </Suspense>
        ),
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Professor sign-in",
        path: "professor/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Professor sign-up",
        path: "professor/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorSignUp />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-in",
        path: "hod/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-up",
        path: "hod/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSignUp />
          </Suspense>
        ),
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Admin sign-in",
        path: "admin/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Admin sign-up",
        path: "admin/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSignUp />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;
