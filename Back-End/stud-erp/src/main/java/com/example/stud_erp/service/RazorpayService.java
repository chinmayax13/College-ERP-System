package com.example.stud_erp.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class RazorpayService {

  @Value("${razorpay.key.id}")
  private String keyId;

  @Value("${razorpay.key.secret}")
  private String keySecret;

  private RazorpayClient razorpayClient;
  private final RestTemplate restTemplate = new RestTemplate();

  /**
   * Initialize Razorpay Client (lazy initialization)
   */
  private RazorpayClient getRazorpayClient() throws RazorpayException {
    if (razorpayClient == null) {
      razorpayClient = new RazorpayClient(keyId, keySecret);
    }
    return razorpayClient;
  }

  /**
   * Create a Razorpay order for payment
   * 
   * @param amount      Amount in paise (multiply rupees by 100)
   * @param orderId     Unique order ID from college system
   * @param description Payment description
   * @return Razorpay Order ID
   */
  public String createOrder(Long amount, String orderId, String description) throws RazorpayException {
    try {
      RazorpayClient client = getRazorpayClient();

      // Create order request JSON
      JSONObject orderRequest = new JSONObject();
      orderRequest.put("amount", amount);
      orderRequest.put("currency", "INR");
      orderRequest.put("receipt", orderId);
      orderRequest.put("notes", new JSONObject().put("description", description));

      // Create order using Razorpay SDK
      com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);

      // Return the Razorpay order ID
      return razorpayOrder.get("id");

    } catch (RazorpayException e) {
      throw new RazorpayException("Failed to create Razorpay order: " + e.getMessage());
    }
  }

  /**
   * Verify payment signature
   * 
   * @param orderId   Razorpay Order ID
   * @param paymentId Razorpay Payment ID
   * @param signature Payment signature from Razorpay
   * @return true if signature is valid
   */
  public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
    try {
      String payload = orderId + "|" + paymentId;
      String expectedSignature = generateSignature(payload);
      return expectedSignature.equals(signature);
    } catch (Exception e) {
      return false;
    }
  }

  /**
   * Generate HMAC SHA256 signature
   */
  private String generateSignature(String payload) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    SecretKeySpec secretKeySpec = new SecretKeySpec(
        keySecret.getBytes(StandardCharsets.UTF_8),
        "HmacSHA256");
    mac.init(secretKeySpec);
    byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
    return bytesToHex(rawHmac);
  }

  /**
   * Convert byte array to hex string
   */
  private String bytesToHex(byte[] bytes) {
    StringBuilder sb = new StringBuilder();
    for (byte b : bytes) {
      sb.append(String.format("%02x", b));
    }
    return sb.toString();
  }

  /**
   * Get payment details - Placeholder for future implementation
   */
  public Map<String, Object> getPaymentDetails(String paymentId) throws RazorpayException {
    try {
      Map<String, Object> details = new HashMap<>();
      details.put("paymentId", paymentId);
      details.put("amount", 0);
      details.put("currency", "INR");
      details.put("status", "captured");
      details.put("method", "card");
      details.put("description", "College Fee Payment");
      details.put("email", "student@college.edu");
      details.put("contact", "7777777777");
      details.put("createdAt", System.currentTimeMillis() / 1000);

      // TODO: Implement actual API call to fetch payment details from Razorpay
      // when SDK supports it or use RestTemplate for HTTP call
      return details;
    } catch (Exception e) {
      throw new RazorpayException("Failed to fetch payment details: " + e.getMessage());
    }
  }

  /**
   * Get order details - Placeholder for future implementation
   */
  public Map<String, Object> getOrderDetails(String orderId) throws RazorpayException {
    try {
      Map<String, Object> details = new HashMap<>();
      details.put("orderId", orderId);
      details.put("amount", 5400000);
      details.put("currency", "INR");
      details.put("status", "created");
      details.put("receipt", "receipt_" + orderId);
      details.put("attempts", 0);
      details.put("createdAt", System.currentTimeMillis() / 1000);

      // TODO: Implement actual API call to fetch order details from Razorpay
      // when SDK supports it or use RestTemplate for HTTP call
      return details;
    } catch (Exception e) {
      throw new RazorpayException("Failed to fetch order details: " + e.getMessage());
    }
  }

  /**
   * Get Razorpay Key ID for frontend use
   * 
   * @return Key ID (safe to expose to frontend)
   */
  public String getKeyId() {
    return keyId;
  }
}
