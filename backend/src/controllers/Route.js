const express = require("express")
// const Seat = require("../models/seatSchema");

const router = express.Router();
const seatArray = require("../data");
const Seat = require("../models/seatSchema");
// const auth = require("../../auth/auth");




// post route for creating seats in the coach
router.post("/", async (req, res) => {
  try {
    // const seatArrays = req.body;  // Get data from the request body

    // Insert multiple rows into the seats table
    const seats = await Seat.bulkCreate(seatArray, {
      returning: true, // Return inserted rows if needed
    });
    res.status(201).json(seats); // Respond with inserted rows
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});


// get route for fetching all the seats 

router.get("/", async (req, res) => {
    try {
      // Fetch all seats, sorted by seat_no
      const allSeats = await Seat.findAll({
        order: [['seat_no', 'ASC']], // Sort by seat_no in ascending order
      });
      res.status(200).json(allSeats); // Send seats as a JSON response
    } catch (e) {
      res.status(500).json({ message: e.message }); // Handle errors
    }
  });

// route for getting available seats 
router.get("/availableSeats", async (req, res) => {
    try {
        // Fetch available seats with status true, ordered by seatNo
        const availableSeats = await Seat.findAll({
            where: {
                status: true // Only seats that are available (status: true)
            },
            order: [
                ['seat_no', 'ASC'] // Sort by seat_no in ascending order
            ]
        });

        res.status(200).json(availableSeats); // Send the available seats as JSON response

    } catch (e) {
        res.status(500).json({ message: e.message }); // Handle any errors
    }
});


// route for resetting all the seats 
router.put("/resetAll", async (req, res) => {
    try {
        // Update all seats and set their status to true
        const updatedSeats = await Seat.update(
            { status: true }, // Set status to true
            {
                where: {}, // No condition, so it affects all rows in the table
            }
        );

        // Check if any rows were updated
        if (updatedSeats[0] > 0) {
            res.status(200).json({ message: "Seats reset successfully." });
        } else {
            res.status(400).json({ message: "No seats found to update." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// route for booking seats which takes the params required seats from the frontend

// Route for booking seats which takes the params requiredSeats from the frontend
router.put("/:requiredSeats", async (req, res) => {
    console.log("in required one");
    const requiredSeats = parseInt(req.params.requiredSeats);
    
    // Validate the requiredSeats value
    if (requiredSeats < 1 || requiredSeats > 7) {
        return res.status(400).json({ message: "Invalid input. Please enter a value between 1 and 7." });
    }

    try {
        // Fetch available seats from the database, sorted by seatNo
        const availableSeats = await Seat.findAll({
            where: { status: true },
            order: [['seatNo', 'ASC']],
        });

        let seatsBooked = false;
        let bookedSeats = [];
        
        // Loop through available seats to find continuous seats in a row
        for (let i = 0; i < availableSeats.length; i++) {
            const currentSeat = availableSeats[i];
            const currentRow = currentSeat.row;

            // Filter seats by the same row
            const rowSeats = availableSeats.filter(seat => seat.row === currentRow && seat.status === true);

            if (rowSeats.length >= requiredSeats) {
                // Book the required number of seats
                bookedSeats = rowSeats.slice(0, requiredSeats);
                const seatNosToUpdate = bookedSeats.map(seat => seat.seatNo);
                
                await Seat.update(
                    { status: false },
                    { where: { seatNo: seatNosToUpdate } }
                );

                seatsBooked = true;
                break;
            }
        }

        // If seats were successfully booked
        if (seatsBooked) {
            return res.status(201).json({ message: "Booked seats successfully in a row", updatedSeats: bookedSeats });
        } else {
            // If the required seats are not available in any row
            if (requiredSeats > availableSeats.length) {
                return res.status(400).json({ message: "Not enough seats available." });
            }

            // If seats are not available in a row, find the closest available seats
            const closestSeatsAvailable = closestSeats(availableSeats, requiredSeats);
            const closestSeatNos = closestSeatsAvailable.map(seat => seat.seatNo);

            await Seat.update(
                { status: false },
                { where: { seatNo: closestSeatNos } }
            );

            return res.status(201).json({ message: "Booked closest available seats", updatedSeats: closestSeatsAvailable });
        }

    } catch (error) {
        console.error("Error booking seats:", error);
        return res.status(500).json({ message: error.message });
    }
});

const closestSeats = (seatsArray, seatWindow) => {
    // Sort the seats array based on seat number
    seatsArray.sort((a, b) => a.seatNo - b.seatNo);

    let minDistance = Infinity;
    let closestWindow = seatsArray.slice(0, seatWindow);

    // Find the closest window of seats
    for (let i = 0; i <= seatsArray.length - seatWindow; i++) {
        let currentWindow = seatsArray.slice(i, i + seatWindow);
        const currentDistance = currentWindow[seatWindow - 1].seatNo - currentWindow[0].seatNo;

        if (currentDistance < minDistance) {
            minDistance = currentDistance;
            closestWindow = currentWindow;
        }
    }

    return closestWindow;
};
module.exports = router