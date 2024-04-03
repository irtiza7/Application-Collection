const ParkingData = require("./db");

async function handleCheckInRequest(req, res) {
  const { checkInTime, vehicleType, vehicleNumber } = req.body;
  insertParkingData(checkInTime, vehicleType, vehicleNumber);
  sendResponse(req, res, 200, "Done");
}

async function handleCheckOutRequest(req, res) {
  const { checkOutTime, vehicleNumber } = req.query;
  const fare = await calculateParkingFare(vehicleNumber, checkOutTime);
  sendResponse(req, res, 200, fare);
}

async function insertParkingData(checkInTime, vehicleType, vehicleNumber) {
  try {
    const result = await ParkingData.create({
      checkInTime,
      vehicleType,
      vehicleNumber,
    });
    console.log("Data inserted:", result.toJSON());
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

async function calculateParkingFare(carNumber, checkOutTime) {
  try {
    const parkingRecord = await ParkingData.findOne({
      where: { vehicleNumber: carNumber },
      order: [["checkInTime", "DESC"]],
      limit: 1,
    });

    if (!parkingRecord) {
      return -1;
    }
    const { checkInTime, vehicleType } = parkingRecord;

    const checkIn = new Date(`2000-01-01T${checkInTime}`);
    const checkOut = new Date(`2000-01-01T${checkOutTime}`);

    if (checkOut < checkIn) {
      // Adjust for crossing midnight
      checkOut.setDate(checkOut.getDate() + 1);
    }

    const durationInMinutes = (checkOut - checkIn) / (1000 * 60);

    let parkingRate;
    switch (vehicleType) {
      case "Car":
        parkingRate = process.env.CAR_FARE_PER_MINUTE;
        break;
      case "Heavy Vehicle":
        parkingRate = process.env.HEAVY_VEHICLE_FARE_PER_MINUTE;
        break;
      case "Two Wheeler":
        parkingRate = process.env.TWO_WHEELER_FARE_PER_MINUTE;
        break;
      default:
        parkingRate = 1;
    }

    const parkingFare = durationInMinutes * parkingRate;
    return parkingFare;
  } catch (error) {
    console.error("Error calculating parking fare:", error);
    return "An error occurred while calculating parking fare.";
  }
}

async function sendResponse(
  req,
  res,
  statusCode = 204,
  resData = "NO DATA TO SEND"
) {
  try {
    res.json(resData);
  } catch (error) {
    console.error(`ERROR INSIDE sendResponse: ${error}`);
  }
}

module.exports = {
  handleCheckInRequest,
  handleCheckOutRequest,
};
