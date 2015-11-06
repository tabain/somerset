angular.module('app').controller('StudentCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Student Visitor';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});
        $scope.studentGuest = {};
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.studentGuest.sendPromotions = true;

        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;
        $scope.inputDisabledResident = false;
        $scope.inputDisabledRoom = false;
        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.studentGuest.location = obj;
        if ($scope.studentGuest.location== "undefined" || $scope.studentGuest.location== "null" || $scope.studentGuest.location === null) $scope.studentGuest.location= $scope.vaildLocations[0];
        else if($scope.studentGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.studentGuest.location.id == $scope.vaildLocations[l].id) $scope.studentGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('studentGuest.location', function () {
            var str = JSON.stringify($scope.studentGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });

        $scope.$watch('studentGuest.residentName',function(){
            $('#roomStudent input').prop( "disabled", true );
            if(!$scope.studentGuest.residentName || $scope.studentGuest.residentName === undefined) {
                $('#roomStudent').show();
                $scope.inputDisabledRoom = false;
                $('#roomStudent input').prop( "disabled", false );
            }
            else{
                $('#roomStudent').hide();

            }

        });
        $scope.$watch('studentGuest.roomNo',function(){
            $('#residentStudent input').prop( "disabled", true );
            if(!$scope.studentGuest.roomNo || $scope.studentGuest.roomNo === undefined){
                $('#residentStudent').show();
                $('#residentStudent input').prop( "disabled", false );
            }else{
                $('#residentStudent').hide();
            }

        });
        $scope.submitForm = function (isValid) {
            if (isValid) {
                if (!$scope.studentGuest.residentName && !$scope.studentGuest.roomNo) return toaster.error(errors.BAD_RESIDENT_Room);
                $scope.studentGuest.type = types[1];
                $scope.studentGuest.plus18 = !$scope.studentGuest.under18;
                if($scope.studentGuest.phone.charAt(0)!='+') $scope.studentGuest.phone = '+'+$scope.studentGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.studentGuest.name,
                        locationId: $scope.studentGuest.location.id,
                        roomNo: $scope.studentGuest.roomNo|| '',
                        residentName: $scope.studentGuest.residentName|| '',
                        email: $scope.studentGuest.email,
                        phone: $scope.studentGuest.phone,
                        type: $scope.studentGuest.type ,
                        sendPromotions: $scope.studentGuest.sendPromotions || false

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
                    $scope.$$childHead.studentForm.name.$pristine = false;
                    $scope.$$childHead.studentForm.residentName.$pristine = false;
                    $scope.$$childHead.studentForm.email.$pristine = false;
                    $scope.$$childHead.studentForm.phone.$pristine = false;
                    if ($scope.$$childHead.studentForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.studentForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.studentForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.studentForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });