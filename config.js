const event = require('events');

module.exports = {
    port: 5000,
    event: new event.EventEmitter()
}