import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  Select,
  Option,
} from "@material-tailwind/react";
import { ClockIcon, AcademicCapIcon } from "@heroicons/react/24/solid";

const BTechTimetable = () => {
  const [selectedSemester, setSelectedSemester] = useState("1st Semester");

  // Simple BTech timetable data
  const btechTimetable = {
    "1st Semester": {
      timeSlots: ["08:00-08:55", "08:55-09:50", "09:50-10:45", "10:45-11:40", "11:40-12:35", "12:35-01:30", "01:30-02:25"],
      schedule: {
        "Monday": {
          "08:00-08:55": { subject: "Mathematics-I", teacher: "Dr. Sharma", room: "A-101" },
          "08:55-09:50": { subject: "Physics-I", teacher: "Dr. Patel", room: "B-205" },
          "09:50-10:45": { subject: "Chemistry", teacher: "Dr. Singh", room: "C-301" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "English", teacher: "Ms. Johnson", room: "A-102" },
          "12:35-01:30": { subject: "Programming", teacher: "Mr. Kumar", room: "Lab-1" },
          "01:30-02:25": { subject: "Engineering Drawing", teacher: "Mr. Reddy", room: "D-401" }
        },
        "Tuesday": {
          "08:00-08:55": { subject: "Physics-I", teacher: "Dr. Patel", room: "B-205" },
          "08:55-09:50": { subject: "Mathematics-I", teacher: "Dr. Sharma", room: "A-101" },
          "09:50-10:45": { subject: "Engineering Drawing", teacher: "Mr. Reddy", room: "D-401" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Chemistry", teacher: "Dr. Singh", room: "C-301" },
          "12:35-01:30": { subject: "Physics Lab", teacher: "Dr. Patel", room: "Lab-2" },
          "01:30-02:25": { subject: "English", teacher: "Ms. Johnson", room: "A-102" }
        },
        "Wednesday": {
          "08:00-08:55": { subject: "English", teacher: "Ms. Johnson", room: "A-102" },
          "08:55-09:50": { subject: "Chemistry", teacher: "Dr. Singh", room: "C-301" },
          "09:50-10:45": { subject: "Mathematics-I", teacher: "Dr. Sharma", room: "A-101" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Engineering Drawing", teacher: "Mr. Reddy", room: "D-401" },
          "12:35-01:30": { subject: "Chemistry Lab", teacher: "Dr. Singh", room: "Lab-3" },
          "01:30-02:25": { subject: "Programming", teacher: "Mr. Kumar", room: "Lab-1" }
        },
        "Thursday": {
          "08:00-08:55": { subject: "Mathematics-I", teacher: "Dr. Sharma", room: "A-101" },
          "08:55-09:50": { subject: "Physics-I", teacher: "Dr. Patel", room: "B-205" },
          "09:50-10:45": { subject: "English", teacher: "Ms. Johnson", room: "A-102" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Engineering Drawing", teacher: "Mr. Reddy", room: "D-401" },
          "12:35-01:30": { subject: "Programming Lab", teacher: "Mr. Kumar", room: "Lab-1" },
          "01:30-02:25": { subject: "Chemistry", teacher: "Dr. Singh", room: "C-301" }
        },
        "Friday": {
          "08:00-08:55": { subject: "Chemistry", teacher: "Dr. Singh", room: "C-301" },
          "08:55-09:50": { subject: "English", teacher: "Ms. Johnson", room: "A-102" },
          "09:50-10:45": { subject: "Physics-I", teacher: "Dr. Patel", room: "B-205" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Mathematics-I", teacher: "Dr. Sharma", room: "A-101" },
          "12:35-01:30": { subject: "Programming Lab", teacher: "Mr. Kumar", room: "Lab-1" },
          "01:30-02:25": { subject: "Physics Lab", teacher: "Dr. Patel", room: "Lab-2" }
        },
        "Saturday": {
          "08:00-08:55": { subject: "Extra Mathematics", teacher: "Dr. Sharma", room: "A-101" },
          "08:55-09:50": { subject: "Sports", teacher: "Coach Martin", room: "Ground" },
          "09:50-10:45": { subject: "Library Study", teacher: "", room: "Library" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Project Work", teacher: "Various", room: "Lab-1" },
          "12:35-01:30": null,
          "01:30-02:25": null
        }
      }
    },
    "3rd Semester": {
      timeSlots: ["08:00-08:55", "08:55-09:50", "09:50-10:45", "10:45-11:40", "11:40-12:35", "12:35-01:30", "01:30-02:25"],
      schedule: {
        "Monday": {
          "08:00-08:55": { subject: "Data Structures", teacher: "Dr. Wilson", room: "CS-101" },
          "08:55-09:50": { subject: "Mathematics-III", teacher: "Dr. Sharma", room: "A-101" },
          "09:50-10:45": { subject: "Digital Logic", teacher: "Mr. Brown", room: "E-201" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "OOP", teacher: "Ms. Davis", room: "CS-102" },
          "12:35-01:30": { subject: "DS Lab", teacher: "Dr. Wilson", room: "CS-Lab1" },
          "01:30-02:25": { subject: "Computer Organization", teacher: "Dr. Lee", room: "CS-103" }
        },
        "Tuesday": {
          "08:00-08:55": { subject: "Digital Logic", teacher: "Mr. Brown", room: "E-201" },
          "08:55-09:50": { subject: "Data Structures", teacher: "Dr. Wilson", room: "CS-101" },
          "09:50-10:45": { subject: "Mathematics-III", teacher: "Dr. Sharma", room: "A-101" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Computer Organization", teacher: "Dr. Lee", room: "CS-103" },
          "12:35-01:30": { subject: "OOP Lab", teacher: "Ms. Davis", room: "CS-Lab2" },
          "01:30-02:25": { subject: "Digital Lab", teacher: "Mr. Brown", room: "E-Lab1" }
        },
        "Wednesday": {
          "08:00-08:55": { subject: "OOP", teacher: "Ms. Davis", room: "CS-102" },
          "08:55-09:50": { subject: "Computer Organization", teacher: "Dr. Lee", room: "CS-103" },
          "09:50-10:45": { subject: "Data Structures", teacher: "Dr. Wilson", room: "CS-101" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Digital Logic", teacher: "Mr. Brown", room: "E-201" },
          "12:35-01:30": { subject: "Mathematics-III", teacher: "Dr. Sharma", room: "A-101" },
          "01:30-02:25": { subject: "Project Work", teacher: "Various", room: "CS-Labs" }
        },
        "Thursday": {
          "08:00-08:55": { subject: "Mathematics-III", teacher: "Dr. Sharma", room: "A-101" },
          "08:55-09:50": { subject: "OOP", teacher: "Ms. Davis", room: "CS-102" },
          "09:50-10:45": { subject: "Computer Organization", teacher: "Dr. Lee", room: "CS-103" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Data Structures", teacher: "Dr. Wilson", room: "CS-101" },
          "12:35-01:30": { subject: "Mini Project", teacher: "Multiple", room: "Project Lab" },
          "01:30-02:25": { subject: "Digital Logic", teacher: "Mr. Brown", room: "E-201" }
        },
        "Friday": {
          "08:00-08:55": { subject: "Computer Organization", teacher: "Dr. Lee", room: "CS-103" },
          "08:55-09:50": { subject: "Digital Logic", teacher: "Mr. Brown", room: "E-201" },
          "09:50-10:45": { subject: "Mathematics-III", teacher: "Dr. Sharma", room: "A-101" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "OOP", teacher: "Ms. Davis", room: "CS-102" },
          "12:35-01:30": { subject: "Comprehensive Lab", teacher: "Multiple", room: "All Labs" },
          "01:30-02:25": { subject: "Data Structures", teacher: "Dr. Wilson", room: "CS-101" }
        },
        "Saturday": {
          "08:00-08:55": { subject: "Extra Classes", teacher: "Various", room: "Classrooms" },
          "08:55-09:50": { subject: "Technical Quiz", teacher: "Student Clubs", room: "Hall-2" },
          "09:50-10:45": { subject: "Coding Practice", teacher: "CS Faculty", room: "CS-Labs" },
          "10:45-11:40": { subject: "Break Time", teacher: "", room: "", type: "break" },
          "11:40-12:35": { subject: "Project Development", teacher: "Various", room: "CS-Labs" },
          "12:35-01:30": null,
          "01:30-02:25": null
        }
      }
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentTimetable = btechTimetable[selectedSemester];

  const getCellStyle = (classData) => {
    if (!classData) return "bg-gray-50 text-gray-400";
    if (classData.type === "break") return "bg-orange-50 text-orange-800";
    return "bg-blue-50 text-blue-800";
  };

  return (
    <Card className="border border-blue-gray-100 shadow-lg">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="h-6 w-6 text-blue-500" />
            <Typography variant="h6" color="blue-gray">
              BTech Timetable
            </Typography>
          </div>
          <div className="w-48">
            <Select
              value={selectedSemester}
              onChange={(value) => setSelectedSemester(value)}
              label="Select Semester"
            >
              <Option value="1st Semester">1st Semester</Option>
              <Option value="3rd Semester">3rd Semester</Option>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-0 p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-3 text-left">
                  <Typography variant="small" className="font-semibold text-gray-700">
                    Time
                  </Typography>
                </th>
                {days.map((day) => (
                  <th key={day} className="border border-gray-200 p-3 text-center">
                    <Typography variant="small" className="font-semibold text-gray-700">
                      {day}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTimetable.timeSlots.map((timeSlot) => (
                <tr key={timeSlot}>
                  <td className="border border-gray-200 p-3 bg-gray-50 text-center">
                    <Typography variant="small" className="font-medium text-gray-600">
                      {timeSlot}
                    </Typography>
                  </td>
                  {days.map((day) => {
                    const classData = currentTimetable.schedule[day]?.[timeSlot];
                    return (
                      <td key={day} className={`border border-gray-200 p-3 ${getCellStyle(classData)}`}>
                        {classData ? (
                          <div className="text-center">
                            <Typography variant="small" className="font-semibold">
                              {classData.subject}
                            </Typography>
                            {classData.teacher && (
                              <Typography variant="small" className="text-xs text-gray-600 mt-1">
                                {classData.teacher}
                              </Typography>
                            )}
                            {classData.room && (
                              <Typography variant="small" className="text-xs text-gray-500">
                                {classData.room}
                              </Typography>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <Typography variant="small" className="text-gray-400">
                              -
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
        
        <div className="mt-4 text-center">
          <Typography variant="small" className="text-gray-600">
            Classes: 8:00 AM - 2:25 PM | Break: 10:45 AM - 11:40 AM
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default BTechTimetable;