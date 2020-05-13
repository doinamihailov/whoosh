const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
/*
const server = require("http").createServer();
const io = require("socket.io")(server);
*/
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
/*
io.on("connection", socket => {
    const { id } = socket.client;
    console.log(`User connected: ${id}`);
    socket.on("chat message", msg => {
      console.log(`${id}: ${msg}`);
    });
  });
*/

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3030 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

require("./routes/user.routes")(app);
module.exports = app;