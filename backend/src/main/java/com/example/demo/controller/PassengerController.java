package com.example.demo.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PassengerController {

    private final JdbcTemplate jdbcTemplate;

    public PassengerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // GET ALL PASSENGERS
    @GetMapping
    public List<Map<String, Object>> getAllPassengers() {

        String sql = """
                SELECT
                    P.PASSENGER_ID,
                    P.FIRST_NAME,
                    P.LAST_NAME,
                    P.EMAIL,
                    P.GENDER,
                    P.DOB,
                    P.DOOR_NO,
                    P.CITY,
                    P.STATE,
                    P.PIN,
                    (
                        SELECT LISTAGG(PC.PHONE_NO, ',')
                        WITHIN GROUP (ORDER BY PC.PHONE_NO)
                        FROM PASSENGER_CONTACT PC
                        WHERE PC.PASSENGER_ID = P.PASSENGER_ID
                    ) AS PHONE_NUMBERS
                FROM PASSENGER P
                ORDER BY P.PASSENGER_ID
                """;

        return jdbcTemplate.queryForList(sql);
    }

    // ADD PASSENGER
    @PostMapping
    public String addPassenger(@RequestBody Map<String, Object> passenger) {

        String sql = """
                INSERT INTO PASSENGER
                (
                    PASSENGER_ID,
                    FIRST_NAME,
                    LAST_NAME,
                    EMAIL,
                    GENDER,
                    DOB,
                    DOOR_NO,
                    CITY,
                    STATE,
                    PIN
                )
                VALUES (
                    ?, ?, ?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'),
                    ?, ?, ?, ?
                )
                """;

        jdbcTemplate.update(
                sql,
                passenger.get("passenger_id"),
                passenger.get("first_name"),
                passenger.get("last_name"),
                passenger.get("email"),
                passenger.get("gender"),
                passenger.get("dob"),
                passenger.get("door_no"),
                passenger.get("city"),
                passenger.get("state"),
                passenger.get("pin")
        );

        return "Passenger added successfully";
    }

    // UPDATE PASSENGER
    @PutMapping("/{id}")
    public String updatePassenger(
            @PathVariable String id,
            @RequestBody Map<String, Object> passenger) {

        String sql = """
                UPDATE PASSENGER
                SET
                    FIRST_NAME = ?,
                    LAST_NAME = ?,
                    EMAIL = ?,
                    GENDER = ?,
                    DOB = TO_DATE(?, 'YYYY-MM-DD'),
                    DOOR_NO = ?,
                    CITY = ?,
                    STATE = ?,
                    PIN = ?
                WHERE PASSENGER_ID = ?
                """;

        int rows = jdbcTemplate.update(
                sql,
                passenger.get("first_name"),
                passenger.get("last_name"),
                passenger.get("email"),
                passenger.get("gender"),
                passenger.get("dob"),
                passenger.get("door_no"),
                passenger.get("city"),
                passenger.get("state"),
                passenger.get("pin"),
                id
        );

        if (rows == 0) {
            return "Passenger not found";
        }

        return "Passenger updated successfully";
    }

    // DELETE PASSENGER
    @DeleteMapping("/{id}")
    public String deletePassenger(@PathVariable String id) {

        String sql = """
                DELETE FROM PASSENGER
                WHERE PASSENGER_ID = ?
                """;

        int rows = jdbcTemplate.update(sql, id);

        if (rows == 0) {
            return "Passenger not found";
        }

        return "Passenger deleted successfully";
    }
}