const Controllers = require("./controllers");

const Express = require("express");
const Router = Express.Router();

Router.post("/signup", Controllers.signupUser);
Router.post("/login", Controllers.loginUser);
Router.post("/api/task/list", Controllers.getAllTasks);
Router.post("/api/task/add", Controllers.addTask);
Router.post("/api/task/edit", Controllers.editTask);
Router.post("/api/task/delete", Controllers.deleteTask);

module.exports = Router;
