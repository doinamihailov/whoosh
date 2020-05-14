const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');

app.use(require('express').static(path.join(__dirname, 'build')));
app.use(fileUpload());
var cors = require('cors');
app.use(cors());
app.use(function (err, req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type, Accept, Authorization');
    next();
})
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));
app.use(bodyParser.json());
app.use(logger('dev'));

require("./websocket/websocket")(app);
require("./routes/user.routes")(app);
module.exports = app;