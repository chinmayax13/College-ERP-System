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
  Checkbox,
  Alert,
  Chip,
  Progress,
  Spinner,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

const AttendanceForm = () => {
  const [professor, setProfessor] = useState(null);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [allSubjectsData, setAllSubjectsData] = useState({});
  const [time, setTime] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get professor data from localStorage
  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");
    if (storedProfessorData) {
      const professorData = JSON.parse(storedProfessorData);
      setProfessor(professorData);
      setSelectedDepartment(professorData.departmentName);
      
      // Set current date and time as defaults
      const now = new Date();
      setAttendanceDate(now.toISOString().split('T')[0]);
      setTime(""); // Don't set default time, let user select period
    }
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:8787/api/departments/get-dept");
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch students based on selected department
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedDepartment) {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:8787/api/attendance/students/department/${selectedDepartment}`);
          const studentsData = response.data;
          
          // Transform the data to match our component's expected format
          const transformedStudents = studentsData.map(student => ({
            id: student.id || 0,
            name: student.studName || student.name || "Unknown Student",
            studRollNo: student.studRollNo || "N/A",
            rollNumber: student.studRollNo || "N/A",
            email: student.email || "",
            major: student.major || ""
          }));
          
          setStudents(transformedStudents);
          setAttendanceList(
            transformedStudents.map((student) => ({
              studentId: student.id,
              studentName: student.name || "Unknown Student",
              rollNo: student.studRollNo || "N/A",
              status: false,
            }))
          );
        } catch (error) {
          console.error("Error fetching students:", error);
          console.error("Error details:", error.response?.data, error.response?.status);
          setError(`Failed to load students for ${selectedDepartment}. Server may be unavailable.`);
          // Fallback to dummy data if API fails
          const dummyStudents = [
                // Add a few more dummy students for demonstration if needed
            { id: 2, name: "Akshata Gautam Parghane", studRollNo: "CS002" },
            { id: 3, name: "Anushka Gautam Fulkar", studRollNo: "CS003" },
          ];

          setStudents(dummyStudents);
          setAttendanceList(
            dummyStudents.map((student) => ({
              studentId: student.id || 0,
              studentName: student.name || "Unknown Student",
              rollNo: student.studRollNo || "N/A",
              status: false,
            }))
          );
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchStudents();
  }, [selectedDepartment]);

  // Get available subjects from server (semester-based curriculum)
  useEffect(() => {
    if (professor) {
      fetchAvailableSubjects();
    }
  }, [professor]);

  // Fetch all subjects from server based on semester curriculum
  const fetchAvailableSubjects = async () => {
    try {
      console.log("🔍 Fetching subjects from server...");
      const response = await axios.get('http://localhost:8787/api/attendance/subjects/all');
      
      if (response.data) {
        // Store the full semester data
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
        const professorSubject = professor.subject;
        if (professorSubject && !allSubjects.includes(professorSubject)) {
          allSubjects.unshift(professorSubject);
        }
        
        console.log("📚 Loaded subjects from server:", allSubjects);
        console.log("👨‍🏫 Professor subject:", professorSubject);
        
        setSubjects(allSubjects);
        
        // Set default to professor's subject if available
        if (professorSubject && allSubjects.includes(professorSubject)) {
          setSelectedSubject(professorSubject);
        }
      } else {
        console.warn("⚠️ No subjects received from server, using fallback");
        // Fallback to basic subjects if API fails
        const fallbackSubjects = [
          "Mathematics I", "Programming Fundamentals C", "Object Oriented Programming using JAVA",
          "Data Structures", "Operating Systems", "Computer Networks", "Database Management Systems"
        ];
        setSubjects(fallbackSubjects);
      }
    } catch (error) {
      console.error("❌ Error fetching subjects:", error);
      // Fallback subjects in case of error
      const fallbackSubjects = [
        "Mathematics I", "Programming Fundamentals C", "Object Oriented Programming using JAVA",
        "Data Structures", "Operating Systems", "Computer Networks", "Database Management Systems",
        "Software Engineering", "Web Technologies", "Machine Learning"
      ];
      setSubjects(fallbackSubjects);
    }
  };

  // Filter subjects by selected semester
  useEffect(() => {
    if (Object.keys(allSubjectsData).length > 0) {
      if (selectedSemester === "all") {
        // Show all subjects
        const allSubjects = [];
        Object.keys(allSubjectsData).forEach(semesterKey => {
          const semesterData = allSubjectsData[semesterKey];
          if (semesterData.subjects) {
            semesterData.subjects.forEach(subject => {
              if (!allSubjects.includes(subject)) {
                allSubjects.push(subject);
              }
            });
          }
        });
        
        // Add professor's subject if not in curriculum list
        const professorSubject = professor?.subject;
        if (professorSubject && !allSubjects.includes(professorSubject)) {
          allSubjects.unshift(professorSubject);
        }
        
        setSubjects(allSubjects);
      } else {
        // Show subjects for selected semester only
        const semesterData = allSubjectsData[selectedSemester];
        if (semesterData && semesterData.subjects) {
          setSubjects([...semesterData.subjects]);
        }
      }
    }
  }, [selectedSemester, allSubjectsData, professor]);

  // College time periods (8 AM to 5 PM, 55 minutes each)
  const timePeriods = [
    { period: "Period 1", time: "08:00-08:55", value: "08:00" },
    { period: "Period 2", time: "08:55-09:50", value: "08:55" },
    { period: "Period 3", time: "09:50-10:45", value: "09:50" },
    { period: "Break", time: "10:45-11:00", value: "10:45", disabled: true },
    { period: "Period 4", time: "11:00-11:55", value: "11:00" },
    { period: "Period 5", time: "11:55-12:50", value: "11:55" },
    { period: "Lunch Break", time: "12:50-13:30", value: "12:50", disabled: true },
    { period: "Period 6", time: "13:30-14:25", value: "13:30" },
    { period: "Period 7", time: "14:25-15:20", value: "14:25" },
    { period: "Period 8", time: "15:20-16:15", value: "15:20" },
    { period: "Period 9", time: "16:15-17:10", value: "16:15" },
  ];

  const handleSubjectChange = (value) => {
    console.log("Subject selected:", value); // Debug log
    setSelectedSubject(value);
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleDateChange = (e) => {
    setAttendanceDate(e.target.value);
    if (error || success) {
      setError("");
      setSuccess("");
    }
  };

  const handleAttendanceChange = (index) => {
    const updatedAttendanceList = [...attendanceList];
    updatedAttendanceList[index].status = !updatedAttendanceList[index].status;
    setAttendanceList(updatedAttendanceList);
  };

  const handleMarkAll = (status) => {
    const updatedList = attendanceList.map(student => ({
      ...student,
      studentName: student.studentName || "Unknown Student",
      rollNo: student.rollNo || "N/A",
      status: status
    }));
    setAttendanceList(updatedList);
  };

  // Mark attendance for individual student
  const markAttendance = (studentId, status) => {
    setAttendanceList(prev => {
      const existingIndex = prev.findIndex(a => a.studentId === studentId);
      if (existingIndex !== -1) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        // Add new entry
        return [...prev, { studentId, status }];
      }
    });
  };

  // Mark all students present
  const markAllPresent = () => {
    const allPresent = students.map(student => ({
      studentId: student.id || 0,
      studentName: student.name || "Unknown Student",
      rollNo: student.studRollNo || "N/A",
      status: true
    }));
    setAttendanceList(allPresent);
  };

  // Mark all students absent
  const markAllAbsent = () => {
    const allAbsent = students.map(student => ({
      studentId: student.id || 0,
      studentName: student.name || "Unknown Student", 
      rollNo: student.studRollNo || "N/A",
      status: false
    }));
    setAttendanceList(allAbsent);
  };

  // Reset form
  const resetForm = () => {
    setSelectedSubject("");
    setTime("");
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setAttendanceList([]);
    setSuccess("");
    setError("");
  };

  // Handle time period change
  const handleTimeChange = (value) => {
    setTime(value);
  };

  const getAttendanceStats = () => {
    const present = attendanceList.filter(student => student.status).length;
    const total = attendanceList.length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, total, percentage };
  };

  const filteredStudents = attendanceList.filter(student => {
    const studentName = student.studentName || "";
    const rollNo = student.rollNo || "";
    const searchTerm = searchStudent.toLowerCase();
    
    const matchesSearch = studentName.toLowerCase().includes(searchTerm) ||
                         rollNo.toLowerCase().includes(searchTerm);
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "present") return matchesSearch && student.status;
    if (filterStatus === "absent") return matchesSearch && !student.status;
    
    return matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!professor) {
      setError("Professor data not found. Please log in again.");
      setLoading(false);
      return;
    }

    if (!selectedSubject || !time || !attendanceDate) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (attendanceList.length === 0) {
      setError("Please mark attendance for at least one student.");
      setLoading(false);
      return;
    }

    try {
      const attendanceData = {
        professorName: professor.name,
        subject: selectedSubject,
        time: time,
        attendanceDate: attendanceDate,
        attendanceList: attendanceList.map(record => {
          const student = students.find(s => s.id === record.studentId);
          return {
            studentId: record.studentId,
            studentName: student?.name || record.studentName,
            rollNo: student?.studRollNo || record.rollNo,
            status: record.status ? "P" : "A",
          };
        })
      };

      console.log("Submitting attendance data:", attendanceData);

      const response = await axios.post(
        'http://localhost:8787/api/attendance/save',
        attendanceData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log("Attendance submitted successfully:", response.data);
      setSuccess("Attendance marked successfully!");
      
      // Reset attendance after success
      setTimeout(() => {
        const resetList = attendanceList.map(record => ({
          ...record,
          status: false
        }));
        setAttendanceList(resetList);
        setSuccess("");
      }, 3000);

    } catch (error) {
      console.error("Error submitting attendance:", error);
      if (error.response?.data) {
        setError(`Error: ${error.response.data.message || error.response.data}`);
      } else {
        setError("Error submitting attendance. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!professor) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6" color="blue-gray">
          Loading professor data...
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h4" color="white" className="flex items-center gap-2">
            <UserGroupIcon className="h-6 w-6" />
            Mark Attendance
          </Typography>
          <Typography variant="small" color="white" className="opacity-80">
            Mark attendance for {professor.departmentName} department - {professor.name}
          </Typography>
        </CardHeader>

        <CardBody>
          {/* Success/Error Messages */}
          {success && (
            <Alert color="green" className="mb-4" icon={<CheckCircleIcon className="h-6 w-6" />}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert color="red" className="mb-4" icon={<XCircleIcon className="h-6 w-6" />}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Semester Filter Row */}
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                Filter by Semester (Optional)
              </Typography>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Semesters</option>
                {Object.keys(allSubjectsData).map(semesterKey => {
                  const semesterData = allSubjectsData[semesterKey];
                  return (
                    <option key={semesterKey} value={semesterKey}>
                      {semesterData.semesterName} ({semesterData.subjects?.length || 0} subjects)
                    </option>
                  );
                })}
              </select>
              <Typography variant="small" color="gray" className="mt-1">
                Filter subjects by semester to make selection easier
              </Typography>
            </div>

            {/* Form Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  Subject * {selectedSemester !== "all" && (
                    <span className="text-blue-500 text-xs">
                      ({allSubjectsData[selectedSemester]?.semesterName})
                    </span>
                  )}
                </Typography>
                {/* Alternative: Native select as fallback */}
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject, index) => (
                    <option key={`subject-${index}`} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {/* Debug info */}
                <Typography variant="small" color="blue-gray" className="mt-1 opacity-70">
                  Selected: {selectedSubject || "None"} | Available: {subjects.length} 
                  {selectedSemester !== "all" && (
                    <span className="text-blue-500"> | Filtered by {allSubjectsData[selectedSemester]?.semesterName}</span>
                  )}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  Time Period *
                </Typography>
                <Select
                  value={time}
                  onChange={handleTimeChange}
                  label="Select Time Period"
                  required
                >
                  {timePeriods.map((period, index) => (
                    <Option 
                      key={index} 
                      value={period.value} 
                      disabled={period.disabled}
                      className={period.disabled ? "opacity-50" : ""}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{period.period}</span>
                        <span className="text-sm opacity-70">{period.time}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4" />
                  Date *
                </Typography>
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5" />
                  Students ({students.length})
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outlined"
                    color="green"
                    onClick={markAllPresent}
                    className="flex items-center gap-1"
                  >
                    <CheckIcon className="h-4 w-4" />
                    All Present
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="red"
                    onClick={markAllAbsent}
                    className="flex items-center gap-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    All Absent
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <div className="grid gap-2 p-4">
                  {students.map((student) => (
                    <Card key={student.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-gray-100 flex items-center justify-center">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="text-sm">
                              {student.name}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="opacity-70">
                              Roll No: {student.rollNumber}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Chip
                            size="sm"
                            variant={
                              attendanceList.find(a => a.studentId === student.id)?.status === 'present'
                                ? "filled" : "outlined"
                            }
                            color="green"
                            value="Present"
                            onClick={() => markAttendance(student.id, 'present')}
                            className="cursor-pointer"
                          />
                          <Chip
                            size="sm"
                            variant={
                              attendanceList.find(a => a.studentId === student.id)?.status === 'absent'
                                ? "filled" : "outlined"
                            }
                            color="red"
                            value="Absent"
                            onClick={() => markAttendance(student.id, 'absent')}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outlined"
                color="blue-gray"
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reset
              </Button>
              <Button
                type="submit"
                variant="gradient"
                color="blue"
                disabled={loading || attendanceList.length === 0}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                {loading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AttendanceForm;
