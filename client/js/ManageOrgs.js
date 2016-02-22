angular.module('app').controller('ManageOrgs',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.org ={};
        $scope.orgs =[];
        $scope.rooms=[];
        $scope.orge ={};
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;

        loadOrgs = function(){
            $http.get('/orgs')
                .success(function (data, headers){
                    if (data) {
                        $scope.orgs = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadOrgs();

        loadRooms = function(org){

            var url = '/rooms';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.rooms = data;
                })
                .error(function (err) {
                    showError(err);
                });
        };
        loadRooms();
        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };

        $('#addRoom').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
        });


        $scope.addOrg = function () {
            $('#addOrg').modal('show');
            var Org= $resource('/orgs/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    var obj = {
                        location: $scope.org.room.location.id,
                        wing: $scope.org.room.wing.id,
                        room: $scope.org.room.id,
                        name: $scope.org.name,
                        phone: $scope.org.phone,
                        ext: $scope.org.ext,
                        fax: $scope.org.fax,
                        mobile: $scope.org.mobile,
                        email: $scope.org.email
                    };
                    new Org(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addOrg').modal('hide');
                        // TODO: Post Success
                        loadOrgs();

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editOrg = function (org) {

            $rootScope.editOrg= org;

            $scope.orge = angular.copy(org);
            $scope.rooms.forEach(function(d){
                if (d.id === $scope.orge.room.id ){
                    $scope.orge.room = d;

                }
            });

            $('#editOrg').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location: $scope.orge.room.location.id,
                        wing: $scope.orge.room.wing.id,
                        room: $scope.orge.room.id,
                        name: $scope.orge.name,
                        phone: $scope.orge.phone,
                        ext: $scope.orge.ext,
                        fax: $scope.orge.fax,
                        mobile: $scope.orge.mobile,
                        email: $scope.orge.email
                    };
                    $http.put('/orgs/' + $scope.orge.id, obj)
                        .success(function (result) {

                            $('#editOrg').modal('hide');
                            loadOrgs();

                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteOrg = function (org) {
            $('#deleteOrg').modal('show');
            $scope.orgDeleted = org;
            $scope.confirmDeleted = function () {
                $http.delete('/orgs/' +  org.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.orgs.forEach(function (g, i) {
                            if (g.id == org.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.orgs.splice(index, 1);

                        }
                        $('#deleteOrg').modal('hide');
                        $scope.orgDeleted={};
                    })
                    .error(function (err) {
                        $('#deleteOrg').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteOrg').modal('hide');
            };
        };
    });



