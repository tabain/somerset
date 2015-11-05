var mongoose = require('mongoose');

mongoose.connect('mongodb://guestappprod:greystar123#234@52.17.62.25:27000,54.77.48.19:27000,54.77.41.107:27000/greystar-prod', function (err) {
    if (err) throw err;
    execute();
});
var G = require('./models/Guest');


var stats = {valid: 0, invalid: 0, total: 0, plus44: 0, inter: 0, mobile: 0};
var contains = function (m, it) {
    return m.indexOf(it) != -1;
};
var insert = function (m, index, string) {
    if (index > 0) return m.substring(0, index) + string + m.substring(index, m.length);
    else return string + m;
};
var formatPhoneNumber = function (p) {
    stats.total++;

    if (p.charAt(0) == '+' && contains(p, ' ')) {
        stats.valid++;
        return p;
    } else if (contains(p, '+44')) {
        stats.plus44++;
        return insert(p, 3, ' ');
    } else if (contains(p, '+')) {
        return insert(p, 3, ' ');
    } else if (p.indexOf('00') == 0) {
        stats.inter++;
        return formatPhoneNumber(p.replace(/^00/, '+'));
    } else if (p.indexOf('0') == 0) {
        stats.mobile++;
        return formatPhoneNumber(p.replace(/^0/, '+44'));
    } else {
        stats.invalid++;
        return p;
    }

};

function execute() {
    G.distinct('phone', {}).then(function (list) {
        list.forEach(function (n) {
            console.log(n + ' --> ' + formatPhoneNumber(n));
        });
        process.exit(0);
    });
}