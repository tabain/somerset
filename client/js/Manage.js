angular.module('app').controller('Manage',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {

        $scope.name = 'Manage';

        $scope.gotoAdminManage = function(){
            $location.path('/manage/admin');

        };
        $scope.gotoWingManage = function(){
            $location.path('/manage/wing');

        };
        $scope.gotoWingLocManage = function(){
            $location.path('/manage/wingLoc');

        };
        $scope.gotoRoomManage = function(){
            $location.path('/manage/room');

        };
        $scope.gotoOrganisationManage = function(){
            $location.path('/organisationManage');

        };
        $scope.gotoMemberManage = function(){
            $location.path('/memberManage');

        };


    });
