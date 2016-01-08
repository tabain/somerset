angular.module('app').controller('ManageRooms',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.wings= [];
        $scope.winglocs = [];
        $scope.locs = [];
        $scope.room ={};
        $scope.rooms=[];
        $scope.roome ={};
        $scope.locDisabled = true;


        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.wings = data;

                        $scope.room.wing = $scope.wings[0];
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();
        $scope.$watch('room.wing', function(){
            $scope.locDisabled = true;
                if ($scope.room.wing === undefined || !$scope.room.wing){

                }
                else{loadwingbyloc($scope.room);}


        });
        $scope.$watch('roome.wing', function(){
            $scope.locDisabled = true;

                if ($scope.room.wing === undefined || !$scope.room.wing){

                }
                else{loadwingbyloc($scope.roome);}


        });
        $scope.$watch('winglocs', function(){

            if ($scope.roome.location){
                $scope.winglocs.forEach(function(d){
                    if (d.id === $scope.roome.location.id){
                        $scope.roome.location = d;
                    }
                });
            }
            if ($scope.winglocs.length > 0){
                $scope.locDisabled = false;
            }
        })

        loadRoom = function () {
            var url = '/rooms';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.rooms = data;
                })
                .error(function (err) {
                    showError(err);
                });
        };

        loadRoom();

        loadwingbyloc = function(room){
          $http
              .get("/winglocs/" + room.wing.id)
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

        $('#addRoom').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
        });


        $scope.addRoom = function () {
            $('#addRoom').modal('show');
            var Room= $resource('/rooms/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    var obj = {
                        location: $scope.room.location.id,
                        wing: $scope.room.wing.id,
                        room: $scope.room.room
                    };
                    new Room(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addRoom').modal('hide');
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
                        $scope.rooms.push(data);

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editRoom = function (room) {
            loadwingbyloc(room);
            $rootScope.editRoom= room;

            $scope.roome = angular.copy(room);
            $scope.wings.forEach(function(d){
                if (d.id === $scope.roome.wing.id ){
                    $scope.roome.wing = d;

                }
            });

            $('#editRoom').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location : $scope.roome.location.id,
                        wing : $scope.roome.wing.id,
                        room: $scope.roome.room
                    };
                    $http.put('/rooms/' + $scope.roome.id, obj)
                        .success(function (result) {

                            $('#editRoom').modal('hide');
                            loadRoom();

                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteRoom = function (room) {
            $('#deleteRoom').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/rooms/' +  room.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.rooms.forEach(function (g, i) {
                            if (g.id == room.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.rooms.splice(index, 1);

                        }
                        $('#deleteRoom').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteRoom').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteRoom').modal('hide');
            };
        };
    });



