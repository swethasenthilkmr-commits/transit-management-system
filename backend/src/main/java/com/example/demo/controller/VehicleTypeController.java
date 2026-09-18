package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicle-types")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VehicleTypeController {

    private final JdbcTemplate jdbcTemplate;

    public VehicleTypeController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllVehicleTypes() {
        String sql = """
                SELECT VEHICLE_TYPE_ID, TYPE_NAME, CAPACITY, FUEL_TYPE
                FROM VEHICLE_TYPE
                ORDER BY VEHICLE_TYPE_ID
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addVehicleType(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO VEHICLE_TYPE (VEHICLE_TYPE_ID, TYPE_NAME, CAPACITY, FUEL_TYPE)
                VALUES (?, ?, ?, ?)
                """;
        jdbcTemplate.update(
                sql,
                body.get("vehicle_type_id"),
                body.get("type_name"),
                body.get("capacity"),
                body.get("fuel_type")
        );
        return "Vehicle type added successfully";
    }

    @PutMapping("/{id}")
    public String updateVehicleType(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE VEHICLE_TYPE
                SET TYPE_NAME = ?, CAPACITY = ?, FUEL_TYPE = ?
                WHERE VEHICLE_TYPE_ID = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("type_name"),
                body.get("capacity"),
                body.get("fuel_type"),
                id
        );
        return rows == 0 ? "Vehicle type not found" : "Vehicle type updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteVehicleType(@PathVariable String id) {
        String sql = "DELETE FROM VEHICLE_TYPE WHERE VEHICLE_TYPE_ID = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows == 0 ? "Vehicle type not found" : "Vehicle type deleted successfully";
    }
}
