# College ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed specifically for educational institutions. This full-stack application provides role-based access control and management capabilities for administrators, HODs, professors, and students.

## 🏗️ Project Architecture

```
College-ERP-System/
├── Back-End/                 # Spring Boot REST API
│   └── stud-erp/
│       ├── src/main/java/
│       │   └── com/example/stud_erp/
│       │       ├── controller/     # REST Controllers
│       │       ├── entity/         # JPA Entities
│       │       ├── service/        # Business Logic
│       │       ├── repository/     # Data Access Layer
│       │       ├── configuration/  # Security & Config
│       │       ├── payload/        # DTOs & Request Objects
│       │       └── exception/      # Custom Exceptions
│       └── pom.xml
├── Front-End/                # React.js Frontend
│   └── College-ERP/
│       ├── src/
│       │   ├── pages/dashboard/    # Role-based Dashboards
│       │   │   ├── admin/         # Admin Management
│       │   │   ├── hod/           # HOD Operations
│       │   │   ├── professor/     # Professor Interface
│       │   │   └── student/       # Student Portal
│       │   ├── components/        # Reusable UI Components
│       │   ├── layouts/           # Page Layouts
│       │   └── data/             # Mock Data & Constants
│       └── package.json
└── README.md
```

## 🚀 Technology Stack

### Backend

- **Framework**: Spring Boot 3.2.7
- **Language**: Java 17
- **Database**: MySQL
- **ORM**: JPA/Hibernate
- **Security**: Spring Security
- **Build Tool**: Maven
- **Image Storage**: Cloudinary
- **Email Service**: Spring Mail
- **Documentation**: REST API

### Frontend

- **Framework**: React 18.2.0
- **Build Tool**: Vite 7.1.2
- **UI Library**: Material Tailwind 2.1.4
- **Routing**: React Router DOM 6.17.0
- **State Management**: Redux Toolkit 2.2.7
- **Styling**: Tailwind CSS 3.3.4
- **Icons**: Heroicons, React Icons
- **Charts**: ApexCharts
- **HTTP Client**: Axios

## 👥 User Roles & Features

### 🔐 Admin Dashboard

- **User Management**: Bulk add students, professors, and HODs
- **System Analytics**: Comprehensive dashboard with statistics
- **Profile Management**: Admin profile customization
- **Bulk Operations**: CSV import/export functionality

### 🏢 HOD (Head of Department) Dashboard

- **Faculty Overview**: View and manage department professors
- **Department Statistics**: Real-time faculty and student counts
- **Email System**: Send department-wide emails with professional signatures
- **Notifications**: Create and manage department notifications
- **Faculty Management**: Monitor professor activities and performance

### 👨‍🏫 Professor Dashboard

- **Student Analytics**: View total registered students across departments
- **Class Management**: Track completed and upcoming classes
- **Attendance System**:
  - Take attendance for classes
  - View attendance analytics and trends
  - Generate attendance reports
- **Profile Management**: Update personal and professional information
- **Timetable**: View BTech class schedules
- **Notifications**: Receive and manage notifications

### 🎓 Student Dashboard

- **Academic Overview**: View academic statistics and progress
- **Timetable**: Personal weekly class schedule
- **Attendance Tracking**: View personal attendance records
- **Academic Records**: Semester-wise grade reports
- **Notifications**: Receive important announcements
- **Profile Management**: Update personal information

## 🛠️ Key Features

### 📊 Attendance Management

- **Real-time Attendance**: Professors can take attendance using intuitive interface
- **Analytics Dashboard**: Detailed attendance statistics and trends
- **Performance Tracking**: Student-wise and class-wise attendance analysis
- **Department Filtering**: Filter attendance by department and subject

### 📧 Email & Notification System

- **Professional Email**: HOD can send branded emails with signatures
- **Notification Management**: Create, send, and track notifications
- **Recipient Targeting**: Send to specific roles or departments
- **Email Preview**: Preview emails before sending

### 🔒 Security Features

- **Role-based Access Control**: Secure endpoints based on user roles
- **JWT Authentication**: Stateless authentication mechanism
- **Password Security**: BCrypt password hashing
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Comprehensive input validation and sanitization

### 📱 User Experience

- **Responsive Design**: Mobile-first responsive interface
- **Modern UI**: Material Design components with Tailwind CSS
- **Real-time Updates**: Dynamic data loading and updates
- **Intuitive Navigation**: Role-based navigation menus
- **Professional Theming**: Gradient backgrounds and modern styling

## 🗄️ Database Schema

### Core Entities

