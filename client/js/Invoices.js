angular.module('app').controller('Invoices',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.invoices = [];
        list = function(){
            $http.get('/invoices')
                .success(function (data, headers){
                    if (data) {
                        $scope.invoices = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };

        list();


        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };
    });



