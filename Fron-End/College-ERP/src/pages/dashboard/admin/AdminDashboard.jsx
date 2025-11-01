import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  ChartBarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import API_CONFIG from "../../../config/api.js";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [hods, setHods] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  useEffect(() => {
    fetchDashboardStats();
    fetchAllData();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/dashboard/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [studentsRes, professorsRes, hodsRes, departmentsRes, coursesRes] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/admin/students`),
        fetch(`${API_CONFIG.BASE_URL}/admin/professors`),
        fetch(`${API_CONFIG.BASE_URL}/admin/hods`),
        fetch(`${API_CONFIG.BASE_URL}/admin/departments`),
        fetch(`${API_CONFIG.BASE_URL}/admin/courses`),
      ]);

      const [studentsData, professorsData, hodsData, departmentsData, coursesData] = await Promise.all([
        studentsRes.ok ? studentsRes.json() : [],
        professorsRes.ok ? professorsRes.json() : [],
        hodsRes.ok ? hodsRes.json() : [],
        departmentsRes.ok ? departmentsRes.json() : [],
        coursesRes.ok ? coursesRes.json() : [],
      ]);

      setStudents(studentsData);
      setProfessors(professorsData);
      setHods(hodsData);
      setDepartments(departmentsData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty arrays on error to prevent crashes
      setStudents([]);
      setProfessors([]);
      setHods([]);
      setDepartments([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/admin/${type}s/${id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          fetchAllData(); // Refresh data
          alert(`${type} deleted successfully`);
        } else {
          alert(`Error deleting ${type}`);
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}`);
      }
    }
  };

  const openDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedItem(null);
    setDialogType("");
  };

  const tabsData = [
    {
      label: "Dashboard",
      value: "dashboard",
      icon: ChartBarIcon,
    },
    {
      label: "Students",
      value: "students",
      icon: UserGroupIcon,
    },
    {
      label: "Professors",
      value: "professors",
      icon: AcademicCapIcon,
    },
    {
      label: "HODs",
      value: "hods",
      icon: BuildingOfficeIcon,
    },
    {
      label: "Departments",
      value: "departments",
      icon: BuildingOfficeIcon,
    },
    {
      label: "Courses",
      value: "courses",
      icon: BookOpenIcon,
    },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total Students
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {stats.totalStudents || 0}
                </Typography>
              </div>
              <UserGroupIcon className="h-12 w-12 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total Professors
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {stats.totalProfessors || 0}
                </Typography>
              </div>
              <AcademicCapIcon className="h-12 w-12 text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total HODs
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {stats.totalHODs || 0}
                </Typography>
              </div>
              <BuildingOfficeIcon className="h-12 w-12 text-purple-500" />
            </div>
          </CardBody>
        </Card>

        <Card className="border border-blue-gray-100 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Total Departments
                </Typography>
                <Typography variant="h3" color="blue-gray" className="font-bold">
                  {stats.totalDepartments || 0}
                </Typography>
              </div>
              <BuildingOfficeIcon className="h-12 w-12 text-orange-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="blue-gray">
              System Overview
            </Typography>
            <Button
              size="sm"
              color="blue"
              className="flex items-center gap-2"
              onClick={() => fetchDashboardStats()}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {stats.totalCourses || 0}
              </Typography>
              <Typography variant="small" color="blue-gray">
                Total Courses
              </Typography>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {stats.totalSemesters || 0}
              </Typography>
              <Typography variant="small" color="blue-gray">
                Total Semesters
              </Typography>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Typography variant="h4" color="blue-gray" className="font-bold">
                {stats.totalAttendanceRecords || 0}
              </Typography>
              <Typography variant="small" color="blue-gray">
                Attendance Records
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderTable = (data, type) => (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex items-center justify-between">
          <Typography variant="h6" color="blue-gray">
            {type.charAt(0).toUpperCase() + type.slice(1)} Management
          </Typography>
          <Button
            size="sm"
            color="blue"
            className="flex items-center gap-2"
            onClick={() => openDialog(type)}
          >
            <PlusIcon className="h-4 w-4" />
            Add {type.slice(0, -1)}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none opacity-70"
                >
                  Name
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none opacity-70"
                >
                  Email
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none opacity-70"
                >
                  Username
                </Typography>
              </th>
              <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold leading-none opacity-70"
                >
                  Actions
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? data.map((item, index) => {
              const isLast = index === data.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={index}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {item.name || item.studName || item.professorId || item.department || 'N/A'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {item.email || 'N/A'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray">
                      {item.username || 'N/A'}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <IconButton
                        size="sm"
                        color="blue"
                        variant="text"
                        onClick={() => openDialog(type, item)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="sm"
                        color="green"
                        variant="text"
                        onClick={() => openDialog(type, item)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="sm"
                        color="red"
                        variant="text"
                        onClick={() => handleDelete(type.slice(0, -1), item.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  <Typography variant="small" color="blue-gray">
                    No {type} found
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );

  return (
    <div className="mt-12">
      <div className="mb-8">
        <Typography variant="h2" color="blue-gray" className="mb-2">
          Admin Dashboard
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg">
          Manage your college ERP system
        </Typography>
      </div>

      <Tabs value={activeTab} className="overflow-visible">
        <TabsHeader className="relative z-0">
          {tabsData.map(({ label, value, icon }) => (
            <Tab key={value} value={value} onClick={() => setActiveTab(value)}>
              <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "h-5 w-5" })}
                {label}
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="!overflow-x-hidden !overflow-y-visible">
          <TabPanel value="dashboard" className="p-0">
            {renderDashboard()}
          </TabPanel>
          <TabPanel value="students" className="p-0">
            {renderTable(students, "student")}
          </TabPanel>
          <TabPanel value="professors" className="p-0">
            {renderTable(professors, "professor")}
          </TabPanel>
          <TabPanel value="hods" className="p-0">
            {renderTable(hods, "hod")}
          </TabPanel>
          <TabPanel value="departments" className="p-0">
            {renderTable(departments, "department")}
          </TabPanel>
          <TabPanel value="courses" className="p-0">
            {renderTable(courses, "course")}
          </TabPanel>
        </TabsBody>
      </Tabs>

      {/* Dialog for Add/Edit/View */}
      <Dialog open={showDialog} handler={closeDialog} size="lg">
        <DialogHeader>
          {dialogType === "add" ? "Add" : dialogType === "edit" ? "Edit" : "View"} {selectedItem ? "Item" : "New Item"}
        </DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            This is a placeholder for the {dialogType} form. You can implement the actual form here.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={closeDialog} className="mr-1">
            Cancel
          </Button>
          <Button color="blue" onClick={closeDialog}>
            {dialogType === "add" ? "Add" : dialogType === "edit" ? "Update" : "Close"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
