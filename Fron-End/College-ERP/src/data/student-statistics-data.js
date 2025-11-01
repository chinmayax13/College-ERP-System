import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export const studentStatisticsCardsData = [
  {
    color: "blue",
    icon: AcademicCapIcon,
    title: "Current CGPA",
    value: "8.7",
    footer: {
      color: "text-green-500",
      value: "+0.3",
      label: "from last semester",
    },
  },
  {
    color: "green", 
    icon: ChartBarIcon,
    title: "Attendance",
    value: "92%",
    footer: {
      color: "text-green-500",
      value: "Above",
      label: "required minimum",
    },
  },
  {
    color: "orange",
    icon: ClockIcon,
    title: "Credits Completed",
    value: "145/180",
    footer: {
      color: "text-blue-500",
      value: "80.5%",
      label: "course completion",
    },
  },
];

export const studentStatisticsChartsData = [
  {
    color: "blue",
    title: "Semester-wise Performance",
    description: "Your CGPA trend over semesters",
    footer: "Based on completed semesters",
    chart: {
      type: "line",
      height: 220,
      series: [
        {
          name: "CGPA",
          data: [7.8, 8.1, 8.3, 8.5, 8.2, 8.4, 8.7],
        },
      ],
      options: {
        colors: ["#2563eb"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
          width: 3,
        },
        markers: {
          size: 5,
        },
        xaxis: {
          categories: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7"],
        },
        yaxis: {
          min: 6,
          max: 10,
        },
      },
    },
  },
  {
    color: "green",
    title: "Subject-wise Performance",
    description: "Current semester subject scores", 
    footer: "Mid-semester results",
    chart: {
      type: "bar",
      height: 220,
      series: [
        {
          name: "Score",
          data: [87, 92, 78, 85, 90, 88],
        },
      ],
      options: {
        colors: ["#16a34a"],
        plotOptions: {
          bar: {
            columnWidth: "25%",
            borderRadius: 5,
          },
        },
        xaxis: {
          categories: ["DSA", "DBMS", "OS", "Networks", "Algorithms", "Web Dev"],
        },
      },
    },
  },
  {
    color: "orange", 
    title: "Attendance Overview",
    description: "Monthly attendance percentage",
    footer: "Current academic year",
    chart: {
      type: "area",
      height: 220,
      series: [
        {
          name: "Attendance %",
          data: [85, 90, 88, 92, 89, 94, 92, 91],
        },
      ],
      options: {
        colors: ["#ea580c"],
        stroke: {
          curve: "smooth",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
          },
        },
        xaxis: {
          categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
        },
        yaxis: {
          min: 70,
          max: 100,
        },
      },
    },
  },
];

export default { studentStatisticsCardsData, studentStatisticsChartsData };