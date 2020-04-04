//const User = require("../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10;
let jwt = require('jsonwebtoken');
var crypto = require("crypto");
var nodemailer = require('nodemailer');


var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


// retrieve all users
exports.findAll = (req, res) => {
  var users = [];

  if(localStorage.length !== 0)
    users = JSON.parse(localStorage.getItem('users'));
  console.log("in findAll users sunt:")
  console.log(users);
  res.send(users);

/*
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving user."
      });
    });*/
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
/*
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
    });*/
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
      /*
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
        });*/
        var users = [];
        if(localStorage.getItem('users') !== null)
          users = JSON.parse(localStorage.getItem('users'));

        console.log("in create users avem:");
        console.log(users);
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        res.send("ok");

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