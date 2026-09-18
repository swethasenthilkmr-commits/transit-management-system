package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RouteController {

    private final JdbcTemplate jdbcTemplate;

    public RouteController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllRoutes() {

        String sql = """
                SELECT ROUTE_ID,
                       ROUTE_NAME,
                       ROUTE_TYPE,
                       TOTAL_DISTANCE
                FROM ROUTE
                ORDER BY ROUTE_ID
                """;

        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addRoute(@RequestBody Map<String, Object> route) {

        String sql = """
                INSERT INTO ROUTE
                (
                    ROUTE_ID,
                    ROUTE_NAME,
                    ROUTE_TYPE,
                    TOTAL_DISTANCE
                )
                VALUES (?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                route.get("route_id"),
                route.get("route_name"),
                route.get("route_type"),
                route.get("total_distance")
        );

        return "Route added successfully";
    }

    @PutMapping("/{id}")
    public String updateRoute(
            @PathVariable String id,
            @RequestBody Map<String, Object> route) {

        String sql = """
                UPDATE ROUTE
                SET ROUTE_NAME = ?,
                    ROUTE_TYPE = ?,
                    TOTAL_DISTANCE = ?
                WHERE ROUTE_ID = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                route.get("route_name"),
                route.get("route_type"),
                route.get("total_distance"),
                id
        );

        if (rows == 0) {
            return "Route not found";
        }

        return "Route updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteRoute(@PathVariable String id) {

        String sql = """
                DELETE FROM ROUTE
                WHERE ROUTE_ID = ?
                """;

        int rows = jdbcTemplate.update(sql, id);

        if (rows == 0) {
            return "Route not found";
        }

        return "Route deleted successfully";
    }
}