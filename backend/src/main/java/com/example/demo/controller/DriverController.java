package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DriverController {

    private final JdbcTemplate jdbcTemplate;

    public DriverController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllDrivers() {
        String sql = """
                SELECT DRIVER_ID, FIRST_NAME, LAST_NAME, LICENSE_NO, TO_CHAR(DOB,'YYYY-MM-DD') AS DOB, PHONE_NO
                FROM DRIVER
                ORDER BY DRIVER_ID
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addDriver(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO DRIVER (DRIVER_ID, FIRST_NAME, LAST_NAME, LICENSE_NO, DOB, PHONE_NO)
                VALUES (?, ?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?)
                """;
        jdbcTemplate.update(
                sql,
                body.get("driver_id"),
                body.get("first_name"),
                body.get("last_name"),
                body.get("license_no"),
                body.get("dob"),
                body.get("phone_no")
        );
        return "Driver added successfully";
    }

    @PutMapping("/{id}")
    public String updateDriver(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE DRIVER
                SET FIRST_NAME = ?, LAST_NAME = ?, LICENSE_NO = ?, DOB = TO_DATE(?, 'YYYY-MM-DD'), PHONE_NO = ?
                WHERE DRIVER_ID = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("first_name"),
                body.get("last_name"),
                body.get("license_no"),
                body.get("dob"),
                body.get("phone_no"),
                id
        );
        return rows == 0 ? "Driver not found" : "Driver updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteDriver(@PathVariable String id) {
        String sql = "DELETE FROM DRIVER WHERE DRIVER_ID = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows == 0 ? "Driver not found" : "Driver deleted successfully";
    }
}