- **Users**: Base user entity with role management
- **Student**: Student-specific information and records
- **Professor**: Faculty details and subject assignments
- **HOD**: Department head information and responsibilities
- **Admin**: System administrator details
- **Department**: Organizational structure
- **Attendance**: Class attendance records
- **Notification**: System notifications and announcements
- **Subject**: Academic subjects and curriculum
- **Semester**: Academic semester management

### Relationships

- One-to-Many: Department → Students/Professors
- Many-to-One: HOD → Department
- One-to-Many: Professor → Attendance Records
- Many-to-Many: Student → Subjects (through attendance)

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

```bash
cd Back-End/stud-erp
mvn clean install
mvn spring-boot:run
```

The backend server will start at `http://localhost:8787`

### Frontend Setup

```bash
cd Front-End/College-ERP
npm install
npm run dev
```

The frontend application will start at `http://localhost:5173`

### Database Configuration

1. Create MySQL database: `college_erp`
2. Update `application.properties` with your database credentials
3. JPA will auto-create tables on first run

## 📚 API Endpoints

### Authentication

- `POST /api/students/login` - Student login
- `POST /api/professors/login` - Professor login
- `POST /api/hods/login` - HOD login
- `POST /api/admin/auth/login` - Admin login

### User Management

- `GET /api/students` - Get all students
- `GET /api/professors/get-prof` - Get all professors
- `POST /api/admin/students/bulk-import` - Bulk import students
- `PUT /api/professors/{id}` - Update professor profile

### Attendance

- `GET /api/attendance/lecturer/subject` - Get attendance by lecturer and subject
- `GET /api/attendance/students/department/{dept}` - Get students by department
- `POST /api/attendance` - Submit attendance records

### Notifications & Email

- `POST /api/notifications/send` - Send notifications
- `GET /api/notifications/sent/{hodId}` - Get sent notifications
- `POST /api/email/send` - Send emails

## 🎨 UI Components

### Reusable Components

- **StatisticsCard**: Display metrics and KPIs
- **ProfileInfoCard**: User profile information display
- **MailSender**: Email composition and sending interface
- **Timetable**: Class schedule visualization
- **AttendanceFlow**: Attendance taking workflow

### Design System

- **Color Palette**: Professional gradients and Material Design colors
- **Typography**: Consistent font hierarchy using Material Tailwind
- **Spacing**: Standardized margin and padding system
- **Icons**: Heroicons for consistent iconography

## 📈 System Performance

### Optimization Features

- **Lazy Loading**: React components loaded on demand
- **Code Splitting**: Optimized bundle sizes
- **Efficient Queries**: Optimized database queries with JPA
- **Caching**: Strategic caching implementation
- **Image Optimization**: Cloudinary integration for image management

## 🔧 Configuration

### Backend Configuration

- **Security**: CORS, CSRF protection, JWT configuration
- **Database**: JPA/Hibernate configuration
- **Email**: SMTP configuration for email services
- **File Upload**: Multipart file handling for images

### Frontend Configuration

- **Routing**: Protected routes based on user roles
- **State Management**: Redux store configuration
- **API Integration**: Axios interceptors and error handling
- **Build Configuration**: Vite optimization settings

## 🚦 Development Workflow

### Backend Development

1. Create entity classes with JPA annotations
2. Implement repository interfaces
3. Develop service layer with business logic
4. Create REST controllers with proper endpoints
5. Configure security and validation

### Frontend Development

1. Design component hierarchy
2. Implement responsive layouts
3. Integrate with backend APIs
4. Add state management
5. Implement routing and navigation

## 📋 Future Enhancements

### Planned Features

- **Mobile Application**: React Native mobile app
- **Advanced Analytics**: Detailed reporting and insights
- **Integration APIs**: Third-party system integration
- **Blockchain Certificates**: Secure certificate management
- **AI-Powered Insights**: Predictive analytics for student performance
- **Video Conferencing**: Integrated virtual classroom
- **Library Management**: Digital library system
- **Fee Management**: Online fee payment system

### Technical Improvements

- **Microservices Architecture**: Decompose monolith into microservices
- **Docker Containerization**: Container-based deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Real-time Features**: WebSocket integration for live updates
- **Performance Monitoring**: Application performance monitoring
- **Load Balancing**: Horizontal scaling capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:

- Create an issue in the repository
- Contact the development team
- Check documentation and API guides

## 🙏 Acknowledgments

- Material Tailwind for UI components
- Spring Boot community for excellent documentation
- React.js team for the powerful frontend framework
- Contributors and testers who helped improve the system

---

**Built with ❤️ by Chinmaya Subudhi**
