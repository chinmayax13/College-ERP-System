import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Chip,
  Progress,
  Alert,
} from "@material-tailwind/react";
import {
  EyeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});

  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");
    if (storedProfessorData) {
      setProfessor(JSON.parse(storedProfessorData));
    }
  }, []);

  useEffect(() => {
    if (professor) {
      fetchAttendanceData();
    }
  }, [professor]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get("http://localhost:8787/api/classes");
      const data = response.data;
      
      // Filter data for current professor
      const professorData = data.filter(session => 
        session.lecturer === professor.name
      );
      
      setAttendanceData(professorData);

      // Extract unique dates and subjects
      const dates = Array.from(
        new Set(
          professorData.flatMap((session) =>
            (session.attendanceList || []).flatMap((attendance) =>
              attendance.attendance ? Object.keys(attendance.attendance) : []
            )
          )
        )
      ).sort((a, b) => new Date(b) - new Date(a)); // Sort by most recent first

      const subjectsList = Array.from(
        new Set(professorData.map(session => session.subject).filter(Boolean))
      );

      setUniqueDates(dates);
      setSubjects(subjectsList);
      
      // Calculate attendance statistics
      calculateAttendanceStats(professorData);

    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendanceStats = (data) => {
    const stats = {};
    
    data.forEach(session => {
      const subject = session.subject;
      if (!stats[subject]) {
        stats[subject] = {
          totalClasses: 0,
          totalStudents: 0,
          totalPresent: 0,
          attendanceRate: 0
        };
      }
      
      stats[subject].totalClasses++;
      
      if (session.attendanceList) {
        session.attendanceList.forEach(student => {
          if (student.attendance) {
            Object.values(student.attendance).forEach(status => {
              stats[subject].totalStudents++;
              if (status === 'P') {
                stats[subject].totalPresent++;
              }
            });
          }
        });
      }
    });

    // Calculate percentages
    Object.keys(stats).forEach(subject => {
      const stat = stats[subject];
      stat.attendanceRate = stat.totalStudents > 0 
        ? Math.round((stat.totalPresent / stat.totalStudents) * 100)
        : 0;
    });

    setAttendanceStats(stats);
  };

  const filteredData = attendanceData.filter(session => {
    const matchesSubject = !filterSubject || session.subject === filterSubject;
    const matchesDate = !filterDate || uniqueDates.some(date => 
      date.includes(filterDate) && 
      session.attendanceList?.some(student => 
        student.attendance && Object.keys(student.attendance).includes(date)
      )
    );
    
    return matchesSubject && matchesDate;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h4" color="white" className="flex items-center gap-2">
            <EyeIcon className="h-6 w-6" />
            Attendance Records
          </Typography>
          <Typography variant="small" color="white" className="opacity-80">
            View and analyze attendance data for your classes
          </Typography>
        </CardHeader>

        <CardBody>
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Statistics Cards */}
          {Object.keys(attendanceStats).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(attendanceStats).map(([subject, stats]) => (
                <Card key={subject} className="bg-blue-gray-50">
                  <CardBody className="p-4">
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      {subject}
                    </Typography>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Typography variant="small" color="blue-gray">
                          Total Classes:
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {stats.totalClasses}
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="small" color="blue-gray">
                          Attendance Rate:
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {stats.attendanceRate}%
                        </Typography>
                      </div>
                      <Progress 
                        value={stats.attendanceRate} 
                        color={stats.attendanceRate >= 75 ? "green" : stats.attendanceRate >= 50 ? "yellow" : "red"}
                        className="mt-2"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6 bg-blue-gray-50">
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center gap-2">
                <FunnelIcon className="h-5 w-5" />
                Filters
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Filter by Subject"
                  value={filterSubject}
                  onChange={(value) => setFilterSubject(value)}
                >
                  <Option value="">All Subjects</Option>
                  {subjects.map((subject, index) => (
                    <Option key={index} value={subject}>
                      {subject}
                    </Option>
                  ))}
                </Select>
                <Input
                  type="date"
                  label="Filter by Date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <Input
                  label="Search Student"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => {
                    setFilterSubject("");
                    setFilterDate("");
                    setSearchStudent("");
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  size="sm"
                  onClick={fetchAttendanceData}
                  disabled={loading}
                >
                  {loading ? "Refreshing..." : "Refresh Data"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Attendance Table */}
          {loading ? (
            <div className="text-center py-8">
              <Typography variant="h6" color="blue-gray">
                Loading attendance data...
              </Typography>
            </div>
          ) : filteredData.length === 0 ? (
            <Card>
              <CardBody className="text-center py-8">
                <UserGroupIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  No Attendance Data Available
                </Typography>
                <Typography color="blue-gray" className="opacity-70">
                  No attendance records found matching your criteria.
                </Typography>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="overflow-x-auto p-0">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-blue-gray-50">
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Subject
                      </th>
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Students Present
                      </th>
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Attendance Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((session, sessionIndex) => {
                      const sessionStats = calculateSessionStats(session);
                      return (
                        <tr key={sessionIndex} className="border-b border-blue-gray-50 hover:bg-blue-gray-50">
                          <td className="px-6 py-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {session.subject || "N/A"}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Typography variant="small" color="blue-gray">
                              {session.attendanceDate ? new Date(session.attendanceDate).toLocaleDateString() : "N/A"}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="opacity-70">
                              {session.time || "N/A"}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Typography variant="small" color="blue-gray">
                              {sessionStats.present} / {sessionStats.total}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Chip
                                size="sm"
                                value={`${sessionStats.percentage}%`}
                                color={sessionStats.percentage >= 75 ? "green" : sessionStats.percentage >= 50 ? "yellow" : "red"}
                                variant="ghost"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );

  function calculateSessionStats(session) {
    let present = 0;
    let total = 0;
    
    if (session.attendanceList) {
      session.attendanceList.forEach(student => {
        if (student.attendance) {
          Object.values(student.attendance).forEach(status => {
            total++;
            if (status === 'P') present++;
          });
        }
      });
    }
    
    return {
      present,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }
};

export default AttendanceView;
