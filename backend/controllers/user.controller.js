const User = require("../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10;
let jwt = require('jsonwebtoken');
var crypto = require("crypto");
var nodemailer = require('nodemailer');

// retrieve all users
exports.findAll = (req, res) => {

  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

// verify login
exports.login = (req, res) => {

  // validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  User.findAll()
    .then(data => {
      const user = data.filter(x => x.email === req.body.email);
      const pass = user[0].password;

      bcrypt
        .compare(req.body.password, pass)
        .then(res2 => {
          // a mers
          if (res2 === true) {
            let token = jwt.sign({ email: req.body.email },
              "tokenSerializer",
              {
                expiresIn: '24h' // expires in 24 hours
              }
            );
            // return the JWT token for the future API calls
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });

          }
          else {
            res.send(403).json({
              success: false,
              message: 'Incorrect username or password'
            });
          }
        })
        .catch(err => console.error(err.message));
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });
};

exports.deleteByID = (req, res) => {
  console.log(req.body)

  User.destroy({
    where: { id: req.body.id }
  })
    .then(() => {
      res.send({ message: 'User deleted successfully!' });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing the user."
      });
    });
}

exports.changePassword = (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: ''
  };

  bcrypt
    .hash(req.body.password, saltRounds)
    .then(hash => {

      user.password = hash;

      User.update(user, {
        where: { email: req.body.email }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "user was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update user with id=${id}. Maybe User was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating user with id=" + id
          });
        });

    })
    .catch(err => console.error(err.message));
}


exports.resetPassword = (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: ''
  };
  var randomPass = crypto.randomBytes(4).toString('hex');
  console.log(randomPass);
  bcrypt
    .hash(randomPass, saltRounds)
    .then(hash => {

      // Store hash in your password DB.
      user.password = hash;

      User.update(user, {
        where: { email: req.body.email }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "user was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update user with email=${req.body.email}. Maybe User was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({
            message: "Error updating user with email=" + req.body.email
          });
        });

    })
    .catch(err => console.error(err.message));

    //send email with random password

    var transporter = nodemailer.createTransport({
      host: 'aquasoft.ro',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'deductions@aquasoft.ro', // generated ethereal user
        pass: 'NkN1ppxbZj&A'
        //   pass: '!@#$%TREWQ' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: '"noreply.vat@aquasoft.ro"deductions@aquasoft.ro',
      to: user.email,
      subject: 'Reset password',
      text: 'Your password has been reset succesfully!\n' + '\nYour information is:\nFirst name: ' +
        user.first_name + '\nLast name: ' + user.last_name + '\nEmail: ' + user.email +
        '\nRole: ' + user.role + '\n' + '\nYour new password was automatically generated: ' + randomPass
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

exports.editUser = (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
    User.update(user, {
      where: { id: req.body.id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "user was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    });
}



// delete all users
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    });
};

exports.registerRequest = (req, res) => {
  // validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!"
    });
    return;
  }
  //send email to admin

  var transporter = nodemailer.createTransport({
    host: 'aquasoft.ro',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'deductions@aquasoft.ro', 
      pass: 'NkN1ppxbZj&A'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: '"noreply.vat@aquasoft.ro"deductions@aquasoft.ro',
    to: 'doinami99@yahoo.com', //TO DO: CHANGE TO ADMIN'S EMAIL
    subject: 'New register request',
    text: 'A new user would like to be registered with the following data:\n' + '\nFirst name: ' +
      req.body.first_name + '\nLast name: ' + req.body.last_name + '\nEmail: ' + req.body.email +
      '\n'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      res.send('Email sent: ' + info.response);
    }
  });

};

exports.create = (req, res) => {
  // validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!"
    });
    return;
  }
  // create an user
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: ''
  };

  var randomPass = crypto.randomBytes(4).toString('hex');
  console.log(randomPass);

  console.log(req.body.role)
  bcrypt
    .hash(randomPass, saltRounds)
    .then(hash => {

      // Store hash in your password DB.
      user.password = hash;

      // save user in db
      User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          console.log(err)
            ; res.status(500).send({
              message:
                err.message || "Some error occurred while creating the user."
            });
        });

    })
    .catch(err => console.error(err.message));

  //send email with random password

  var transporter = nodemailer.createTransport({
    host: 'aquasoft.ro',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'deductions@aquasoft.ro', // generated ethereal user
      pass: 'NkN1ppxbZj&A'
      //   pass: '!@#$%TREWQ' // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: '"noreply.vat@aquasoft.ro"deductions@aquasoft.ro',
    to: user.email,
    subject: 'Account created succesfully',
    text: 'Your account was created succesfully!\n' + '\nYour information is:\nFirst name: ' +
      user.first_name + '\nLast name: ' + user.last_name + '\nEmail: ' + user.email +
     '\n' + '\nYour password was automatically generated: ' + randomPass +
      '\nPlease reset it after your first login.'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};