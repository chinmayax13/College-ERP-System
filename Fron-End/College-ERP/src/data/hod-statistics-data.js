import {
  UsersIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/solid";

export const hodStatisticsCardsData = [
  {
    color: "blue",
    icon: UsersIcon,
    title: "Total Faculty",
    value: "15",
    footer: {
      color: "text-green-500",
      value: "+2",
      label: "new this year",
    },
  },
  {
    color: "green", 
    icon: AcademicCapIcon,
    title: "Total Students",
    value: "450",
    footer: {
      color: "text-green-500",
      value: "+12%",
      label: "from last semester",
    },
  },
  {
    color: "orange",
    icon: ChartBarIcon,
    title: "Department Rating",
    value: "4.8/5.0",
    footer: {
      color: "text-green-500",
      value: "+0.2",
      label: "improvement",
    },
  },
  {
    color: "red",
    icon: BuildingOfficeIcon,
    title: "Active Programs",
    value: "8",
    footer: {
      color: "text-blue-500",
      value: "UG & PG",
      label: "programs running",
    },
  },
];

export const hodStatisticsChartsData = [
  {
    color: "blue",
    title: "Faculty Performance",
    description: "Department faculty evaluation scores",
    footer: "Updated 2 days ago",
    chart: {
      type: "bar",
      height: 220,
      series: [
        {
          name: "Performance Score",
          data: [85, 90, 88, 92, 87, 89, 91, 86, 94, 88],
        },
      ],
      options: {
        colors: ["#2563eb"],
        plotOptions: {
          bar: {
            columnWidth: "16%",
            borderRadius: 5,
          },
        },
        xaxis: {
          categories: ["Prof A", "Prof B", "Prof C", "Prof D", "Prof E", "Prof F", "Prof G", "Prof H", "Prof I", "Prof J"],
        },
      },
    },
  },
  {
    color: "green",
    title: "Student Enrollment Trend",
    description: "Monthly student enrollment statistics", 
    footer: "Updated today",
    chart: {
      type: "line",
      height: 220,
      series: [
        {
          name: "Enrollments",
          data: [45, 52, 48, 61, 58, 67, 72, 69, 75, 78],
        },
      ],
      options: {
        colors: ["#16a34a"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
        },
        xaxis: {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        },
      },
    },
  },
  {
    color: "orange", 
    title: "Department Budget",
    description: "Budget allocation and utilization",
    footer: "Budget cycle 2024-25",
    chart: {
      type: "donut",
      height: 220,
      series: [65, 20, 15],
      options: {
        colors: ["#ea580c", "#f97316", "#fb923c"],
        labels: ["Utilized", "Reserved", "Available"],
        legend: {
          show: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                value: {
                  show: true,
                  fontSize: "16px",
                  fontWeight: 600,
                },
              },
            },
          },
        },
      },
    },
  },
];

export default { hodStatisticsCardsData, hodStatisticsChartsData };