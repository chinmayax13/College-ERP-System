import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";

export function SemesterTable() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const hodData = JSON.parse(localStorage.getItem('hod'));
      const hodDepartment = hodData?.departmentName;

      const response = await fetch('http://localhost:8787/api/professors/get-prof');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const allProfessors = await response.json();
      
      // Filter professors by HOD's department
      const departmentProfessors = hodDepartment 
        ? allProfessors.filter(prof => prof.departmentName === hodDepartment)
        : allProfessors;
      
      setProfessors(departmentProfessors);
      setError(null);
    } catch (error) {
      console.error('Error fetching professors:', error);
      setError('Failed to load professors data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 mb-8 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <Typography variant="small" color="blue-gray">
            Loading professors data...
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 mb-8">
        <Card>
          <CardBody className="text-center py-8">
            <Typography variant="h6" color="red" className="mb-2">
              Error Loading Data
            </Typography>
            <Typography variant="small" color="blue-gray">
              {error}
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Department Faculty Overview ({professors.length} Professors)
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {professors.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                No Professors Found
              </Typography>
              <Typography variant="small" color="blue-gray">
                No professors are currently assigned to this department.
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Professor", "ID", "Subject", "Email", "Phone", "Status"].map((el) => (
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
                {professors.map((professor, key) => {
                  const className = `py-3 px-5 ${
                    key === professors.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={professor.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={professor.imageUrl || "/img/user.png"}
                            alt={professor.name}
                            size="sm"
                            variant="rounded"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {professor.name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-600">
                              {professor.departmentName}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {professor.professorId}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {professor.subject}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {professor.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {professor.phone || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color="green"
                          value="Active"
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default SemesterTable;
