import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { studentStatisticsCardsData } from "@/data/student-statistics-data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import StudentTimetable from "@/components/StudentTimetable";

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-gray-50 to-white p-6 -mt-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
          <Typography variant="h3" className="font-bold mb-2">
            Welcome Back, Student! 👋
          </Typography>
          <Typography variant="lead" className="opacity-90">
            Ready to continue your learning journey? Check your latest progress and upcoming classes.
          </Typography>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {studentStatisticsCardsData.map(({ icon, title, footer, ...rest }, index) => (
          <div key={title} className="transform hover:scale-105 transition-all duration-300">
            <Card className="bg-gradient-to-br from-white to-blue-gray-50 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${index === 0 ? 'from-green-400 to-green-600' : index === 1 ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'} flex items-center justify-center shadow-lg`}>
                    {React.createElement(icon, {
                      className: "w-8 h-8 text-white",
                    })}
                  </div>
                  <div className="text-right">
                    <Typography variant="small" className="text-blue-gray-500 font-medium uppercase tracking-wide">
                      {title}
                    </Typography>
                    <Typography variant="h4" className="font-bold text-blue-gray-800 mt-1">
                      {rest.value}
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
        ))}
      </div>

      {/* Timetable Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h4" className="font-bold text-blue-gray-800 flex items-center gap-2">
            📅 Your Weekly Schedule
          </Typography>
          <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
            <Typography variant="small" className="text-white font-semibold">
              Current Week
            </Typography>
          </div>
        </div>
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardBody className="p-0">
            <StudentTimetable />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
