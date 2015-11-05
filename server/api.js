var api = require('express')();
var newGuests = require('./controllers/newGuests');
var locations = require('./controllers/locations');

api.get('/newGuests', newGuests.getGuest);
api.post('/newGuests', newGuests.createGuest);
api.get('/locations', locations.getLocations);

module.exports = api;