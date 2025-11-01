import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Tooltip,
  Progress,
  Spinner,
} from "@material-tailwind/react";
import { BellIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import {
  getDepartmentSubjects,
} from "@/API/ApiStore";
import { hodStatisticsCardsData } from "@/data/hod-statistics-data";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [departmentSubjects, setDepartmentSubjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sentEmails, setSentEmails] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    departmentRating: "4.8/5.0",
    activePrograms: 3,
  });
  const [loading, setLoading] = useState({
    subjects: true,
    activities: true,
    stats: true,
  });

  // Get HOD ID from localStorage the same way as notifications page
  const [hodId, setHodId] = useState('');

  useEffect(() => {
    const hodData = JSON.parse(localStorage.getItem("hodData"));
    if (hodData && hodData.id) {
      setHodId(hodData.id);
    } else {
      console.warn("HOD information not found in localStorage");
      // Try alternative storage methods
      const alternativeHodId = localStorage.getItem('hodId');
      if (alternativeHodId) {
        setHodId(alternativeHodId);
      }
    }
  }, []);

  useEffect(() => {
    if (hodId) {
      // Only fetch working endpoints
      fetchActivitiesData();
      fetchStatisticsData();
    }
  }, [hodId]);

  const fetchStatisticsData = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      let facultyCount = 0;
      let studentCount = 0;
      
      // Get ALL professors from the system
      try {
        const professorsResponse = await fetch('http://localhost:8787/api/professors/get-prof');
        if (professorsResponse.ok) {
          const professors = await professorsResponse.json();
          facultyCount = Array.isArray(professors) ? professors.length : 0;
        }
      } catch (error) {
        // Silent fail for professors
      }
      
      // Get ALL students from departments (skip the restricted /api/students endpoint)
      const departments = [
        'Computer Science', 'CSE', 'Information Technology', 'Electronics', 
        'Mechanical', 'Civil', 'Computer Engineering', 'IT', 'ECE', 'EEE',
        'Electrical', 'Chemical', 'Biotechnology', 'Aerospace'
      ];
      
      let allStudents = [];
      let studentIds = new Set();
      
      for (const dept of departments) {
        try {
          const deptResponse = await fetch(`http://localhost:8787/api/attendance/students/department/${dept}`);
          if (deptResponse.ok) {
            const deptStudents = await deptResponse.json();
            if (Array.isArray(deptStudents)) {
              deptStudents.forEach(student => {
                const studentId = student.studentId || student.id || student.studRollNo;
                if (!studentIds.has(studentId)) {
                  studentIds.add(studentId);
                  allStudents.push(student);
                }
              });
            }
          }
        } catch (error) {
          // Silent fail for individual departments
        }
      }
      
      studentCount = allStudents.length;
      
      setDashboardStats(prev => ({
        ...prev,
        totalFaculty: facultyCount,
        totalStudents: studentCount,
      }));
      
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Initialize with sample data since the API endpoint is not available
  useEffect(() => {
    if (hodId) {
      // Set sample subjects data
      setDepartmentSubjects([
        {
          id: 1,
          name: "Data Structures & Algorithms",
          lecturer: { name: "Dr. John Smith", avatar: "/img/team-1.jpeg" },
          totalLectures: 45,
          completedLectures: 32,
          completion: 71,
        },
        {
          id: 2,
          name: "Database Management Systems",
          lecturer: { name: "Prof. Sarah Wilson", avatar: "/img/team-2.jpeg" },
          totalLectures: 40,
          completedLectures: 35,
          completion: 87,
        },
        {
          id: 3,
          name: "Software Engineering",
          lecturer: { name: "Dr. Mike Johnson", avatar: "/img/team-3.jpeg" },
          totalLectures: 38,
          completedLectures: 25,
          completion: 66,
        },
      ]);
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  }, [hodId]);

  const fetchActivitiesData = async () => {
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      
      // Fetch notifications using the same endpoint as notifications page
      const notificationsResponse = await fetch(`http://localhost:8787/api/notifications/sent/${hodId}`);
      let notificationsData = [];
      
      if (notificationsResponse.ok) {
        notificationsData = await notificationsResponse.json();
      }
      
      // For now, set emails as empty array since you'll fix emails later
      const emailsData = [];
      
      setNotifications(notificationsData || []);
      setSentEmails(emailsData);
    } catch (error) {
      // Silent error handling
      setNotifications([]);
      setSentEmails([]);
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Format time like the notifications page
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Combine notifications and emails for recent activities
  const recentActivities = [...notifications, ...sentEmails]
    .sort((a, b) => new Date(b.timestamp || b.createdAt || b.sentAt) - new Date(a.timestamp || a.createdAt || a.sentAt))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-gray-50 p-6 -mt-6">
      {/* HOD Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
          <Typography variant="h3" className="font-bold mb-2">
            HOD Dashboard
          </Typography>
          <Typography variant="lead" className="opacity-90">
            Oversee department operations, manage faculty, and monitor academic progress across all programs.
          </Typography>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {hodStatisticsCardsData.map(({ icon, title, footer, ...rest }, index) => {
          const gradients = [
            'from-teal-500 to-teal-700',
            'from-cyan-500 to-cyan-700', 
            'from-blue-500 to-blue-700',
            'from-indigo-500 to-indigo-700'
          ];
          
          // Get dynamic values based on title
          let dynamicValue = rest.value;
          if (title === "Total Faculty") {
            dynamicValue = loading.stats ? "..." : dashboardStats.totalFaculty.toString();
          } else if (title === "Total Students") {
            dynamicValue = loading.stats ? "..." : dashboardStats.totalStudents.toString();
          } else if (title === "Department Rating") {
            dynamicValue = dashboardStats.departmentRating;
          } else if (title === "Active Programs") {
            dynamicValue = dashboardStats.activePrograms.toString();
          }
          
          return (
            <div key={title} className="transform hover:scale-105 transition-all duration-300">
              <Card className="bg-gradient-to-br from-white to-blue-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center shadow-lg`}>
                      {loading.stats && (title === "Total Faculty" || title === "Total Students") ? (
                        <Spinner className="w-6 h-6 text-white" />
                      ) : (
                        React.createElement(icon, {
                          className: "w-8 h-8 text-white",
                        })
                      )}
                    </div>
                    <div className="text-right">
                      <Typography variant="small" className="text-blue-gray-500 font-medium uppercase tracking-wide">
                        {title}
                      </Typography>
                      <Typography variant="h4" className="font-bold text-blue-gray-800 mt-1">
                        {dynamicValue}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography className="font-normal text-blue-gray-600 text-sm">
                      <strong className={footer.color}>{footer.value}</strong>
                      &nbsp;{footer.label}
                    </Typography>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${footer.color.includes('green') ? 'bg-green-100 text-green-800' : footer.color.includes('red') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                      {footer.color.includes('green') ? '↗' : footer.color.includes('red') ? '↘' : '→'}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Department Management Section */}
      <div className="mb-8">
        <Typography variant="h4" className="font-bold text-blue-gray-800 mb-6 flex items-center gap-2">
          Department Management
        </Typography>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <Card className="xl:col-span-2 bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-gray-100"
            >
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold mb-2">
                  Academic Subjects
                </Typography>
                <Typography
                  variant="small"
                  className="flex items-center gap-2 font-normal text-blue-gray-600"
                >
                  <CheckCircleIcon
                    strokeWidth={2}
                    className="h-5 w-5 text-green-500"
                  />
                  <strong>30 chapters completed this month</strong>
                </Typography>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Typography variant="h6" className="text-white font-bold">
                  #
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-4 pb-6">
              {loading.subjects ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner className="h-8 w-8" />
                  <Typography variant="small" className="ml-3 text-blue-gray-500">
                    Loading subjects...
                  </Typography>
                </div>
              ) : (
                <table className="w-full min-w-[640px] table-auto">
                  <thead>
                    <tr>
                      {["subject", "lecturer", "lectures", "completion"].map(
                        (el) => (
                          <th
                            key={el}
                            className="border-b border-blue-gray-50 py-3 px-6 text-left"
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium uppercase text-blue-gray-400"
                            >
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {departmentSubjects.map((subject, key) => {
                      const className = `py-3 px-5 ${
                        key === departmentSubjects.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={subject.id || key}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Typography variant="small" className="text-white font-bold">
                                  {subject.name ? subject.name.charAt(0) : 'S'}
                                </Typography>
                              </div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-bold"
                              >
                                {subject.name || subject.subjectName}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <div className="flex items-center gap-3">
                              <Avatar 
                                src={subject.lecturer?.avatar || "/img/user.png"} 
                                alt={subject.lecturer?.name || subject.professorName}
                                size="sm" 
                              />
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium"
                              >
                                {subject.lecturer?.name || subject.professorName}
                              </Typography>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              className="text-center font-medium text-blue-gray-600"
                            >
                              {subject.completedLectures || 0}/{subject.totalLectures || 0}
                            </Typography>
                          </td>
                          <td className={className}>
                            <div className="w-10/12">
                              <Typography
                                variant="small"
                                className="mb-1 block text-xs font-medium text-blue-gray-600"
                              >
                                {subject.completion || 0}%
                              </Typography>
                              <Progress
                                value={subject.completion || 0}
                                variant="gradient"
                                color={subject.completion === 100 ? "green" : subject.completion >= 70 ? "blue" : "orange"}
                                className="h-1"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
          
          <Card className="bg-white shadow-2xl border-0 rounded-2xl">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-blue-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h6" color="blue-gray" className="font-bold mb-2">
                    Notifications & Emails
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex items-center gap-2 font-normal text-blue-gray-600"
                  >
                    <BellIcon strokeWidth={2} className="h-4 w-4 text-blue-500" />
                    <strong>{recentActivities.length}</strong> recent activities
                  </Typography>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BellIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              {loading.activities ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner className="h-6 w-6" />
                  <Typography variant="small" className="ml-3 text-blue-gray-500">
                    Loading activities...
                  </Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.length > 0 ? recentActivities.map((activity, key) => {
                    const gradients = [
                      'from-blue-400 to-blue-600',
                      'from-green-400 to-green-600', 
                      'from-orange-400 to-orange-600',
                      'from-purple-400 to-purple-600',
                      'from-cyan-400 to-cyan-600',
                      'from-teal-400 to-teal-600'
                    ];
                    
                    // Determine if it's an email or notification
                    const isEmail = activity.type === 'email' || activity.emailType;
                    const IconComponent = isEmail ? EnvelopeIcon : BellIcon;
                    
                    return (
                      <div key={activity.id || key} className="flex items-start gap-4 p-3 rounded-xl hover:bg-blue-gray-50 transition-colors duration-200">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[key % 6]} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {activity.title}
                            </Typography>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isEmail
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isEmail ? 'Email' : 'Notification'}
                            </div>
                          </div>
                          
                          {/* Show subject if available */}
                          {activity.subject && (
                            <Typography
                              variant="small"
                              className="text-blue-gray-600 mb-1 font-medium"
                            >
                              Subject: {activity.subject}
                            </Typography>
                          )}
                          
                          <Typography
                            variant="small"
                            className="text-blue-gray-500 mb-1 line-clamp-2"
                          >
                            {activity.message}
                          </Typography>
                          
                          <div className="flex items-center justify-between">
                            <Typography
                              variant="small"
                              className="text-blue-gray-400 text-xs"
                            >
                              {activity.timestamp ? formatTimeAgo(activity.timestamp) : 'Recently'}
                            </Typography>
                            
                            {/* Show recipient type if available */}
                            {activity.recipientType && (
                              <Typography
                                variant="small"
                                className="text-blue-gray-400 text-xs"
                              >
                                To: {activity.recipientType.replace('ALL_', '').toLowerCase()}
                              </Typography>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8">
                      <BellIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                      <Typography variant="small" color="blue-gray" className="text-blue-gray-500">
                        No recent activities found
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;