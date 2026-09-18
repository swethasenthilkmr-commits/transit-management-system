package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StationController {

    private final JdbcTemplate jdbcTemplate;

    public StationController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // GET - get all stations
    @GetMapping
    public List<Map<String, Object>> getAllStations() {

        String sql = """
                SELECT STATION_ID, STATION_NAME, CITY, AREA, LANDMARK, ROUTE_ID
                FROM STATION
                ORDER BY STATION_ID
                """;

        return jdbcTemplate.queryForList(sql);
    }

    // POST - add a new station
    @PostMapping
    public String addStation(@RequestBody Map<String, Object> station) {

        String sql = """
                INSERT INTO STATION
                (STATION_ID, STATION_NAME, CITY, AREA, LANDMARK, ROUTE_ID)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                station.get("station_id"),
                station.get("station_name"),
                station.get("city"),
                station.get("area"),
                station.get("landmark"),
                station.get("route_id")
        );

        return "Station added successfully";
    }
    // PUT - update a station
@PutMapping("/{id}")
public String updateStation(
        @PathVariable String id,
        @RequestBody Map<String, Object> station) {

    String sql = """
            UPDATE STATION
            SET STATION_NAME = ?,
                CITY = ?,
                AREA = ?,
                LANDMARK = ?,
                ROUTE_ID = ?
            WHERE STATION_ID = ?
            """;

    int rows = jdbcTemplate.update(
            sql,
            station.get("station_name"),
            station.get("city"),
            station.get("area"),
            station.get("landmark"),
            station.get("route_id"),
            id
    );

    if (rows == 0) {
        return "Station not found";
    }

    return "Station updated successfully";
}


// DELETE - delete a station
@DeleteMapping("/{id}")
public String deleteStation(@PathVariable String id) {

    String sql = """
            DELETE FROM STATION
            WHERE STATION_ID = ?
            """;

    int rows = jdbcTemplate.update(sql, id);

    if (rows == 0) {
        return "Station not found";
    }

    return "Station deleted successfully";
}
}