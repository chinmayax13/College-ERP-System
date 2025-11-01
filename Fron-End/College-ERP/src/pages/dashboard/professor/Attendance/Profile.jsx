import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Alert,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
const AttendanceByProf = () => {
  const [professor, setProfessor] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [dates, setDates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [allSubjectsData, setAllSubjectsData] = useState({});
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [attendanceStats, setAttendanceStats] = useState({});

  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");
    if (storedProfessorData) {
      const professorData = JSON.parse(storedProfessorData);
      setProfessor(professorData);
      setSelectedLecturer(professorData.name);
      
      // Fetch subjects from server instead of using hardcoded list
      fetchAvailableSubjects(professorData);
    } else {
      // If no professor data, still try to load semester data
      fetchAvailableSubjects({ name: "Test Professor", subject: "Test Subject" });
    }
  }, []);

  // Fetch all subjects from server based on semester curriculum
  const fetchAvailableSubjects = async (professorData) => {
    try {
      const response = await axios.get('http://localhost:8787/api/attendance/subjects/all');
      
      if (response.data && Object.keys(response.data).length > 0) {
        setAllSubjectsData(response.data);
        
        // Flatten all subjects from all semesters
        const allSubjects = [];
        Object.keys(response.data).forEach(semesterKey => {
          const semesterData = response.data[semesterKey];
          if (semesterData.subjects) {
            semesterData.subjects.forEach(subject => {
              if (!allSubjects.includes(subject)) {
                allSubjects.push(subject);
              }
            });
          }
        });

        // Add professor's subject if not in curriculum list
        const professorSubject = professorData?.subject;
        if (professorSubject && !allSubjects.includes(professorSubject)) {
          allSubjects.unshift(professorSubject);
        }
        
        setSubjects(allSubjects);
        setSelectedSubject(professorSubject || "");
      } else {
        // Create fallback semester data structure
        const fallbackData = {
          "1": {
            semesterName: "1st Semester",
            subjects: ["Mathematics I", "Programming Fundamentals C", "Physics"]
          },
          "2": {
            semesterName: "2nd Semester", 
            subjects: ["Mathematics II", "Object Oriented Programming using JAVA", "Chemistry"]
          },
          "3": {
            semesterName: "3rd Semester",
            subjects: ["Data Structures", "Operating Systems", "Database Management Systems"]
          },
          "4": {
            semesterName: "4th Semester",
            subjects: ["Software Engineering", "Web Technologies", "Computer Networks"]
          }
        };
        
        setAllSubjectsData(fallbackData);
        
        const fallbackSubjects = [
          "Mathematics I", "Programming Fundamentals C", "Object Oriented Programming using JAVA",
          "Data Structures", "Operating Systems", "Computer Networks", "Database Management Systems"
        ];
        setSubjects(fallbackSubjects);
        setSelectedSubject(professorData?.subject || "");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      
      // Create fallback semester data structure
      const fallbackData = {
        "1": {
          semesterName: "1st Semester",
          subjects: ["Mathematics I", "Programming Fundamentals C", "Physics"]
        },
        "2": {
          semesterName: "2nd Semester",
          subjects: ["Mathematics II", "Object Oriented Programming using JAVA", "Chemistry"]
        },
        "3": {
          semesterName: "3rd Semester", 
          subjects: ["Data Structures", "Operating Systems", "Database Management Systems"]
        },
        "4": {
          semesterName: "4th Semester",
          subjects: ["Software Engineering", "Web Technologies", "Machine Learning"]
        }
      };
      
      setAllSubjectsData(fallbackData);
      
      const fallbackSubjects = [
        "Mathematics I", "Programming Fundamentals C", "Object Oriented Programming using JAVA",
        "Data Structures", "Operating Systems", "Computer Networks", "Database Management Systems",
        "Software Engineering", "Web Technologies", "Machine Learning"
      ];
      setSubjects(fallbackSubjects);
      setSelectedSubject(professorData?.subject || "");
    }
  };

  // Filter subjects by selected semester
  useEffect(() => {
    if (Object.keys(allSubjectsData).length > 0) {
      let newSubjects = [];
      
      if (selectedSemester === "all") {
        // Show all subjects
        Object.keys(allSubjectsData).forEach(semesterKey => {
          const semesterData = allSubjectsData[semesterKey];
          if (semesterData.subjects) {
            semesterData.subjects.forEach(subject => {
              if (!newSubjects.includes(subject)) {
                newSubjects.push(subject);
              }
            });
          }
        });
        
        // Add professor's subject if not in curriculum list
        const professorSubject = professor?.subject;
        if (professorSubject && !newSubjects.includes(professorSubject)) {
          newSubjects.unshift(professorSubject);
        }
      } else {
        // Show subjects for selected semester only
        const semesterData = allSubjectsData[selectedSemester];
        if (semesterData && semesterData.subjects) {
          newSubjects = [...semesterData.subjects];
        }
      }
      
      setSubjects(newSubjects);
      
      // Reset selected subject if it's not in the new filtered list
      if (selectedSubject && !newSubjects.includes(selectedSubject)) {
        setSelectedSubject("");
      }
    }
  }, [selectedSemester, allSubjectsData, professor, selectedSubject]);

  // Clear results when lecturer or subject changes
  useEffect(() => {
    // Clear previous results when selection changes
    setAttendanceRecords([]);
    setDates([]);
    setAttendanceStats({});
    setError("");
  }, [selectedLecturer, selectedSubject]);

  const fetchAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Clear previous results
    setAttendanceRecords([]);
    setDates([]);
    setAttendanceStats({});
    
    try {
      const response = await axios.get(
        "http://localhost:8787/api/attendance/lecturer/subject",
        {
          params: {
            lecturer: selectedLecturer,
            subject: selectedSubject,
          },
        }
      );

      // Check if response has data
      if (!response.data || Object.keys(response.data).length === 0) {
        setError("No attendance records found for the selected lecturer and subject combination.");
        return;
      }

      // Transform the response data
      const transformedData = transformData(response.data);
      
      setAttendanceRecords(transformedData.records);
      setDates(transformedData.dates);
      
      // Calculate statistics
      calculateStats(transformedData.records, transformedData.dates);
      
    } catch (err) {
      setError(`Error fetching attendance data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (records, dates) => {
    let totalPresent = 0;
    let totalClasses = 0;
    const studentStats = {};
    let excellentStudents = 0; // >= 90%
    let goodStudents = 0; // 75-89%
    let averageStudents = 0; // 60-74%
    let lowStudents = 0; // < 60%

    records.forEach(record => {
      dates.forEach(date => {
        if (record[date]) {
          totalClasses++;
          if (record[date] === 'P') {
            totalPresent++;
          }
          
          // Per student stats
          if (!studentStats[record.studentName]) {
            studentStats[record.studentName] = { present: 0, total: 0 };
          }
          studentStats[record.studentName].total++;
          if (record[date] === 'P') {
            studentStats[record.studentName].present++;
          }
        }
      });
    });

    // Calculate student performance categories
    Object.values(studentStats).forEach(stat => {
      const percentage = stat.total > 0 ? (stat.present / stat.total) * 100 : 0;
      if (percentage >= 90) excellentStudents++;
      else if (percentage >= 75) goodStudents++;
      else if (percentage >= 60) averageStudents++;
      else lowStudents++;
    });

    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
    
    setAttendanceStats({
      overallPercentage,
      totalClasses: dates.length,
      totalStudents: records.length,
      studentStats,
      performanceBreakdown: {
        excellent: excellentStudents,
        good: goodStudents,
        average: averageStudents,
        low: lowStudents
      },
      classWiseStats: dates.map(date => {
        const dayPresent = records.filter(record => record[date] === 'P').length;
        const dayTotal = records.filter(record => record[date]).length;
        return {
          date,
          present: dayPresent,
          absent: dayTotal - dayPresent,
          percentage: dayTotal > 0 ? Math.round((dayPresent / dayTotal) * 100) : 0
        };
      })
    });
  };

  // Function to transform the fetched data
  const transformData = (data) => {
    const dates = Object.keys(data); // Extract dates
    const studentRecords = {};

    dates.forEach((date) => {
      data[date].forEach((record) => {
        if (!studentRecords[record.studentName]) {
          studentRecords[record.studentName] = { id: record.id };
        }
        studentRecords[record.studentName][date] = record.status;
      });
    });

    const records = Object.entries(studentRecords).map(
      ([studentName, record]) => ({
        studentName,
        ...record,
      })
    );

    return { records, dates };
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h4" color="white" className="flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6" />
            Attendance Analytics
          </Typography>
          <Typography variant="small" color="white" className="opacity-80">
            View detailed attendance statistics and trends
          </Typography>
        </CardHeader>

        <CardBody>
          {/* Search Form */}
          <Card className="mb-6 bg-blue-gray-50">
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Search Attendance Records
              </Typography>
              
              {/* Semester Filter */}
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Filter by Semester (Optional)
                </Typography>
                <Select
                  key={`semester-${selectedSemester}-${Object.keys(allSubjectsData).length}`}
                  value={selectedSemester}
                  onChange={(value) => setSelectedSemester(value)}
                  label="Select Semester"
                  className="w-full md:w-1/2"
                >
                  <Option value="all">All Semesters</Option>
                  {Object.keys(allSubjectsData).map(semesterKey => {
                    const semesterData = allSubjectsData[semesterKey];
                    return (
                      <Option key={semesterKey} value={semesterKey}>
                        {semesterData.semesterName} ({semesterData.subjects?.length || 0} subjects)
                      </Option>
                    );
                  })}
                </Select>
                <Typography variant="small" color="gray" className="mt-1">
                  Filter subjects by semester for focused analytics
                  {Object.keys(allSubjectsData).length > 0 && (
                    <span className="text-blue-500"> • {Object.keys(allSubjectsData).length} semesters available</span>
                  )}
                  {Object.keys(allSubjectsData).length === 0 && (
                    <span className="text-red-500"> • Loading semesters...</span>
                  )}
                </Typography>
                {selectedSemester && selectedSemester !== "all" && allSubjectsData[selectedSemester] && (
                  <Typography variant="small" color="blue" className="mt-1 font-medium">
                    Selected: {allSubjectsData[selectedSemester].semesterName}
                  </Typography>
                )}
              </div>

              <form onSubmit={fetchAttendance}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Lecturer
                    </Typography>
                    <Input
                      value={selectedLecturer}
                      onChange={(e) => setSelectedLecturer(e.target.value)}
                      placeholder="Enter lecturer name"
                      required
                      disabled={professor ? true : false}
                    />
                    {professor && (
                      <Typography variant="small" color="blue-gray" className="mt-1 opacity-70">
                        Using your profile data
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                      Subject {selectedSemester !== "all" && (
                        <span className="text-blue-500 text-xs">
                          ({allSubjectsData[selectedSemester]?.semesterName})
                        </span>
                      )}
                    </Typography>
                    <Select
                      key={`subject-${selectedSubject}-${subjects.length}`}
                      value={selectedSubject}
                      onChange={(value) => setSelectedSubject(value)}
                      label="Select Subject"
                      required
                      disabled={subjects.length === 0}
                    >
                      {subjects.length > 0 ? (
                        subjects.map((subject, index) => (
                          <Option key={index} value={subject}>
                            {subject}
                          </Option>
                        ))
                      ) : (
                        <Option disabled value="">
                          No subjects available for selected semester
                        </Option>
                      )}
                    </Select>
                    <Typography variant="small" color="blue-gray" className="mt-1 opacity-70">
                      Available: {subjects.length} subjects
                      {selectedSemester !== "all" && (
                        <span className="text-blue-500"> | Filtered by {allSubjectsData[selectedSemester]?.semesterName}</span>
                      )}
                      {selectedSubject && !subjects.includes(selectedSubject) && (
                        <span className="text-red-500"> | Selected subject not available in this semester</span>
                      )}
                    </Typography>
                    {selectedSubject && (
                      <Typography variant="small" color="blue" className="mt-1 font-medium">
                        Selected Subject: {selectedSubject}
                      </Typography>
                    )}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="mt-4"
                  disabled={loading || !selectedLecturer || !selectedSubject}
                  fullWidth
                  color={selectedLecturer && selectedSubject ? "blue" : "gray"}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Fetching Analytics...
                    </span>
                  ) : (
                    `Analyze Attendance for ${selectedSubject || 'Subject'}`
                  )}
                </Button>
                
                {!selectedLecturer || !selectedSubject ? (
                  <Typography variant="small" color="red" className="mt-2 text-center">
                    Please select both lecturer and subject to view analytics
                  </Typography>
                ) : (
                  <Typography variant="small" color="green" className="mt-2 text-center">
                    Ready to fetch analytics for {selectedSubject}
                  </Typography>
                )}
              </form>
            </CardBody>
          </Card>

          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Statistics */}
          {Object.keys(attendanceStats).length > 0 && (
            <>
              {/* Main Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-blue-50">
                  <CardBody className="p-4 text-center">
                    <Typography variant="h4" color="blue" className="font-bold">
                      {attendanceStats.totalClasses}
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      Total Classes
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="bg-green-50">
                  <CardBody className="p-4 text-center">
                    <Typography variant="h4" color="green" className="font-bold">
                      {attendanceStats.totalStudents}
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      Total Students
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="bg-purple-50">
                  <CardBody className="p-4 text-center">
                    <Typography variant="h4" color="purple" className="font-bold">
                      {attendanceStats.overallPercentage}%
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      Overall Attendance
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="bg-orange-50">
                  <CardBody className="p-4">
                    <Typography variant="small" color="blue-gray" className="mb-2">
                      Attendance Rate
                    </Typography>
                    <Progress 
                      value={attendanceStats.overallPercentage} 
                      color={attendanceStats.overallPercentage >= 75 ? "green" : attendanceStats.overallPercentage >= 50 ? "yellow" : "red"}
                      className="mb-2"
                    />
                    <Typography variant="small" color="blue-gray" className="text-center">
                      {attendanceStats.overallPercentage >= 75 ? "Excellent" : attendanceStats.overallPercentage >= 50 ? "Good" : "Needs Improvement"}
                    </Typography>
                  </CardBody>
                </Card>
              </div>

              {/* Performance Breakdown */}
              {attendanceStats.performanceBreakdown && (
                <Card className="mb-6">
                  <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
                    <Typography variant="h6" color="white" className="flex items-center gap-2">
                      <ChartBarIcon className="h-5 w-5" />
                      Student Performance Distribution
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-green-100 p-4 rounded-lg text-center border-l-4 border-green-500">
                        <Typography variant="h5" color="green" className="font-bold">
                          {attendanceStats.performanceBreakdown.excellent}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-medium">
                          Excellent (≥90%)
                        </Typography>
                        <Typography variant="small" color="green" className="opacity-80">
                          Outstanding performers
                        </Typography>
                      </div>
                      
                      <div className="bg-blue-100 p-4 rounded-lg text-center border-l-4 border-blue-500">
                        <Typography variant="h5" color="blue" className="font-bold">
                          {attendanceStats.performanceBreakdown.good}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-medium">
                          Good (75-89%)
                        </Typography>
                        <Typography variant="small" color="blue" className="opacity-80">
                          Above average
                        </Typography>
                      </div>
                      
                      <div className="bg-yellow-100 p-4 rounded-lg text-center border-l-4 border-yellow-500">
                        <Typography variant="h5" color="yellow" className="font-bold">
                          {attendanceStats.performanceBreakdown.average}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-medium">
                          Average (60-74%)
                        </Typography>
                        <Typography variant="small" color="yellow" className="opacity-80">
                          Satisfactory
                        </Typography>
                      </div>
                      
                      <div className="bg-red-100 p-4 rounded-lg text-center border-l-4 border-red-500">
                        <Typography variant="h5" color="red" className="font-bold">
                          {attendanceStats.performanceBreakdown.low}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-medium">
                          Low (&lt;60%)
                        </Typography>
                        <Typography variant="small" color="red" className="opacity-80">
                          Needs attention
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Class-wise Attendance Trend */}
              {attendanceStats.classWiseStats && attendanceStats.classWiseStats.length > 0 && (
                <Card className="mb-6">
                  <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
                    <Typography variant="h6" color="white" className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-5 w-5" />
                      Class-wise Attendance Trend
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left p-3 text-sm font-bold text-gray-700">Date</th>
                            <th className="text-center p-3 text-sm font-bold text-gray-700">Present</th>
                            <th className="text-center p-3 text-sm font-bold text-gray-700">Absent</th>
                            <th className="text-center p-3 text-sm font-bold text-gray-700">Percentage</th>
                            <th className="text-center p-3 text-sm font-bold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceStats.classWiseStats.map((classData, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium">
                                {new Date(classData.date).toLocaleDateString('en-GB')}
                              </td>
                              <td className="p-3 text-sm text-center">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  {classData.present}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-center">
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  {classData.absent}
                                </span>
                              </td>
                              <td className="p-3 text-sm text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  classData.percentage >= 90 ? 'bg-green-200 text-green-900' :
                                  classData.percentage >= 75 ? 'bg-blue-200 text-blue-900' :
                                  classData.percentage >= 60 ? 'bg-yellow-200 text-yellow-900' :
                                  'bg-red-200 text-red-900'
                                }`}>
                                  {classData.percentage}%
                                </span>
                              </td>
                              <td className="p-3 text-sm text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  classData.percentage >= 80 ? 'bg-green-100 text-green-800' :
                                  classData.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {classData.percentage >= 80 ? 'Good' : classData.percentage >= 60 ? 'Average' : 'Poor'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              )}
            </>
          )}

          {/* Individual Student Performance Summary */}
          {attendanceStats.studentStats && Object.keys(attendanceStats.studentStats).length > 0 && (
            <Card className="mb-6">
              <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
                <Typography variant="h6" color="white" className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5" />
                  Student Performance Rankings
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-3">
                    {Object.entries(attendanceStats.studentStats)
                      .sort(([,a], [,b]) => (b.present/b.total) - (a.present/a.total))
                      .map(([studentName, stats], index) => {
                        const percentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
                        const getRankClass = (rank) => {
                          if (rank === 0) return "bg-yellow-100 border-yellow-300";
                          if (rank === 1) return "bg-gray-100 border-gray-300";
                          if (rank === 2) return "bg-orange-100 border-orange-300";
                          return "bg-blue-gray-50 border-blue-gray-200";
                        };
                        
                        const getPerformanceClass = (pct) => {
                          if (pct >= 90) return "text-green-700 bg-green-100 border-green-300";
                          if (pct >= 75) return "text-blue-700 bg-blue-100 border-blue-300";
                          if (pct >= 60) return "text-yellow-700 bg-yellow-100 border-yellow-300";
                          return "text-red-700 bg-red-100 border-red-300";
                        };

                        return (
                          <div key={studentName} className={`p-4 rounded-lg border-2 ${getRankClass(index)} flex justify-between items-center`}>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center">
                                <Typography variant="small" color="gray" className="text-xs">
                                  Rank
                                </Typography>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  #{index + 1}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="small" color="blue-gray" className="font-bold">
                                  {studentName}
                                </Typography>
                                <Typography variant="small" color="gray" className="flex items-center gap-2">
                                  <span>Classes Attended: {stats.present}/{stats.total}</span>
                                  {index < 3 && (
                                    <span className="text-yellow-600">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </span>
                                  )}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <Typography variant="small" color="gray" className="text-xs">
                                  Attendance Rate
                                </Typography>
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                  {percentage}%
                                </Typography>
                              </div>
                              <div className={`px-3 py-2 rounded-full border-2 ${getPerformanceClass(percentage)}`}>
                                <Typography variant="small" className="font-bold">
                                  {percentage >= 90 ? 'Excellent' : 
                                   percentage >= 75 ? 'Good' : 
                                   percentage >= 60 ? 'Average' : 'Poor'}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Attendance Table */}
          {attendanceRecords.length > 0 && (
            <Card>
              <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
                <Typography variant="h6" color="white" className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5" />
                  Detailed Attendance Records
                </Typography>
              </CardHeader>
              <CardBody className="overflow-x-auto p-0">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-blue-gray-50">
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Sr. No
                      </th>
                      <th className="px-6 py-3 bg-blue-gray-50 text-left text-sm font-bold text-blue-gray-600">
                        Student Name
                      </th>
                      {dates.map((date, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 bg-blue-gray-50 text-center text-sm font-bold text-blue-gray-600"
                        >
                          <div className="flex flex-col items-center">
                            <CalendarDaysIcon className="h-4 w-4 mb-1" />
                            {new Date(date).toLocaleDateString("en-GB")}
                          </div>
                        </th>
                      ))}
                      <th className="px-6 py-3 bg-blue-gray-50 text-center text-sm font-bold text-blue-gray-600">
                        Attendance %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record, index) => {
                      const studentStat = attendanceStats.studentStats?.[record.studentName] || { present: 0, total: 0 };
                      const studentPercentage = studentStat.total > 0 ? Math.round((studentStat.present / studentStat.total) * 100) : 0;
                      
                      return (
                        <tr key={index} className="border-b border-blue-gray-50 hover:bg-blue-gray-50">
                          <td className="px-6 py-4 text-center">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {index + 1}
                            </Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Typography variant="small" color="blue-gray" className="font-medium">
                              {record.studentName}
                            </Typography>
                          </td>
                          {dates.map((date, idx) => (
                            <td key={idx} className="px-6 py-4 text-center">
                              {record[date] ? (
                                <Chip
                                  size="sm"
                                  value={record[date]}
                                  color={record[date] === 'P' ? "green" : "red"}
                                  variant="ghost"
                                />
                              ) : (
                                <Typography variant="small" color="blue-gray" className="opacity-50">
                                  -
                                </Typography>
                              )}
                            </td>
                          ))}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Typography variant="small" color="blue-gray" className="font-bold">
                                {studentPercentage}%
                              </Typography>
                              <div className="w-16">
                                <Progress 
                                  size="sm"
                                  value={studentPercentage} 
                                  color={studentPercentage >= 75 ? "green" : studentPercentage >= 50 ? "yellow" : "red"}
                                />
                              </div>
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

          {/* Loading State */}
          {loading && (
            <Card>
              <CardBody className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Fetching Attendance Analytics...
                </Typography>
                <Typography color="blue-gray" className="opacity-70">
                  Please wait while we analyze the attendance data for {selectedSubject}
                </Typography>
              </CardBody>
            </Card>
          )}

          {/* Empty State */}
          {attendanceRecords.length === 0 && !loading && !error && selectedLecturer && selectedSubject && (
            <Card>
              <CardBody className="text-center py-8">
                <EyeIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  No Attendance Records Found
                </Typography>
                <Typography color="blue-gray" className="opacity-70 mb-4">
                  No attendance data found for <strong>{selectedLecturer}</strong> teaching <strong>{selectedSubject}</strong>
                </Typography>
                <Typography variant="small" color="blue-gray" className="opacity-60">
                  Make sure attendance has been taken for this combination, or try a different subject.
                </Typography>
              </CardBody>
            </Card>
          )}

          {/* Initial State */}
          {attendanceRecords.length === 0 && !loading && !error && (!selectedLecturer || !selectedSubject) && (
            <Card>
              <CardBody className="text-center py-8">
                <ChartBarIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Ready for Analytics
                </Typography>
                <Typography color="blue-gray" className="opacity-70">
                  Select a lecturer and subject above to view detailed attendance analytics and insights.
                </Typography>
              </CardBody>
            </Card>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AttendanceByProf;
