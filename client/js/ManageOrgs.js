angular.module('app').controller('ManageOrgs',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {

        $scope.wings= [];
        $scope.winglocs = [];
        $scope.locs = [];
        $scope.org ={};
        $scope.orgs =[];
        $scope.rooms=[];
        $scope.orge ={};
        $scope.locDisabled = true;
        $scope.roomDisabled = true;
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;


        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.wings = data;

                        $scope.org.wing = $scope.wings[0];
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
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
        loadWings();
        $scope.$watch('org.wing', function(){
            $scope.locDisabled = true;
                if ($scope.org.wing === undefined || !$scope.org.wing){

                }
                else{loadwingbyloc($scope.org);}


        });
        $scope.$watch('orge.wing', function(){
            $scope.locDisabled = true;

                if ($scope.orge.wing === undefined || !$scope.orge.wing){

                }
                else{loadwingbyloc($scope.orge);}


        });


        $scope.$watch('org.location', function(){
            $scope.roomDisabled = true;
            if ($scope.org.location === undefined || !$scope.org.location){

            }
            else{loadlocbyroom($scope.org);}


        });
        $scope.$watch('orge.location', function(){
            $scope.locDisabled = true;

            if ($scope.orge.location === undefined || !$scope.orge.location){

            }
            else{loadlocbyroom($scope.orge);}


        });
        $scope.$watch('winglocs', function(){

            if ($scope.orge.location){
                $scope.winglocs.forEach(function(d){
                    if (d.id === $scope.orge.location.id){
                        $scope.orge.location = d;
                    }
                });
            }
            if ($scope.winglocs.length > 0){
                $scope.locDisabled = false;
            }
        });
        $scope.$watch('rooms', function(){

            if ($scope.orge.room){
                $scope.rooms.forEach(function(d){
                    if (d.id === $scope.orge.room.id){
                        $scope.orge.room = d;
                    }
                });
            }
            if ($scope.rooms.length > 0){
                $scope.roomDisabled = false;
            }
        });

        loadwingbyloc = function(org){

          $http
              .get("/winglocs/" + org.wing.id)
              .success(function (data){
                  $scope.winglocs = data;
                  if ($scope.winglocs == 0) $scope.winglocs =[];


              })
              .error(function(err){
                  $scope.winglocs =[];
                  showError(err);
              });
        };

        loadlocbyroom = function(org){
            $scope.rooms =[];
            $http
                .get("/rooms/" + org.location.id)
                .success(function (data){
                    $scope.rooms = data;
                    if ($scope.rooms == 0) $scope.rooms =[];
                })
                .error(function(err){
                    $scope.rooms =[];
                    showError(err);
                });
        };

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
                        location: $scope.org.location.id,
                        wing: $scope.org.wing.id,
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
                        $scope.wings.forEach(function(d){
                            if (d.id == data.wing){
                                data.wing = d;
                            }
                        });
                        $scope.winglocs.forEach(function(d){
                            if (d.id == data.location){
                                data.location = d;
                            }
                        });

                        $scope.rooms.forEach(function(d){
                            if (d.id == data.room){
                                data.room = d;
                            }
                        });
                        $scope.orgs.push(data);

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editOrg = function (org) {
            loadwingbyloc(org);
            loadlocbyroom(org);
            $rootScope.editOrg= org;

            $scope.orge = angular.copy(org);
            $scope.wings.forEach(function(d){
                if (d.id === $scope.orge.wing.id ){
                    $scope.orge.wing = d;

                }
            });

            $('#editOrg').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location: $scope.orge.location.id,
                        wing: $scope.orge.wing.id,
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



