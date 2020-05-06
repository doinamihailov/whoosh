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
/*
const Sequelize = require('sequelize');

module.exports = new Sequelize(
    'vat_0_1_dev',
    'amber',
    'XDR%6tfc', {
        host: '109.100.42.38',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            idle: 20000,
            acquire: 20000
        }
    }
);*/