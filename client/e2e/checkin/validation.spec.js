var CheckInPage = require('./checkin.po.js');
var fs = require('fs');

describe('Check In', function () {
    var page = new CheckInPage();

    it('should have a wrong field', function () {
        expect(page.name.getText()).toEqual('');
        page.setName('Tabain');
        page.setEmail('tabain@,,.com');
        page.setPhone('123456');
        page.setResident('Shamraiz');
        page.setSendPromotion(true);
        expect(page.name.getAttribute('value')).toEqual('Tabain');
        expect(page.email.getAttribute('value')).toEqual('tabain@,,.com');
        expect(page.phone.getAttribute('value')).toEqual('123456');
        expect(page.resident.getAttribute('value')).toEqual('Shamraiz');
        expect(page.sendPromotions.getAttribute('value')).toBeTruthy();
        expect(page.nameError.isDisplayed()).toBeTruthy();
        expect(page.emailError.isDisplayed()).toBeTruthy();
        expect(page.phoneError.isDisplayed()).toBeTruthy();
        expect(page.residentError.isDisplayed()).toBeTruthy();
        expect(page.buttonPost.isEnabled()).toBe(false);
        browser.takeScreenshot().then(function(png) {
            var stream = fs.createWriteStream(".tmp/checkinError-ss.png");
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });

    });
    it('should have a correct field', function () {
        page.name.clear();
        page.email.clear();
        page.phone.clear();
        page.resident.clear();;
        expect(page.name.getText()).toEqual('');
        expect(page.email.getText()).toEqual('');
        expect(page.phone.getText()).toEqual('');
        expect(page.resident.getText()).toEqual('');
        page.setName('Tabain Akhtar');
        page.setEmail('tabain@erlystage.com');
        page.setPhone('123456555');
        page.setResident('Shamraiz akhtar');
        page.setSendPromotion(true);
        expect(page.name.getAttribute('value')).toEqual('Tabain Akhtar');
        expect(page.email.getAttribute('value')).toEqual('tabain@erlystage.com');
        expect(page.phone.getAttribute('value')).toEqual('123456555');
        expect(page.resident.getAttribute('value')).toEqual('Shamraiz akhtar');
        expect(page.sendPromotions.getAttribute('value')).toBeTruthy();;
        expect(page.nameError.isDisplayed()).toBe(false);
        expect(page.emailError.isDisplayed()).toBe(false);
        expect(page.phoneError.isDisplayed()).toBe(false);
        expect(page.residentError.isDisplayed()).toBe(false);
        expect(page.buttonPost.isEnabled());
        browser.takeScreenshot().then(function(png) {
            var stream = fs.createWriteStream(".tmp/checkinSuccess-ss.png");
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });
    });

});
