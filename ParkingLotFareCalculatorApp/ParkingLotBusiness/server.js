const Express = require("express");
const Morgan = require("morgan");
const cors = require("cors");
const Timeout = require("connect-timeout");
const Router = require("./routes");
require("dotenv").config();

const serverApp = Express();

serverApp.use(cors());
serverApp.use(Express.json());
serverApp.use(Morgan("common"));
serverApp.use(Timeout("30s"));
serverApp.use("/", Router);

serverApp.listen(process.env.SERVER_PORT, (error) => {
  if (error) {
    console.error(error);
  }
  console.log(
    `Listening at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
