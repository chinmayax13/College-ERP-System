import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import BTechTimetable from "@/components/ProfessorTimetable";

export function Home() {
  const [statisticsData, setStatisticsData] = useState({
    totalStudents: 0,
    classesCompleted: 0,
    upcomingClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);

      // Fetch total students registered (using attendance API which is accessible)
      let totalStudents = 0;
      try {
        // Use attendance API to get all students from common departments
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
          } catch (deptError) {
            // Continue with other departments if one fails
            console.log(`Failed to fetch students from ${dept}:`, deptError.message);
          }
        }
        
        totalStudents = allStudents.length;
        console.log(`Successfully fetched ${totalStudents} total students`);
        
      } catch (error) {
        console.error('Error fetching students:', error);
        totalStudents = 0;
      }

      // Set statistics data
      setStatisticsData({
        totalStudents: totalStudents,
        classesCompleted: 45, // This could be fetched from attendance records
        upcomingClasses: 12,  // This could be calculated from timetable
      });
      
      setError(null);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const statisticsCards = [
    {
      title: "Total Students",
      value: loading ? "..." : statisticsData.totalStudents,
      footer: {
        color: "text-green-500",
        value: "Registered",
        label: "in the system"
      }
    },
    {
      icon: CalendarDaysIcon,
      title: "Classes Completed",
      value: loading ? "..." : statisticsData.classesCompleted,
      footer: {
        color: "text-green-500",
        value: "+5",
        label: "this week"
      }
    },
    {
      icon: ClockIcon,
      title: "Upcoming Classes", 
      value: loading ? "..." : statisticsData.upcomingClasses,
      footer: {
        color: "text-orange-500",
        value: "3",
        label: "today"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-gray-50 p-6 -mt-6">
      {/* Professor Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <Typography variant="h3" className="font-bold mb-2">
            Professor Dashboard 👨‍🏫
          </Typography>
          <Typography variant="lead" className="opacity-90">
            Manage your classes, track student progress, and stay updated with academic activities.
          </Typography>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6">
          <Card className="bg-red-50 border border-red-200">
            <CardBody className="p-4">
              <Typography variant="small" color="red" className="font-medium">
                {error}
              </Typography>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="mb-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {statisticsCards.map(({ icon, title, value, footer }, index) => {
          const gradients = [
            'from-emerald-500 to-emerald-700',
            'from-blue-500 to-blue-700', 
            'from-purple-500 to-purple-700',
            'from-orange-500 to-orange-700'
          ];
          return (
            <div key={title} className="transform hover:scale-105 transition-all duration-300">
              <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardBody className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[index % 4]} flex items-center justify-center shadow-lg`}>
                      {index === 0 && (
                        <div className="flex items-center justify-center w-full h-full">
                          <span className="text-white text-2xl font-bold">👥</span>
                        </div>
                      )}
                      {index === 1 && <CalendarDaysIcon className="w-8 h-8 text-white" />}
                      {index === 2 && <ClockIcon className="w-8 h-8 text-white" />}
                    </div>
                    <div className="text-right">
                      <Typography variant="small" className="text-blue-gray-500 font-medium uppercase tracking-wide">
                        {title}
                      </Typography>
                      <Typography variant="h4" className="font-bold text-blue-gray-800 mt-1">
                        {value}
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

      {/* BTech Timetable Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" className="font-bold text-blue-gray-800 flex items-center gap-2">
            📅 BTech Class Schedule
          </Typography>
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
            <Typography variant="small" className="text-white font-semibold">
              Academic Year 2024-25
            </Typography>
          </div>
        </div>
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardBody className="p-0">
            <BTechTimetable />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
