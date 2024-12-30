const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configs/db');

const Seat = sequelize.define('Seat', {
  
    seatNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: 'seat_row_combination',
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  row: {
    type: DataTypes.INTEGER, // Change to STRING if rows are labeled alphabetically
    allowNull: false,
    unique: 'seat_row_combination',
  },
}, {
  tableName: 'seats',
  timestamps: false,
  underscored: true,
});

module.exports = Seat;


// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../../configs/db');

// const Seat = sequelize.define('Seat', {
//   seat_no: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: true,
//   },
//   row: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   tableName: 'seats',
//   timestamps: false, // Disable createdAt and updatedAt
// });

// module.exports = Seat;