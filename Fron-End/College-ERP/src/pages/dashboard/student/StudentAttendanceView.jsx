import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Progress,
  Chip,
  Spinner,
  Alert,
  Select,
  Option,
  Button,
  Switch,
} from "@material-tailwind/react";
import {
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";

// Dynamic CS/IT Curriculum Data by Semester (matches backend AttendanceService)
const getDynamicSemesterData = () => {
  return {
    "1": {
      name: "1st Semester",
      subjects: [
        "Mathematics I",
        "Physics I", 
        "English Communication",
        "Basic Electrical Engineering",
        "Basic Mechanical Engineering"
      ]
    },
    "2": {
      name: "2nd Semester", 
      subjects: [
        "Mathematics II",
        "Programming Fundamentals C",
        "Basic Civil Engineering",
        "Engineering Mechanics",
        "Chemistry",
        "Basic Electronics Engineering"
      ]
    },
    "3": {
      name: "3rd Semester",
      subjects: [
        "Object Oriented Programming using JAVA",
        "Mathematics-III",
        "Data Structures", 
        "Digital Logic Design",
        "Environmental Science",
        "Engineering Economics"
      ]
    },
    "4": {
      name: "4th Semester",
      subjects: [
        "Computer Organization and Architecture",
        "Design and Analysis of Algorithms",
        "Data Communication",
        "Digital Signal Processing",
        "Organizational Behavior",
        "Discrete Mathematics"
      ]
    },
    "5": {
      name: "5th Semester",
      subjects: [
        "Operating Systems",
        "Computer Networks",
        "Database Management Systems",
        "Theory of Computation",
        "Computer Graphics",
        "Advanced Java Programming"
      ]
    },
    "6": {
      name: "6th Semester",
      subjects: [
        "Analog and Digital Communication",
        "Internet and Web Technologies",
        "Optimization in Engineering",
        "Software Engineering",
        "Wireless Sensor Networks",
        "PPT(Aptitude & Resoning)"
      ]
    },
    "7": {
      name: "7th Semester",
      subjects: [
        "Cyber Law and Ethics",
        "Internet of Things",
        "Embedded System",
        "Entrepreneurship Development",
        "E-Commerce and ERP",
        "Green Technology"
      ]
    }
  };
};

// Get semester data dynamically
const semesterData = getDynamicSemesterData();

// Note: Removed hardcoded fallback data - system now uses real database data only

export function StudentAttendanceView() {
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [studentYear, setStudentYear] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true); // Enable auto-refresh by default for real-time updates
  const [lastDataHash, setLastDataHash] = useState(null);
  const [newDataNotification, setNewDataNotification] = useState(false);

  useEffect(() => {
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      const studentData = JSON.parse(storedStudentData);
      setStudent(studentData);
      // Only fetch available semesters once
      if (!availableSemesters.length) {
        fetchAvailableSemesters(studentData);
      }
    }
  }, []);

  useEffect(() => {
    if (student && selectedSemester) {
      // Add debounce to prevent multiple rapid API calls
      const timeoutId = setTimeout(() => {
        fetchStudentAttendance(student, selectedSemester);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSemester, student]);

  // Handle semester change
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
  };

  // Calculate available semesters based on student year
  const getAvailableSemestersForYear = (year) => {
    const maxSemester = Math.min(year * 2, 8); // Maximum 8 semesters
    const semesters = [];
    
    for (let i = 1; i <= maxSemester; i++) {
      if (semesterData[i.toString()]) {
        semesters.push({
          key: i.toString(),
          name: semesterData[i.toString()].name
        });
      }
    }
    
    return semesters;
  };

  // Get current semester based on student year
  const getCurrentSemester = (year) => {
    // For 4th year students, current semester would be 7th or 8th
    // For 3rd year students, current semester would be 5th or 6th
    // This assumes current semester is the latest odd semester for the year
    const currentSemester = (year * 2) - 1; // 4th year = 7th sem, 3rd year = 5th sem
    return Math.min(currentSemester, 7).toString(); // Cap at 7th semester
  };

  // Fetch available semesters based on student year
  const fetchAvailableSemesters = async (studentData) => {
    try {
      // Use student's actual year from the data
      const studentYear = studentData.year || 4; // Default to 4th year if not specified
      const availableSemesters = getAvailableSemestersForYear(studentYear);
      const currentSemester = getCurrentSemester(studentYear);
      
      setAvailableSemesters(availableSemesters);
      setStudentYear(studentYear);
      
      // Set default semester to current semester
      setSelectedSemester(currentSemester);
      
      // Setup semester data for student

      // Try to fetch real data from backend as well
      try {
        const response = await axios.get(`http://localhost:8787/api/attendance/student/${studentData.id}/available-semesters`);
        if (response.data && response.data.availableSemesters) {
          // Backend semester data available
          // Override with backend data if available
          setAvailableSemesters(response.data.availableSemesters);
          if (response.data.studentYear) {
            setStudentYear(response.data.studentYear);
          }
        }
      } catch (backendError) {
        // Backend semester API not available, using calculated semesters
      }
      
    } catch (error) {
      console.error("❌ Error setting up semesters:", error);
      // Fallback for any errors
      const fallbackSemesters = getAvailableSemestersForYear(4);
      setAvailableSemesters(fallbackSemesters);
      setStudentYear(4);
      setSelectedSemester("7");
    }
  };

  const fetchStudentAttendance = async (studentData, semester = "1") => {
    setLoading(true);
    setError("");
    
    try {
      // Fetching attendance data
      
      // Get all subjects for the semester first
      const allSemesterSubjects = getAllSubjectsForSemester(semester);
      
      // Fetch real attendance data from API for the selected semester with timeout
      const response = await axios.get(`http://localhost:8787/api/attendance/student/${studentData.id}/semester/${semester}`, {
        timeout: 5000 // 5 second timeout
      });
      
      let processedData;
      
      if (response.data && response.data.length > 0) {
        // Process received attendance data
        
        // Process real attendance data and merge with all subjects
        processedData = mergeAttendanceWithAllSubjects(response.data, allSemesterSubjects, semester);
        
        // Check for data changes to show notification
        const dataHash = JSON.stringify(processedData);
        if (lastDataHash && lastDataHash !== dataHash) {
          setNewDataNotification(true);
          // New attendance data detected
          setTimeout(() => setNewDataNotification(false), 5000);
        }
        setLastDataHash(dataHash);
        
      } else {
        // No attendance data found - showing all subjects with 0 attendance
        // Show all subjects with 0 attendance when no data exists
        processedData = allSemesterSubjects;
      }
      
      setAttendanceData(processedData);
      // Set processed attendance data
      
    } catch (error) {
      console.error("❌ Error fetching attendance:", error);
      
      // Even on error, show all subjects with 0 attendance
      const allSemesterSubjects = getAllSubjectsForSemester(semester);
      setAttendanceData(allSemesterSubjects);
      
      if (error.response?.status === 404) {
        // No records found - displaying subjects with 0 attendance
      } else {
        setError("Unable to fetch attendance data from server, showing subjects with current attendance as 0.");
      }
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const processAttendanceData = (rawData, semester) => {
    // Processing attendance data for semester
    
    // Validate input data
    if (!rawData || !Array.isArray(rawData)) {
      console.error("❌ Invalid rawData format:", rawData);
      return [];
    }
    
    // Group attendance by subject and calculate statistics
    const subjectMap = {};
    let validRecords = 0;
    
    rawData.forEach((record, index) => {
      // Add comprehensive null checks to prevent errors
      if (!record) {
        // Skip null/undefined record
        return;
      }
      
      // Check if classSession exists and has subject
      if (!record.classSession || !record.classSession.subject) {
        // Skip record missing classSession or subject
        return;
      }
      
      const subject = record.classSession.subject;
      const status = record.status?.toUpperCase(); // Normalize status
      
      if (!subjectMap[subject]) {
        // Get subject code from semester data mapping
        const subjectCode = getSubjectCodeFromName(subject, semester);
        
        subjectMap[subject] = {
          subjectCode: subjectCode,
          subjectName: subject,
          heldClasses: 0,
          presentClasses: 0,
        };
      }
      
      subjectMap[subject].heldClasses += 1;
      if (status === 'P') {
        subjectMap[subject].presentClasses += 1;
      }
      
      validRecords++;
    });
    
    const result = Object.values(subjectMap);
    // Process attendance records into subject data
    
    // Sort by subject code for consistent display
    result.sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));
    
    return result;
  };

  // Get all subjects for a semester with default 0 attendance
  const getAllSubjectsForSemester = (semester) => {
    const subjects = semesterData[semester]?.subjects || [];
    return subjects.map(subjectName => ({
      subjectCode: getSubjectCodeFromName(subjectName, semester),
      subjectName: subjectName,
      heldClasses: 0,
      presentClasses: 0
    }));
  };

  // Merge real attendance data with all semester subjects
  const mergeAttendanceWithAllSubjects = (attendanceRecords, allSubjects, semester) => {
    // Process real attendance data first
    const attendanceMap = {};
    
    attendanceRecords.forEach((record, index) => {
      // Get subject from classSession
      const subject = record?.classSession?.subject;
      
      if (!subject) {
        console.warn(`Attendance record ${index} missing classSession.subject - skipping`);
        return;
      }
      
      const status = record.status?.toUpperCase();
      
      if (!attendanceMap[subject]) {
        attendanceMap[subject] = {
          subjectCode: getSubjectCodeFromName(subject, semester),
          subjectName: subject,
          heldClasses: 0,
          presentClasses: 0,
        };
      }
      
      attendanceMap[subject].heldClasses += 1;
      if (status === 'P') {
        attendanceMap[subject].presentClasses += 1;
      }
    });

    // Merge with all semester subjects
    const mergedData = allSubjects.map(subject => {
      const attendanceData = attendanceMap[subject.subjectName];
      
      if (attendanceData) {
        return attendanceData; // Use real data if available
      } else {
        return subject; // Use default 0 values if no attendance yet
      }
    });

    // Add any subjects from attendance that weren't in semester list (edge case)
    Object.values(attendanceMap).forEach(attendanceSubject => {
      const exists = mergedData.find(s => s.subjectName === attendanceSubject.subjectName);
      if (!exists) {
        mergedData.push(attendanceSubject);
      }
    });

    return mergedData.sort((a, b) => a.subjectCode.localeCompare(b.subjectCode));
  };

  // Enhanced subject code mapping with dynamic generation
  const getSubjectCodeFromName = (subjectName, semester) => {
    // Predefined subject code mappings (matches backend)
    const subjectCodeMap = {
      // Semester 1
      "Mathematics I": "MA101",
      "Physics I": "PH101", 
      "English Communication": "EN101",
      "Basic Electrical Engineering": "BEE101",
      "Basic Mechanical Engineering": "BME101",
      
      // Semester 2
      "Mathematics II": "MA102",
      "Programming Fundamentals C": "CS101",
      "Basic Civil Engineering": "BCE102",
      "Engineering Mechanics": "EM102",
      "Chemistry": "CH102",
      "Basic Electronics Engineering": "BE102",
      
      // Semester 3
      "Object Oriented Programming using JAVA": "CS201",
      "Mathematics-III": "MA201",
      "Data Structures": "CS202",
      "Digital Logic Design": "DLD201",
      "Environmental Science": "ES202",
      "Engineering Economics": "EC202",
      
      // Semester 4
      "Computer Organization and Architecture": "COA202",
      "Design and Analysis of Algorithms": "DAA203",
      "Data Communication": "DC204",
      "Digital Signal Processing": "DSP205",
      "Organizational Behavior": "OB203",
      "Discrete Mathematics": "DM203",
      
      // Semester 5
      "Operating Systems": "CS301",
      "Computer Networks": "CS302",
      "Database Management Systems": "DBMS303",
      "Theory of Computation": "CS304",
      "Computer Graphics": "CG305",
      "Advanced Java Programming": "CS306",
      
      // Semester 6
      "Analog and Digital Communication": "ADC301",
      "Internet and Web Technologies": "IWT301",
      "Optimization in Engineering": "OE301",
      "Software Engineering": "SE304",
      "Wireless Sensor Networks": "WSN305",
      "PPT(Aptitude & Resoning)": "PPT306",
      
      // Semester 7
      "Cyber Law and Ethics": "CLE401",
      "Internet of Things": "IOT402",
      "Embedded System": "ES403",
      "Entrepreneurship Development": "ED404",
      "E-Commerce and ERP": "ECOMM401",
      "Green Technology": "GT401"
    };
    
    // Try exact match
    if (subjectCodeMap[subjectName]) {
      return subjectCodeMap[subjectName];
    }
    
    // Try case-insensitive match
    const normalizedName = subjectName.toLowerCase();
    for (const [name, code] of Object.entries(subjectCodeMap)) {
      if (name.toLowerCase() === normalizedName) {
        return code;
      }
    }
    
    // Try partial match
    for (const [name, code] of Object.entries(subjectCodeMap)) {
      if (name.toLowerCase().includes(normalizedName) || 
          normalizedName.includes(name.toLowerCase())) {
        return code;
      }
    }
    
    // Generate fallback subject code
    const semesterNum = parseInt(semester) || 1;
    const yearCode = Math.ceil(semesterNum / 2) * 100 + (semesterNum % 2 === 1 ? 1 : 2);
    const subjectInitials = subjectName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    return `${subjectInitials}${yearCode}`; // e.g., "OOP301" for Object Oriented Programming in semester 3
  };

  // Manual refresh function
  const handleRefresh = () => {
    if (student) {
      // Manual refresh triggered
      fetchStudentAttendance(student, selectedSemester);
    }
  };

  // Auto-refresh effect with improved error handling
  useEffect(() => {
    let intervalId;
    if (autoRefresh && student) {
      // Auto-refresh enabled - checking every 15 seconds
      intervalId = setInterval(async () => {
        try {
          await fetchStudentAttendance(student, selectedSemester);
        } catch (error) {
          console.error("❌ Auto-refresh failed:", error);
          // Don't disable auto-refresh on error, just log it
        }
      }, 30000); // Refresh every 30 seconds for better real-time updates
    }
    
    return () => {
      if (intervalId) {
        // Auto-refresh disabled
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, student, selectedSemester]);

  const calculatePercentage = (present, held) => {
    return held > 0 ? ((present / held) * 100).toFixed(1) : 0;
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "green";
    if (percentage >= 75) return "amber";
    return "red";
  };

  const getOverallAttendance = () => {
    if (attendanceData.length === 0) {
      return "0.0";
    }
    const totalHeld = attendanceData.reduce((sum, subject) => sum + subject.heldClasses, 0);
    const totalPresent = attendanceData.reduce((sum, subject) => sum + subject.presentClasses, 0);
    return calculatePercentage(totalPresent, totalHeld);
  };

  if (!student) {
    return (
      <div className="mt-12">
        <Card>
          <CardBody className="text-center py-8">
            <Typography variant="h6" color="blue-gray">
              Please log in to view attendance records
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-12">
        <Card>
          <CardBody className="text-center py-8">
            <Spinner className="h-8 w-8 mx-auto" />
            <Typography variant="h6" color="blue-gray" className="mt-4">
              Loading attendance data...
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* New Data Notification */}
      {newDataNotification && (
        <Alert color="green" className="mb-6 animate-pulse" icon={<CheckCircleIcon className="h-6 w-6" />}>
          <div className="flex items-center justify-between">
            <span>🎉 New attendance data available! Your records have been updated.</span>
            <button 
              onClick={() => setNewDataNotification(false)}
              className="text-green-800 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        </Alert>
      )}

      {/* Info Alert for Server Issues */}
      {error && !error.includes("No attendance records found") && (
        <Alert color="amber" className="mb-6" icon={<InformationCircleIcon className="h-6 w-6" />}>
          {error}
        </Alert>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <Typography variant="h4" color="blue-gray" className="font-bold">
                My Attendance - Year {studentYear}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Overall Attendance: <span className="font-bold text-blue-600">{getOverallAttendance()}%</span>
                {availableSemesters.length > 0 && (
                  <span className="ml-4 text-blue-500">
                    (Showing {availableSemesters.length} of {studentYear * 2} completed semesters)
                  </span>
                )}
              </Typography>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="flex items-center gap-4">
            {/* Auto-refresh Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                label="Auto-refresh"
                className="checked:bg-blue-500"
              />
              <Typography variant="small" color="gray">
                Live Updates
              </Typography>
            </div>

            {/* Manual Refresh Button */}
            <Button
              onClick={handleRefresh}
              disabled={loading}
              size="sm"
              variant="outlined"
              className="flex items-center gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {/* Current Semester Indicator */}
            {studentYear && (
              <div className="px-3 py-1 bg-green-50 rounded-full border border-green-200">
                <Typography variant="small" color="green" className="font-medium">
                  Current: {getCurrentSemester(studentYear) === selectedSemester ? 
                    `${semesterData[selectedSemester]?.name} (Active)` : 
                    `${semesterData[selectedSemester]?.name}`}
                </Typography>
              </div>
            )}

            {/* Semester Selector */}
            <div className="w-72">
              <Select
                value={selectedSemester}
                onChange={(value) => handleSemesterChange(value)}
                label="Select Semester"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              >
                {availableSemesters.map((semester) => (
                  <Option key={semester.key} value={semester.key}>
                    {semester.name}
                    {getCurrentSemester(studentYear) === semester.key && (
                      <span className="ml-2 text-green-600 font-bold">• Current</span>
                    )}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <Card className="h-full w-full shadow-lg">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h6" color="blue-gray">
                Subject-wise Attendance - {availableSemesters.find(s => s.key === selectedSemester)?.name || semesterData[selectedSemester]?.name}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                View your attendance for {availableSemesters.find(s => s.key === selectedSemester)?.name || semesterData[selectedSemester]?.name} subjects
                <span className="ml-2 text-blue-500 font-medium">
                  (Year {studentYear} - Available up to Semester {Math.min(studentYear * 2, 7)})
                </span>
                {lastUpdated && (
                  <span className="ml-4 text-gray-400 text-xs">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                    {autoRefresh && <span className="ml-1 text-green-500">● Live</span>}
                  </span>
                )}
              </Typography>
              {attendanceData.length > 0 && attendanceData.every(subject => subject.heldClasses === 0) && (
                <div className="mt-2 p-2 bg-blue-50 rounded-md">
                  <Typography variant="small" color="blue" className="flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-2" />
                    Showing all {semesterData[selectedSemester]?.name} subjects. Attendance will update when professors start taking attendance.
                    {autoRefresh && <span className="ml-2 text-green-600">🔄 Auto-monitoring for updates...</span>}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    Subject Code
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none"
                  >
                    Subject Name
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none text-center"
                  >
                    Total Classes
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none text-center"
                  >
                    Present Classes
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none text-center"
                  >
                    Attendance %
                  </Typography>
                </th>
                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold leading-none text-center"
                  >
                    Status
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((subject, index) => {
                const percentage = parseFloat(calculatePercentage(subject.presentClasses, subject.heldClasses));
                const isLast = index === attendanceData.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                const hasAttendance = subject.heldClasses > 0;
                
                return (
                  <tr key={subject.subjectCode} className={`hover:bg-blue-gray-50/50 ${!hasAttendance ? 'opacity-75' : ''}`}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {subject.subjectCode}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {subject.subjectName}
                        </Typography>
                        {!hasAttendance && (
                          <Chip
                            size="sm"
                            variant="ghost"
                            value="Not Started"
                            color="gray"
                            className="w-fit text-xs"
                          />
                        )}
                      </div>
                    </td>
                    <td className={`${classes} text-center`}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {subject.heldClasses}
                      </Typography>
                    </td>
                    <td className={`${classes} text-center`}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {subject.presentClasses}
                      </Typography>
                    </td>
                    <td className={`${classes} text-center`}>
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {percentage}%
                      </Typography>
                    </td>
                    <td className={`${classes} text-center`}>
                      {hasAttendance ? (
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={percentage >= 75 ? "Good" : "Low"}
                          color={getAttendanceColor(percentage)}
                          className="w-fit"
                        />
                      ) : (
                        <Chip
                          size="sm"
                          variant="ghost"
                          value="Pending"
                          color="gray"
                          className="w-fit"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Attendance Guidelines & Semester Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Attendance Guidelines */}
        <Card className="border-l-4 border-amber-500">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Attendance Guidelines
                </Typography>
                <div className="space-y-1">
                  <Typography variant="small" color="gray">
                    • <span className="text-green-600 font-medium">75% minimum attendance</span> required to appear in exams
                  </Typography>
                  <Typography variant="small" color="gray">
                    • <span className="text-amber-600 font-medium">Above 90%</span> attendance is considered excellent
                  </Typography>
                  <Typography variant="small" color="gray">
                    • Contact your professor for any attendance discrepancies
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Semester Information */}
        <Card className="border-l-4 border-blue-500">
          <CardBody>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <InformationCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Semester Information
                </Typography>
                <div className="space-y-1">
                  <Typography variant="small" color="gray">
                    • <span className="text-blue-600 font-medium">Year {studentYear}</span> - Viewing {semesterData[selectedSemester]?.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    • <span className="text-green-600 font-medium">Current Semester:</span> {getCurrentSemester(studentYear) === selectedSemester ? semesterData[selectedSemester]?.name : semesterData[getCurrentSemester(studentYear)]?.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    • Attendance resets each semester for new subjects
                  </Typography>
                  <Typography variant="small" color="gray">
                    • Historical data available for completed semesters
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default StudentAttendanceView;