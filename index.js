const app = require('./app');
const { port } = require('./config');
const fs = require('fs');
let port2 = process.env.PORT || port;
app.listen(port2, () => console.log(`started on port ${port2}`));