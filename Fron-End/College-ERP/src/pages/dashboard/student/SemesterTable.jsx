import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { BookOpenIcon, BeakerIcon } from "@heroicons/react/24/solid";

// Comprehensive semester data based on engineering curriculum
const getAllSemesterData = () => {
  return {
    1: {
      semester: "1st Semester",
      subjects: [
        { code: "MA101", name: "Mathematics I", credits: 4, grade: "A", ct1: 18, ct2: 20, theory: 55 },
        { code: "PH101", name: "Physics I", credits: 4, grade: "B+", ct1: 16, ct2: 18, theory: 48 },
        { code: "EN101", name: "English Communication", credits: 3, grade: "A-", ct1: 17, ct2: 19, theory: 52 },
        { code: "BEE101", name: "Basic Electrical Engineering", credits: 4, grade: "B", ct1: 15, ct2: 16, theory: 42 },
        { code: "BME101", name: "Basic Mechanical Engineering", credits: 4, grade: "A", ct1: 19, ct2: 18, theory: 54 },
      ],
      practicals: [
        { code: "PH101L", name: "Physics Lab", grade: "A", written: 20, viva: 18 },
        { code: "ED101L", name: "Engineering Drawing", grade: "B+", written: 18, viva: 16 },
        { code: "BEE101L", name: "Basic Electrical Lab", grade: "A-", written: 19, viva: 17 },
      ],
    },
    2: {
      semester: "2nd Semester",
      subjects: [
        { code: "MA102", name: "Mathematics II", credits: 4, grade: "A", ct1: 17, ct2: 19, theory: 53 },
        { code: "CS101", name: "Programming Fundamentals C", credits: 4, grade: "A+", ct1: 20, ct2: 20, theory: 58 },
        { code: "BCE102", name: "Basic Civil Engineering", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 47 },
        { code: "EM102", name: "Engineering Mechanics", credits: 4, grade: "B", ct1: 14, ct2: 16, theory: 43 },
        { code: "CH102", name: "Chemistry", credits: 4, grade: "A-", ct1: 18, ct2: 17, theory: 51 },
        { code: "BE102", name: "Basic Electronics Engineering", credits: 4, grade: "A", ct1: 19, ct2: 18, theory: 55 },
      ],
      practicals: [
        { code: "CH102L", name: "Chemistry Lab", grade: "A", written: 20, viva: 19 },
        { code: "CS101L", name: "C Programming Lab", grade: "A+", written: 20, viva: 20 },
        { code: "BE102L", name: "Basic Electronics Lab", grade: "B+", written: 18, viva: 17 },
      ],
    },
    3: {
      semester: "3rd Semester",
      subjects: [
        { code: "CS201", name: "Object Oriented Programming using JAVA", credits: 4, grade: "A", ct1: 18, ct2: 19, theory: 54 },
        { code: "MA201", name: "Mathematics-III", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 46 },
        { code: "CS202", name: "Data Structures", credits: 4, grade: "A+", ct1: 20, ct2: 19, theory: 58 },
        { code: "DLD201", name: "Digital Logic Design", credits: 4, grade: "A-", ct1: 17, ct2: 18, theory: 52 },
        { code: "ES202", name: "Environmental Science", credits: 3, grade: "A", ct1: 19, ct2: 18, theory: 55 },
        { code: "EC202", name: "Engineering Economics", credits: 3, grade: "B", ct1: 15, ct2: 16, theory: 44 },
      ],
      practicals: [
        { code: "CS201L", name: "Java Programming Lab", grade: "A", written: 19, viva: 18 },
        { code: "CS202L", name: "Data Structures Lab", grade: "A+", written: 20, viva: 20 },
        { code: "DLD201L", name: "Digital Logic Lab", grade: "A-", written: 18, viva: 17 },
      ],
    },
    4: {
      semester: "4th Semester",
      subjects: [
        { code: "COA202", name: "Computer Organization and Architecture", credits: 4, grade: "A", ct1: 18, ct2: 17, theory: 53 },
        { code: "DAA203", name: "Design and Analysis of Algorithms", credits: 4, grade: "A-", ct1: 17, ct2: 19, theory: 51 },
        { code: "DC204", name: "Data Communication", credits: 4, grade: "B+", ct1: 16, ct2: 18, theory: 48 },
        { code: "DSP205", name: "Digital Signal Processing", credits: 4, grade: "B", ct1: 15, ct2: 16, theory: 45 },
        { code: "OB203", name: "Organizational Behavior", credits: 3, grade: "A", ct1: 19, ct2: 18, theory: 56 },
        { code: "DM203", name: "Discrete Mathematics", credits: 4, grade: "A-", ct1: 17, ct2: 18, theory: 52 },
      ],
      practicals: [
        { code: "COA202L", name: "Computer Architecture Lab", grade: "A-", written: 18, viva: 17 },
        { code: "DAA203L", name: "Algorithm Lab", grade: "A", written: 19, viva: 18 },
        { code: "DSP205L", name: "DSP Lab", grade: "B+", written: 17, viva: 16 },
      ],
    },
    5: {
      semester: "5th Semester",
      subjects: [
        { code: "CS301", name: "Operating Systems", credits: 4, grade: "A", ct1: 18, ct2: 19, theory: 54 },
        { code: "CS302", name: "Computer Networks", credits: 4, grade: "A+", ct1: 20, ct2: 19, theory: 57 },
        { code: "DBMS303", name: "Database Management Systems", credits: 4, grade: "A", ct1: 19, ct2: 18, theory: 55 },
        { code: "CS304", name: "Theory of Computation", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 49 },
        { code: "CG305", name: "Computer Graphics", credits: 4, grade: "A-", ct1: 17, ct2: 18, theory: 51 },
        { code: "CS306", name: "Advanced Java Programming", credits: 4, grade: "A", ct1: 18, ct2: 19, theory: 54 },
      ],
      practicals: [
        { code: "CS301L", name: "Operating Systems Lab", grade: "A", written: 19, viva: 18 },
        { code: "CS302L", name: "Computer Networks Lab", grade: "A+", written: 20, viva: 19 },
        { code: "DBMS303L", name: "Database Lab", grade: "A", written: 19, viva: 18 },
        { code: "CG305L", name: "Computer Graphics Lab", grade: "A-", written: 18, viva: 17 },
      ],
    },
    6: {
      semester: "6th Semester",
      subjects: [
        { code: "ADC301", name: "Analog and Digital Communication", credits: 4, grade: "A-", ct1: 17, ct2: 18, theory: 52 },
        { code: "IWT301", name: "Internet and Web Technologies", credits: 4, grade: "A", ct1: 18, ct2: 19, theory: 55 },
        { code: "OE301", name: "Optimization in Engineering", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 47 },
        { code: "SE304", name: "Software Engineering", credits: 4, grade: "A", ct1: 19, ct2: 18, theory: 54 },
        { code: "WSN305", name: "Wireless Sensor Networks", credits: 4, grade: "A-", ct1: 17, ct2: 18, theory: 51 },
        { code: "PPT306", name: "PPT(Aptitude & Reasoning)", credits: 3, grade: "A", ct1: 19, ct2: 20, theory: 56 },
      ],
      practicals: [
        { code: "ADC301L", name: "Communication Lab", grade: "A-", written: 18, viva: 17 },
        { code: "IWT301L", name: "Web Development Lab", grade: "A", written: 19, viva: 18 },
        { code: "SE304L", name: "Software Engineering Lab", grade: "A", written: 19, viva: 18 },
        { code: "WSN305L", name: "WSN Lab", grade: "A-", written: 18, viva: 17 },
      ],
    },
    7: {
      semester: "7th Semester",
      subjects: [
        { code: "CLE401", name: "Cyber Law and Ethics", credits: 3, grade: "A", ct1: 18, ct2: 19, theory: 55 },
        { code: "IOT402", name: "Internet of Things", credits: 4, grade: "A+", ct1: 20, ct2: 19, theory: 58 },
        { code: "ES403", name: "Embedded System", credits: 4, grade: "A", ct1: 19, ct2: 18, theory: 54 },
        { code: "ED404", name: "Entrepreneurship Development", credits: 3, grade: "A-", ct1: 17, ct2: 18, theory: 52 },
        { code: "ECOMM401", name: "E-Commerce and ERP", credits: 4, grade: "A", ct1: 18, ct2: 19, theory: 55 },
        { code: "GT401", name: "Green Technology", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 48 },
      ],
      practicals: [
        { code: "IOT402L", name: "IoT Lab", grade: "A+", written: 20, viva: 19 },
        { code: "ES403L", name: "Embedded Systems Lab", grade: "A", written: 19, viva: 18 },
        { code: "ECOMM401L", name: "E-Commerce Lab", grade: "A", written: 19, viva: 18 },
        { code: "GT401L", name: "Green Tech Lab", grade: "B+", written: 17, viva: 16 },
      ],
    },
  };
};

