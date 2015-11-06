var CheckInPage = function() {
    this.name = element(by.model('guest.name'));
    this.resident = element(by.model('guest.residentName'));
    this.email = element(by.model('guest.email'));
    this.phone = element(by.model('guest.phone'));
    this.sendPromotions = element(by.model('guest.sendPromotions'));
    this.nameError = $('#name p');
    this.emailError = $('#email p');
    this.phoneError = $('#phone p');
    this.residentError = $('#resident p');
    this.sendPromotionsError = $('#promotions p');
    this.buttonPost = $('#submit button');
    //this.email = element(by.binding('guest.email'));
this.get = function() {
        browser.get('/#!/');
    };
    this.setName = function(name) {
        this.name.sendKeys(name, protractor.Key.ENTER);
    };
    this.setEmail = function(email) {
        this.email.sendKeys(email, protractor.Key.ENTER);
    };
    this.setPhone = function(phone) {
        this.phone.sendKeys(phone, protractor.Key.ENTER);
    };
    this.setSendPromotion = function(sp) {
        this.sendPromotions.sendKeys(sp, protractor.Key.ENTER);
    };
    this.setResident = function(resident) {
        this.resident.sendKeys(resident, protractor.Key.ENTER);
    };

};

module.exports = CheckInPage;
