angular.module('app').controller('AboutYou',
    function ($scope, $rootScope, $resource, $location, $window, toaster, $http) {
        $scope.frontCrash = $rootScope.frontCrash;
        if ($rootScope.frontCrash === true){
            $rootScope.frontCrash = false;
            $scope.frontCrash = $rootScope.frontCrash;
            $location.path('/frontdesk');
        }
        $scope.new = {};
        $scope.check={};
        $scope.return = false;
        $scope.validTypes = types;
        $scope.new.type = $scope.validTypes[0];
        $scope.defaultType = $scope.validTypes[0];
        $scope.changeUpdate = function(){
            $rootScope.whoru = $scope.new.type;
            if ($rootScope.whoru == 'Returning Guest'){
                $scope.return = true;
                $scope.pagename = 'Returning Guest';
                //$location.path('/returningGuest');
            }
            else if($rootScope.whoru=='Event Guest'){
                $location.path('/eventGuest');

            }else if($rootScope.whoru=='Family Member'){
                $location.path('/familyMember');

            }else if($rootScope.whoru=='Student Visitor'){
                $location.path('/studentVisitor');

            }else if($rootScope.whoru=='Business Partner'){
                $location.path('/businessPartner');

            }else if($rootScope.whoru=='Other Visitor'){
                $location.path('/otherVisitor');

            }else if($rootScope.whoru=='Student – Other Property'){
                $location.path('/studentOtherPropertyVisitor');


            }
        };
        $scope.newUser = function () {
            $scope.return = false;

        };
        $scope.submitForm = function (isValid) {
            if (isValid) {
                var url;

                if (!$scope.check.email && !$scope.check.phone) {
                    toaster.warning(errors.NEW_USER);
                    return;
                } else if (!$scope.check.email && $scope.check.phone) {
                    $scope.ParsePh = angular.copy($scope.check.phone);
                    if($scope.ParsePh.charAt(0)!='+') $scope.ParsePh = '%2B'+$scope.ParsePh;
                    //if($scope.check.phone.charAt(0)!='+') $scope.check.phone ='%2B'+$scope.check.phone;
                    url = '/newGuests?phone=' + $scope.ParsePh;
                    //url = '/guests?phone=' + $scope.check.phone;
                } else if ($scope.check.email && !$scope.check.phone) {
                    url = '/newGuests?email=' + $scope.check.email;
                } else if ($scope.check.email && $scope.check.phone) {
                    url = '/newGuests?email=' + $scope.check.email;
                }

                $http
                    .get(url)
                    .success(function (res) {
                        //$scope.identify = true;
                        //$rootScope.returningGuest = true;
                        $rootScope.guest= res;
                        $scope.guest= $rootScope.guest;
                        $location.path('/returningGuest');
                    })
                    .error(function (err) {
                        //$scope.identify = false;
                        //$scope.newUser();
                        toaster.warning(errors.NEW_USER);
                    });
            }


        };
    });