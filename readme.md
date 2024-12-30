
# Seat Booking System

The Seat Booking System is a web application that allows users to book seats in a coach. It provides a user-friendly interface for selecting seats and managing bookings. 

## Features
- Display available and booked seats in the coach.
- Book a seat by selecting the desired seat number.
- Reset all bookings to make all seats available again.
- one can book maximum 7 seats at a time.

## Technologies Used
- **Frontend:** React.js
- **Backend:**   Node.js with Express.js
- **Database:** Posrgres
- **Deployment:**  Frontend- Netlify && Backend - Render
- **Version Control:** GIT

# overview

The Seat Booking System is designed to facilitate the booking of seats in a coach. It allows user to view the available seats and make bookings based on the stated logic. The system keeps track of the booked seats and updates the availability status in real-time.

## User Flow
The typical user flow in the Seat Booking System is as follows:

1. Upon accessing the application, users are presented with the homepage, which displays the coach on the left and in right user can see the status of seats booked or available along with that an input box to put the required seats and two buttons booking and reseting.
2. Users can view the seat layout and availability, with booked seats indicated as "Booked."
3. To book a seat, users can fill the input box with how much seats he wants to book and can book by pressing on "Book ticket" button.
4. Users can view their current booked seats in a designated area on the UI.
5. To reset all bookings and make all seats available again, users can click the "Reset Bookings" button. This action clears all bookings and updates the seat availability accordingly.
6. Users can repeat the seat booking process as needed.


## Booking Logic

The Seat Booking System implements the following logic for seat bookings:

When a user requests to book a certain number of seats:

The system checks each row to determine if there are enough consecutive available seats to accommodate the user's request. 

1. If there are enough consecutive available seats in a single row:
- The system books the seats in that row, marking them as "Booked" and updating their availability status.


![App Screenshot](./screenshots/Screenshot%20(14).png)

here the required seates are available to book in a row. So 
system booked the seats in that row

![App Screenshot](./screenshots/Screenshot%20(15).png)


1. If there are not enough consecutive available seats in any row:
- The system searches for the closest available seats across all rows that can accommodate the requested number of seats.
- It calculates the distance between each available seat and its neighboring seats to determine the proximity.

![App Screenshot](./screenshots/Screenshot%20(16).png)

- The system then selects the seats with the closest proximity, ensuring they are adjacent to each other.

![App Screenshot](./screenshots/Screenshot%20(17).png)

- These seats are booked, marked as "Booked," and their availability status is updated.


By following this logic, the system ensures that when the required number of seats is available in a single row, they are booked together. However, if the required number of seats is not available in any row, the system selects and books the seats that are closest to each other across rows.





# Frontend
The frontend of the Seat Booking System is built using React.js, a popular JavaScript library for building user interfaces. It leverages the power of React components and state management to provide a dynamic and interactive user experience.


## Installation

1. Clone the repository:

```bash
  git clone https://github.com/hemantjayas/seatBookingApp
```
2. Navigate to the frontend directory:

```bash
cd frontend
```

3. Install the dependencies:
```bash
npm install
```
## Usage

1. Start the frontend development server:
```bash
npm start
```

2. Open a web browser and visit http://localhost:3000 to access the Seat Booking System.
# Backend

The backend of the Seat Booking System is built using Node.js and Express.js, providing a RESTful API for handling seat bookings and retrieving seat information from the database.
## Installation

1. Clone the repository:
```bash
git clone https://github.com/hemantjayas/seatBookingApp
```
2. Navigate to the backend directory:
```bash
cd backend
```
3. Install the dependencies:
```bash
npm install
```

### Configuration
1. Create a .env file in the backend directory.
2. Add the following environment variables to the .env file:

```makefile
PORT=<backend-port>
MONGODB_URI=<mongodb-connection-string>
```

Replace <backend-port> with the desired port number for the backend server.

Replace <mongodb-connection-string> with the connection string for your MongoDB database.

## Usage 
1. Start the backend server:
```bash
npm run dev
```
The backend server will start listening on the configured port.
2. The API endpoints will be available at 
`http://localhost:<backend-port>/seats`.
