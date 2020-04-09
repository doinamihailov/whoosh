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
  res.send(users);

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
      var users = [];

      if(localStorage.length !== 0)
        users = JSON.parse(localStorage.getItem('users'));
      const user = users.filter(x => x.email === req.body.email);
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
            res.status(403).send({
              message: 'Incorrect username or password'
            });
          }
        })
        .catch(err => console.error(err.message))
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
        var users = [];
        if(localStorage.getItem('users') !== null)
          users = JSON.parse(localStorage.getItem('users'));
        
        users.push(user);
        console.log("in create users avem:");
        console.log(users);
       
        localStorage.setItem('users', JSON.stringify(users));
        console.log(JSON.stringify(users));
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
    from: '"noreply@whoosh.ro"deductions@aquasoft.ro',
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


exports.resetPassword = (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: '',
  };
  var randomPass = crypto.randomBytes(4).toString('hex');
  console.log(randomPass);
  bcrypt
    .hash(randomPass, saltRounds)
    .then(hash => {

      // Store hash in your password DB.
      user.password = hash;
      var users = [];
      if(localStorage.getItem('users') !== null){
        users = JSON.parse(localStorage.getItem('users'));
        users = users.filter(x => x.email !== user.email);
        
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        res.send({
            message: "user was updated successfully."
        });
        } else {
          res.status(500).send({
            message: "Error updating user with email=" + req.body.email
          });
        }
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
      from: '"noreply@whoosh.ro" deductions@aquasoft.ro',
      to: user.email,
      subject: 'Reset password',
      text: 'Your password has been reset succesfully!\n' + '\nYour information is:\nFirst name: ' +
        user.first_name + '\nLast name: ' + user.last_name + '\nEmail: ' + user.email +
        '\n' + '\nYour new password was automatically generated: ' + randomPass
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

exports.changePassword = (req, res) => {
  bcrypt
    .hash(req.body.password, saltRounds)
    .then(hash => {
      var users = [];
      if(localStorage.getItem('users') !== null){

        users = JSON.parse(localStorage.getItem('users'));
        var oldUser =  users.filter(x => x.email === req.body.email);
        bcrypt.compare(req.body.password, oldUser[0].password, function(err, result) {
          if(result) {
            res.status(403).send({
              message: "Email can not be empty!"
            });
          } else {
            const user = {
              first_name: oldUser[0].first_name,
              last_name: oldUser[0].last_name,
              email: req.body.email,
              password: hash
            };
            users = users.filter(x => x.email !== user.email);
            
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            res.send({
              message: "user was updated successfully."
            });
          }
        });
      } else {
        res.status(500).send({
        message: "Error updating user with email=" + req.body.email
        });
      }
      
    })
    .catch(err => console.error(err.message));
 }

 exports.editUser = (req, res) => {
  const user = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password
  };
  var users = [];

  if(localStorage.getItem('users') !== null){
    users = JSON.parse(localStorage.getItem('users'));
    users = users.filter(x => x.email !== user.email);
        
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    res.send({
        message: "user was updated successfully."
    });
    } else {
      res.status(500).send({
      message: "Error updating user with email=" + req.body.email
    });
  }
}

exports.delete = (req, res) => {
  var users = [];
  
  if(localStorage.getItem('users') !== null){
    users = JSON.parse(localStorage.getItem('users'));
    users = users.filter(x => x.email !== req.body.email);
      
    localStorage.setItem('users', JSON.stringify(users));
    res.send({
        message: "user was deleted successfully."
    });
    } else {
      res.status(500).send({
      message: "Error deleting user with email=" + req.body.email
    });
  }
}
