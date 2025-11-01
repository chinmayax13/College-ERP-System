import {
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const professorStatisticsCardsData = [
  {
    color: "blue",
    icon: BookOpenIcon,
    title: "My Subjects",
    value: "3",
    footer: {
      color: "text-blue-500",
      value: "Active",
      label: "this semester",
    },
  },
  {
    color: "green", 
    icon: UserGroupIcon,
    title: "Total Students",
    value: "120",
    footer: {
      color: "text-green-500",
      value: "Across",
      label: "all my classes",
    },
  },
  {
    color: "orange",
    icon: ClockIcon,
    title: "Teaching Hours",
    value: "18/week",
    footer: {
      color: "text-orange-500",
      value: "Standard",
      label: "workload",
    },
  },
  {
    color: "red",
    icon: ChartBarIcon,
    title: "Student Rating",
    value: "4.6/5.0",
    footer: {
      color: "text-green-500",
      value: "+0.3",
      label: "from last semester",
    },
  },
];

export const professorStatisticsChartsData = [
  {
    color: "blue",
    title: "Class Performance",
    description: "Average class performance by subject",
    footer: "Based on recent assessments",
    chart: {
      type: "bar",
      height: 220,
      series: [
        {
          name: "Average Score",
          data: [82, 78, 85, 79, 88, 84],
        },
      ],
      options: {
        colors: ["#2563eb"],
        plotOptions: {
          bar: {
            columnWidth: "20%",
            borderRadius: 5,
          },
        },
        xaxis: {
          categories: ["Data Structures", "Algorithms", "Database", "Networks", "OS", "Software Eng"],
        },
      },
    },
  },
  {
    color: "green",
    title: "Student Engagement",
    description: "Class participation and attendance trends", 
    footer: "Updated weekly",
    chart: {
      type: "line",
      height: 220,
      series: [
        {
          name: "Attendance %",
          data: [88, 92, 87, 89, 94, 91, 93, 90, 95, 92],
        },
        {
          name: "Participation %", 
          data: [75, 78, 82, 79, 85, 88, 86, 89, 87, 90],
        },
      ],
      options: {
        colors: ["#16a34a", "#22c55e"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
        },
        xaxis: {
          categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10"],
        },
      },
    },
  },
];

export default { professorStatisticsCardsData, professorStatisticsChartsData };