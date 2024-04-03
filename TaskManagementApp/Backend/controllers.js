const { resolveSoa } = require("dns");
const { TaskTable, UserTable } = require("./db");
const bcrypt = require("bcrypt");

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

async function applyPasswordHash(password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePassword(userPassword, dbPassword) {
  return await bcrypt.compare(userPassword, dbPassword);
}

async function signupUser(req, res) {
  const data = await UserTable.findOne({
    where: { email: req.body.email },
    limit: 1,
  });
  if (data) {
    sendResponse(req, res, 200, {
      errorFlag: true,
      message: "Email Already Exists",
    });
    return;
  }

  try {
    const hashedPassword = await applyPasswordHash(req.body.password);
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    };
    let result = await UserTable.create(userData);
    result = { ...result, errorFlag: false, message: "Sign Up Successful" };
    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
  }
}

async function loginUser(req, res) {
  try {
    let result = await UserTable.findOne({ where: { email: req.body.email } });
    if (!result) {
      sendResponse(req, res, 200, {
        errorFlag: 1,
        message: "User Doesn't Exist",
      });
    }
    if (!(await comparePassword(req.body.password, result.password))) {
      sendResponse(req, res, 200, {
        errorFlag: 1,
        message: "Incorrect Password",
      });
    }

    result = { ...result, errorFlag: false, message: "Log In Successful" };
    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
  }
}

async function addTask(req, res) {
  try {
    const { title, description, status, userId } = req.body;

    if (!userId) {
      sendResponse(req, res, 200, {
        errorFlag: 1,
        message: "User Id can't be Null",
      });
      return;
    }

    let result = await TaskTable.create({
      title,
      description,
      status,
      userId,
    });

    result = { ...result, errorFlag: 0, message: "Task Created Successfully" };
    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
    console.error("Error inserting data:", error);
  }
}

async function editTask(req, res) {
  try {
    const { id, title, description, status } = req.body;

    let result = await TaskTable.findOne({ where: { id: id } });
    result.set({
      title: title,
      description: description,
      status: status,
    });
    await result.save();

    result = { ...result, errorFlag: 0, message: "Task Edited Successfully" };
    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.body;
    let result = await TaskTable.destroy({ where: { id: id } });

    result = { ...result, errorFlag: 0, message: "Task Deleted Successfully" };
    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
  }
}

async function getAllTasks(req, res) {
  try {
    const { id } = req.body;
    let result = await TaskTable.findAll({
      where: { userId: id },
    });

    sendResponse(req, res, 200, result);
  } catch (error) {
    sendResponse(req, res, 500, error);
    console.error("Error fetching data:", error);
  }
}

module.exports = {
  signupUser,
  loginUser,
  addTask,
  editTask,
  deleteTask,
  getAllTasks,
};
