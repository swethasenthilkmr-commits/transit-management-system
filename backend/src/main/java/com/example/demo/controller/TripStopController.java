package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips/{tripId}/stops")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TripStopController {

    private final JdbcTemplate jdbcTemplate;

    public TripStopController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getTripStops(@PathVariable String tripId) {
        String sql = """
                SELECT TRIP_ID, STOP_NO, STATION_ID, STATION_NAME, ARRIVAL_TIME, DEPARTURE_TIME
                FROM TRIP_STOP
                WHERE TRIP_ID = ?
                ORDER BY STOP_NO
                """;
        return jdbcTemplate.queryForList(sql, tripId);
    }

    @PostMapping
    public String addTripStops(@PathVariable String tripId, @RequestBody List<Map<String, Object>> stops) {
        String sql = """
                INSERT INTO TRIP_STOP (TRIP_ID, STOP_NO, STATION_ID, STATION_NAME, ARRIVAL_TIME, DEPARTURE_TIME)
                VALUES (?, ?, ?, ?, ?, ?)
                """;
        if (stops != null) {
            for (Map<String, Object> stop : stops) {
                jdbcTemplate.update(
                        sql,
                        tripId,
                        stop.get("stop_no"),
                        stop.get("station_id"),
                        stop.get("station_name"),
                        stop.get("arrival_time"),
                        stop.get("departure_time")
                );
            }
        }
        return "Trip stops added successfully";
    }

    @DeleteMapping
    public String deleteTripStops(@PathVariable String tripId) {
        String sql = "DELETE FROM TRIP_STOP WHERE TRIP_ID = ?";
        int rows = jdbcTemplate.update(sql, tripId);
        return rows == 0 ? "Trip stops not found" : "Trip stops deleted successfully";
    }
}
