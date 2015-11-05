/**
 * Instance of logger that is configured here rather then providing a config file. So that it can be required anywhere in the project to stream.
 * There are following approaches to this
 *
 * 1. Make it dependent on config so that express can configure it and pass it down to all middleware for usage. Probably replace console.
 * 2. Let each file(non test) require it and use it.
 */


'use strict';
var config = require('./config');
var winston = require('winston');
winston.emitErrs = true;

var fs = require('fs');

if (!fs.existsSync('./bin')) {
    fs.mkdirSync('./bin');
}

if (!fs.existsSync('./bin/logs')) {
    fs.mkdirSync('./bin/logs');
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'verbose',
            filename: './bin/logs/all-logs.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};