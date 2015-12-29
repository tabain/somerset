angular.module('app').controller('Guest',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {
        $scope.guest = {};
        $scope.member = {};
        if ($rootScope.member){
            $scope.member = $rootScope.member;

        }


    });