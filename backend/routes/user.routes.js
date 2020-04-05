module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);

  // Create a new user
  router.post("/login", users.login);

  // Retrieve all users
  router.get("/", users.findAll);

  // update password
  router.post("/forgottenPassword", users.resetPassword);

  app.use('/users', router);
};