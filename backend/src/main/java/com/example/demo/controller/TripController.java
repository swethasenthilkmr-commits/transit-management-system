package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TripController {

    private final JdbcTemplate jdbcTemplate;

    public TripController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllTrips() {
        String sql = """
                SELECT TRIP_ID, TO_CHAR(TRIP_DATE,'YYYY-MM-DD') AS TRIP_DATE, START_TIME, END_TIME, ROUTE_ID
                FROM TRIP
                ORDER BY TRIP_ID
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addTrip(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO TRIP (TRIP_ID, TRIP_DATE, START_TIME, END_TIME, ROUTE_ID)
                VALUES (?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, ?)
                """;
        jdbcTemplate.update(
                sql,
                body.get("trip_id"),
                body.get("trip_date"),
                body.get("start_time"),
                body.get("end_time"),
                body.get("route_id")
        );
        return "Trip added successfully";
    }

    @PutMapping("/{id}")
    public String updateTrip(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE TRIP
                SET TRIP_DATE = TO_DATE(?, 'YYYY-MM-DD'), START_TIME = ?, END_TIME = ?, ROUTE_ID = ?
                WHERE TRIP_ID = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("trip_date"),
                body.get("start_time"),
                body.get("end_time"),
                body.get("route_id"),
                id
        );
        return rows == 0 ? "Trip not found" : "Trip updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteTrip(@PathVariable String id) {
        String sql = "DELETE FROM TRIP WHERE TRIP_ID = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows == 0 ? "Trip not found" : "Trip deleted successfully";
    }
}
