const Sequelize = require('sequelize')
const seq = new Sequelize(
    'users',
    'root',
    'parola123', {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        //logging: false
    }
)
module.exports = seq;