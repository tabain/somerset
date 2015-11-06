app.directive('intlTelInput', function($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope,element,attrs,ngModel){
            var handleWhatsSupposedToBeAnArray, options, watchOnce;
            var read = function() {
                var inputValue = element.val();
                ngModel.$setViewValue(inputValue);
            };
            handleWhatsSupposedToBeAnArray = function(value) {
                if (value instanceof Array) {
                    return value;
                } else {
                    return value.toString().replace(/[ ]/g, '').split(',');
                }
            };
            element.intlTelInput({
                autoFormat: true,
                autoHideDialCode: true,
                defaultCountry: 'gb',
                nationalMode: false,
                numberType: '',
                onlyCountries: void 0,
                preferredCountries: ['us', 'gb'],
                responsiveDropdown: true,
                utilsScript: "/lib/intl-tel-input/lib/libphonenumber/build/utils.js"
            });



            ngModel.$formatters.push(function(value) {
                if (!value) {
                    return value;
                } else {
                    $timeout(function() {
                        return element.intlTelInput('setNumber', value);
                    }, 0);
                    return element.val();
                }
            });
            ngModel.$parsers.push(function(value) {
                if (!value) {
                    return value;
                }
                return value.replace(/[^\d]/g, '');
            });
            element.on('focus blur keyup change', function() {
                scope.$apply(read);
            });
            read();
        }
    };
});