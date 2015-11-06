angular.module('app').controller('OtherCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.pagename = 'Other Visitor';
        var Guest = $resource('/newGuests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});
        $scope.otherGuest = {};
        $scope.vaildLocations = $rootScope.validLocations;
        $scope.otherGuest.sendPromotions = true;

        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;
        $scope.purposeOfVisit = /^[a-zA-Z0-9 .'-]{1,50}/;

        var obj = JSON.parse($window.localStorage.getItem('guest_locationStorage'));
        $scope.otherGuest.location = obj;
        if ($scope.otherGuest.location== "undefined" || $scope.otherGuest.location== "null" || $scope.otherGuest.location === null) $scope.otherGuest.location= $scope.vaildLocations[0];
        else if($scope.otherGuest.location){
            for(var l=0; l < $scope.vaildLocations.length; l++){
                if($scope.otherGuest.location.id == $scope.vaildLocations[l].id) $scope.otherGuest.location = $scope.vaildLocations[l];
            }

        }

        $scope.$watch('otherGuest.location', function () {
            var str = JSON.stringify($scope.otherGuest.location);
            $window.localStorage.setItem('guest_locationStorage', str);
        });

        $scope.$watch('otherGuest.residentName',function(){
            $('#roomFamily input').prop( "disabled", true );
            if(!$scope.otherGuest.residentName || $scope.otherGuest.residentName === undefined) {
                $('#roomOther').show();
                $('#roomOther input').prop( "disabled", false );
            }
            else{
                $('#roomOther').hide();

            }

        });
        $scope.$watch('otherGuest.roomNo',function(){
            $('#residentOther input').prop( "disabled", true );
            if(!$scope.otherGuest.roomNo || $scope.otherGuest.roomNo === undefined){
                $('#residentOther').show();
                $('#residentOther input').prop( "disabled", false );
            }else{
                $('#residentOther').hide();
            }

        });



        $scope.submitForm = function (isValid) {
            if (isValid) {
                $scope.otherGuest.type = types[5];
                $scope.otherGuest.plus18 = !$scope.otherGuest.under18;
                if($scope.otherGuest.phone.charAt(0)!='+') $scope.otherGuest.phone = '+'+$scope.otherGuest.phone;
                $http.
                    post('/newGuests', {
                        name: $scope.otherGuest.name,
                        locationId: $scope.otherGuest.location.id,
                        roomNo: $scope.otherGuest.roomNo|| '',
                        residentName: $scope.otherGuest.residentName|| '',
                        purposeOfVisit: $scope.otherGuest.purposeOfVisit|| '',
                        email: $scope.otherGuest.email,
                        phone: $scope.otherGuest.phone,
                        type: $scope.otherGuest.type,
                        sendPromotions: $scope.otherGuest.sendPromotions || false
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
                    $scope.$$childHead.otherForm.name.$pristine = false;
                    $scope.$$childHead.otherForm.residentName.$pristine = false;
                    $scope.$$childHead.otherForm.email.$pristine = false;
                    $scope.$$childHead.otherForm.phone.$pristine = false;
                    if ($scope.$$childHead.otherForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.otherForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.otherForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.otherForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };



    });