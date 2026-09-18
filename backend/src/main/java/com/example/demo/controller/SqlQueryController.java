package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/query")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SqlQueryController {

    private final JdbcTemplate jdbcTemplate;

    public SqlQueryController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping
    public ResponseEntity<?> executeQuery(@RequestBody Map<String, String> request) {
        String sql = request.get("sql");
        if (sql == null) {
            return ResponseEntity.badRequest().body("SQL query is required.");
        }

        String trimmedSql = sql.trim().toUpperCase();
        if (!trimmedSql.startsWith("SELECT") && !trimmedSql.startsWith("WITH")) {
            return ResponseEntity.badRequest().body("Only SELECT or WITH queries are permitted.");
        }

        try {
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
