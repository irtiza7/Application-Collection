const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
  }
);

const ParkingData = sequelize.define("ParkingData", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  checkInTime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vehicleType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vehicleNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

sequelize.sync({ force: false }).then(() => {
  console.log(
    "ParkingData table has been created (if not exists) in the database."
  );
});

module.exports = ParkingData;
