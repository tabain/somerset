angular.module('app').controller('StudentOtherCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Student - Other Property';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});

        $scope.studentOtherGuest = {};
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.studentOtherGuest.sendPromotions = true;

        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;

        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.studentOtherGuest.location = obj;
        if ($scope.studentOtherGuest.location== "undefined" || $scope.studentOtherGuest.location== "null" || $scope.studentOtherGuest.location === null) $scope.studentOtherGuest.location= $scope.vaildLocations[0];
        else if($scope.studentOtherGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.studentOtherGuest.location.id == $scope.vaildLocations[l].id) $scope.studentOtherGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('studentOtherGuest.location', function () {
            var str = JSON.stringify($scope.studentOtherGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });

        $scope.$watch('studentOtherGuest.residentName',function(){
            $('#roomstudentOther input').prop( "disabled", true );
            if(!$scope.studentOtherGuest.residentName || $scope.studentOtherGuest.residentName === undefined) {
                $('#roomstudentOther').show();
                $('#roomstudentOther input').prop( "disabled", false );
            }
            else{
                $('#roomstudentOther').hide();

            }

        });
        $scope.$watch('studentOtherGuest.roomNo',function(){
            $('#residentstudentOther input').prop( "disabled", true );
            if(!$scope.studentOtherGuest.roomNo || $scope.studentOtherGuest.roomNo === undefined){
                $('#residentstudentOther').show();
                $('#residentstudentOther input').prop( "disabled", false );
            }else{
                $('#residentstudentOther').hide();
            }

        });



        $scope.submitForm = function (isValid) {
            if (isValid) {
                if (!$scope.studentOtherGuest.residentName && !$scope.studentOtherGuest.roomNo) return toaster.error(errors.BAD_RESIDENT_Room);
                $scope.studentOtherGuest.type = types[7];
                $scope.studentOtherGuest.plus18 = !$scope.studentOtherGuest.under18;
                if($scope.studentOtherGuest.phone.charAt(0)!='+') $scope.studentOtherGuest.phone = '+'+$scope.studentOtherGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.studentOtherGuest.name,
                        locationId: $scope.studentOtherGuest.location.id,
                        roomNo: $scope.studentOtherGuest.roomNo|| '',
                        residentName: $scope.studentOtherGuest.residentName|| '',
                        email: $scope.studentOtherGuest.email,
                        phone: $scope.studentOtherGuest.phone,
                        type: $scope.studentOtherGuest.type,
                        sendPromotions: $scope.studentOtherGuest.sendPromotions || false
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
                    $scope.$$childHead.studentOtherForm.name.$pristine = false;
                    $scope.$$childHead.studentOtherForm.residentName.$pristine = false;
                    $scope.$$childHead.studentOtherForm.email.$pristine = false;
                    $scope.$$childHead.studentOtherForm.phone.$pristine = false;
                    if ($scope.$$childHead.studentOtherForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.studentOtherForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.studentOtherForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.studentOtherForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });