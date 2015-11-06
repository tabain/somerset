angular.module('app').controller('EventCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Event Guest';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});

        $scope.eventGuest = {};
        $scope.eventGuest.sendPromotions = true;
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.lastLocation = $scope.vaildLocations[0].name;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;

        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.eventGuest.location = obj;
        if ($scope.eventGuest.location== "undefined" || $scope.eventGuest.location== "null" || $scope.eventGuest.location === null) $scope.eventGuest.location= $scope.vaildLocations[0];
        else if($scope.eventGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.eventGuest.location.id == $scope.vaildLocations[l].id) $scope.eventGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('eventGuest.location', function () {
            var str = JSON.stringify($scope.eventGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });


        $scope.submitForm = function (isValid) {
            if (isValid) {

                $scope.eventGuest.type = types[3];
                $scope.eventGuest.plus18 = !$scope.eventGuest.under18;
                if($scope.eventGuest.phone.charAt(0)!='+') $scope.eventGuest.phone = '+'+$scope.eventGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.eventGuest.name,
                        locationId: $scope.eventGuest.location.id,
                        roomNo: $scope.eventGuest.roomNo|| '',
                        residentName: $scope.eventGuest.residentName|| '',
                        event: $scope.eventGuest.event|| '',
                        email: $scope.eventGuest.email,
                        phone: $scope.eventGuest.phone,
                        type: $scope.eventGuest.type,
                        sendPromotions: $scope.eventGuest.sendPromotions || false
                    })
                    .success(function(data, status, headers, config){
                        $rootScope.lastGuest = data;
                        if ($rootScope.currentUser === undefined || !$rootScope.currentUser || $rootScope.currentUser === null) {
                            $location.path('/welcome');
                        }
                        else if ($rootScope.currentUser.role == 'frontdesk' || $rootScope.currentUser.role == 'admin'){
                            $location.path('/frontdesk');
                        }
                    })
                    .error(function(err){
                        if (err.details) {
                            toaster.error(err.details[0].message);

                        }
                        else if (err.errors){
                            if (err.errors.phone && err.errors.email) return toaster.error(errors.BAD_EMAIL_PHONE_USE);
                            if (err.errors.email) return toaster.error(errors.BAD_EMAIL_USE);
                            if (err.errors.phone) return toaster.error(errors.BAD_PHONE_USE);


                        }
                    });
            } else {

                if (!$scope.$$childHead) {
                    toaster.error(errors.RELOAD);
                } else {
                    $scope.$$childHead.eventForm.name.$pristine = false;
                    $scope.$$childHead.eventForm.residentName.$pristine = false;
                    $scope.$$childHead.eventForm.email.$pristine = false;
                    $scope.$$childHead.eventForm.phone.$pristine = false;
                    if ($scope.$$childHead.eventForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.eventForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.eventForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.eventForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });