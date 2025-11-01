import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Typography,
  Spinner,
  Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";
import { PaperClipIcon } from "@heroicons/react/24/outline";

const MailSender = () => {
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientType, setRecipientType] = useState("all-students"); // Default to 'all-students'
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedProfessors, setSelectedProfessors] = useState([]);
  const [hodInfo, setHodInfo] = useState(null);

  useEffect(() => {
    // Get HOD information from localStorage
    const hodData = JSON.parse(localStorage.getItem("hodData"));
    if (hodData) {
      setHodInfo(hodData);
    }

    if (recipientType === "selected-students") {
      fetchStudents();
    } else if (recipientType === "selected-professors") {
      fetchProfessors();
    }
  }, [recipientType]);

  const fetchStudents = async () => {
    try {
      // Use department-based approach to avoid 403 errors
      const departments = ['Computer Science', 'CSE', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
      let allStudents = [];
      
      for (const dept of departments) {
        try {
          const response = await axios.get(`http://localhost:8787/api/attendance/students/department/${dept}`);
          if (response.data && Array.isArray(response.data)) {
            allStudents = [...allStudents, ...response.data];
          }
        } catch (error) {
          // Continue with next department
        }
      }
      
      // Remove duplicates based on email
      const uniqueStudents = allStudents.filter((student, index, self) => 
        index === self.findIndex(s => s.email === student.email)
      );
      
      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await axios.get("http://localhost:8787/api/professors/get-prof");
      setProfessors(response.data || []);
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const handleAttachmentsChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleRecipientTypeChange = (value) => {
    setRecipientType(value);
  };

  const generateEmailSignature = () => {
    if (!hodInfo) return "";
    
    return `
    <br><br>
    <div style="border-top: 2px solid #1976d2; padding-top: 15px; margin-top: 20px;">
      <p style="margin: 0; font-weight: bold; color: #1976d2;">Best regards,</p>
      <p style="margin: 5px 0; font-weight: bold;">${hodInfo.name || 'HOD'}</p>
      <p style="margin: 2px 0; color: #666;">Head of Department</p>
      <p style="margin: 2px 0; color: #666;">${hodInfo.department || 'Department'}</p>
      <p style="margin: 2px 0; color: #666;">Email: ${hodInfo.email || ''}</p>
      <p style="margin: 2px 0; color: #666;">Phone: ${hodInfo.phoneNumber || hodInfo.phone || ''}</p>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
        This email was sent from the College ERP System
      </p>
    </div>
    `;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create enhanced email body with HOD signature
    const enhancedBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      ${body}
      ${generateEmailSignature()}
    </div>
    `;

    const formData = new FormData();
    formData.append("recipientType", recipientType);
    formData.append("subject", subject);
    formData.append("body", enhancedBody);
    
    // Add HOD information for backend processing
    if (hodInfo) {
      formData.append("senderName", hodInfo.name || "HOD");
      formData.append("senderEmail", hodInfo.email || "");
      formData.append("senderDepartment", hodInfo.department || "");
    }
    
    if (recipientType === "selected-students") {
      formData.append("selectedStudents", JSON.stringify(selectedStudents));
    } else if (recipientType === "selected-professors") {
      formData.append("selectedProfessors", JSON.stringify(selectedProfessors));
    } else if (
      recipientType === "individual-student" ||
      recipientType === "individual-professor"
    ) {
      formData.append("recipients", recipients);
    }

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      setIsLoading(true);
      await axios.post("http://localhost:8787/api/email/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Emails sent successfully!");
      // Reset the form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecipients("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setRecipientType("all-students"); // Reset to default
    setSelectedStudents([]);
    setSelectedProfessors([]);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-12 shadow-lg border border-gray-100">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div>
          <Typography variant="h5" className="font-semibold mb-2">
            Department Email Sender
          </Typography>
          {hodInfo && (
            <Typography variant="small" className="opacity-90">
              Sending as: {hodInfo.name} - Head of {hodInfo.department}
            </Typography>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Typography
              variant="small"
              className="block text-gray-700 font-medium mb-2"
            >
              Recipients Type
            </Typography>
            <Select
              value={recipientType}
              onChange={(value) => handleRecipientTypeChange(value)}
              className="w-full"
            >
              <Option value="all-students">All Students</Option>
              <Option value="all-professors">All Professors</Option>
              <Option value="all">All Students + All Professors</Option>
              <Option value="individual-student">Individual Student</Option>
              <Option value="individual-professor">Individual Professor</Option>
              <Option value="selected-students">Selected Students</Option>
              <Option value="selected-professors">Selected Professors</Option>
            </Select>
          </div>

          {recipientType === "individual-student" && (
            <div>
              <Typography
                variant="small"
                className="block text-gray-700 font-medium mb-2"
              >
                Individual Student Email
              </Typography>
              <Input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter the student's email"
                required
                className="w-full"
              />
            </div>
          )}
          {recipientType === "individual-professor" && (
            <div>
              <Typography
                variant="small"
                className="block text-gray-700 font-medium mb-2"
              >
                Individual Professor Email
              </Typography>
              <Input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter the professor's email"
                required
                className="w-full"
              />
            </div>
          )}

          {/* Selected Students Checkbox List */}
          {recipientType === "selected-students" && (
            <div>
              <Typography
                variant="small"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Students
              </Typography>
              <div>
                {students.map((student) => (
                  <Checkbox
                    key={student.id}
                    label={student.email}
                    checked={selectedStudents.includes(student.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents([
                          ...selectedStudents,
                          student.email,
                        ]);
                      } else {
                        setSelectedStudents(
                          selectedStudents.filter(
                            (email) => email !== student.email
                          )
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Selected Professors Checkbox List */}
          {recipientType === "selected-professors" && (
            <div>
              <Typography
                variant="small"
                className="block text-gray-700 font-medium mb-2"
              >
                Select Professors
              </Typography>
              <div>
                {professors.map((professor) => (
                  <Checkbox
                    key={professor.id}
                    label={professor.email}
                    checked={selectedProfessors.includes(professor.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProfessors([
                          ...selectedProfessors,
                          professor.email,
                        ]);
                      } else {
                        setSelectedProfessors(
                          selectedProfessors.filter(
                            (email) => email !== professor.email
                          )
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <Typography
              variant="small"
              className="block text-gray-700 font-medium mb-2"
            >
              Subject
            </Typography>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              required
              className="w-full"
            />
          </div>
          <div>
            <Typography
              variant="small"
              className="block text-gray-700 font-medium mb-2"
            >
              Body
            </Typography>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter your message here. Your HOD signature will be automatically added."
              rows="6"
              required
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {body && hodInfo && (
              <div className="mt-2 p-3 bg-gray-50 border rounded-md">
                <Typography variant="small" className="text-gray-600 mb-2 font-medium">
                  Email Preview:
                </Typography>
                <div 
                  className="text-sm border-l-4 border-blue-500 pl-3"
                  dangerouslySetInnerHTML={{ 
                    __html: `${body.replace(/\n/g, '<br>')}<br><br><strong>Best regards,</strong><br><strong>${hodInfo.name}</strong><br>Head of Department - ${hodInfo.department}` 
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <Typography
              variant="small"
              className="block text-gray-700 font-medium mb-2"
            >
              Attachments
            </Typography>
            <div className="flex items-center gap-4">
              <input
                type="file"
                multiple
                onChange={handleAttachmentsChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                <PaperClipIcon className="h-5 w-5" />
                <span className="underline">Attach files</span>
              </label>
              {attachments.length > 0 && (
                <Typography variant="small" className="text-gray-600">
                  {attachments.length} file(s) selected
                </Typography>
              )}
            </div>
          </div>
          <div>
            <Button
              type="submit"
              color="blue"
              disabled={isLoading}
              fullWidth
              className="flex items-center justify-center"
            >
              {isLoading ? <Spinner className="h-5 w-5" /> : "Send Email"}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default MailSender;
