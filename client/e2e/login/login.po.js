var LoginPage = function() {
    this.email = element(by.model('admin.email'));
    this.password = element(by.model('admin.password'));
    this.emailError = $('#adminEmail p');
    this.passwordError = $('#adminPassword p');
    this.adminSubtmit = $('#adminSubmit button');
    this.get = function() {
        browser.get('/#!/login/');
    };
    this.setEmail = function(email) {
        this.email.sendKeys(email, protractor.Key.ENTER);
    };
    this.setPassword = function(pass) {
        this.password.sendKeys(pass, protractor.Key.ENTER);
    };


};

module.exports = LoginPage;
