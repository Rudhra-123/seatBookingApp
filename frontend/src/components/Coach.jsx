import React, { useState, useEffect } from 'react';
import "./coach.css";
import axios from "axios";
import { Notification } from './Notification/Notification';

 const Proxy = "http://localhost:8080/api";   // the basee URL 
// const Proxy = "https://seat-booking-api.onrender.com/seats";   // the deployed URL

export const Coach = () => {
    const [requiredSeats, setRequiredSeats] = useState("");
    const [allSeatsdata, setAllSeatsData] = useState([]);
    const [showError, setShowError] = useState(false);
    const [currentBookedSeats, setCurrentBookedSeats] = useState([]);
    const [message, setMessage] = useState("")


    // this is the function which gets all the seats and set the data as AllSeatsData it run when the application is runs for that first time and if there is chanage in the currentbookedSeats
    const allSeats = async () => {
        try {
            const res = await axios.get(`${Proxy}`);
            setAllSeatsData(res.data); // this sets the allSeatsData which basically shown  on the UI

        } catch (error) {
            console.log("error while fetching the data", error.message);
        }
    };


    // this function handles the input change and it sets the requiredSeats. 
    const handleInput = (e) => {
        let value = e.target.value.trim();
        console.log(value)
        setRequiredSeats(value); //requiredSeats are the number, that many seats to be booked
        setShowError(false);    // showError is the toggle which handles the input validation
    };

    // this is validation function of the input which returns the true if input is correct and vice versa
    const validateInput = () => {
        // Performing input validation logic here
        const isValid = Number(requiredSeats) >= 1 && Number(requiredSeats) <= 7;
        return isValid;
    };



    // this function handles the booking of the seats 
    const handleBooking = async () => {
        if (!validateInput()) {
            setShowError(true); // Show error message if input is invalid
            setMessage("Invalid input. Please enter a value between 1 and 7.")
            setRequiredSeats(""); // if the input is invalid then it sets the requiredSeats to empty
            return;
        }
        // if the code is valid then this opration gets executed to book the seats which are available.
        try {
            const resp = await axios.put(`${Proxy}/${requiredSeats}`); // it sends the put request to the server with the requiredSeats parameter
            if (resp.data.updatedSeats) {
                setCurrentBookedSeats(resp.data.updatedSeats); // this sets the currently booked seats and this is used to show the the seats on the UI

            } else {
                setShowError(true);
                setMessage(resp.data.message)

            }

        } catch (error) {
            console.log("error while booking the seats", error.message);
        }
        setRequiredSeats("");  // this sets the input empty again
    };


    // this is the function to reseting all the seats to be available 
    const handleReseting = async () => {
        try {
            await axios.put(`${Proxy}/resetAll`); // it send the request to server to update the all the  seats
            allSeats();
            setCurrentBookedSeats([])
        } catch (error) {
            console.log("error while reseting the seats", error.message);
        }
    };

    useEffect(() => {
        allSeats(); // Fetch all seats data again when currentBookedSeats updates
    }, [currentBookedSeats]);

    return (
        <div className="container">
            <h1>Seat Booking System</h1>
            <div className="mainComponent">

                <div className="coach">
                    {allSeatsdata.length !== 0 ? (
                        allSeatsdata.map((item, index) => (
                            <div
                                key={index}
                                className="seats"
                                style={{
                                    background: item.status === true ? "#00bdf2" : "#bcb5b5",
                                    color: item.status === true ? "white" : "white",
                                }}
                            >
                                <p>{item.seatNo}</p>
                            </div>
                        ))
                    ) : (
                        <div className="loading">Loading...</div>
                    )}
                </div>

                <div className="booking">
                    <div className="seatStatus">
                        <div className="seatSattusDiv">
                            <div className="statusColorbooked"></div>
                            <div>Booked Seats</div>
                        </div>
                        <div className="seatSattusDiv">
                            <div className="statusColoravail"></div>
                            <div>Available Seats</div>
                        </div>
                    </div>

                    <div className="currentBookedSeats">
                        <h4>Current Booked Seats: </h4>
                        <div className='bookedSeats'>{currentBookedSeats.map((item) => (
                            <button key={item._id}>{item.seatNo}</button>
                        ))}</div> {/* Display the updated number of booked seats */}
                    </div>

                    <div className="inputButton">
                        <input
                            type="number"
                            placeholder="Enter Number 1-7 to book Seats"
                            value={requiredSeats}
                            onChange={(e) => {
                                handleInput(e);
                            }}
                        />
                        <button className="bookingButton" onClick={handleBooking}>
                            Book Ticket
                        </button>
                        <button className="resetAll" onClick={handleReseting}>
                            Reset Bookings
                        </button>
                    </div>
                </div>
            </div>

            {showError && (
                <Notification message={message} />
            )}
        </div>
    );
};