export function SemesterTable() {
  const [studentYear, setStudentYear] = useState(4); // Default to 4th year
  const [availableSemesters, setAvailableSemesters] = useState([]);

  useEffect(() => {
    // Get student data from localStorage
    const storedStudentData = localStorage.getItem("studentData");
    if (storedStudentData) {
      const studentData = JSON.parse(storedStudentData);
      const year = studentData.year || 4;
      setStudentYear(year);
    }
  }, []);

  useEffect(() => {
    // Determine which semesters to show based on student year
    const allSemesterData = getAllSemesterData();
    const maxSemester = Math.min(studentYear * 2 - 1, 7); // 4th year = up to 7th semester
    const semestersToShow = [];
    
    for (let i = 1; i <= maxSemester; i++) {
      if (allSemesterData[i]) {
        semestersToShow.push(allSemesterData[i]);
      }
    }
    
    setAvailableSemesters(semestersToShow);
  }, [studentYear]);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Student Info Header */}
      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6"
        >
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-blue-500" />
            <Typography variant="h6" color="blue-gray">
              Academic Records - Year {studentYear}
            </Typography>
          </div>
          <Typography
            variant="small"
            className="mt-2 font-normal text-blue-gray-600"
          >
            Showing records for semesters 1 to {Math.min(studentYear * 2 - 1, 7)} based on your current academic year
          </Typography>
        </CardHeader>
      </Card>

      {availableSemesters.map((semester, semKey) => (
        <Card key={semKey} className="border border-blue-gray-100 shadow-sm">
          {/* Theory Subjects Section */}
          <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5 text-white" />
              <Typography variant="h6" color="white">
                {semester.semester} - Theory Subjects
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[600px] table-auto">
              <thead>
                <tr>
                  {["Subject Code", "Subject Name", "Credits", "Grade", "Grade Points"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semester.subjects.map((subject, key) => {
                  const className = `py-3 px-5 ${
                    key === semester.subjects.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  const getGradePoints = (grade) => {
                    const gradePointMap = {
                      'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 
                      'C+': 6, 'C': 5, 'C-': 4.5, 'D': 4, 'F': 0
                    };
                    return gradePointMap[grade] || 0;
                  };

                  const getGradeColor = (grade) => {
                    if (grade === 'A+' || grade === 'A') return "green";
                    if (grade === 'A-' || grade === 'B+') return "blue";
                    if (grade === 'B' || grade === 'B-') return "amber";
                    if (grade === 'C+' || grade === 'C') return "orange";
                    return "red";
                  };

                  const gradePoints = getGradePoints(subject.grade);

                  return (
                    <tr key={subject.code} className="hover:bg-blue-gray-50/50">
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold text-blue-600"
                        >
                          {subject.code}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-medium text-blue-gray-700">
                          {subject.name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {subject.credits}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={getGradeColor(subject.grade)}
                          value={subject.grade}
                          className="py-0.5 px-3 text-[12px] font-bold w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-bold text-blue-gray-800">
                          {gradePoints.toFixed(1)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>

          {/* Practical/Lab Section */}
          <CardHeader variant="gradient" color="green" className="mb-8 p-6 mt-8">
            <div className="flex items-center gap-2">
              <BeakerIcon className="h-5 w-5 text-white" />
              <Typography variant="h6" color="white">
                {semester.semester} - Laboratory/Practical Subjects
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[500px] table-auto">
              <thead>
                <tr>
                  {["Lab Code", "Lab Name", "Credits", "Grade", "Grade Points"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {semester.practicals.map((practical, key) => {
                  const className = `py-3 px-5 ${
                    key === semester.practicals.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  const getGradePoints = (grade) => {
                    const gradePointMap = {
                      'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 
                      'C+': 6, 'C': 5, 'C-': 4.5, 'D': 4, 'F': 0
                    };
                    return gradePointMap[grade] || 0;
                  };

                  const getGradeColor = (grade) => {
                    if (grade === 'A+' || grade === 'A') return "green";
                    if (grade === 'A-' || grade === 'B+') return "blue";
                    if (grade === 'B' || grade === 'B-') return "amber";
                    if (grade === 'C+' || grade === 'C') return "orange";
                    return "red";
                  };

                  const gradePoints = getGradePoints(practical.grade);
                  const labCredits = 1; // Labs typically have 1 credit

                  return (
                    <tr key={practical.code} className="hover:bg-green-50/50">
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold text-green-600"
                        >
                          {practical.code}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-medium text-blue-gray-700">
                          {practical.name}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {labCredits}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={getGradeColor(practical.grade)}
                          value={practical.grade}
                          className="py-0.5 px-3 text-[12px] font-bold w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-sm font-bold text-blue-gray-800">
                          {gradePoints.toFixed(1)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>

          {/* SGPA Calculation for this semester */}
          <CardBody className="pt-4 pb-6">
            {(() => {
              const getGradePoints = (grade) => {
                const gradePointMap = {
                  'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 
                  'C+': 6, 'C': 5, 'C-': 4.5, 'D': 4, 'F': 0
                };
                return gradePointMap[grade] || 0;
              };

              let totalCredits = 0;
              let totalGradePoints = 0;

              // Calculate for theory subjects
              semester.subjects.forEach(subject => {
                totalCredits += subject.credits;
                totalGradePoints += getGradePoints(subject.grade) * subject.credits;
              });

              // Calculate for lab subjects (assuming 1 credit each)
              semester.practicals.forEach(practical => {
                totalCredits += 1;
                totalGradePoints += getGradePoints(practical.grade) * 1;
              });

              const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;

              return (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <Typography variant="small" className="text-blue-gray-600 font-medium">
                        Total Credits
                      </Typography>
                      <Typography variant="h6" className="text-blue-600 font-bold">
                        {totalCredits}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" className="text-blue-gray-600 font-medium">
                        Grade Points Earned
                      </Typography>
                      <Typography variant="h6" className="text-blue-600 font-bold">
                        {totalGradePoints.toFixed(1)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="small" className="text-blue-gray-600 font-medium">
                        SGPA (Semester GPA)
                      </Typography>
                      <Typography variant="h5" className="text-blue-800 font-bold">
                        {sgpa.toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardBody>
        </Card>
      ))}

      {/* Overall CGPA Summary */}
      {availableSemesters.length > 0 && (
        <Card className="border border-purple-200 shadow-lg">
          <CardHeader variant="gradient" color="purple" className="mb-6 p-6">
            <Typography variant="h5" color="white" className="font-bold">
              📊 Overall Academic Performance Summary
            </Typography>
          </CardHeader>
          <CardBody>
            {(() => {
              const getGradePoints = (grade) => {
                const gradePointMap = {
                  'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 
                  'C+': 6, 'C': 5, 'C-': 4.5, 'D': 4, 'F': 0
                };
                return gradePointMap[grade] || 0;
              };

              let overallTotalCredits = 0;
              let overallTotalGradePoints = 0;
              const semesterGPAs = [];

              // Calculate CGPA and collect semester GPAs
              availableSemesters.forEach((semester, index) => {
                let semesterCredits = 0;
                let semesterGradePoints = 0;

                // Theory subjects
                semester.subjects.forEach(subject => {
                  semesterCredits += subject.credits;
                  semesterGradePoints += getGradePoints(subject.grade) * subject.credits;
                  overallTotalCredits += subject.credits;
                  overallTotalGradePoints += getGradePoints(subject.grade) * subject.credits;
                });

                // Lab subjects
                semester.practicals.forEach(practical => {
                  semesterCredits += 1;
                  semesterGradePoints += getGradePoints(practical.grade) * 1;
                  overallTotalCredits += 1;
                  overallTotalGradePoints += getGradePoints(practical.grade) * 1;
                });

                const semesterGPA = semesterCredits > 0 ? (semesterGradePoints / semesterCredits) : 0;
                semesterGPAs.push({
                  semester: semester.semester,
                  gpa: semesterGPA,
                  credits: semesterCredits
                });
              });

              const cgpa = overallTotalCredits > 0 ? (overallTotalGradePoints / overallTotalCredits) : 0;

              return (
                <div className="space-y-6">
                  {/* Semester-wise GPA Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {semesterGPAs.map((sem, index) => (
                      <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-purple-100">
                        <Typography variant="small" className="text-purple-600 font-semibold">
                          {sem.semester}
                        </Typography>
                        <Typography variant="h6" className="text-purple-800 font-bold">
                          SGPA: {sem.gpa.toFixed(2)}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          Credits: {sem.credits}
                        </Typography>
                      </div>
                    ))}
                  </div>

                  {/* Overall CGPA */}
                  <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 border-2 border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <Typography variant="small" className="text-purple-600 font-medium">
                          Total Semesters
                        </Typography>
                        <Typography variant="h4" className="text-purple-800 font-bold">
                          {availableSemesters.length}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" className="text-purple-600 font-medium">
                          Total Credits Earned
                        </Typography>
                        <Typography variant="h4" className="text-purple-800 font-bold">
                          {overallTotalCredits}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="small" className="text-purple-600 font-medium">
                          Total Grade Points
                        </Typography>
                        <Typography variant="h4" className="text-purple-800 font-bold">
                          {overallTotalGradePoints.toFixed(1)}
                        </Typography>
                      </div>
                      <div className="md:col-span-1">
                        <Typography variant="small" className="text-purple-600 font-medium">
                          Overall CGPA
                        </Typography>
                        <Typography variant="h3" className="text-purple-900 font-bold">
                          {cgpa.toFixed(2)}
                        </Typography>
                        <div className="mt-2">
                          <Chip
                            variant="gradient"
                            color={cgpa >= 9 ? "green" : cgpa >= 8 ? "blue" : cgpa >= 7 ? "amber" : cgpa >= 6 ? "orange" : "red"}
                            value={cgpa >= 9 ? "Excellent" : cgpa >= 8 ? "Very Good" : cgpa >= 7 ? "Good" : cgpa >= 6 ? "Average" : "Below Average"}
                            className="text-sm font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default SemesterTable;
