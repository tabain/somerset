angular.module('app').controller('ManageWings',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window) {

        $( "html" ).removeClass( "background-client" );
        $scope.wings = [];
        $scope.wing ={};
        loadWings = function () {
            var url = '/wings';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.wings = data;
                })
                .error(function (err) {
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

        $('#addWing').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
        });


        $scope.addWing = function () {
            $('#addWing').modal('show');
            var Wing = $resource('/wings/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    new Wing($scope.wing).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addWing').modal('hide');
                        // TODO: When Success Reset Form
                        // TODO: Post Success
                        $scope.wings.push(data);
                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editWing = function (wing) {
            $rootScope.editWing= wing;

            $scope.wing = angular.copy(wing);

            $('#editWing').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    $http.put('/wings/' + $scope.wing.id, $scope.wing)
                        .success(function (result) {

                            $('#editWing').modal('hide');
                            $scope.wings.forEach(function (w, i) {
                                if (w.id == result.id) {
                                    w.name = result.name;

                                }
                            });
                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteWing = function (wing) {
            $('#deleteWing').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/wings/' +  wing.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.wings.forEach(function (g, i) {
                            if (g.id == wing.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.wings.splice(index, 1);

                        }
                        $('#deleteWing').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteWing').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteWing').modal('hide');
            };
        };
    });


