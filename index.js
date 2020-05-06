const app = require('./app');
const { port } = require('./config');
const fs = require('fs');
//const db = require('./db');
//const User = require('./models/User');
/*db.sync().catch(error => {
    console.log(error)
});*/
let port2 = process.env.PORT || port;
app.listen(port2, () => console.log(`started on port ${port2}`));