package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TicketController {

    private final JdbcTemplate jdbcTemplate;

    public TicketController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllTickets() {
        String sql = """
                SELECT TICKET_ID, TRIP_ID, PASSENGER_ID, TO_CHAR(ISSUE_DATE,'YYYY-MM-DD') AS ISSUE_DATE, TICKET_TYPE, TRAVEL_CLASS
                FROM TICKET
                ORDER BY TICKET_ID
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addTicket(@RequestBody Map<String, Object> body) {
        String sql = """
                INSERT INTO TICKET (TICKET_ID, TRIP_ID, PASSENGER_ID, ISSUE_DATE, TICKET_TYPE, TRAVEL_CLASS)
                VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?)
                """;
        jdbcTemplate.update(
                sql,
                body.get("ticket_id"),
                body.get("trip_id"),
                body.get("passenger_id"),
                body.get("issue_date"),
                body.get("ticket_type"),
                body.get("travel_class")
        );
        return "Ticket added successfully";
    }

    @PutMapping("/{id}")
    public String updateTicket(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE TICKET
                SET TRIP_ID = ?, PASSENGER_ID = ?, ISSUE_DATE = TO_DATE(?, 'YYYY-MM-DD'), TICKET_TYPE = ?, TRAVEL_CLASS = ?
                WHERE TICKET_ID = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("trip_id"),
                body.get("passenger_id"),
                body.get("issue_date"),
                body.get("ticket_type"),
                body.get("travel_class"),
                id
        );
        return rows == 0 ? "Ticket not found" : "Ticket updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteTicket(@PathVariable String id) {
        String sql = "DELETE FROM TICKET WHERE TICKET_ID = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows == 0 ? "Ticket not found" : "Ticket deleted successfully";
    }
}
