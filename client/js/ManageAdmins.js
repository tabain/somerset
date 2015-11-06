angular.module('app').controller('ManageAdmins',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {

        defaultAdmin = function () {
            return {
                username: '',
                email: '',
                password: '',
                defaultLocation: 'Spitalfields',
                role: 'frontdesk'
            };
        };

        $scope.admin = defaultAdmin();
        $scope.validRoles = ['frontdesk', 'admin'];
        $scope.validLocations = ['Spitalfields', 'Notting Hill', 'King\'s Cross'];
        $scope.admins = [];

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
                    new Admin($scope.admin).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addUser').modal('hide');
                        // TODO: When Success Reset Form
                        // TODO: Post Success
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
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    $http.put('/users/' + $scope.admin.id, $scope.admin)
                        .success(function (result) {
                            $('#editAdmin').modal('hide');
                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };


    });
