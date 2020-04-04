module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new user
  router.post("/", users.create);

  // Create a new user
  router.post("/login", users.login);

  // Retrieve all users
  router.get("/", users.findAll);

  // delete all
  router.delete("/", users.deleteAll);

  // delete by id
  router.post("/deleteByID", users.deleteByID);

  // changePassword 
  router.post("/changePassword", users.changePassword);

  // update password
  router.post("/forgottenPassword", users.resetPassword);

  // edit user
  router.post("/editUser", users.editUser);

   // register request
   router.post("/registerRequest", users.registerRequest);


  app.use('/users', router);
};