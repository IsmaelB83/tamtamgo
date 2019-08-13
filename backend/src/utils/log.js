"use strict";
// Import node modules
const SimpleNodeLogger = require('simple-node-logger');
const Moment = require ('moment');

// Create the logger with the specified configuration
const options = {
    logFilePath:`./logs/error.${Moment().format("YYYYMMDD")}.log`,
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
};

const log = SimpleNodeLogger.createSimpleLogger(options);
log.setLevel('info');

// Export the logger
module.exports = log;