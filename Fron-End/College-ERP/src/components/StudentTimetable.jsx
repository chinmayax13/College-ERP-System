import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { ClockIcon, CalendarDaysIcon, BookOpenIcon, BeakerIcon } from "@heroicons/react/24/solid";

const StudentTimetable = () => {
  const [selectedSemester, setSelectedSemester] = useState("7"); // Default to 7th semester
  const [studentYear, setStudentYear] = useState(4); // Default to 4th year
  
  // Time slots for classes
  const timeSlots = [
    "08:00-08:55", "08:55-09:50", "09:50-10:45", 
    "10:45-11:40", "11:40-12:35", "12:35-01:30", 
    "01:30-02:25"
  ];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Comprehensive semester data with subjects and labs
  const getSemesterTimetableData = () => {
    return {
      "1": {
        name: "1st Semester",
        subjects: [
          { name: "Mathematics I", code: "MA101", professor: "Dr. A. Kumar", room: "A-101" },
          { name: "Physics I", code: "PH101", professor: "Dr. S. Sharma", room: "B-201" },
          { name: "English Communication", code: "EN101", professor: "Ms. P. Singh", room: "C-301" },
          { name: "Basic Electrical Engineering", code: "BEE101", professor: "Dr. R. Gupta", room: "D-401" },
          { name: "Basic Mechanical Engineering", code: "BME101", professor: "Dr. M. Verma", room: "E-501" }
        ],
        labs: [
          { name: "Physics Lab", code: "PH101L", professor: "Dr. S. Sharma", room: "Physics Lab" },
          { name: "Engineering Drawing", code: "ED101L", professor: "Mr. K. Jain", room: "Drawing Hall" },
          { name: "Basic Electrical Lab", code: "BEE101L", professor: "Dr. R. Gupta", room: "EE Lab" }
        ]
      },
      "2": {
        name: "2nd Semester", 
        subjects: [
          { name: "Mathematics II", code: "MA102", professor: "Dr. B. Patel", room: "A-102" },
          { name: "Programming Fundamentals C", code: "CS101", professor: "Dr. N. Agarwal", room: "CS Lab" },
          { name: "Basic Civil Engineering", code: "BCE102", professor: "Dr. L. Mishra", room: "B-202" },
          { name: "Engineering Mechanics", code: "EM102", professor: "Dr. T. Rao", room: "C-302" },
          { name: "Chemistry", code: "CH102", professor: "Dr. V. Joshi", room: "D-402" },
          { name: "Basic Electronics Engineering", code: "BE102", professor: "Dr. H. Shah", room: "E-502" }
        ],
        labs: [
          { name: "Chemistry Lab", code: "CH102L", professor: "Dr. V. Joshi", room: "Chem Lab" },
          { name: "C Programming Lab", code: "CS101L", professor: "Dr. N. Agarwal", room: "CS Lab 1" },
          { name: "Basic Electronics Lab", code: "BE102L", professor: "Dr. H. Shah", room: "Electronics Lab" }
        ]
      },
      "3": {
        name: "3rd Semester",
        subjects: [
          { name: "Object Oriented Programming using JAVA", code: "CS201", professor: "Dr. A. Mehta", room: "CS Lab 2" },
          { name: "Mathematics-III", code: "MA201", professor: "Dr. S. Pandey", room: "A-201" },
          { name: "Data Structures", code: "CS202", professor: "Dr. R. Singh", room: "B-301" },
          { name: "Digital Logic Design", code: "DLD201", professor: "Dr. K. Sharma", room: "C-401" },
          { name: "Environmental Science", code: "ES202", professor: "Dr. M. Gupta", room: "D-501" },
          { name: "Engineering Economics", code: "EC202", professor: "Dr. P. Kumar", room: "E-601" }
        ],
        labs: [
          { name: "Java Programming Lab", code: "CS201L", professor: "Dr. A. Mehta", room: "CS Lab 2" },
          { name: "Data Structures Lab", code: "CS202L", professor: "Dr. R. Singh", room: "CS Lab 3" },
          { name: "Digital Logic Lab", code: "DLD201L", professor: "Dr. K. Sharma", room: "Digital Lab" }
        ]
      },
      "4": {
        name: "4th Semester",
        subjects: [
          { name: "Computer Organization and Architecture", code: "COA202", professor: "Dr. V. Agarwal", room: "A-301" },
          { name: "Design and Analysis of Algorithms", code: "DAA203", professor: "Dr. N. Verma", room: "B-401" },
          { name: "Data Communication", code: "DC204", professor: "Dr. L. Patel", room: "C-501" },
          { name: "Digital Signal Processing", code: "DSP205", professor: "Dr. T. Gupta", room: "D-601" },
          { name: "Organizational Behavior", code: "OB203", professor: "Ms. S. Jain", room: "E-701" },
          { name: "Discrete Mathematics", code: "DM203", professor: "Dr. H. Kumar", room: "A-401" }
        ],
        labs: [
          { name: "Computer Architecture Lab", code: "COA202L", professor: "Dr. V. Agarwal", room: "Hardware Lab" },
          { name: "Algorithm Lab", code: "DAA203L", professor: "Dr. N. Verma", room: "CS Lab 4" },
          { name: "DSP Lab", code: "DSP205L", professor: "Dr. T. Gupta", room: "DSP Lab" }
        ]
      },
      "5": {
        name: "5th Semester",
        subjects: [
          { name: "Operating Systems", code: "CS301", professor: "Dr. A. Singh", room: "A-501" },
          { name: "Computer Networks", code: "CS302", professor: "Dr. M. Sharma", room: "B-501" },
          { name: "Database Management Systems", code: "DBMS303", professor: "Dr. R. Patel", room: "C-601" },
          { name: "Theory of Computation", code: "CS304", professor: "Dr. K. Verma", room: "D-701" },
          { name: "Computer Graphics", code: "CG305", professor: "Dr. L. Gupta", room: "Graphics Lab" },
          { name: "Advanced Java Programming", code: "CS306", professor: "Dr. N. Jain", room: "CS Lab 5" }
        ],
        labs: [
          { name: "Operating Systems Lab", code: "CS301L", professor: "Dr. A. Singh", room: "OS Lab" },
          { name: "Computer Networks Lab", code: "CS302L", professor: "Dr. M. Sharma", room: "Network Lab" },
          { name: "Database Lab", code: "DBMS303L", professor: "Dr. R. Patel", room: "Database Lab" },
          { name: "Computer Graphics Lab", code: "CG305L", professor: "Dr. L. Gupta", room: "Graphics Lab" }
        ]
      },
      "6": {
        name: "6th Semester",
        subjects: [
          { name: "Analog and Digital Communication", code: "ADC301", professor: "Dr. S. Kumar", room: "A-601" },
          { name: "Internet and Web Technologies", code: "IWT301", professor: "Dr. P. Singh", room: "Web Lab" },
          { name: "Optimization in Engineering", code: "OE301", professor: "Dr. V. Sharma", room: "B-601" },
          { name: "Software Engineering", code: "SE304", professor: "Dr. R. Agarwal", room: "C-701" },
          { name: "Wireless Sensor Networks", code: "WSN305", professor: "Dr. M. Patel", room: "D-801" },
          { name: "PPT(Aptitude & Resoning)", code: "PPT306", professor: "Ms. L. Verma", room: "E-801" }
        ],
        labs: [
          { name: "Communication Lab", code: "ADC301L", professor: "Dr. S. Kumar", room: "Comm Lab" },
          { name: "Web Development Lab", code: "IWT301L", professor: "Dr. P. Singh", room: "Web Lab" },
          { name: "Software Engineering Lab", code: "SE304L", professor: "Dr. R. Agarwal", room: "SE Lab" },
          { name: "WSN Lab", code: "WSN305L", professor: "Dr. M. Patel", room: "IoT Lab" }
        ]
      },
      "7": {
        name: "7th Semester",
        subjects: [
          { name: "Cyber Law and Ethics", code: "CLE401", professor: "Dr. A. Joshi", room: "A-701" },
          { name: "Internet of Things", code: "IOT402", professor: "Dr. S. Gupta", room: "IoT Lab" },
          { name: "Embedded System", code: "ES403", professor: "Dr. K. Patel", room: "Embedded Lab" },
          { name: "Entrepreneurship Development", code: "ED404", professor: "Ms. R. Singh", room: "B-701" },
          { name: "E-Commerce and ERP", code: "ECOMM401", professor: "Dr. M. Kumar", room: "C-801" },
          { name: "Green Technology", code: "GT401", professor: "Dr. V. Verma", room: "D-901" }
        ],
        labs: [
          { name: "IoT Lab", code: "IOT402L", professor: "Dr. S. Gupta", room: "IoT Lab" },
          { name: "Embedded Systems Lab", code: "ES403L", professor: "Dr. K. Patel", room: "Embedded Lab" },
          { name: "E-Commerce Lab", code: "ECOMM401L", professor: "Dr. M. Kumar", room: "Web Lab 2" },
          { name: "Green Tech Lab", code: "GT401L", professor: "Dr. V. Verma", room: "Research Lab" }
        ]
      }
    };
  };

  const semesterData = getSemesterTimetableData();

  // Generate timetable for selected semester
  const generateSemesterTimetable = (semester) => {
    const data = semesterData[semester];
    if (!data) return {};

    const schedule = {};
    const allClasses = [...data.subjects, ...data.labs];
    
    // Initialize schedule
    days.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach(slot => {
        schedule[day][slot] = null;
      });
    });

    // Add break (10:45-11:40 slot)
    days.forEach(day => {
      schedule[day]["10:45-11:40"] = { 
        subject: "Break", 
        room: "", 
        professor: "", 
        isBreak: true 
      };
    });

    // Distribute classes across the week
    let classIndex = 0;
    const regularSlots = ["08:00-08:55", "08:55-09:50", "09:50-10:45", "11:40-12:35", "12:35-01:30", "01:30-02:25"];
    
    // Create a comprehensive schedule with better distribution
    const totalSlots = days.length * regularSlots.length;
    let scheduledClasses = 0;
    
    // Special handling for 7th semester (no labs, repeat classes)
    if (semester === "7") {
      const subjects = data.subjects;
      const subjectsWithRepeat = [...subjects, ...subjects]; // Repeat each subject twice
      let subjectIndex = 0;
      
      days.forEach((day, dayIndex) => {
        regularSlots.forEach((slot, slotIndex) => {
          if (subjectIndex < subjectsWithRepeat.length) {
            const classData = subjectsWithRepeat[subjectIndex];
            const repeatCount = Math.floor(subjectIndex / subjects.length) + 1;
            
            schedule[day][slot] = {
              subject: `${classData.name}${repeatCount > 1 ? ` (Session ${repeatCount})` : ''}`,
              code: `${classData.code}${repeatCount > 1 ? `-S${repeatCount}` : ''}`,
              room: classData.room,
              professor: classData.professor,
              isLab: false
            };
            subjectIndex++;
            scheduledClasses++;
          }
        });
      });
      
      // Fill remaining slots with tutorial/revision sessions
      if (subjectIndex >= subjectsWithRepeat.length) {
        let tutorialIndex = 0;
        days.forEach((day, dayIndex) => {
          regularSlots.forEach((slot, slotIndex) => {
            if (!schedule[day][slot] && tutorialIndex < subjects.length) {
              const classData = subjects[tutorialIndex % subjects.length];
              schedule[day][slot] = {
                subject: `${classData.name} (Tutorial)`,
                code: `${classData.code}-T`,
                room: classData.room,
                professor: classData.professor,
                isLab: false
              };
              tutorialIndex++;
            }
          });
        });
      }
    } else {
      // Original logic for other semesters with labs - fill all slots completely
      const totalAvailableSlots = days.length * regularSlots.length;
      const allClassesRepeated = [];
      
      // Create enough classes to fill all slots by repeating subjects and labs
      while (allClassesRepeated.length < totalAvailableSlots) {
        allClassesRepeated.push(...allClasses);
      }
      
      let globalClassIndex = 0;
      
      days.forEach((day, dayIndex) => {
        let slotIndex = 0;
        
        while (slotIndex < regularSlots.length) {
          const slot = regularSlots[slotIndex];
          
          if (globalClassIndex < allClassesRepeated.length) {
            const classData = allClassesRepeated[globalClassIndex];
            const isLab = classData.name.includes("Lab");
            const repeatCount = Math.floor(globalClassIndex / allClasses.length);
            
            if (isLab && slotIndex < regularSlots.length - 1 && !schedule[day][regularSlots[slotIndex + 1]]) {
              // Extended lab period (2 consecutive slots)
              const currentSlot = regularSlots[slotIndex];
              const nextSlot = regularSlots[slotIndex + 1];
              
              schedule[day][currentSlot] = {
                subject: `${classData.name} (Part 1)${repeatCount > 0 ? ` - Round ${repeatCount + 1}` : ''}`,
                code: `${classData.code}${repeatCount > 0 ? `-R${repeatCount + 1}` : ''}`,
                room: classData.room,
                professor: classData.professor,
                isLab: true,
                isExtended: true
              };
              
              schedule[day][nextSlot] = {
                subject: `${classData.name} (Part 2)${repeatCount > 0 ? ` - Round ${repeatCount + 1}` : ''}`,
                code: `${classData.code}${repeatCount > 0 ? `-R${repeatCount + 1}` : ''}`,
                room: classData.room,
                professor: classData.professor,
                isLab: true,
                isExtended: true
              };
              
              slotIndex += 2; // Skip next slot as it's occupied by extended lab
              scheduledClasses += 2;
            } else {
              // Regular single-period class
              const sessionType = repeatCount === 0 ? '' : 
                                 repeatCount === 1 ? ' (Tutorial)' : 
                                 ' (Revision)';
              const codeExtension = repeatCount === 0 ? '' : 
                                   repeatCount === 1 ? '-T' : 
                                   `-R${repeatCount}`;
              
              schedule[day][slot] = {
                subject: `${classData.name}${sessionType}`,
                code: `${classData.code}${codeExtension}`,
                room: classData.room,
                professor: classData.professor,
                isLab: isLab
              };
              slotIndex++;
              scheduledClasses++;
            }
            globalClassIndex++;
          } else {
            // Fill with additional revision if we run out
            const fallbackSubject = data.subjects[slotIndex % data.subjects.length];
            schedule[day][slot] = {
              subject: `${fallbackSubject.name} (Extra Review)`,
              code: `${fallbackSubject.code}-ER`,
              room: fallbackSubject.room,
              professor: fallbackSubject.professor,
              isLab: false
            };
            slotIndex++;
          }
        }
      });
    }
    
    // Second pass: Not needed for semesters 1-6 as they're completely filled above
    // Only used for 7th semester edge cases
    if (semester !== "7") {
      // Ensure no empty slots remain for semesters 1-6
      days.forEach((day, dayIndex) => {
        regularSlots.forEach((slot, slotIndex) => {
          if (!schedule[day][slot]) {
            const fallbackSubject = data.subjects[slotIndex % data.subjects.length];
            schedule[day][slot] = {
              subject: `${fallbackSubject.name} (Additional)`,
              code: `${fallbackSubject.code}-ADD`,
              room: fallbackSubject.room,
              professor: fallbackSubject.professor,
              isLab: false
            };
          }
        });
      });
    }
    
    // Third pass: Final check to ensure ALL slots are filled for semesters 1-6
    if (semester !== "7") {
      // Double-check: Fill any remaining empty slots
      days.forEach((day, dayIndex) => {
        regularSlots.forEach((slot, slotIndex) => {
          if (!schedule[day][slot]) {
            const subjectIndex = (dayIndex * regularSlots.length + slotIndex) % data.subjects.length;
            const subjectData = data.subjects[subjectIndex];
            
            schedule[day][slot] = {
              subject: `${subjectData.name} (Make-up Class)`,
              code: `${subjectData.code}-MU`,
              room: subjectData.room,
              professor: subjectData.professor,
              isLab: false
            };
          }
        });
      });
    } else {
      // For 7th semester, fill any remaining empty slots with revision sessions
      days.forEach((day, dayIndex) => {
        regularSlots.forEach((slot, slotIndex) => {
          if (!schedule[day][slot]) {
            const subjectData = data.subjects[slotIndex % data.subjects.length];
            schedule[day][slot] = {
              subject: `${subjectData.name} (Revision)`,
              code: `${subjectData.code}-R`,
              room: subjectData.room,
              professor: subjectData.professor,
              isLab: false
            };
          }
        });
      });
    }
    
    // Special handling for Saturday - ensure all slots are filled for semesters 1-6
    if (data.subjects.length > 0 && semester !== "7") {
      // Fill all Saturday slots completely
      regularSlots.forEach((slot, index) => {
        if (!schedule["Saturday"][slot]) {
          const subjectData = data.subjects[index % data.subjects.length];
          let sessionType = "";
          let codeExtension = "";
          
          if (index < 3) {
            sessionType = " (Project Work)";
            codeExtension = "-P";
          } else if (index === 3) {
            sessionType = " (Workshop)";
            codeExtension = "-W";
          } else if (index === 4) {
            sessionType = " (Practical)";
            codeExtension = "-PR";
          } else {
            sessionType = " (Revision)";
            codeExtension = "-R";
          }
          
          schedule["Saturday"][slot] = {
            subject: `${subjectData.name}${sessionType}`,
            code: `${subjectData.code}${codeExtension}`,
            room: index < 3 ? "Project Lab" : subjectData.room,
            professor: subjectData.professor,
            isLab: false
          };
        }
      });
    }
    
    // For 7th semester, Saturday gets regular repeated classes like other days
    if (semester === "7") {
      // Saturday schedule is already handled in the main 7th semester logic above
      // Just ensure all slots are filled with revision classes if needed
      regularSlots.forEach((slot, index) => {
        if (!schedule["Saturday"][slot]) {
          const subjectData = data.subjects[index % data.subjects.length];
          schedule["Saturday"][slot] = {
            subject: `${subjectData.name} (Extra Session)`,
            code: `${subjectData.code}-E`,
            room: subjectData.room,
            professor: subjectData.professor,
            isLab: false
          };
        }
      });
    }

    return schedule;
  };

  const [currentSchedule, setCurrentSchedule] = useState({});

  useEffect(() => {
    // Get student data from localStorage
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      const studentData = JSON.parse(storedStudentData);
      const year = studentData.year || 4;
      setStudentYear(year);
      
      // Set current semester based on year
      const currentSem = (year * 2) - 1; // 4th year = 7th semester
      setSelectedSemester(Math.min(currentSem, 7).toString());
    }
  }, []);

  useEffect(() => {
    setCurrentSchedule(generateSemesterTimetable(selectedSemester));
  }, [selectedSemester]);

  // Get available semesters based on student year
  const getAvailableSemesters = () => {
    const maxSemester = Math.min(studentYear * 2, 7);
    const semesters = [];
    
    for (let i = 1; i <= maxSemester; i++) {
      semesters.push({
        key: i.toString(),
        name: semesterData[i.toString()]?.name || `${i}th Semester`
      });
    }
    
    return semesters;
  };

  const studentSchedule = currentSchedule;

  const getSubjectColor = (classData) => {
    if (!classData) return "";
    
    if (classData.isBreak) return "bg-orange-50 text-orange-800 border-l-4 border-orange-400";
    if (classData.isLab && classData.isExtended) return "bg-green-50 text-green-800 border-l-4 border-green-400 border-2 border-dashed border-green-300";
    if (classData.isLab) return "bg-green-50 text-green-800 border-l-4 border-green-400";
    
    // Color coding based on subject type
    const subject = classData.subject.toLowerCase();
    
    if (subject.includes("mathematics") || subject.includes("math")) return "bg-blue-50 text-blue-800 border-l-4 border-blue-400";
    if (subject.includes("physics")) return "bg-purple-50 text-purple-800 border-l-4 border-purple-400";
    if (subject.includes("chemistry")) return "bg-red-50 text-red-800 border-l-4 border-red-400";
    if (subject.includes("programming") || subject.includes("java") || subject.includes("computer")) return "bg-gray-50 text-gray-800 border-l-4 border-gray-400";
    if (subject.includes("english") || subject.includes("communication")) return "bg-indigo-50 text-indigo-800 border-l-4 border-indigo-400";
    if (subject.includes("database") || subject.includes("dbms")) return "bg-cyan-50 text-cyan-800 border-l-4 border-cyan-400";
    if (subject.includes("network") || subject.includes("internet")) return "bg-teal-50 text-teal-800 border-l-4 border-teal-400";
    if (subject.includes("embedded") || subject.includes("iot")) return "bg-pink-50 text-pink-800 border-l-4 border-pink-400";
    if (subject.includes("software") || subject.includes("engineering")) return "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400";
    if (subject.includes("project")) return "bg-amber-50 text-amber-800 border-l-4 border-amber-400";
    if (subject.includes("seminar")) return "bg-violet-50 text-violet-800 border-l-4 border-violet-400";
    
    return "bg-gray-50 text-gray-800 border-l-4 border-gray-400";
  };

  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-6 w-6 text-blue-500" />
            <Typography variant="h6" color="blue-gray">
              Weekly Timetable
            </Typography>
          </div>
          <div className="w-48">
            <Select
              label="Select Semester"
              value={selectedSemester}
              onChange={(value) => setSelectedSemester(value)}
            >
              {getAvailableSemesters().map((semester) => (
                <Option key={semester.key} value={semester.key}>
                  {semester.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <Typography
          variant="small"
          className="mt-2 font-normal text-blue-gray-600"
        >
          {semesterData[selectedSemester]?.name || "Select a semester"} - Complete class schedule with subjects and labs
        </Typography>
        
        {/* Semester subjects and labs info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BookOpenIcon className="h-4 w-4 text-blue-600" />
              <Typography variant="small" className="font-semibold text-blue-800">
                Subjects ({semesterData[selectedSemester]?.subjects?.length || 0})
              </Typography>
            </div>
            <div className="flex flex-wrap gap-1">
              {semesterData[selectedSemester]?.subjects?.map((subject, index) => (
                <Chip
                  key={index}
                  size="sm"
                  value={subject.code}
                  className="bg-blue-100 text-blue-800"
                />
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BeakerIcon className="h-4 w-4 text-green-600" />
              <Typography variant="small" className="font-semibold text-green-800">
                Labs ({semesterData[selectedSemester]?.labs?.length || 0})
              </Typography>
            </div>
            <div className="flex flex-wrap gap-1">
              {semesterData[selectedSemester]?.labs?.map((lab, index) => (
                <Chip
                  key={index}
                  size="sm"
                  value={lab.code}
                  className="bg-green-100 text-green-800"
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="border border-blue-gray-100 p-2 bg-blue-gray-50">
                  <Typography variant="small" className="font-semibold text-blue-gray-700">
                    Time
                  </Typography>
                </th>
                {days.map((day) => (
                  <th key={day} className="border border-blue-gray-100 p-2 bg-blue-gray-50">
                    <Typography variant="small" className="font-semibold text-blue-gray-700">
                      {day}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border border-blue-gray-100 p-2 bg-blue-gray-25">
                    <Typography variant="small" className="font-medium text-blue-gray-600">
                      {timeSlot}
                    </Typography>
                  </td>
                  {days.map((day) => {
                    const classData = studentSchedule[day]?.[timeSlot];
                    return (
                      <td key={day} className="border border-blue-gray-100 p-1">
                        {classData ? (
                          <div className={`p-2 rounded-md text-center ${getSubjectColor(classData)}`}>
                            <Typography variant="small" className="font-semibold">
                              {classData.subject}
                              {classData.isLab && (
                                <span className="ml-1">
                                  <BeakerIcon className="h-3 w-3 inline" />
                                  {classData.isExtended && (
                                    <span className="text-xs ml-1 bg-green-200 px-1 rounded">2hr</span>
                                  )}
                                </span>
                              )}
                            </Typography>
                            {classData.code && !classData.isBreak && (
                              <Typography variant="small" className="text-xs opacity-70 font-medium">
                                {classData.code}
                              </Typography>
                            )}
                            {!classData.isBreak && classData.room && (
                              <Typography variant="small" className="text-xs opacity-80">
                                📍 {classData.room}
                              </Typography>
                            )}
                            {!classData.isBreak && classData.professor && (
                              <Typography variant="small" className="text-xs opacity-80">
                                👨‍🏫 {classData.professor}
                              </Typography>
                            )}
                          </div>
                        ) : (
                          <div className="p-2 text-center">
                            <Typography variant="small" className="text-gray-400">
                              Free
                            </Typography>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default StudentTimetable;