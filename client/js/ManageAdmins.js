angular.module('app').controller('ManageAdmins',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {


        $scope.validRoles = ['frontdesk', 'admin'];
        $scope.validLocations = [];
        $scope.admins = [];
        defaultAdmin = function () {
            return {
                username: '',
                email: '',
                password: '',
                wing:$scope.validLocations[1],
                role: 'frontdesk'
            };
        };

        $scope.admin = defaultAdmin();
        loadAdmins = function () {
            var url = '/users';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.admins = data;
                })
                .error(function (err) {
                    showError(err);
                });
        };

        loadAdmins();
        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.validLocations = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };

        $('#addGuest').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
            $scope.admin = defaultAdmin();
        });


        $scope.addUser = function () {
            $('#addUser').modal('show');
            $scope.admin = defaultAdmin();
            var Admin = $resource('/users/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    $scope.admin.wing = $scope.admin.wing.id;
                    new Admin($scope.admin).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addUser').modal('hide');
                        // TODO: When Success Reset Form
                        // TODO: Post Success
                        $scope.admins.push(data);
                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editAdmin = function (admin) {
            $rootScope.editadmin = admin;

            $scope.admin = angular.copy(admin);
            $('#editAdmin').modal('show');
            if ($scope.admin.wing)   {
                $scope.validLocations.forEach(function(d){
                    if (d.id === $scope.admin.wing.id ){
                        $scope.admin.wing = d;
                    }
                });
            }

            $scope.submitForm = function (isValid) {
                if (isValid) {
                    $scope.admin.wing = $scope.admin.wing.id;
                    $http.put('/users/' + $scope.admin.id, $scope.admin)
                        .success(function (result) {
                            $('#editAdmin').modal('hide');
                            $scope.validLocations.forEach(function(d){
                                if (d.id === result.wing ){
                                    result.wing = d;
                                }
                            });
                            $scope.admins.forEach(function (ad, i) {
                                if (ad.id == result.id) {

                                    ad=result;
                                }
                            });
                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteAdmin = function (admin) {
            $('#deleteAdmin').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/users/' +  admin.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.admins.forEach(function (g, i) {
                            if (g.id == admin.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.admins.splice(index, 1);

                        }
                        $('#deleteAdmin').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteAdmin').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteAdmin').modal('hide');
            };
        };
    });


