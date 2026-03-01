import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Textarea,
  Spinner,
  Alert,
  Radio,
} from "@material-tailwind/react";
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import {
  getPaymentSummary,
  getPendingPayments,
  initializeSemesterFee,
  processPayment,
  getFeeStructure,
} from "@/API/ApiStore";
import API_CONFIG from "@/config/api";

export function Payment() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [feeStructure, setFeeStructure] = useState({});
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [initializeDialog, setInitializeDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [studentId, setStudentId] = useState(null);
  const [successDialog, setSuccessDialog] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);
  
  // Initialize fee form
  const [newSemester, setNewSemester] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [residentialType, setResidentialType] = useState("DAY_SCHOLAR");
  const [razorpayKeyId, setRazorpayKeyId] = useState(null);
  const [currentRazorpayOrder, setCurrentRazorpayOrder] = useState(null);

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem("studentData"));
    if (studentData && studentData.id) {
      setStudentId(studentData.id);  // Use database id, not studentId
      fetchPaymentData(studentData.id);
      // Get Razorpay key from backend or environment
      fetchRazorpayKey();
    }
  }, []);

  const fetchRazorpayKey = async () => {
    try {
      console.log("Fetching Razorpay key from backend...");
      const response = await fetch(`${API_CONFIG.BASE_URL}/razorpay/key`);
      if (response.ok) {
        const data = await response.json();
        console.log("Razorpay key fetched:", data.keyId);
        setRazorpayKeyId(data.keyId);
      } else {
        console.error("Failed to fetch Razorpay key, status:", response.status);
        throw new Error("Failed to fetch payment configuration");
      }
    } catch (error) {
      console.error("Could not fetch Razorpay key:", error);
      showAlert("Payment gateway configuration error. Please contact support.", "error");
    }
  };

  const fetchPaymentData = async (id) => {
    try {
      setLoading(true);
      const [summaryData, pendingData, feeData] = await Promise.all([
        getPaymentSummary(id),
        getPendingPayments(id),
        getFeeStructure(),
      ]);
      
      setSummary(summaryData);
      setPendingPayments(pendingData);
      setFeeStructure(feeData);
    } catch (error) {
      showAlert("Error fetching payment data: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentDialog = (payment) => {
    setSelectedPayment(payment);
    setPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setSelectedPayment(null);
    setPaymentMethod("ONLINE");
    setRemarks("");
  };

  const handleProcessPayment = async () => {
    if (!selectedPayment || !paymentMethod) {
      showAlert("Please select a payment method", "error");
      return;
    }
    
    console.log("Processing payment with method:", paymentMethod);
    
    try {
      setProcessing(true);
      
      // For Razorpay (CARD, NETBANKING, UPI) - all go through Razorpay checkout
      if (paymentMethod === "CARD" || paymentMethod === "NETBANKING" || paymentMethod === "UPI") {
        console.log("Initiating Razorpay payment...");
        await initiateRazorpayPayment();
        return;
      }
      
      // For OFFLINE methods, process directly
      console.log("Processing offline payment...");
      const result = await processPayment(selectedPayment.id, paymentMethod, remarks);
      
      handleClosePaymentDialog();
      setCompletedPayment(result);
      setSuccessDialog(true);
      
      if (studentId) {
        await fetchPaymentData(studentId);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      showAlert("Error processing payment: " + error.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const initiateRazorpayPayment = async () => {
    try {
      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded. Please check if the script is included in index.html");
        throw new Error("Razorpay payment gateway is not available. Please refresh the page and try again.");
      }

      // Check if we have the Razorpay key
      if (!razorpayKeyId) {
        console.error("Razorpay key not available");
        throw new Error("Payment gateway is not configured. Please contact support.");
      }

      console.log("Creating Razorpay order...");
      console.log("Payment ID:", selectedPayment.id);
      console.log("Amount:", selectedPayment.amount);
      console.log("Method:", paymentMethod);
      
      // Convert amount from rupees to paise (Razorpay expects amount in paise)
      const amountInPaise = Math.round(selectedPayment.amount * 100);
      
      // Call backend to create Razorpay order
      const orderResponse = await fetch(`${API_CONFIG.BASE_URL}/razorpay/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          amount: amountInPaise,
          description: selectedPayment.description,
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        console.error("Order creation failed:", error);
        throw new Error(error.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      console.log("Order created successfully:", orderData);
      
      // Store order info in local variable for the handler (not just state)
      const orderInfo = {
        ...orderData,
        paymentId: selectedPayment.id,
        method: paymentMethod,
      };
      
      setCurrentRazorpayOrder(orderInfo);

      // Determine preferred payment method for Razorpay
      let preferredMethod = undefined;
      if (paymentMethod === "UPI") {
        preferredMethod = "upi";
      } else if (paymentMethod === "NETBANKING") {
        preferredMethod = "netbanking";
      } else if (paymentMethod === "CARD") {
        preferredMethod = "card";
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: amountInPaise,
        currency: "INR",
        order_id: orderData.orderId,
        name: "Trident Academy of Technology",
        description: selectedPayment.description,
        // Remove image to avoid CORS errors in development
        // image: "/img/Cj-logo.png",
        
        handler: async (response) => {
          console.log("Razorpay payment successful:", response);
          console.log("Order info for verification:", orderInfo);
          // Payment successful - verify on backend using local orderInfo
          await verifyRazorpayPaymentWithOrder(response, orderInfo);
        },
        
        prefill: {
          // Auto-fill with student email/contact if available
          email: JSON.parse(localStorage.getItem("studentData"))?.email || "",
          contact: JSON.parse(localStorage.getItem("studentData"))?.phone || "",
        },
        
        theme: {
          color: "#2563EB",
        },
        
        method: preferredMethod ? {
          [preferredMethod]: true,
        } : undefined,
        
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user");
            setProcessing(false);
            showAlert("Payment cancelled", "error");
          },
        },
      };

      console.log("Opening Razorpay checkout with options:", {
        ...options,
        key: options.key.substring(0, 10) + "...",
      });

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      handleClosePaymentDialog();
      
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      showAlert("Error initiating payment: " + error.message, "error");
      setProcessing(false);
    }
  };

  const verifyRazorpayPaymentWithOrder = async (razorpayResponse, orderInfo) => {
    try {
      if (!orderInfo) {
        console.error("Order information is missing!");
        throw new Error("Order information missing");
      }

      console.log("Verifying payment with order info:", orderInfo);
      console.log("Razorpay response:", razorpayResponse);

      // Call backend to verify payment signature
      const verifyResponse = await fetch(`${API_CONFIG.BASE_URL}/razorpay/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderInfo.orderId,
          paymentId: razorpayResponse.razorpay_payment_id,
          signature: razorpayResponse.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        const error = await verifyResponse.json();
        console.error("Verification failed:", error);
        throw new Error(error.error || "Payment verification failed");
      }

      const verifyData = await verifyResponse.json();
      console.log("Payment verified successfully:", verifyData);

      // Payment verified - now mark it as completed in our system
      const paymentResult = await processPayment(
        orderInfo.paymentId,
        orderInfo.method,
        `${remarks} (Razorpay ID: ${razorpayResponse.razorpay_payment_id})`
      );
      
      console.log("Payment marked as completed:", paymentResult);

      setCompletedPayment({
        ...paymentResult,
        transactionId: razorpayResponse.razorpay_payment_id,
      });
      
      setSuccessDialog(true);
      setRemarks("");
      setCurrentRazorpayOrder(null);

      // Refresh payment data
      if (studentId) {
        await fetchPaymentData(studentId);
      }

      showAlert("Payment completed successfully!", "success");
    } catch (error) {
      console.error("Payment verification error:", error);
      showAlert("Payment verification failed: " + error.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialog(false);
    setCompletedPayment(null);
  };

  const handleViewReceipt = () => {
    // Navigate to payment history where receipt can be viewed
    window.location.href = "/dashboard/student/payment-history";
  };

  const handleInitializeFee = async () => {
    if (!newSemester || !academicYear) {
      showAlert("Please select semester and academic year", "error");
      return;
    }
    
    try {
      setProcessing(true);
      await initializeSemesterFee(studentId, newSemester, academicYear, residentialType);
      
      showAlert("Semester fee initialized successfully!", "success");
      setInitializeDialog(false);
      setNewSemester("");
      setResidentialType("DAY_SCHOLAR");
      
      // Refresh data
      if (studentId) {
        await fetchPaymentData(studentId);
      }
    } catch (error) {
      showAlert("Error initializing fee: " + error.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {alert.show && (
        <div className="fixed top-6 left-6 right-6 z-50">
          <Alert
            color={alert.type === "success" ? "green" : "red"}
            className="mb-6 shadow-lg"
            onClose={() => setAlert({ show: false, message: "", type: "" })}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <Typography variant="h3" className="font-bold mb-2 text-gray-800">
            Fee Payment Portal
          </Typography>
          <Typography className="text-gray-600">
            Manage your college fees, view payment history, and track dues
          </Typography>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
              <Chip value="Paid" size="sm" color="green" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {formatCurrency(summary?.totalPaid || 0)}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Total Amount Paid
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ExclamationTriangleIcon className="h-10 w-10 text-orange-600" />
              <Chip value="Due" size="sm" color="orange" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {formatCurrency(summary?.totalPending || 0)}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Pending Dues
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DocumentTextIcon className="h-10 w-10 text-blue-600" />
              <Chip value={`${summary?.pendingPaymentsCount || 0} Due`} size="sm" color="blue" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {summary?.completedPaymentsCount || 0}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Completed Payments
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Fee Structure */}
      <Card className="mb-8 border border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-600 p-6">
          <Typography variant="h5" className="text-white font-semibold">
            Semester-wise Fee Structure
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* Day Scholar Fees */}
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <Typography variant="h6" className="font-bold text-blue-900 mb-3">
                Day Scholar Fees
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography className="text-sm text-gray-600">Course Fee (per semester):</Typography>
                  <Typography className="font-bold text-gray-800">₹54,000</Typography>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <Typography className="text-sm font-semibold text-gray-700">Total per Semester:</Typography>
                  <Typography className="font-bold text-blue-700 text-lg">₹54,000</Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="text-sm font-semibold text-gray-700">Total per Year:</Typography>
                  <Typography className="font-bold text-blue-700">₹1,08,000</Typography>
                </div>
              </div>
            </div>

            {/* Hosteller Fees */}
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <Typography variant="h6" className="font-bold text-green-900 mb-3">
                Hosteller Fees
              </Typography>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography className="text-sm text-gray-600">Course Fee (per semester):</Typography>
                  <Typography className="font-bold text-gray-800">₹54,000</Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="text-sm text-gray-600">Hostel Fee (per semester):</Typography>
                  <Typography className="font-bold text-gray-800">₹45,000</Typography>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <Typography className="text-sm font-semibold text-gray-700">Total per Semester:</Typography>
                  <Typography className="font-bold text-green-700 text-lg">₹99,000</Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="text-sm font-semibold text-gray-700">Total per Year:</Typography>
                  <Typography className="font-bold text-green-700">₹1,98,000</Typography>
                </div>
              </div>
            </div>
          </div>
          <Typography variant="small" className="text-gray-600 text-center">
            * Same fee structure applies to all 8 semesters (4 years)
          </Typography>
        </CardBody>
      </Card>

      {/* Pending Payments */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-orange-600 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h5" className="text-white font-semibold">
              Pending Payments
            </Typography>
            <Button
              size="sm"
              className="bg-white text-orange-700 hover:bg-gray-100"
              onClick={() => setInitializeDialog(true)}
            >
              + Initialize New Fee
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {pendingPayments.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <Typography variant="h6" color="blue-gray" className="mb-2">
                No Pending Payments
              </Typography>
              <Typography className="text-blue-gray-500">
                All your fees are up to date!
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Description
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Semester
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Academic Year
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Amount
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Due Date
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-semibold text-gray-700">
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment, index) => (
                    <tr key={payment.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 border-b border-gray-200">
                        <Typography variant="small" className="font-medium">
                          {payment.description}
                        </Typography>
                        <Typography variant="small" className="text-gray-500 text-xs">
                          {payment.paymentType}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Chip value={`Sem ${payment.semester}`} size="sm" color="blue" />
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Typography variant="small">{payment.academicYear}</Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Typography variant="small" className="font-bold text-orange-700">
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-orange-500" />
                          <Typography variant="small" className="text-orange-700">
                            {formatDate(payment.dueDate)}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <Button
                          size="sm"
                          color="green"
                          onClick={() => handleOpenPaymentDialog(payment)}
                        >
                          Pay Now
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} handler={handleClosePaymentDialog} size="lg">
        <DialogHeader className="bg-blue-600 text-white">
          Process Payment
        </DialogHeader>
        <DialogBody divider className="max-h-96 overflow-y-auto space-y-4">
          {selectedPayment ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Typography variant="h6" className="mb-3 text-gray-800">
                  Payment Details
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography className="text-gray-600">Description:</Typography>
                    <Typography className="font-medium">{selectedPayment.description}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-gray-600">Semester:</Typography>
                    <Typography className="font-medium">Semester {selectedPayment.semester}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography className="text-gray-600">Academic Year:</Typography>
                    <Typography className="font-medium">{selectedPayment.academicYear}</Typography>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <Typography className="text-gray-600 font-bold">Amount:</Typography>
                    <Typography className="font-bold text-green-700 text-lg">
                      {formatCurrency(selectedPayment.amount)}
                    </Typography>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="small" className="mb-3 font-semibold text-gray-700">
                  <span className="text-red-600">*</span> Select Payment Method
                </Typography>
                <div className="space-y-2">
                  {/* UPI Payment Options */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "UPI" 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("UPI")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Radio
                          name="payment"
                          checked={paymentMethod === "UPI"}
                          onChange={() => setPaymentMethod("UPI")}
                        />
                        <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600" />
                        <div>
                          <Typography className="font-semibold">UPI Payment (Razorpay)</Typography>
                          <Typography variant="small" className="text-gray-600">
                            PhonePe, GPay, Paytm & all UPI apps
                          </Typography>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          PhonePe
                        </div>
                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          Paytm
                        </div>
                        <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          GPay
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit/Debit Card */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "CARD" 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("CARD")}
                  >
                    <div className="flex items-center gap-3">
                      <Radio
                        name="payment"
                        checked={paymentMethod === "CARD"}
                        onChange={() => setPaymentMethod("CARD")}
                      />
                      <CreditCardIcon className="h-6 w-6 text-blue-600" />
                      <div>
                        <Typography className="font-semibold">Credit/Debit Card (Razorpay)</Typography>
                        <Typography variant="small" className="text-gray-600">
                          Visa, Mastercard, RuPay - Secured by Razorpay
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "NETBANKING" 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("NETBANKING")}
                  >
                    <div className="flex items-center gap-3">
                      <Radio
                        name="payment"
                        checked={paymentMethod === "NETBANKING"}
                        onChange={() => setPaymentMethod("NETBANKING")}
                      />
                      <BuildingLibraryIcon className="h-6 w-6 text-indigo-600" />
                      <div>
                        <Typography className="font-semibold">Net Banking (Razorpay)</Typography>
                        <Typography variant="small" className="text-gray-600">
                          All major banks - Secured by Razorpay
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Offline Methods */}
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "OFFLINE" 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("OFFLINE")}
                  >
                    <div className="flex items-center gap-3">
                      <Radio
                        name="payment"
                        checked={paymentMethod === "OFFLINE"}
                        onChange={() => setPaymentMethod("OFFLINE")}
                      />
                      <BanknotesIcon className="h-6 w-6 text-green-600" />
                      <div>
                        <Typography className="font-semibold">Offline Payment</Typography>
                        <Typography variant="small" className="text-gray-600">
                          Cash, Cheque, Demand Draft
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="small" className="mb-2 font-semibold text-gray-700">
                  Remarks (Optional)
                </Typography>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  label="Add any notes or transaction reference"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <Typography>Loading payment details...</Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2 bg-gray-50">
          <Button variant="text" onClick={handleClosePaymentDialog} disabled={processing}>
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handleProcessPayment}
            disabled={processing || !selectedPayment}
            className="w-auto flex items-center justify-center gap-2 px-6"
          >
            {processing ? (
              <>
                <Spinner size="sm" /> Processing...
              </>
            ) : (
              <>
                <CreditCardIcon className="h-5 w-5" />
                Proceed to Pay ✓
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Initialize Fee Dialog */}
      <Dialog open={initializeDialog} handler={() => setInitializeDialog(false)} size="md">
        <DialogHeader className="bg-orange-600 text-white">
          Initialize Semester Fee
        </DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" className="mb-2 font-semibold text-gray-700">
              Student Type
            </Typography>
            <div className="space-y-3">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  residentialType === "DAY_SCHOLAR" 
                    ? "border-blue-600 bg-blue-50" 
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setResidentialType("DAY_SCHOLAR")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio
                      name="residential"
                      checked={residentialType === "DAY_SCHOLAR"}
                      onChange={() => setResidentialType("DAY_SCHOLAR")}
                    />
                    <div>
                      <Typography className="font-semibold">Day Scholar</Typography>
                      <Typography variant="small" className="text-gray-600">
                        Course Fee Only
                      </Typography>
                    </div>
                  </div>
                  <Typography className="font-bold text-blue-700">₹54,000/sem</Typography>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  residentialType === "HOSTELLER" 
                    ? "border-green-600 bg-green-50" 
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setResidentialType("HOSTELLER")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio
                      name="residential"
                      checked={residentialType === "HOSTELLER"}
                      onChange={() => setResidentialType("HOSTELLER")}
                    />
                    <div>
                      <Typography className="font-semibold">Hosteller</Typography>
                      <Typography variant="small" className="text-gray-600">
                        Course Fee + Hostel Fee
                      </Typography>
                    </div>
                  </div>
                  <Typography className="font-bold text-green-700">₹99,000/sem</Typography>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold text-gray-700">
              Select Semester
            </Typography>
            <Select value={newSemester} onChange={(val) => setNewSemester(val)} label="Choose Semester">
              <Option value="1">Semester 1</Option>
              <Option value="2">Semester 2</Option>
              <Option value="3">Semester 3</Option>
              <Option value="4">Semester 4</Option>
              <Option value="5">Semester 5</Option>
              <Option value="6">Semester 6</Option>
              <Option value="7">Semester 7</Option>
              <Option value="8">Semester 8</Option>
            </Select>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold text-gray-700">
              Academic Year
            </Typography>
            <Select value={academicYear} onChange={(val) => setAcademicYear(val)} label="Select Academic Year">
              <Option value="2024-2025">2024-2025</Option>
              <Option value="2025-2026">2025-2026</Option>
              <Option value="2026-2027">2026-2027</Option>
            </Select>
          </div>

          {/* Fee Summary */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Typography variant="small" className="font-semibold text-gray-700 mb-2">
              Fee Summary
            </Typography>
            <div className="space-y-1">
              <div className="flex justify-between">
                <Typography variant="small" className="text-gray-600">Course Fee:</Typography>
                <Typography variant="small" className="font-medium">₹54,000</Typography>
              </div>
              {residentialType === "HOSTELLER" && (
                <div className="flex justify-between">
                  <Typography variant="small" className="text-gray-600">Hostel Fee:</Typography>
                  <Typography variant="small" className="font-medium">₹45,000</Typography>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <Typography variant="small" className="font-bold text-gray-800">Total Amount:</Typography>
                <Typography variant="small" className="font-bold text-orange-700 text-lg">
                  {residentialType === "HOSTELLER" ? "₹99,000" : "₹54,000"}
                </Typography>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={() => setInitializeDialog(false)} disabled={processing}>
            Cancel
          </Button>
          <Button
            color="orange"
            onClick={handleInitializeFee}
            disabled={processing}
          >
            {processing ? <Spinner size="sm" /> : "Initialize Fee"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Payment Success Dialog */}
      <Dialog open={successDialog} handler={handleCloseSuccessDialog} size="md" className="max-h-screen overflow-y-auto">
        <DialogHeader className="bg-green-600 text-white flex items-center gap-3">
          <CheckCircleIcon className="h-8 w-8" />
          Payment Successful!
        </DialogHeader>
        <DialogBody divider className="space-y-4 max-h-[60vh] overflow-y-auto">{completedPayment && (
            <>
              <div className="text-center py-4">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <Typography variant="h4" className="text-green-700 font-bold mb-2">
                  Payment Completed Successfully!
                </Typography>
                <Typography className="text-gray-600">
                  Your payment has been processed and confirmed
                </Typography>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
                <Typography variant="h6" className="font-bold text-gray-800 mb-3 pb-2 border-b">
                  Transaction Details
                </Typography>
                
                <div className="flex justify-between">
                  <Typography className="text-gray-600">Receipt Number:</Typography>
                  <Typography className="font-bold text-blue-700">{completedPayment.receiptNumber}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Transaction ID:</Typography>
                  <Typography className="font-medium">{completedPayment.transactionId}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Payment Method:</Typography>
                  <Typography className="font-medium">{completedPayment.paymentMethod}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Description:</Typography>
                  <Typography className="font-medium">{completedPayment.description}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Semester:</Typography>
                  <Typography className="font-medium">Semester {completedPayment.semester}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Academic Year:</Typography>
                  <Typography className="font-medium">{completedPayment.academicYear}</Typography>
                </div>

                <div className="flex justify-between">
                  <Typography className="text-gray-600">Payment Date:</Typography>
                  <Typography className="font-medium">{formatDate(completedPayment.paymentDate)}</Typography>
                </div>

                <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                  <Typography className="font-bold text-gray-800">Amount Paid:</Typography>
                  <Typography className="font-bold text-green-700 text-xl">
                    {formatCurrency(completedPayment.amount)}
                  </Typography>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Typography variant="small" className="text-blue-800">
                  <strong>Secured Payments:</strong> Your payment information is securely processed by Razorpay. 
                  For offline payments (Cash/Check/DD), please visit the office with your receipt.
                </Typography>
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2 bg-gray-50 border-t-2 border-gray-200">
          <Button 
            variant="outlined" 
            onClick={handleCloseSuccessDialog}
            className="px-6"
            size="lg"
          >
            Close
          </Button>
          <Button 
            color="green" 
            onClick={handleCloseSuccessDialog}
            className="px-6"
            size="lg"
          >
            ✓ Done
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Payment;
