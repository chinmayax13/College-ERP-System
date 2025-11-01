import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Typography,
  Select,
  Option,
  Spinner,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  IconButton,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import axios from "axios";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { BellIcon } from "@heroicons/react/24/outline";

const NotificationSender = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [recipientType, setRecipientType] = useState("ALL_STUDENTS");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [hodId, setHodId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  
  // Sent notifications management
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loadingSentNotifications, setLoadingSentNotifications] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editDialog, setEditDialog] = useState({ 
    open: false, 
    notification: null,
    editTitle: "",
    editMessage: "",
    editSubject: ""
  });
  const [viewDialog, setViewDialog] = useState({ open: false, notification: null });

  useEffect(() => {
    const hodData = JSON.parse(localStorage.getItem("hodData"));
    if (hodData && hodData.id) {
      setHodId(hodData.id);
    } else {
      setFeedback({ type: "error", message: "HOD information not found. Please log in again." });
    }
  }, []);

  const fetchSentNotifications = useCallback(async () => {
    if (!hodId) return; // Don't fetch if no HOD ID
    
    setLoadingSentNotifications(true);
    try {
      console.log("Fetching sent notifications for HOD ID:", hodId);
      const response = await axios.get(`http://localhost:8787/api/notifications/sent/${hodId}`);
      console.log("Sent notifications response status:", response.status);
      console.log("Sent notifications response data:", response.data);
      
      // No more grouping needed - backend returns unique notifications only!
      setSentNotifications(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      
      if (response.data.length === 0) {
        console.log("No sent notifications found. This could be because:");
        console.log("1. You haven't sent any notifications yet");
        console.log("2. Previous notifications were created before the senderId field was added");
        console.log("3. There's a mismatch between HOD ID and stored notifications");
      }
    } catch (error) {
      console.error("Error fetching sent notifications:", error);
      console.error("Error details:", error.response?.data);
      setFeedback({ type: "error", message: "Failed to load sent notifications." });
    } finally {
      setLoadingSentNotifications(false);
    }
  }, [hodId]);

  useEffect(() => {
    if (hodId && activeTab === "manage") {
      fetchSentNotifications();
    }
  }, [hodId, activeTab, fetchSentNotifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!hodId) {
      setFeedback({ type: "error", message: "Cannot send notification without HOD ID." });
      return;
    }

    const notificationData = {
      title,
      message,
      subject,
      recipientType,
      senderId: hodId,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8787/api/notifications/send",
        notificationData
      );

      if (response.status === 200) {
        setFeedback({ type: "success", message: "Notification sent successfully!" });
        resetForm();
        // Refresh sent notifications if we're on the manage tab
        if (activeTab === "manage") {
          fetchSentNotifications();
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data || "An unexpected error occurred.";
      setFeedback({ type: "error", message: `Failed to send notification: ${errorMessage}` });
      console.error("Error sending notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      await axios.delete(`http://localhost:8787/api/notifications/${deleteDialog.id}`);
      setFeedback({ type: "success", message: "Notification deleted successfully!" });
      setDeleteDialog({ open: false, id: null });
      fetchSentNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      setFeedback({ type: "error", message: "Failed to delete notification." });
    }
  };

  const handleEditNotification = async () => {
    try {
      const updateData = {
        title: editDialog.editTitle,
        message: editDialog.editMessage,
        subject: editDialog.editSubject,
        recipientType: editDialog.notification.recipientType,
        senderId: hodId,
      };

      await axios.put(`http://localhost:8787/api/notifications/${editDialog.notification.id}`, updateData);
      setFeedback({ type: "success", message: "Notification updated successfully!" });
      setEditDialog({ open: false, notification: null, editTitle: "", editMessage: "", editSubject: "" });
      fetchSentNotifications();
    } catch (error) {
      console.error("Error updating notification:", error);
      setFeedback({ type: "error", message: "Failed to update notification." });
    }
  };

  const openEditDialog = (notification) => {
    setEditDialog({
      open: true,
      notification,
      editTitle: notification.title,
      editMessage: notification.message,
      editSubject: notification.subject || "",
    });
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSubject("");
    setRecipientType("ALL_STUDENTS");
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRecipientTypeChip = (recipientType) => {
    const config = {
      "ALL_STUDENTS": { color: "blue", label: "Students" },
      "ALL_PROFESSORS": { color: "green", label: "Professors" },
      "ALL": { color: "purple", label: "All" }
    };
    return config[recipientType] || { color: "gray", label: recipientType || "Unknown" };
  };

  return (
    <div className="mt-12">
      <Card className="max-w-6xl mx-auto shadow-lg border border-gray-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-center gap-3">
            <BellIcon className="h-8 w-8" />
            <div>
              <Typography variant="h4" className="font-bold">
                Notification Management
              </Typography>
              <Typography variant="small" className="opacity-80">
                Send and manage notifications for students and professors
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {feedback.message && (
            <Alert
              color={feedback.type === "success" ? "green" : "red"}
              icon={feedback.type === "success" ? <CheckCircleIcon className="h-6 w-6" /> : <ExclamationTriangleIcon className="h-6 w-6" />}
              className="mb-6"
            >
              {feedback.message}
            </Alert>
          )}

          <Tabs value={activeTab}>
            <TabsHeader className="grid w-full grid-cols-2">
              <Tab value="send" onClick={() => setActiveTab("send")}>
                <div className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Send Notification
                </div>
              </Tab>
              <Tab value="manage" onClick={() => setActiveTab("manage")}>
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-4 w-4" />
                  Manage Sent ({sentNotifications.length})
                </div>
              </Tab>
            </TabsHeader>
            <TabsBody>
              {/* Send Notification Tab */}
              <TabPanel value="send" className="p-0 mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Typography variant="small" className="block text-gray-700 font-medium mb-2">
                        Recipient Type
                      </Typography>
                      <Select
                        value={recipientType}
                        onChange={(value) => setRecipientType(value)}
                        className="w-full"
                      >
                        <Option value="ALL_STUDENTS">All Students</Option>
                        <Option value="ALL_PROFESSORS">All Professors</Option>
                        <Option value="ALL">All Students & Professors</Option>
                      </Select>
                    </div>

                    <div>
                      <Typography variant="small" className="block text-gray-700 font-medium mb-2">
                        Subject (Optional)
                      </Typography>
                      <Input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g., Exam Schedule, Holiday"
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="small" className="block text-gray-700 font-medium mb-2">
                      Notification Title
                    </Typography>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter notification title"
                      required
                    />
                  </div>

                  <div>
                    <Typography variant="small" className="block text-gray-700 font-medium mb-2">
                      Message
                    </Typography>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message"
                      rows="4"
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      color="blue"
                      size="lg"
                      fullWidth
                      className="flex items-center justify-center gap-2"
                      disabled={isLoading || !hodId}
                    >
                      {isLoading ? <Spinner className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                      {isLoading ? "Sending..." : "Send Notification"}
                    </Button>
                  </div>
                </form>
              </TabPanel>

              {/* Manage Sent Notifications Tab */}
              <TabPanel value="manage" className="p-0 mt-6">
                {/* Header with Refresh Button */}
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6" color="blue-gray">
                    Sent Notifications
                  </Typography>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="blue"
                    onClick={fetchSentNotifications}
                    disabled={loadingSentNotifications}
                    className="flex items-center gap-2"
                  >
                    {loadingSentNotifications ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                    Refresh
                  </Button>
                </div>
                
                {loadingSentNotifications ? (
                  <div className="flex justify-center items-center h-64">
                    <Spinner className="h-8 w-8" />
                  </div>
                ) : sentNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {sentNotifications.map((notification) => (
                      <Card key={notification.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Typography variant="h6" color="blue-gray" className="font-semibold">
                                  {notification.title}
                                </Typography>
                                <Chip
                                  value={getRecipientTypeChip(notification.recipientType).label}
                                  color={getRecipientTypeChip(notification.recipientType).color}
                                  size="sm"
                                  className="px-2 py-1 text-xs"
                                />
                              </div>
                              
                              {notification.subject && (
                                <Typography variant="small" color="gray" className="mb-2 font-medium">
                                  Subject: {notification.subject}
                                </Typography>
                              )}
                              
                              <Typography variant="small" color="gray" className="mb-3 line-clamp-2">
                                {notification.message}
                              </Typography>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="h-4 w-4" />
                                  {formatTimeAgo(notification.timestamp)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <UserGroupIcon className="h-4 w-4" />
                                  Sent to {getRecipientTypeChip(notification.recipientType).label}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 ml-4">
                              <IconButton
                                size="sm"
                                variant="text"
                                color="blue"
                                onClick={() => setViewDialog({ open: true, notification })}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                variant="text"
                                color="amber"
                                onClick={() => openEditDialog(notification)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                size="sm"
                                variant="text"
                                color="red"
                                onClick={() => setDeleteDialog({ open: true, id: notification.id })}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Typography variant="h6" color="blue-gray" className="mb-2">
                      No notifications sent yet
                    </Typography>
                    <Typography variant="small" color="gray">
                      Your sent notifications will appear here
                    </Typography>
                  </div>
                )}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} handler={() => setDeleteDialog({ open: false, id: null })}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this notification? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setDeleteDialog({ open: false, id: null })}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="filled" color="red" onClick={handleDeleteNotification}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Notification Dialog */}
      <Dialog 
        open={editDialog.open} 
        handler={() => setEditDialog({ open: false, notification: null, editTitle: "", editMessage: "", editSubject: "" })}
        size="lg"
      >
        <DialogHeader>Edit Notification</DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography variant="small" className="block text-gray-700 font-medium mb-2">
              Title
            </Typography>
            <Input
              value={editDialog.editTitle}
              onChange={(e) => setEditDialog(prev => ({ ...prev, editTitle: e.target.value }))}
              placeholder="Enter notification title"
            />
          </div>
          <div>
            <Typography variant="small" className="block text-gray-700 font-medium mb-2">
              Subject (Optional)
            </Typography>
            <Input
              value={editDialog.editSubject}
              onChange={(e) => setEditDialog(prev => ({ ...prev, editSubject: e.target.value }))}
              placeholder="Enter subject"
            />
          </div>
          <div>
            <Typography variant="small" className="block text-gray-700 font-medium mb-2">
              Message
            </Typography>
            <textarea
              value={editDialog.editMessage}
              onChange={(e) => setEditDialog(prev => ({ ...prev, editMessage: e.target.value }))}
              placeholder="Enter your message"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setEditDialog({ open: false, notification: null, editTitle: "", editMessage: "", editSubject: "" })}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="filled" color="blue" onClick={handleEditNotification}>
            Save Changes
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View Notification Dialog */}
      <Dialog 
        open={viewDialog.open} 
        handler={() => setViewDialog({ open: false, notification: null })}
        size="md"
      >
        <DialogHeader>Notification Details</DialogHeader>
        <DialogBody>
          {viewDialog.notification ? (
            <div className="space-y-4">
              <div>
                <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                  Title:
                </Typography>
                <Typography>{viewDialog.notification.title}</Typography>
              </div>
              
              {viewDialog.notification.subject && (
                <div>
                  <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                    Subject:
                  </Typography>
                  <Typography>{viewDialog.notification.subject}</Typography>
                </div>
              )}
              
              <div>
                <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                  Recipients:
                </Typography>
                <div className="flex items-center gap-2">
                  <Chip
                    value={getRecipientTypeChip(viewDialog.notification.recipientType).label}
                    color={getRecipientTypeChip(viewDialog.notification.recipientType).color}
                    size="sm"
                  />
                  <Typography variant="small" color="gray">
                    (Broadcast notification)
                  </Typography>
                </div>
              </div>
              
              <div>
                <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                  Message:
                </Typography>
                <Typography className="whitespace-pre-wrap">{viewDialog.notification.message}</Typography>
              </div>
              
              <div>
                <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                  Sent:
                </Typography>
                <Typography variant="small" color="gray">
                  {new Date(viewDialog.notification.timestamp).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </div>
            </div>
          ) : (
            <Typography>Loading notification details...</Typography>
          )}
        </DialogBody>
        <DialogFooter>
          <Button 
            variant="filled" 
            color="blue" 
            onClick={() => setViewDialog({ open: false, notification: null })}
          >
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default NotificationSender;
