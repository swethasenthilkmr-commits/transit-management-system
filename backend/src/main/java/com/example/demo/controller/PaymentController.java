
package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PaymentController {

    private final JdbcTemplate jdbcTemplate;

    public PaymentController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    
    @GetMapping
    public List<Map<String, Object>> getAllPayments() {
        String sql = """
                SELECT PAYMENT_ID,
                    PAYMENT_MODE,
                    AMOUNT,
                    TO_CHAR(PAYMENT_DATE, 'YYYY-MM-DD') AS PAYMENT_DATE,
                    TRANSACTION_NO
                FROM PAYMENT
                ORDER BY PAYMENT_ID
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> payment = new java.util.HashMap<>();
            payment.put("payment_id", rs.getString("PAYMENT_ID"));
            payment.put("mode", rs.getString("PAYMENT_MODE"));
            payment.put("amount", rs.getBigDecimal("AMOUNT"));
            payment.put("payment_date", rs.getString("PAYMENT_DATE"));
            payment.put("txn_reference_no", rs.getString("TRANSACTION_NO"));
            return payment;
        });
    }


    @PostMapping
    public String addPayment(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO PAYMENT
                    (PAYMENT_ID, PAYMENT_MODE, AMOUNT, PAYMENT_DATE, TRANSACTION_NO)
                VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?)
                """;

        jdbcTemplate.update(
                sql,
                body.get("payment_id"),
                body.get("mode"),
                body.get("amount"),
                body.get("payment_date"),
                body.get("txn_reference_no")
        );

        return "Payment added successfully";
    }

    @PutMapping("/{id}")
    public String updatePayment(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        String sql = """
                UPDATE PAYMENT
                SET PAYMENT_MODE = ?,
                    AMOUNT = ?,
                    PAYMENT_DATE = TO_DATE(?, 'YYYY-MM-DD'),
                    TRANSACTION_NO = ?
                WHERE PAYMENT_ID = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                body.get("mode"),
                body.get("amount"),
                body.get("payment_date"),
                body.get("txn_reference_no"),
                id
        );

        return rows == 0 ? "Payment not found" : "Payment updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable String id) {
        String sql = "DELETE FROM PAYMENT WHERE PAYMENT_ID = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows == 0 ? "Payment not found" : "Payment deleted successfully";
    }
}
