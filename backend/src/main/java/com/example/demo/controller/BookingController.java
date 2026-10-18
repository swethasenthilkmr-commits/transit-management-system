package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BookingController {

    private final JdbcTemplate jdbcTemplate;

    public BookingController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public List<Map<String, Object>> getAllBookings() {
        String sql = """
                SELECT PASSENGER_ID, TRIP_ID, PASSENGER_NAME, TO_CHAR(TRIP_DATE,'YYYY-MM-DD') AS TRIP_DATE, SEAT_NO, TO_CHAR(BOOKING_DATE,'YYYY-MM-DD') AS BOOKING_DATE
                FROM BOOKING
                ORDER BY BOOKING_DATE DESC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @PostMapping
    public String addBooking(@RequestBody Map<String, Object> body) {
        String passengerId = String.valueOf(body.get("passenger_id"));
        String tripId = String.valueOf(body.get("trip_id"));

        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM BOOKING WHERE PASSENGER_ID = ? AND TRIP_ID = ?",
            Integer.class,
            passengerId,
            tripId
        );

        if (count != null && count > 0) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "This passenger is already booked on this trip."
            );
        }

        String sql = """
            INSERT INTO BOOKING
                (PASSENGER_ID, TRIP_ID, PASSENGER_NAME, TRIP_DATE, SEAT_NO, BOOKING_DATE)
            VALUES (?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, TO_DATE(?, 'YYYY-MM-DD'))
            """;

        jdbcTemplate.update(
            sql,
            passengerId,
            tripId,
            body.get("passenger_name"),
            body.get("trip_date"),
            body.get("seat_number"),
            body.get("booking_date")
        );

        return "Booking added successfully";
    }

    @PutMapping("/{passengerId}/{tripId}")
    public String updateBooking(
            @PathVariable String passengerId,
            @PathVariable String tripId,
            @RequestBody Map<String, Object> body) {
        String sql = """
                UPDATE BOOKING
                SET PASSENGER_NAME = ?, TRIP_DATE = TO_DATE(?, 'YYYY-MM-DD'), SEAT_NO = ?, BOOKING_DATE = TO_DATE(?, 'YYYY-MM-DD')
                WHERE PASSENGER_ID = ? AND TRIP_ID = ?
                """;
        int rows = jdbcTemplate.update(
                sql,
                body.get("passenger_name"),
                body.get("trip_date"),
                body.get("seat_no"),
                body.get("booking_date"),
                passengerId,
                tripId
        );
        return rows == 0 ? "Booking not found" : "Booking updated successfully";
    }

    @DeleteMapping("/{passengerId}/{tripId}")
    public String deleteBooking(@PathVariable String passengerId, @PathVariable String tripId) {
        String sql = "DELETE FROM BOOKING WHERE PASSENGER_ID = ? AND TRIP_ID = ?";
        int rows = jdbcTemplate.update(sql, passengerId, tripId);
        return rows == 0 ? "Booking not found" : "Booking deleted successfully";
    }
}
