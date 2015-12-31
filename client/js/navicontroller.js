angular.module('app').controller('NaviController',
    function ($scope, $rootScope, $location, toaster, Auth) {

        if ($rootScope.currentUser)
            $scope.showLogout = true;
        else
            $scope.showLogout = false;

        $rootScope.$watch('currentUser', function () {
            if ($rootScope.currentUser) {
                $scope.showLogout = true;
                $scope.currentUser = $rootScope.currentUser.username;
            }
            else {
                $scope.showLogout = false;
            }
        });

        $scope.logout = function () {
            Auth.logout().then(function () {
                $location.path('/login');
            }, function () {
                console.log('Could not logout');
            });
        };

        $scope.isAdminUser = function () {
            var u = Auth.getUserInfo();
            if (u && u.role == 'admin') {
                return true;
            }
            return false;
        };$scope.isFrontUser = function () {
            var u = Auth.getUserInfo();
            if ((u && u.role == 'admin') || (u && u.role == 'frontdesk')) {
                return true;
            }
            return false;
        };

        $scope.frontdesk = function () {
            $location.path('/frontdesk');
        };
        $scope.manage = function () {
            $location.path('/manage');
        };
        $scope.stats = function () {
            $location.path('/stats');
        };
    });