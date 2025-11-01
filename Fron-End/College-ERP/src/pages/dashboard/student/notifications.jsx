import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
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
  XMarkIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [viewDialog, setViewDialog] = useState({ open: false, notification: null });

  useEffect(() => {
    const storedStudentData = localStorage.getItem("studentData");

    if (storedStudentData) {
      const studentData = JSON.parse(storedStudentData);
      setStudent(studentData);
      console.log("Student data: ", studentData);
    } else {
      setError("No student data available. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (student) {
          const response = await fetch(
            `http://localhost:8787/api/notifications/student/${student.studentId}`
          );
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            console.log("Student notifications: ", data);
          } else {
            console.error("Failed to fetch notifications");
            setError("Failed to load notifications. Please try again later.");
          }
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (student) {
      fetchNotifications();
    }
  }, [student]);

  const handleNotificationClick = async (notification) => {
    // Mark as read if it's unread
    if (!notification.readStatus) {
      try {
        await axios.put(`http://localhost:8787/api/notifications/${notification.id}/read`, {
          userId: student.studentId,
          userRole: "STUDENT"
        });
        // Update local state
        setNotifications(notifications.map(notif => 
          notif.id === notification.id ? { ...notif, readStatus: true } : notif
        ));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    // Open the view dialog
    setViewDialog({ open: true, notification });
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
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
              My Notifications
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Important updates and announcements for you
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
          notifications.map((notification, index) => (
            <Card 
              key={notification.id || index} 
              className={`shadow-md hover:shadow-lg transition-all duration-300 border cursor-pointer ${
                notification.readStatus ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar/Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-green-50 rounded-full">
                      <AcademicCapIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Typography variant="h6" color="blue-gray" className="font-semibold mb-1">
                          {notification.title}
                        </Typography>
                        <div className="flex items-center gap-2 flex-wrap">
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
                              color="green"
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
                        value={notification.readStatus ? "Read" : "New"}
                        size="sm"
                        color={notification.readStatus ? "green" : "orange"}
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
                    Check back later for important updates and announcements
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
                <Typography className="text-lg font-medium">{viewDialog.notification.title}</Typography>
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
                  From:
                </Typography>
                <Typography>{viewDialog.notification.senderName}</Typography>
              </div>
              
              <div>
                <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                  Message:
                </Typography>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Typography className="whitespace-pre-wrap">{viewDialog.notification.message}</Typography>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <Typography variant="small" className="font-semibold text-gray-700 mb-1">
                    Received:
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
                <Chip
                  value={viewDialog.notification.readStatus ? "Read" : "New"}
                  size="sm"
                  color={viewDialog.notification.readStatus ? "green" : "orange"}
                  className="px-3 py-1"
                />
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
}

export default Notifications;
