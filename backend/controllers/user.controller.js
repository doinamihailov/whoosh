const bcrypt = require("bcrypt");
const saltRounds = 10;
let jwt = require('jsonwebtoken');
var crypto = require("crypto");
var nodemailer = require('nodemailer');

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://user:pass@cluster0-ripl0.azure.mongodb.net/test?retryWrites=true&w=majority';

// retrieve all users
exports.findAll = (req, res) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for retrieving users");
    if(err)
      console.log(err);
    var dbase = db.db("whoosh");

    try {
      const results = dbase.collection('users').find().toArray(function(err, result) {
        if (result.length > 0) {
          res.send(result);
        }
   });

   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error getting users"
      });
   }
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
  MongoClient.connect(url, { useUnifiedTopology: true },  function(err, db){
    console.log("Connected for login");
    if(err)
      console.log(err);
    var dbase = db.db("whoosh");

    try {
      const results = dbase.collection('users').find().toArray(function(err, result) {
        if (result.length > 0) {
          var oldUser =  result.filter(x => x.email === req.body.email);
          const pass = oldUser[0].password;
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
          .catch(err => console.error(err.message));
        }
   });

   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error getting users"
      });
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
      
      user.password = hash;

      //STORE IN MONGODB
      MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        console.log("Connected for register");
        if(err)
          console.log(err);
        var dbase = db.db("whoosh"); //here
        dbase.collection('users').insertOne(user);
      });
      res.send("ok");

    })
    .catch(err => console.error(err.message));

  //send email with random password
   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'whooshsevices@gmail.com',
           pass: 'whooshpass'
       }
   });

  var mailOptions = {
    from: '"noreply@whoosh.ro" whooshsevices@gmail.com',
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
      MongoClient.connect(url, { useUnifiedTopology: true },  function(err, db){
        console.log("Connected for reset password");
        if(err)
          console.log(err);
        var dbase = db.db("whoosh");

        try {
          dbase.collection('users').replaceOne( { 'email' : req.body.email}, user );
          res.send({
            message: "user was edited successfully."
          });
          
      } catch (e) {
          console.log(e); 
          res.status(500).send({
            message: "Error editing user with email=" + req.body.email
          });
      }
      });
    })
    .catch(err => console.error(err.message));

    //send email with random password
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: 'whooshsevices@gmail.com',
             pass: 'whooshpass'
         }
     });

    var mailOptions = {
      from: '"noreply@whoosh.ro" whooshsevices@gmail.com',
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
      MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
        console.log("Connected for change password");
        if(err)
          console.log(err);
        var dbase = db.db("whoosh");
    
        try {
          const results = dbase.collection('users').find().toArray(function(err, result) {
            if (result.length > 0) {
              var oldUser =  result.filter(x => x.email === req.body.email);
              const user = {
                first_name: oldUser[0].first_name,
                last_name: oldUser[0].last_name,
                email: req.body.email,
                password: hash
              };
              try {
                dbase.collection('users').replaceOne( { 'email' : req.body.email}, user );
                res.send({
                  message: "pass was edited successfully."
                });
                
              } catch (e) {
                  console.log(e); 
                  res.status(500).send({
                    message: "Error changing pass for user with email=" + req.body.email
                  });
              }
            }
       });
    
       } catch (e) {
          console.log(e); 
          res.status(500).send({
            message: "Error getting users"
          });
       }
      });
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
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for editing user");
    if(err)
      console.log(err);
    var dbase = db.db("whoosh");

    try {
      dbase.collection('users').replaceOne( { 'email' : req.body.email}, user );
      res.send({
        message: "user was edited successfully."
      });
      
   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error editing user with email=" + req.body.email
      });
   }
  });
}

exports.delete = (req, res) => {
  var users = [];
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db){
    console.log("Connected for deleting user");
    if(err)
      console.log(err);
    var dbase = db.db("whoosh");

    try {
      dbase.collection('users').deleteOne( { 'email' : req.body.email} );
      res.send({
        message: "user was deleted successfully."
      });
      
   } catch (e) {
      console.log(e); 
      res.status(500).send({
        message: "Error deleting user with email=" + req.body.email
      });
   }
  });
}
