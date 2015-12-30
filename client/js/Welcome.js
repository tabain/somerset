angular.module('app').controller('Welcome',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window,$location) {
        $scope.welcome = {};
        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };
        if ($rootScope.lastGuest){
            $http
                .get('/guests/'+$rootScope.lastGuest.id)
                .success(function(data){
                    $scope.welcome = data;
                })
                .error(function(err){
                    showError(err);
                })
        };
        if (!$rootScope.lastGuest) $location.path('/');


        $scope.checkIn = function(){
            $location.path('/');
        };
    });