angular.module('app').controller('client',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {


        $scope.wings = [];
        $scope.wing ={};
        $scope.member ="";
        $scope.members ={};
        $scope.defaultWin= {};
        $scope.disablesearch = false;


        $scope.search = function(member) {
            var urll  = "clientMembers?wing=" +$rootScope.defaultWing;

            if (member)
                urll += '&name=' + member;
            $http
                .get(urll)
                .success(function(data){
                    $scope.members = data;
                    $scope.disablesearch = true;
                })
                .error(function(err){
                    showError(err);
                });


        };


        $rootScope.defaultWing = $window.localStorage.getItem('default_wing_id');
        loadWings = function () {
            var url = '/clientWings';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.wings = data;
                    if ($rootScope.defaultWing){
                        $scope.wings.forEach(function(d){
                            if ($rootScope.defaultWing == d.id){
                                $scope.defaultWin = d ;
                            }

                        });

                    }
                })
                .error(function (err) {
                    showError(err);
                });
        };
        loadWings();

        $scope.$watch('wing', function(){
            if ($scope.wing.id){
                $window.localStorage.setItem('default_wing_id', $scope.wing.id);
            }
        });
        defaultwing = function () {
            $('#defaultwing').modal('show');
            $scope.submitForm = function(isvaild){
                if (isvaild){
                    $('#defaultwing').modal('hide');
                }

            };
            $scope.cancel = function () {

            };
        };
        if(!$rootScope.defaultWing || $rootScope.defaultWing === "undefined" || $rootScope.defaultWing === null){
            defaultwing();
        }


        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };

        //$('#defaultwing').on('shown.bs.modal', function () {
        //    $scope.modalshowhide = true;
        //});
        //$('#defaultwing').on('hide.bs.modal', function () {
        //    if ($rootScope.defaultWing){
        //        $scope.modalshowhide = true;
        //    }
        //});

    });

