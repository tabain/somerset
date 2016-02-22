angular.module('app').controller('ManageRooms',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.winglocs = [];
        $scope.room ={};
        $scope.rooms=[];
        $scope.roome ={};
        $scope.locDisabled = true;


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

        loadlocations= function(){
          $http
              .get("/winglocs/")
              .success(function (data){
                  $scope.winglocs = data;
                  if ($scope.winglocs == 0) $scope.winglocs =[];
              })
              .error(function(err){
                  $scope.winglocs =[];
                  showError(err);
              });
        };
        loadlocations();
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
                        wing: $scope.room.location.wing.id,
                        room: $scope.room.room
                    };
                    new Room(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addRoom').modal('hide');
                        // TODO: Post Success
                        loadRoom();

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editRoom = function (room) {
            $rootScope.editRoom= room;

            $scope.roome = angular.copy(room);
            $scope.winglocs.forEach(function(d){
                if (d.id === $scope.roome.location.id ){
                    $scope.roome.location = d;

                }
            });

            $('#editRoom').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location : $scope.roome.location.id,
                        wing : $scope.roome.location.wing.id,
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
            $scope.roomdeleted = room;
            $scope.confirmDeleted = function () {
                $http.delete('/rooms/' +  $scope.roomdeleted.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.rooms.forEach(function (g, i) {
                            if (g.id == $scope.roomdeleted.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.rooms.splice(index, 1);

                        }
                        $('#deleteRoom').modal('hide');
                        $scope.roomdeleted = {};
                    })
                    .error(function (err) {
                        $('#deleteRoom').modal('hide');
                        showError(err);
                        $scope.roomdeleted = {};

                    });

            };

            $scope.cancel = function () {
                $scope.roomdeleted = {};
                $('#deleteRoom').modal('hide');
            };
        };
    });



