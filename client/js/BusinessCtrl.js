angular.module('app').controller('BusinessCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Business Partner';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});
        $scope.businessGuest = {};
        $scope.businessGuest.sendPromotions = true;
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.lastLocation = $scope.vaildLocations[0].name;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;

        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.businessGuest.location = obj;
        if ($scope.businessGuest.location== "undefined" || $scope.businessGuest.location== "null" || $scope.businessGuest.location === null) $scope.businessGuest.location= $scope.vaildLocations[0];
        else if($scope.businessGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.businessGuest.location.id == $scope.vaildLocations[l].id) $scope.businessGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('businessGuest.location', function () {
            var str = JSON.stringify($scope.businessGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });

        $scope.submitForm = function (isValid) {
            if (isValid) {

                $scope.businessGuest.type = types[6];
                $scope.businessGuest.plus18 = !$scope.businessGuest.under18;
                if($scope.businessGuest.phone.charAt(0)!='+') $scope.businessGuest.phone = '+'+$scope.businessGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.businessGuest.name,
                        locationId: $scope.businessGuest.location.id,
                        roomNo: $scope.businessGuest.roomNo|| '',
                        residentName: $scope.businessGuest.residentName|| '',
                        company: $scope.businessGuest.company|| '',
                        whoAreYou: $scope.businessGuest.whoAreYou|| '',
                        email: $scope.businessGuest.email,
                        phone: $scope.businessGuest.phone,
                        type: $scope.businessGuest.type,
                        sendPromotions: $scope.businessGuest.sendPromotions || false
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
                    $scope.$$childHead.businessForm.name.$pristine = false;
                    $scope.$$childHead.businessForm.residentName.$pristine = false;
                    $scope.$$childHead.businessForm.email.$pristine = false;
                    $scope.$$childHead.businessForm.phone.$pristine = false;
                    if ($scope.$$childHead.businessForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.businessForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.businessForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.businessForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });