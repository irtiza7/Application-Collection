const Controllers = require("./controllers");

const Express = require("express");
const Router = Express.Router();

Router.post("/api/check_in", Controllers.handleCheckInRequest);
Router.get("/api/check_out", Controllers.handleCheckOutRequest);

module.exports = Router;
