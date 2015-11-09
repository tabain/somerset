angular.module('app').controller('Manage',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {

        $scope.name = 'Manage';

        $scope.gotoAdminManage = function(){
            $location.path('/manage/admin');

        };
        $scope.gotoWingManage = function(){
            $location.path('/wingManage');

        };
        $scope.gotoWingPropertyManage = function(){
            $location.path('/wingPropertyManage');

        };
        $scope.gotoOrganisationManage = function(){
            $location.path('/organisationManage');

        };
        $scope.gotoMemberManage = function(){
            $location.path('/memberManage');

        };


    });
