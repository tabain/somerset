var bodyParser = require('body-parser');
var express = require('express');
var config = require('../config/config');
var db = require('../config/db');
var logger = require('../config/logger');

var session = require('express-session');
var api = require('./api');
var website = require('./website');


var app = express();

logger.debug("Overriding 'Express' logger");
app.set('trust proxy', true);
app.set('x-powered-by', false);

app.use(require('morgan')('dev', {"stream": logger.stream}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//app.use(multer({ dest: './bin/uploads/'}))
//app.set('views', config.rootPath + 'server/views');
//app.set('view engine', 'jade');

app.use('/api', api);
// TODO: Check if api does not call website after it.
// TODO: API should returns its own four oh four in json
app.use('/', website);

app.listen(config.port);
console.log('Listening on port ' + config.port + '...');


