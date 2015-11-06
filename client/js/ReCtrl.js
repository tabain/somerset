angular.module('app').controller('ReCtrl',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http,errors,$timeout) {
        $scope.pagename = 'Returning Guest';
        var Guest = $resource('/guests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});

        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;
        $scope.returningGuest = $rootScope.guest;
        $scope.validLocations = $rootScope.validLocations;
        $scope.validLocations.forEach(function(doc){
           if (doc.id === $scope.returningGuest.locationId){
               $scope.returningGuest.location = doc;
               $scope.lastLocation = $scope.returningGuest.location;
           }
        });

        function focusInput(){
            $('input#ph').focus();
        };


        //function checkFeild (){
        //    if($scope.returningGuest.residentName && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
        //        $('#room').hide();
        //        $('#company').hide();
        //        $('#event').hide();
        //        $('#purposeOfVisit').hide();
        //    }
        //    else if ($scope.returningGuest.roomNo && $scope.returningGuest.residentName === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
        //        $('#resident').hide();
        //        $('#company').hide();
        //        $('#event').hide();
        //        $('#purposeOfVisit').hide();
        //    } else if ($scope.returningGuest.company && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#event').hide();
        //        $('#purposeOfVisit').hide();
        //    }else if ($scope.returningGuest.event && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.purposeOfVisit === ''){
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#company').hide();
        //        $('#purposeOfVisit').hide();
        //    }else if ($scope.returningGuest.purposeOfVisit && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === ''){
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#company').hide();
        //        $('#event').hide();
        //    }
        //
        //}


        //
        //$rootScope.returningGuest = false;

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else if (err.status == 400)
                toaster.error(errors.BAD);
            else
                toaster.error(errors.UNKNOWN);
        };

        //$scope.$watch('returningGuest.residentName',function(){
        //    if(!$scope.returningGuest.residentName || $scope.returningGuest.residentName === undefined || $scope.returningGuest.residentName ==='') {
        //        $('#room').show();
        //        $('#company').show();
        //        $('#event').show();
        //        $('#purposeOfVisit').show();
        //    }
        //    else{
        //        $('#room').hide();
        //        $('#company').hide();
        //        $('#event').hide();
        //        $('#purposeOfVisit').hide();
        //
        //    }
        //
        //});
        //$scope.$watch('returningGuest.roomNo',function(){
        //    if(!$scope.returningGuest.roomNo || $scope.returningGuest.roomNo === undefined || $scope.returningGuest.roomNo === ''){
        //        $('#resident').show();
        //        $('#company').show();
        //        $('#event').show();
        //        $('#purposeOfVisit').show();
        //    }else{
        //        $('#event').hide();
        //        $('#resident').hide();
        //        $('#company').hide();
        //        $('#purposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('returningGuest.company',function(){
        //    if(!$scope.returningGuest.company || $scope.returningGuest.company === undefined || $scope.returningGuest.company === ''){
        //        $('#resident').show();
        //        $('#room').show();
        //        $('#event').show();
        //        $('#purposeOfVisit').show();
        //
        //    }else{
        //        $('#event').hide();
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#purposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('returningGuest.event',function(){
        //
        //    if(!$scope.returningGuest.event || $scope.returningGuest.event === undefined || $scope.returningGuest.event === ''){
        //        $('#resident').show();
        //        $('#room').show();
        //        $('#company').show();
        //        $('#purposeOfVisit').show();
        //
        //    }else{
        //        $('#company').hide();
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#purposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('returningGuest.purposeOfVisit',function(){
        //
        //    if(!$scope.returningGuest.purposeOfVisit || $scope.returningGuest.purposeOfVisit === undefined || $scope.returningGuest.purposeOfVisit === ''){
        //        $('#resident').show();
        //        $('#room').show();
        //        $('#company').show();
        //        $('#event').show();
        //
        //    }else{
        //        $('#company').hide();
        //        $('#resident').hide();
        //        $('#room').hide();
        //        $('#event').hide();
        //    }
        //
        //});
        //


        $scope.submitForm = function (isValid) {
            if (isValid) {
                $scope.validLocations.forEach(function(doc){
                   if (doc.id ===  $scope.returningGuest.location.id){
                       $scope.returningGuest.locationId = doc.id;

                   }
                });
                if (!$scope.returningGuest.residentName && !$scope.returningGuest.roomNo && !$scope.returningGuest.company && !$scope.returningGuest.event && !$scope.returningGuest.purposeOfVisit) return toaster.error(errors.BAD_RESIDENT_Room_company_event);
                if (!$scope.returningGuest.whoAreYou && $scope.returningGuest.company) return toaster.error(errors.BAD_whoAreYou);
                $scope.returningGuest.type = types[2];
                $scope.returningGuest.plus18 = !$scope.returningGuest.under18;
                if($scope.returningGuest.phone.charAt(0)!='+') $scope.returningGuest.phone = '+'+$scope.returningGuest.phone;
                $scope.returningGuest.plus18 = !$scope.guest.under18;
                if($scope.returningGuest.phone.charAt(0)!='+') $scope.returningGuest.phone = '+'+$scope.returningGuest.phone;

                $http.
                    post('/visits',$scope.returningGuest

                    )
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
                        toaster.error(err);
                    });
            }

            else{

            }


        };

        $scope.submiting = function(){

            $scope.returningGuest.type = types[2];
            $scope.returningGuest.plus18 = !$scope.returningGuest.under18;
            if($scope.returningGuest.phone.charAt(0)!='+') $scope.returningGuest.phone = '+'+$scope.returningGuest.phone;
            $scope.returningGuest.plus18 = !$scope.guest.under18;
            if($scope.returningGuest.phone.charAt(0)!='+') $scope.returningGuest.phone = '+'+$scope.returningGuest.phone;

            new Guest($scope.returningGuest).$save(function (data, headers) {
                $rootScope.lastGuest = data;
                $location.path('/welcome');

            }, function (err) {
                // TODO: Create Error Translator on Server and add helpful errors here
                showError(err);
            });

        };

        $scope.submitFormreturning = function(isValid){


            if (isValid) {
                $scope.submiting();


            }
            else{

                if (!$scope.$$childHead) {
                    toaster.error(errors.RELOAD);
                } else {
                    $scope.$$childHead.guestForm.name.$pristine = false;
                    $scope.$$childHead.guestForm.residentName.$pristine = false;
                    $scope.$$childHead.guestForm.email.$pristine = false;
                    $scope.$$childHead.guestForm.phone.$pristine = false;
                    if ($scope.$$childHead.guestForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.guestForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.guestForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.guestForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }


            }

        };

    $scope.eventshow = function(){
        if ($scope.returningGuest.event && $scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.purposeOfVisit === ''){
            return true;
        }else if($scope.returningGuest.event === ''  && $scope.returningGuest.residentName  === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.purposeOfVisit === '') {return true;}
    }; $scope.residentshow = function(){
        if($scope.returningGuest.residentName && $scope.returningGuest.roomNo === ''&& $scope.returningGuest.whoAreYou === '' &&  $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
                return true;
        }else if($scope.returningGuest.residentName === undefined ||($scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === ''  && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === '')) {return true;}
    }; $scope.companyshow = function(){
        if ($scope.returningGuest.company && $scope.returningGuest.whoAreYou && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
                return true;
        }
        else if($scope.returningGuest.company === ''  && $scope.returningGuest.whoAreYou === ''  && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === '')
        {
            return true;
        }
        else if($scope.returningGuest.company === ''  && $scope.returningGuest.whoAreYou )
        {
            return true;
        }
        else if($scope.returningGuest.company && $scope.returningGuest.whoAreYou  === '' )
        {
            return true;
        }
    };$scope.whorushow = function(){
        if ($scope.returningGuest.company && $scope.returningGuest.whoAreYou && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === ''){
                return true;
        }
        else if($scope.returningGuest.company === ''  && $scope.returningGuest.whoAreYou === ''  && $scope.returningGuest.residentName === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === '')
        {
            return true;
        }
        else if($scope.returningGuest.company === ''  && $scope.returningGuest.whoAreYou )
        {
            return true;
        }
        else if($scope.returningGuest.company && $scope.returningGuest.whoAreYou  === '' )
        {
            return true;
        }
    }; $scope.roomshow = function(){
       if ($scope.returningGuest.roomNo && $scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === '')
       {
                return true;
        }
       else if($scope.returningGuest.roomNo === '' && $scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '' && $scope.returningGuest.purposeOfVisit === '') {return true;}
    };$scope.purposeOfVisitshow = function(){
        if ($scope.returningGuest.purposeOfVisit && $scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === ''){
                return true;
        }else if($scope.returningGuest.purposeOfVisit === '' && $scope.returningGuest.residentName === '' && $scope.returningGuest.whoAreYou === '' && $scope.returningGuest.roomNo === '' && $scope.returningGuest.company === '' && $scope.returningGuest.event === '') {return true;}
    };
    //$timeout(function(){
    //    checkFeild();
    //},1000);
        $timeout(function(){
            focusInput();
        },200);
    });