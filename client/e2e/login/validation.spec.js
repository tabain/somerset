var LoginPage = require('./login.po.js');
var fs = require('fs');

describe('Login In', function () {
    var pagelogin = new LoginPage();

    it('should have a wrong field', function () {
        pagelogin.get();
        expect(pagelogin.email.getText()).toEqual('');
        expect(pagelogin.password.getText()).toEqual('');
        pagelogin.setEmail('tabain@,,.com');
        pagelogin.setPassword('57785');
        expect(pagelogin.email.getAttribute('value')).toEqual('tabain@,,.com');
        expect(pagelogin.password.getAttribute('value')).toEqual('57785');
        expect(pagelogin.emailError.isDisplayed()).toBeTruthy();
        expect(pagelogin.passwordError.isDisplayed()).toBeTruthy();
        expect(pagelogin.adminSubtmit.isEnabled()).toBe(false);
        browser.takeScreenshot().then(function(png) {
            var stream = fs.createWriteStream(".tmp/loginError-ss.png");
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });

    });
    it('should have a correct field', function () {
        pagelogin.get();
        expect(pagelogin.email.getText()).toEqual('');
        expect(pagelogin.password.getText()).toEqual('');
        pagelogin.setEmail('tabain@erlystage.com');
        pagelogin.setPassword('tabaintab');
        expect(pagelogin.email.getAttribute('value')).toEqual('tabain@erlystage.com');
        expect(pagelogin.password.getAttribute('value')).toEqual('tabaintab');
        expect(pagelogin.emailError.isDisplayed()).toBe(false);
        expect(pagelogin.passwordError.isDisplayed()).toBe(false);
        expect(pagelogin.adminSubtmit.isEnabled()).toBe(true);
        pagelogin.adminSubtmit.click();
        browser.takeScreenshot().then(function(png) {
            var stream = fs.createWriteStream(".tmp/loginError-ss.png");
            stream.write(new Buffer(png, 'base64'));
            stream.end();
        });

    });



});
