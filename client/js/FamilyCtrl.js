angular.module('app').controller('FamilyCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Family Member';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});

        $scope.familyGuest = {};
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.familyGuest.sendPromotions = true;

        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;

        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.familyGuest.location = obj;
        if ($scope.familyGuest.location== "undefined" || $scope.familyGuest.location== "null" || $scope.familyGuest.location === null) $scope.familyGuest.location= $scope.vaildLocations[0];
        else if($scope.familyGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.familyGuest.location.id == $scope.vaildLocations[l].id) $scope.familyGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('familyGuest.location', function () {
            var str = JSON.stringify($scope.familyGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });

        $scope.$watch('familyGuest.residentName',function(){
            $('#roomFamily input').prop( "disabled", true );
            if(!$scope.familyGuest.residentName || $scope.familyGuest.residentName === undefined) {
                $('#roomFamily').show();
                $('#roomFamily input').prop( "disabled", false );
            }
            else{
                $('#roomFamily').hide();

            }

        });
        $scope.$watch('familyGuest.roomNo',function(){
            $('#residentFamily input').prop( "disabled", true );
            if(!$scope.familyGuest.roomNo || $scope.familyGuest.roomNo === undefined){
                $('#residentFamily').show();
                $('#residentFamily input').prop( "disabled", false );
            }else{
                $('#residentFamily').hide();
            }

        });


        $scope.submitForm = function (isValid) {
            if (isValid) {
                if (!$scope.familyGuest.residentName && !$scope.familyGuest.roomNo) return toaster.error(errors.BAD_RESIDENT_Room);
                $scope.familyGuest.type = types[4];
                $scope.familyGuest.plus18 = !$scope.familyGuest.under18;
                if($scope.familyGuest.phone.charAt(0)!='+') $scope.familyGuest.phone = '+'+$scope.familyGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.familyGuest.name,
                        locationId: $scope.familyGuest.location.id,
                        roomNo: $scope.familyGuest.roomNo|| '',
                        residentName: $scope.familyGuest.residentName|| '',
                        email: $scope.familyGuest.email,
                        phone: $scope.familyGuest.phone,
                        type: $scope.familyGuest.type,
                        sendPromotions: $scope.familyGuest.sendPromotions || false
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
                    $scope.$$childHead.familyForm.name.$pristine = false;
                    $scope.$$childHead.familyForm.residentName.$pristine = false;
                    $scope.$$childHead.familyForm.email.$pristine = false;
                    $scope.$$childHead.familyForm.phone.$pristine = false;
                    if ($scope.$$childHead.familyForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.familyForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.familyForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.familyForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });