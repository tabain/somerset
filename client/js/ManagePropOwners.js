angular.module('app').controller('PropOwner',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.wings= [];
        $scope.winglocs = [];
        $scope.locs = [];
        $scope.owner ={};
        $scope.owners=[];
        $scope.ownere ={};
        $scope.locDisabled = true;


        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.wings = data;

                        $scope.owner.wing = $scope.wings[0];
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();
        $scope.$watch('owner.wing', function(){
            $scope.locDisabled = true;
            if ($scope.owner.wing === undefined || !$scope.owner.wing){

            }
            else{loadwingbyloc($scope.owner);}


        });
        $scope.$watch('ownere.wing', function(){
            $scope.locDisabled = true;

            if ($scope.ownere.wing === undefined || !$scope.ownere.wing){

            }
            else{loadwingbyloc($scope.ownere);}


        });
        $scope.$watch('winglocs', function(){

            if ($scope.ownere.location){
                $scope.winglocs.forEach(function(d){
                    if (d.id === $scope.ownere.location.id){
                        $scope.ownere.location = d;
                    }
                });
            }
            if ($scope.winglocs.length > 0){
                $scope.locDisabled = false;
            }
        })

        loadOwners = function () {
            var url = '/owners';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.owners = data;
                })
                .error(function (err) {
                    showError(err);
                });
        };

        loadOwners();

        loadwingbyloc = function(owner){
            $http
                .get("/winglocs/" + owner.wing.id)
                .success(function (data){
                    $scope.winglocs = data;
                    if ($scope.winglocs == 0) $scope.winglocs =[];
                })
                .error(function(err){
                    $scope.winglocs =[];
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

        $('#addOwner').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
        });


        $scope.addOwner = function () {
            $('#addOwner').modal('show');
            var Owner= $resource('/owners/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    var obj = {
                        location: $scope.owner.location.id,
                        wing: $scope.owner.wing.id,
                        propOwner: $scope.owner.propOwner,
                        email: $scope.owner.email,
                        phone: $scope.owner.phone,
                        ext: $scope.owner.ext
                    };
                    new Owner(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addOwner').modal('hide');
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
                        $scope.owners.push(data);

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editOwner = function (owner) {
            loadwingbyloc(owner);
            $rootScope.editOwner= owner;

            $scope.ownere = angular.copy(owner);
            $scope.wings.forEach(function(d){
                if (d.id === $scope.ownere.wing.id ){
                    $scope.ownere.wing = d;

                }
            });

            $('#editOwner').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location : $scope.ownere.location.id,
                        wing : $scope.ownere.wing.id,
                        propOwner : $scope.ownere.propOwner,
                        email : $scope.ownere.email,
                        phone : $scope.ownere.phone,
                        ext : $scope.ownere.ext
                    };
                    $http.put('/owners/' + $scope.ownere.id, obj)
                        .success(function (result) {

                            $('#editOwner').modal('hide');
                            loadOwners();

                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteOwner = function (owner) {
            $('#deleteOwner').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/owners/' +  owner.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.owners.forEach(function (g, i) {
                            if (g.id == owner.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.owners.splice(index, 1);

                        }
                        $('#deleteOwner').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteOwner').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteOwner').modal('hide');
            };
        };
    });