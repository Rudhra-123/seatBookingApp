const { DataTypes } = require('sequelize');
const { sequelize } = require('../../configs/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Please tell us your name',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address',
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, Infinity], // Fixed validation to check for at least 8 characters
        msg: 'Password must be at least 8 characters long',
      },
    },
  },
});

module.exports = User;
