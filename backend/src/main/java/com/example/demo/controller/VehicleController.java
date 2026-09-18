package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VehicleController {

    private final JdbcTemplate jdbcTemplate;

    public VehicleController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllVehicles() {
        String sql = """
                SELECT REGISTRATION_NO, TO_CHAR(MANUFACTURE_DATE,'YYYY-MM-DD') AS MANUFACTURE_DATE, COLOR, VEHICLE_TYPE_ID, DRIVER_ID
                FROM VEHICLE
                ORDER BY REGISTRATION_NO
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addVehicle(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO VEHICLE (REGISTRATION_NO, MANUFACTURE_DATE, COLOR, VEHICLE_TYPE_ID, DRIVER_ID)
                VALUES (?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, ?)
                """;
        jdbcTemplate.update(
                sql,
                body.get("registration_no"),
                body.get("manufacture_date"),
                body.get("color"),
                body.get("vehicle_type_id"),
                body.get("driver_id")
        );
        return "Vehicle added successfully";
    }

    @PutMapping("/{regNo}")
    public String updateVehicle(@PathVariable String regNo, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE VEHICLE
                SET MANUFACTURE_DATE = TO_DATE(?, 'YYYY-MM-DD'), COLOR = ?, VEHICLE_TYPE_ID = ?, DRIVER_ID = ?
                WHERE REGISTRATION_NO = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("manufacture_date"),
                body.get("color"),
                body.get("vehicle_type_id"),
                body.get("driver_id"),
                regNo
        );
        return rows == 0 ? "Vehicle not found" : "Vehicle updated successfully";
    }

    @DeleteMapping("/{regNo}")
    public String deleteVehicle(@PathVariable String regNo) {
        String sql = "DELETE FROM VEHICLE WHERE REGISTRATION_NO = ?";
        int rows = jdbcTemplate.update(sql, regNo);
        return rows == 0 ? "Vehicle not found" : "Vehicle deleted successfully";
    }
}
