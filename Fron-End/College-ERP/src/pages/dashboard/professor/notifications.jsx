import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Chip,
  Badge,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [professor, setProfessor] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewDialog, setViewDialog] = useState({
    open: false,
    notification: null
  });

  useEffect(() => {
    const storedProfessorData = localStorage.getItem("professorData");

    if (storedProfessorData) {
      const professorData = JSON.parse(storedProfessorData);
      setProfessor(professorData);
      console.log("Professor data: ", professorData);
    } else {
      setError("No professor data available. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (professor) {
          const response = await axios.get(
            `http://localhost:8787/api/notifications/professor/${professor.professorId}`
          );

          setNotifications(response.data);
          console.log("Notifications: ", response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (professor) {
      fetchNotifications();
    }
  }, [professor]);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const handleNotificationClick = async (notification) => {
    setViewDialog({
      open: true,
      notification: notification
    });

    // If notification is unread, mark it as read
    if (!notification.readStatus) {
      try {
        await axios.put(`http://localhost:8787/api/notifications/${notification.id}/read`, {
          userId: professor.professorId,
          userRole: "PROFESSOR"
        });
        
        // Update the notification in the local state
        setNotifications(prevNotifications => 
          prevNotifications.map(notif => 
            notif.id === notification.id 
              ? { ...notif, readStatus: true }
              : notif
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BellIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <Typography variant="h4" color="blue-gray" className="font-bold">
              Notifications
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Stay updated with the latest announcements
            </Typography>
          </div>
          <div className="ml-auto">
            <Badge content={notifications.length} color="blue">
              <div className="p-2 bg-blue-600 rounded-full">
                <BellIcon className="h-4 w-4 text-white" />
              </div>
            </Badge>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-l-4 border-red-500 bg-red-50">
          <CardBody className="py-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
              <Typography color="red" className="font-medium">
                {error}
              </Typography>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`shadow-md hover:shadow-lg transition-all duration-300 border cursor-pointer ${
                notification.readStatus 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    <Avatar
                      src="/img/user.png"
                      alt={notification.senderName}
                      size="sm"
                      className="border border-gray-200"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Typography variant="h6" color="blue-gray" className="font-semibold mb-1">
                          {notification.title}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-gray-600">
                            <UserIcon className="h-4 w-4" />
                            <Typography variant="small" color="gray" className="font-medium">
                              {notification.senderName}
                            </Typography>
                          </div>
                          {notification.subject && (
                            <Chip
                              value={notification.subject}
                              size="sm"
                              variant="ghost"
                              color="blue"
                              className="px-2 py-1 text-xs"
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          <Typography variant="small" className="text-xs">
                            {formatTimeAgo(notification.timestamp)}
                          </Typography>
                        </div>
                        <Button
                          size="sm"
                          variant="text"
                          color="gray"
                          className="p-1 hover:bg-gray-100"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Message */}
                    <Typography 
                      variant="paragraph" 
                      color="gray" 
                      className="mb-3 text-sm leading-relaxed"
                    >
                      {notification.message}
                    </Typography>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <Typography variant="small" color="gray" className="text-xs">
                        {new Date(notification.timestamp).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                      <Chip
                        value={notification.readStatus ? "Read" : "Unread"}
                        size="sm"
                        color={notification.readStatus ? "gray" : "blue"}
                        className="px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardBody>
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-gray-100 rounded-full">
                  <BellIcon className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    No notifications yet
                  </Typography>
                  <Typography variant="small" color="gray">
                    When you receive notifications, they will appear here
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* View Notification Dialog */}
      <Dialog 
        open={viewDialog.open} 
        handler={() => setViewDialog({ open: false, notification: null })}
        size="lg"
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full">
          <DialogHeader className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray">
                  Notification Details
                </Typography>
                <Typography variant="small" color="gray">
                  View complete notification information
                </Typography>
              </div>
            </div>
            <Button
              variant="text"
              color="gray"
              onClick={() => setViewDialog({ open: false, notification: null })}
              className="!absolute !top-4 !right-4 p-1"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </DialogHeader>
          
          <DialogBody className="px-6 py-4 max-h-96 overflow-y-auto">
            {viewDialog.notification ? (
              <div className="space-y-6">
                {/* Header Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src="/img/user.png"
                        alt={viewDialog.notification.senderName}
                        size="sm"
                        className="border border-gray-200"
                      />
                      <div>
                        <Typography variant="h6" color="blue-gray" className="font-semibold">
                          {viewDialog.notification.senderName}
                        </Typography>
                        <Typography variant="small" color="gray">
                          Sender
                        </Typography>
                      </div>
                    </div>
                    <Chip
                      value={viewDialog.notification.readStatus ? "Read" : "Unread"}
                      size="sm"
                      color={viewDialog.notification.readStatus ? "gray" : "blue"}
                      className="px-3 py-1"
                    />
                  </div>
                  
                  {viewDialog.notification.subject && (
                    <div className="mb-2">
                      <Typography variant="small" color="gray" className="mb-1">
                        Subject
                      </Typography>
                      <Chip
                        value={viewDialog.notification.subject}
                        variant="ghost"
                        color="blue"
                        className="px-3 py-1"
                      />
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <Typography variant="small" color="gray" className="mb-2 font-medium">
                    Title
                  </Typography>
                  <Typography variant="h6" color="blue-gray" className="font-semibold">
                    {viewDialog.notification.title}
                  </Typography>
                </div>

                {/* Message */}
                <div>
                  <Typography variant="small" color="gray" className="mb-2 font-medium">
                    Message
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="leading-relaxed">
                    {viewDialog.notification.message}
                  </Typography>
                </div>

                {/* Timestamp */}
                <div className="pt-4 border-t border-gray-200">
                  <Typography variant="small" color="gray" className="mb-1">
                    Received on
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {new Date(viewDialog.notification.timestamp).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Typography>
                </div>
              </div>
            ) : (
              <Typography>Loading notification details...</Typography>
            )}
          </DialogBody>

          <DialogFooter className="pt-2">
            <Button
              variant="filled"
              color="blue"
              onClick={() => setViewDialog({ open: false, notification: null })}
              className="ml-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </Card>
      </Dialog>
    </div>
  );
}

export default Notifications;
