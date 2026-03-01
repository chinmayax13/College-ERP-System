package com.example.stud_erp.controller;

import com.example.stud_erp.service.RazorpayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayController {

  @Autowired
  private RazorpayService razorpayService;

  /**
   * Create a Razorpay order for payment
   * POST /api/razorpay/create-order
   * Request body: { "paymentId": 123, "amount": 5400000, "description": "Semester
   * 1 Fee" }
   */
  @PostMapping("/create-order")
  public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
    try {
      Long paymentId = Long.parseLong(request.get("paymentId").toString());
      Long amount = Long.parseLong(request.get("amount").toString());
      String description = request.getOrDefault("description", "College Fee").toString();

      // Create Razorpay order
      String razorpayOrderId = razorpayService.createOrder(amount, "PAYMENT_" + paymentId, description);

      // Return order details to frontend
      Map<String, Object> response = new HashMap<>();
      response.put("orderId", razorpayOrderId);
      response.put("amount", amount);
      response.put("currency", "INR");
      response.put("paymentId", paymentId);
      response.put("description", description);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to create order: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * Verify payment after successful transaction
   * POST /api/razorpay/verify-payment
   * Request body: { "orderId": "order_xxx", "paymentId": "pay_xxx", "signature":
   * "signature_xxx" }
   */
  @PostMapping("/verify-payment")
  public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
    try {
      String orderId = request.get("orderId");
      String paymentId = request.get("paymentId");
      String signature = request.get("signature");

      // Verify the signature
      boolean isValid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);

      if (!isValid) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid payment signature");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
      }

      // Get payment details
      Map<String, Object> paymentDetails = razorpayService.getPaymentDetails(paymentId);

      // Check if payment is successful
      if (!"captured".equals(paymentDetails.get("status"))) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Payment not captured");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
      }

      Map<String, Object> response = new HashMap<>();
      response.put("success", true);
      response.put("message", "Payment verified successfully");
      response.put("paymentDetails", paymentDetails);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Payment verification failed: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * Get order details
   * GET /api/razorpay/order/{orderId}
   */
  @GetMapping("/order/{orderId}")
  public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
    try {
      Map<String, Object> details = razorpayService.getOrderDetails(orderId);
      return ResponseEntity.ok(details);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to fetch order: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * Get payment details
   * GET /api/razorpay/payment/{paymentId}
   */
  @GetMapping("/payment/{paymentId}")
  public ResponseEntity<?> getPaymentDetails(@PathVariable String paymentId) {
    try {
      Map<String, Object> details = razorpayService.getPaymentDetails(paymentId);
      return ResponseEntity.ok(details);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to fetch payment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }

  /**
   * Get Razorpay key ID for frontend
   * GET /api/razorpay/key
   */
  @GetMapping("/key")
  public ResponseEntity<?> getKeyId() {
    try {
      String keyId = razorpayService.getKeyId();
      Map<String, String> response = new HashMap<>();
      response.put("keyId", keyId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> error = new HashMap<>();
      error.put("error", "Failed to fetch key: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  }
}
