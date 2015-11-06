angular.module('app').controller('Frontdesk',
    function ($scope, $http, $interval, toaster, $rootScope, $location, $resource, $window, $timeout) {
        $scope.guests = [];
        $scope.ids = {};
        $scope.guest = {};
        $scope.date = {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        };
        //$scope.date = new Date();
        //$scope.enddate = new Date(new Date().getTime() + 3600 * 1000 * 6);
        $scope.validLocations = $rootScope.validLocations1;
        $scope.validLocationsEdit = $rootScope.validLocations;
        if (!$scope.validLocations) {
            return returningFront();
        }
        function returningFront(){
            $rootScope.frontCrash = true;
            $location.path('/');

        }
        $scope.searchValidLocations = $scope.validLocations;

        $scope.loadingGuests = false;
        $scope.searchLocation = $window.localStorage.getItem('frontdesk_searchLocation1');
        if ($scope.searchLocation == "undefined" || $scope.searchLocation == "null") $scope.searchLocation = null;
        //searchValidLocations.forEach(function(doc, i){
        //   if (doc.name === 'Spitalfields') {
        //       $scope.validLocations.forEach(function(doc2){
        //          if(doc2.name === 'Spitalfields'){
        //              doc.value = doc2.id;
        //              $scope.searchValidLocations.push(doc);
        //          }
        //
        //       });
        //   }else if(doc.name === 'Notting Hill'){
        //       $scope.validLocations.forEach(function(doc2){
        //           if(doc2.name === 'Notting Hill'){
        //               doc.value = doc2.id;
        //               $scope.searchValidLocations.push(doc);
        //           }
        //
        //       });
        //
        //   }else if(doc.name === 'King\'s Cross' || doc.name === 'Kings Cross'  ){
        //       $scope.validLocations.forEach(function(doc2){
        //           if(doc2.name === 'King\'s Cross' || doc2.name === 'Kings Cross'){
        //               doc.value = doc2.id;
        //               $scope.searchValidLocations.push(doc);
        //           }
        //
        //       });
        //
        //   }else if(doc.name === 'All'){
        //       $scope.searchValidLocations.push(doc);
        //   }
        //
        //});



        $scope.validTypes = types;


        $scope.lastLocation = $scope.validLocationsEdit[0];
        $scope.guest.sendPromotions = true;


        //$scope.phonePattern = /^([0-9]{3,4})?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/;//[a-zA-Z.]+ [a-zA-Z.]+
        $scope.print = function () {
            window.print();
        };

        var loadEndTime = 0;
        loadGuests = function () {

            //if (getTime() - loadEndTime < 60000) return;
             if ($scope.loadingGuests) return;
            $scope.loadingGuests = true;

            var url = '/admins/newGuests?limit=250&startdate=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
                '&enddate=' + moment($scope.date.endDate).format("YYYY-MM-DD");
            if ($scope.searchLocation)
                url += '&locationId=' + $scope.searchLocation;
            $http.get(url,{cache: false})
                .success(function (data, headers) {
                    $scope.guests = data;
                    $scope.guests2 = data;
                    $scope.loadingGuests = false;
                    loadEndTime = getTime();
                })
                .error(function (err) {
                    $scope.loadingGuests = false;
                    loadEndTime = getTime();
                    showError(err);
                });
        };

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

        getTime = function () {
            return new Date().getTime();
        };

        //function checkFeild (){
        //    if($scope.guest.residentName && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '' ){
        //        $('#guestRoomNo').hide();
        //        $('#guestCompany').hide();
        //        $('#guestEvent').hide();
        //        $('#guestPurposeOfVisit').hide();
        //    }
        //    else if ($scope.guest.roomNo && $scope.guest.residentName === '' && $scope.guest.company === '' && $scope.guest.event === ''  && $scope.guest.purposeOfVisit === '' ){
        //        $('#guestResidentName').hide();
        //        $('#guestCompany').hide();
        //        $('#guestEvent').hide();
        //        $('#guestPurposeOfVisit').hide();
        //
        //    } else if ($scope.guest.company && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '' ){
        //        $('#guestResidentName').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestEvent').hide();
        //        $('#guestPurposeOfVisit').hide();
        //
        //    }else if ($scope.guest.event && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.purposeOfVisit === '' ){
        //        $('#guestResidentName').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestCompany').hide();
        //        $('#guestPurposeOfVisit').hide();
        //
        //    }else if ($scope.guest.purposeOfVisit && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.event === '' ){
        //        $('#guestResidentName').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestCompany').hide();
        //        $('#guestEvent').hide();
        //
        //    }
        //
        //}

        $('#addGuest').on('hidden.bs.modal', function () {
            for (var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
                if (cs.guestForm) cs.guestForm.$setPristine();
            }
            $('table').removeClass('hideTable');
            $scope.modalshowhide = false;
            $scope.guest = defaultGuest();
        });

        $('#editGuest').on('hidden.bs.modal', function () {
            $scope.modalshowhide = false;
            $('table').removeClass('hideTable');
        });

        $('#editGuest').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
            $('table').addClass('hideTable');
            //checkFeild();
        });

        $('#addGuest').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
            $('table').addClass('hideTable');
            $scope.guest = defaultGuest();
        });

        defaultGuest = function () {
            return {
                name: '',
                email: '',
                phone: '',
                residentName: '',
                sendPromotions: true,
                location: $scope.validLocations[1],
                type: $scope.validTypes[0],
                plus18: true,
                under18: false
            };
        };

        //$scope.addGuest = function () {
        //    $('#addGuest').modal('show');
        //    $scope.guest = defaultGuest();
        //    var Guest = $resource('/admins/guests/:id', {id: '@id'}, {
        //        checkin: {method: 'POST', params: {}, responseType: 'json'}
        //    }, {/*empty options*/});
        //
        //    $scope.submitForm = function (isValid) {
        //
        //        if (isValid) {
        //            $scope.guest.plus18 = !$scope.guest.under18;
        //            if($scope.guest.phone.charAt(0)!='+') $scope.guest.phone = '+'+$scope.guest.phone;
        //            new Guest($scope.guest).$save(function (data, headers) {
        //                $(".modal-backdrop").hide();
        //                $('#addGuest').modal('hide');
        //
        //                // TODO: When Success Reset Form
        //                // TODO: Post Success
        //
        //                $rootScope.lastGuest = data;
        //                var dt = new Date().getTime(),
        //                    odt = $scope.date.startDate.getTime(),
        //                    tdt = $scope.date.endDate.getTime();
        //                if (dt >= odt && dt <= tdt && odt <= tdt) {
        //                    if (data.location == $scope.searchLocation) {
        //                        $scope.guests.push(data);
        //                    }
        //                    else if ($scope.searchLocation === null) {
        //                        $scope.guests.push(data);
        //                    }
        //
        //                }
        //
        //            }, function (err) {
        //                // TODO: Create Error Translator on Server and add helpful errors here
        //                showError(err);
        //
        //            });
        //        } else {
        //            for(var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
        //                if (!cs || !cs.guestForm) {
        //                    // Guest Form dosent exists in this scope
        //                } else {
        //                    cs.guestForm.name.$pristine = false;
        //                    cs.guestForm.residentName.$pristine = false;
        //                    cs.guestForm.email.$pristine = false;
        //                    cs.guestForm.phone.$pristine = false;
        //                    if (cs.guestForm.name.$invalid) {
        //                        toaster.error(errors.BAD_NAME);
        //                    } else if (cs.guestForm.email.$invalid) {
        //                        toaster.error(errors.BAD_RESIDENT);
        //                    } else if (cs.guestForm.phone.$invalid) {
        //                        toaster.error(errors.BAD_PHONE);
        //                    } else if (cs.guestForm.residentName.$invalid) {
        //                        toaster.error(errors.BAD_EMAIL);
        //                    } else {
        //                        toaster.error(errors.BAD);
        //                    }
        //                }
        //            }
        //
        //        }
        //
        //    };
        //};
        $scope.addGuest = function(){
          $location.path('/');
        };
        $scope.reloadPage = function () {
            window.location.reload();
        };

        loadGuests();
        var interval = $interval(loadGuests, 10 * 1000);
        var pageRefresh = $interval($scope.reloadPage, 3 * 60 * 60 * 1000);

        $scope.$watch('date', function () {
            $scope.forceLoadGuests();
        });

        $scope.$watch('searchLocation', function () {
            $window.localStorage.setItem('frontdesk_searchLocation1', $scope.searchLocation);
            $scope.forceLoadGuests();
        });

        $scope.forceLoadGuests = function () {
            loadEndTime = getTime() - 600000;
            loadGuests();
        };

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
            $interval.cancel(pageRefresh);
        });

        $scope.checkInOrCheckOut = function (guest) {
            if (guest.checkedIn && guest.checkedOut) {
                //TODO: throw error in toaster
            } else if (!guest.checkedIn) {
                $scope.updateGuest({id: guest.id, checkIn: true , guestId: guest.guestId});
            } else if (guest.checkedIn && !guest.checkedOut) {
                $scope.updateGuest({id: guest.id, checkOut: true , guestId: guest.guestId});
            }

            $scope.ids[guest.id] = false;

        };

        $scope.togglePromotions = function (guest) {
            $scope.updateGuest({id: guest.id, sendPromotions: guest.sendPromotions ,guestId: guest.guestId});
        };

        $scope.togglePlus18 = function (guest) {
            $scope.updateGuest({id: guest.id, plus18: guest.plus18 ,guestId: guest.guestId});
        };

        $scope.updateGuest = function (guest) {
            $http.put('/admins/newGuests/' + guest.id, guest)
                .success(function (result) {
                    $scope.forceLoadGuests();
                })
                .error(function (err) {
                    showError(err);
                });
        };

        $scope.editGuest = function (guest) {

            $rootScope.editguest = guest;
            $scope.guest = angular.copy(guest);
            $scope.validLocationsEdit.forEach(function(doc){
                if (doc.id === $scope.guest.locationId){
                    //$scope.lastLocation = doc;
                    $scope.guest.location = doc;
                }
            });
            $scope.guest.under18 = !$scope.guest.plus18;
            $timeout(function(){
                $('#edname').focus();
                $('#edphone').focus();
            },200);

            $('#editGuest').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    if (!$scope.guest.residentName && !$scope.guest.roomNo && !$scope.guest.company && !$scope.guest.event && !$scope.guest.purposeOfVisit) return toaster.error(errors.BAD_RESIDENT_Room_company_event);
                    if (!$scope.guest.whoAreYou && $scope.guest.company) return toaster.error(errors.BAD_whoAreYou);

                    $scope.guest.locationId = $scope.guest.location.id;
                    if($scope.guest.phone.charAt(0)!='+') $scope.guest.phone = '+'+$scope.guest.phone;
                    $http.put('/admins/newGuests/' + $scope.guest.id, $scope.guest)
                        .success(function (result) {
                            $scope.forceLoadGuests();
                            $('#editGuest').modal('hide');

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
                        //.error(function (err) {
                        //    showError(err);
                        //});

                }

            };
        };

        $scope.deleteGuest = function (guest) {
            $('#deleteGuest').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/admins/newGuests/' + guest.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.guests.forEach(function (g, i) {
                            if (g.id == guest.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.guests.splice(index, 1);

                        }
                        $('#deleteGuest').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteGuest').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteGuest').modal('hide');
            };
        };

        $scope.reports = function () {
            return '/reports?startdate=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
                '&enddate=' + moment($scope.date.endDate).format("YYYY-MM-DD");
        };

        //$scope.$watch('guest.residentName',function(){
        //    if(!$scope.guest.residentName || $scope.guest.residentName === undefined || $scope.guest.residentName ==='') {
        //        $('#guestRoomNo').show();
        //        $('#guestCompany').show();
        //        $('#guestEvent').show();
        //        $('#guestPurposeOfVisit').show();
        //
        //    }
        //    else{
        //        $('#guestRoomNo').hide();
        //        $('#guestCompany').hide();
        //        $('#guestEvent').hide();
        //        $('#guestPurposeOfVisit').hide();
        //
        //    }
        //
        //});
        //$scope.$watch('guest.roomNo',function(){
        //    if(!$scope.guest.roomNo || $scope.guest.roomNo === undefined || $scope.guest.roomNo === ''){
        //        $('#guestResidentName').show();
        //        $('#guestCompany').show();
        //        $('#guestEvent').show();
        //        $('#guestPurposeOfVisit').show();
        //    }else{
        //        $('#guestEvent').hide();
        //        $('#guestCompany').hide();
        //        $('#guestResidentName').hide();
        //        $('#guestPurposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('guest.company',function(){
        //    if(!$scope.guest.company || $scope.guest.company === undefined || $scope.guest.company === ''){
        //        $('#guestResidentName').show();
        //        $('#guestRoomNo').show();
        //        $('#guestEvent').show();
        //        $('#guestPurposeOfVisit').show();
        //
        //    }else{
        //        $('#guestEvent').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestResidentName').hide();
        //        $('#guestPurposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('guest.event',function(){
        //
        //    if(!$scope.guest.event || $scope.guest.event === undefined || $scope.guest.event === ''){
        //        $('#guestResidentName').show();
        //        $('#guestRoomNo').show();
        //        $('#guestCompany').show();
        //        $('#guestPurposeOfVisit').show();
        //
        //    }else{
        //        $('#guestCompany').hide();
        //        $('#guestResidentName').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestPurposeOfVisit').hide();
        //    }
        //
        //});
        //$scope.$watch('guest.purposeOfVisit',function(){
        //
        //    if(!$scope.guest.purposeOfVisit || $scope.guest.purposeOfVisit === undefined || $scope.guest.purposeOfVisit === ''){
        //        $('#guestResidentName').show();
        //        $('#guestRoomNo').show();
        //        $('#guestCompany').show();
        //        $('#guestEvent').show();
        //
        //    }else{
        //        $('#guestCompany').hide();
        //        $('#guestResidentName').hide();
        //        $('#guestRoomNo').hide();
        //        $('#guestEvent').hide();
        //    }
        //
        //});



        $scope.eventshow = function(){
            if ($scope.guest.event && $scope.guest.residentName === '' && $scope.guest.whoAreYou === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.purposeOfVisit === ''){
                return true;
            }else if($scope.guest.event === ''  && $scope.guest.residentName  === '' && $scope.guest.whoAreYou === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.purposeOfVisit === '') {return true;}
        }; $scope.residentshow = function(){
            if($scope.guest.residentName && $scope.guest.roomNo === ''&& $scope.guest.whoAreYou === '' &&  $scope.guest.company === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === ''){
                return true;
            }else if($scope.guest.residentName === undefined ||($scope.guest.residentName === '' && $scope.guest.whoAreYou === ''  && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '')) {return true;}
        }; $scope.companyshow = function(){
            if ($scope.guest.company && $scope.guest.whoAreYou && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === ''){
                return true;
            }
            else if($scope.guest.company === ''  && $scope.guest.whoAreYou === ''  && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '')
            {
                return true;
            }
            else if($scope.guest.company === ''  && $scope.guest.whoAreYou )
            {
                return true;
            }
            else if($scope.guest.company && $scope.guest.whoAreYou  === '' )
            {
                return true;
            }
        };$scope.whorushow = function(){
            if ($scope.guest.company && $scope.guest.whoAreYou && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === ''){
                return true;
            }
            else if($scope.guest.company === ''  && $scope.guest.whoAreYou === ''  && $scope.guest.residentName === '' && $scope.guest.roomNo === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '')
            {
                return true;
            }
            else if($scope.guest.company === ''  && $scope.guest.whoAreYou )
            {
                return true;
            }
            else if($scope.guest.company && $scope.guest.whoAreYou  === '' )
            {
                return true;
            }
        }; $scope.roomshow = function(){
            if ($scope.guest.roomNo && $scope.guest.residentName === '' && $scope.guest.whoAreYou === '' && $scope.guest.company === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '')
            {
                return true;
            }
            else if($scope.guest.roomNo === '' && $scope.guest.residentName === '' && $scope.guest.whoAreYou === '' && $scope.guest.company === '' && $scope.guest.event === '' && $scope.guest.purposeOfVisit === '') {return true;}
        };$scope.purposeOfVisitshow = function(){
            if ($scope.guest.purposeOfVisit && $scope.guest.residentName === '' && $scope.guest.whoAreYou === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.event === ''){
                return true;
            }else if($scope.guest.purposeOfVisit === '' && $scope.guest.residentName === '' && $scope.guest.whoAreYou === '' && $scope.guest.roomNo === '' && $scope.guest.company === '' && $scope.guest.event === '') {return true;}
        };

    });
