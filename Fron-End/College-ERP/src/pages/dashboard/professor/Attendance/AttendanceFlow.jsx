import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsHeader,
  Tab,
  Card,
  CardBody,
  Typography,
  Alert,
} from "@material-tailwind/react";
import {
  PlusCircleIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Profile from "@/pages/dashboard/professor/Attendance/Profile";
import AttendanceForm from "@/pages/dashboard/professor/Attendance/AttendanceForm";

export function AttendanceFlow() {
  const [activeTab, setActiveTab] = useState("attendance-form");
  const [professor, setProfessor] = useState(null);

  const handleTabChange = (value) => {
    setActiveTab(value);
    console.log("Active Tab Changed to:", value);
  };

  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");
    if (storedProfessorData) {
      setProfessor(JSON.parse(storedProfessorData));
    }
  }, []);

  if (!professor) {
    return (
      <Card className="mx-4 mt-6 border border-blue-gray-100">
        <CardBody className="p-8 text-center">
          <InformationCircleIcon className="h-12 w-12 text-blue-gray-300 mx-auto mb-4" />
          <Typography variant="h6" color="blue-gray" className="mb-2">
            Professor Data Required
          </Typography>
          <Typography color="blue-gray" className="opacity-70">
            Please log in as a professor to access attendance management.
          </Typography>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mt-6 border w-[95%] min-h-[700px] border-blue-gray-100">
      <CardBody className="p-4">
        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <Typography variant="h5" color="blue-gray" className="mb-2">
            Welcome, {professor.name}!
          </Typography>
          <Typography variant="small" color="blue-gray" className="opacity-80">
            Department: {professor.departmentName} | Subject: {professor.subject}
          </Typography>
        </div>

        <Tabs value={activeTab}>
          <TabsHeader className="bg-blue-gray-50">
            <Tab
              value="attendance-form"
              onClick={() => handleTabChange("attendance-form")}
              className="flex justify-center"
            >
              <div className="flex items-center justify-center">
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                <Typography variant="h6" className="font-bold">
                  Mark Attendance
                </Typography>
              </div>
            </Tab>
            <Tab
              value="analytics"
              onClick={() => handleTabChange("analytics")}
              className="flex justify-center"
            >
              <div className="flex items-center justify-center">
                <ChartBarIcon className="mr-2 h-5 w-5" />
                <Typography variant="h6" className="font-bold">
                  Analytics
                </Typography>
              </div>
            </Tab>
          </TabsHeader>
        </Tabs>

        <div className="mt-6">
          {activeTab === "attendance-form" && <AttendanceForm />}
          {activeTab === "analytics" && <Profile />}
        </div>
      </CardBody>
    </Card>
  );
}

export default AttendanceFlow;
