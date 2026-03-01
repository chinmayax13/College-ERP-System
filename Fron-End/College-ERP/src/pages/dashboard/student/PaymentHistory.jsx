import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
  Spinner,
  Input,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { getPaymentHistory, getPaymentById } from "@/API/ApiStore";

export function PaymentHistory() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("studentData"));
    if (data && data.id) {
      setStudentId(data.id);  // Use database id, not studentId
      setStudentData(data);
      fetchPaymentHistory(data.id);
    }
  }, []);

  useEffect(() => {
    filterPayments();
  }, [searchTerm, payments]);

  const fetchPaymentHistory = async (id) => {
    try {
      setLoading(true);
      const data = await getPaymentHistory(id);
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    if (!searchTerm) {
      setFilteredPayments(payments);
      return;
    }

    const filtered = payments.filter(
      (payment) =>
        payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.semester?.includes(searchTerm) ||
        payment.academicYear?.includes(searchTerm) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  };

  const handleViewReceipt = async (payment) => {
    setSelectedPayment(payment);
    setReceiptDialog(true);
  };

  const handleDownloadReceipt = () => {
    if (!selectedPayment) return;

    // Create a clean, official receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${selectedPayment.receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            padding: 40px; 
            background: white;
            color: #000;
            line-height: 1.6;
          }
          .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 30px;
            background: white;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #000; 
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .college-name {
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .college-address {
            font-size: 11px;
            color: #333;
            margin-bottom: 3px;
          }
          .receipt-title {
            font-size: 18px;
            font-weight: bold;
            text-decoration: underline;
            margin-top: 12px;
            text-transform: uppercase;
          }
          .receipt-number {
            border: 2px solid #000;
            padding: 12px;
            margin: 20px 0;
            text-align: center;
            background: #f5f5f5;
          }
          .receipt-number .label {
            font-size: 11px;
            font-weight: bold;
            display: block;
            margin-bottom: 4px;
          }
          .receipt-number .value {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
          }
          .transaction-ref {
            border: 1px solid #666;
            padding: 10px;
            margin: 15px 0;
            background: #f9f9f9;
          }
          .transaction-ref .label {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 3px;
          }
          .transaction-ref .value {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            word-break: break-all;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 5px;
            margin: 20px 0 10px 0;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          table td:first-child {
            font-weight: bold;
            width: 35%;
            background: #f5f5f5;
          }
          .amount-box {
            border: 2px solid #000;
            padding: 15px;
            margin: 25px 0;
            background: #f5f5f5;
          }
          .amount-box .row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
          }
          .amount-box .label {
            font-size: 14px;
            font-weight: bold;
          }
          .amount-box .value {
            font-size: 22px;
            font-weight: bold;
          }
          .amount-words {
            border-top: 1px solid #666;
            padding-top: 8px;
            margin-top: 8px;
            font-size: 11px;
            font-style: italic;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #000;
            font-size: 10px;
            color: #333;
          }
          .footer-note {
            text-align: center;
            margin: 5px 0;
          }
          .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
          }
          .signature-box {
            text-align: center;
            width: 200px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 60px;
            padding-top: 5px;
            font-size: 11px;
            font-weight: bold;
          }
          @media print {
            body { padding: 10px; }
            .receipt-container { border: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <!-- Header -->
          <div class="header">
            <div class="college-name">Trident Academy of Technology</div>
            <div class="college-address">F2, Chandaka Industrial Estate, Bhubaneswar - 751024, Odisha</div>
            <div class="college-address">Phone: +91-674-2725113 | Email: info@tat.ac.in</div>
            <div class="receipt-title">Fee Payment Receipt</div>
          </div>

          <!-- Receipt Number -->
          <div class="receipt-number">
            <span class="label">RECEIPT NO.</span>
            <span class="value">${selectedPayment.receiptNumber}</span>
          </div>

          <!-- Transaction Reference -->
          ${selectedPayment.transactionId && selectedPayment.transactionId !== 'N/A' ? `
          <div class="transaction-ref">
            <div class="label">Transaction ID (Payment Gateway Reference):</div>
            <div class="value">${selectedPayment.transactionId}</div>
          </div>
          ` : ''}

          <!-- Student Details -->
          <div class="section-title">Student Details</div>
          <table>
            <tr>
              <td>Name:</td>
              <td>${selectedPayment.studentName}</td>
            </tr>
            <tr>
              <td>Roll Number:</td>
              <td>${selectedPayment.studentRollNo}</td>
            </tr>
            <tr>
              <td>Department:</td>
              <td>${selectedPayment.department}</td>
            </tr>
            <tr>
              <td>Semester:</td>
              <td>Semester ${selectedPayment.semester}</td>
            </tr>
            <tr>
              <td>Academic Year:</td>
              <td>${selectedPayment.academicYear}</td>
            </tr>
          </table>

          <!-- Payment Details -->
          <div class="section-title">Payment Details</div>
          <table>
            <tr>
              <td>Payment Date:</td>
              <td>${formatDate(selectedPayment.paymentDate)}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td>${selectedPayment.paymentMethod}</td>
            </tr>
            <tr>
              <td>Fee Description:</td>
              <td>${selectedPayment.description}</td>
            </tr>
            ${selectedPayment.remarks ? `
            <tr>
              <td>Remarks:</td>
              <td>${selectedPayment.remarks}</td>
            </tr>
            ` : ''}
            <tr>
              <td>Payment Status:</td>
              <td><strong>✓ COMPLETED</strong></td>
            </tr>
          </table>

          <!-- Amount -->
          <div class="amount-box">
            <div class="row">
              <span class="label">TOTAL AMOUNT PAID:</span>
              <span class="value">${formatCurrency(selectedPayment.amount)}</span>
            </div>
            <div class="amount-words">
              Amount in words: <strong>${convertNumberToWords(selectedPayment.amount)} Rupees Only</strong>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-note"><strong>Note:</strong> This is a computer-generated receipt and does not require a physical signature.</p>
            <p class="footer-note">For any queries, please contact the Accounts Department</p>
            <p class="footer-note">Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>

          <!-- Signatures -->
          <div class="signatures">
            <div class="signature-box">
              <div class="signature-line">Accountant</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Officer Seal</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([receiptHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Receipt_${selectedPayment.receiptNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const convertNumberToWords = (amount) => {
    // Simple implementation for Indian numbering system
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (amount === 0) return 'Zero';
    
    const num = Math.floor(amount);
    let words = '';
    
    if (num >= 10000000) {
      words += convertNumberToWords(Math.floor(num / 10000000)) + ' Crore ';
      return words + convertNumberToWords(num % 10000000);
    }
    if (num >= 100000) {
      words += convertNumberToWords(Math.floor(num / 100000)) + ' Lakh ';
      return words + convertNumberToWords(num % 100000);
    }
    if (num >= 1000) {
      words += convertNumberToWords(Math.floor(num / 1000)) + ' Thousand ';
      return words + convertNumberToWords(num % 1000);
    }
    if (num >= 100) {
      words += ones[Math.floor(num / 100)] + ' Hundred ';
      return words + convertNumberToWords(num % 100);
    }
    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + ' ';
      return words + ones[num % 10];
    }
    if (num >= 10) {
      return teens[num - 10];
    }
    return ones[num];
  };

  const getTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
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
      {/* Page Header */}
      <div className="mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <Typography variant="h3" className="font-bold mb-2 text-gray-800">
            Payment History
          </Typography>
          <Typography className="text-gray-600">
            View all your completed payment transactions and download receipts
          </Typography>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
              <Chip value={payments.length} size="sm" color="green" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {payments.length}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Total Payments Made
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCardIcon className="h-10 w-10 text-blue-600" />
              <Chip value="Paid" size="sm" color="blue" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {formatCurrency(getTotalPaid())}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Total Amount Paid
            </Typography>
          </CardBody>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DocumentTextIcon className="h-10 w-10 text-purple-600" />
              <Chip value="Available" size="sm" color="purple" />
            </div>
            <Typography variant="h4" className="font-bold mb-1 text-gray-800">
              {payments.length}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Receipts Available
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="bg-blue-600 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Typography variant="h5" className="text-white font-semibold">
              Transaction History
            </Typography>
            <div className="w-full md:w-72">
              <Input
                type="text"
                placeholder="Search by receipt, transaction ID, semester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!border-white bg-white"
                labelProps={{
                  className: "hidden",
                }}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <DocumentTextIcon className="h-16 w-16 text-blue-gray-300 mx-auto mb-4" />
              <Typography variant="h6" color="blue-gray" className="mb-2">
                {searchTerm ? "No matching payments found" : "No payment history available"}
              </Typography>
              <Typography className="text-blue-gray-500">
                {searchTerm ? "Try adjusting your search criteria" : "Your payment transactions will appear here"}
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-gray-50">
                  <tr>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Receipt Details
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Description
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Payment Date
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Method
                      </Typography>
                    </th>
                    <th className="p-4 text-left">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Amount
                      </Typography>
                    </th>
                    <th className="p-4 text-center">
                      <Typography variant="small" className="font-bold text-blue-gray-700">
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr key={payment.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <ReceiptPercentIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <Typography variant="small" className="font-bold text-blue-gray-900">
                              {payment.receiptNumber}
                            </Typography>
                            <Typography variant="small" className="text-blue-gray-500 text-xs">
                              {payment.transactionId}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Typography variant="small" className="font-medium">
                          {payment.description}
                        </Typography>
                        <div className="flex gap-2 mt-1">
                          <Chip value={`Sem ${payment.semester}`} size="sm" className="bg-blue-100 text-blue-900" />
                          <Chip value={payment.academicYear} size="sm" className="bg-purple-100 text-purple-900" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-blue-500" />
                          <Typography variant="small">{formatDate(payment.paymentDate)}</Typography>
                        </div>
                      </td>
                      <td className="p-4">
                        <Chip
                          value={payment.paymentMethod}
                          size="sm"
                          className={
                            payment.paymentMethod === "ONLINE"
                              ? "bg-green-100 text-green-900"
                              : "bg-orange-100 text-orange-900"
                          }
                        />
                      </td>
                      <td className="p-4">
                        <Typography variant="small" className="font-bold text-green-700 text-base">
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outlined"
                            className="border-blue-500 text-blue-500"
                            onClick={() => handleViewReceipt(payment)}
                          >
                            View Receipt
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={receiptDialog} handler={() => setReceiptDialog(false)} size="lg">
        <DialogHeader className="bg-gray-800 text-white border-b-2 border-gray-900">
          <div className="w-full text-center">
            <Typography variant="h5" className="font-bold uppercase tracking-wide">Fee Payment Receipt</Typography>
          </div>
        </DialogHeader>
        <DialogBody divider className="max-h-[70vh] overflow-y-auto bg-white p-6">
          {selectedPayment && (
            <div className="space-y-6">
              {/* College Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4">
                <Typography variant="h4" className="font-bold text-gray-900 uppercase tracking-wide">
                  Trident Academy of Technology
                </Typography>
                <Typography variant="small" className="text-gray-700 mt-1">
                  F2, Chandaka Industrial Estate, Bhubaneswar - 751024, Odisha
                </Typography>
                <Typography variant="small" className="text-gray-700">
                  Phone: +91-674-2725113 | Email: info@tat.ac.in
                </Typography>
              </div>

              {/* Receipt Title and Number */}
              <div className="text-center py-3">
                <Typography variant="h5" className="font-bold text-gray-900 uppercase underline decoration-2 mb-3">
                  Official Fee Receipt
                </Typography>
                <div className="inline-block border-2 border-gray-900 px-6 py-3 bg-gray-50">
                  <Typography variant="small" className="text-gray-600 font-semibold">Receipt No.</Typography>
                  <Typography variant="h6" className="font-bold text-gray-900 tracking-wider">
                    {selectedPayment.receiptNumber}
                  </Typography>
                </div>
              </div>

              {/* Transaction Reference */}
              {selectedPayment.transactionId && selectedPayment.transactionId !== 'N/A' && (
                <div className="border border-gray-300 bg-gray-50 p-3">
                  <Typography variant="small" className="text-gray-700 font-semibold mb-1">
                    Transaction ID (Payment Gateway Reference):
                  </Typography>
                  <Typography variant="small" className="font-mono font-medium text-gray-900 break-all">
                    {selectedPayment.transactionId}
                  </Typography>
                </div>
              )}

              {/* Student Details Table */}
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
                  Student Details
                </Typography>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700 w-1/3">Name:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.studentName}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Roll Number:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.studentRollNo}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Department:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.department}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Semester:</td>
                      <td className="py-2 px-3 text-gray-900">Semester {selectedPayment.semester}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Academic Year:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.academicYear}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Details Table */}
              <div>
                <Typography variant="h6" className="font-bold text-gray-900 mb-3 border-b border-gray-400 pb-1">
                  Payment Details
                </Typography>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700 w-1/3">Payment Date:</td>
                      <td className="py-2 px-3 text-gray-900">{formatDate(selectedPayment.paymentDate)}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Payment Method:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.paymentMethod}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Fee Description:</td>
                      <td className="py-2 px-3 text-gray-900">{selectedPayment.description}</td>
                    </tr>
                    {selectedPayment.remarks && (
                      <tr className="border-b border-gray-300">
                        <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Remarks:</td>
                        <td className="py-2 px-3 text-gray-900">{selectedPayment.remarks}</td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 bg-gray-50 font-semibold text-gray-700">Payment Status:</td>
                      <td className="py-2 px-3 text-gray-900 font-semibold">✓ COMPLETED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount Section */}
              <div className="border-2 border-gray-900 bg-gray-50 p-4">
                <div className="flex justify-between items-center py-2">
                  <Typography variant="h6" className="font-bold text-gray-900">TOTAL AMOUNT PAID:</Typography>
                  <Typography variant="h4" className="font-bold text-gray-900">
                    {formatCurrency(selectedPayment.amount)}
                  </Typography>
                </div>
                <div className="border-t border-gray-400 mt-2 pt-2">
                  <Typography variant="small" className="text-gray-700 italic">
                    Amount in words: <span className="font-semibold">{convertNumberToWords(selectedPayment.amount)} Rupees Only</span>
                  </Typography>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-300 pt-4 space-y-2">
                <Typography variant="small" className="text-gray-700 text-center">
                  This is a computer-generated receipt and does not require a physical signature.
                </Typography>
                <Typography variant="small" className="text-gray-600 text-center">
                  For any queries, please contact the Accounts Department
                </Typography>
                <Typography variant="small" className="text-gray-500 text-center">
                  Generated on: {new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </Typography>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={() => setReceiptDialog(false)}>
            Close
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-2"
            onClick={handleDownloadReceipt}
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download Receipt
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default PaymentHistory;
