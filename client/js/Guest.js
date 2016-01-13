angular.module('app').controller('Guest',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {

        $scope.guest = {};
        $scope.member = {};
        if ($rootScope.member){
            $scope.member = $rootScope.member;

        }
        if (!$rootScope.member) $location.path('/');

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };
        $scope.submitForm = function(isValid){
            if (isValid){
                var obj = {
                    name: $scope.guest.name,
                    phone: $scope.guest.phone,
                    email: $scope.guest.email,
                    sendPromotions: $scope.guest.sendPromotions,
                    wing : $scope.member.wing.id,
                    location : $scope.member.location.id,
                    room : $scope.member.room.id,
                    organisation : $scope.member.organisation.id,
                    member : $scope.member.id
                };
                if ($scope.guest.mobile) obj.mobile = $scope.guest.mobile;
                if ($scope.guest.age) obj.age = $scope.guest.age;
                $http
                    .post('/clients', obj)
                    .success(function(data){
                        toaster.success(data);
                        $rootScope.lastGuest = data;
                        $location.path('/welcome');
                    }).error(function(err){showError(err);})

            }

        };


    });