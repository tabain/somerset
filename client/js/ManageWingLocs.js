angular.module('app').controller('ManageWingLocs',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        $scope.wings= [];
        $scope.winglocs = [];
        $scope.wingloc ={};
        $scope.wingloce ={};
        loadWings = function(){
          $http.get('/wings')
              .success(function (data, headers){
                  if (data) {
                      $scope.wings = data;

                      $scope.wingloc.wing = $scope.wings[0];
                  }
              })
              .error(function(err){
                  showError(err);
              });
        };
        loadWings();

        loadWingLocs = function () {
            var url = '/winglocs';
            $http.get(url)
                .success(function (data, headers) {
                    $scope.winglocs = data;
                })
                .error(function (err) {
                    showError(err);
                });
        };

        loadWingLocs();

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };

        $('#addWingLoc').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;
        });


        $scope.addWingLoc = function () {
            $('#addWingLoc').modal('show');
            var WingLoc = $resource('/winglocs/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    var obj = {
                        location: $scope.wingloc.location,
                        wing: $scope.wingloc.wing.id
                    };
                    new WingLoc(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addWingLoc').modal('hide');
                        // TODO: Post Success
                        $scope.wings.forEach(function(d){
                            if (d.id == data.wing){
                                data.wing = d;
                            }
                        });
                        $scope.winglocs.push(data);

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editWingLoc = function (wingloc) {
            $rootScope.editWingLoc= wingloc;

            $scope.wingloce = angular.copy(wingloc);
            $scope.wings.forEach(function(d){
              if (d.id === $scope.wingloce.wing.id ){
                  $scope.wingloce.wing = d;
              }
            })

            $('#editWingLoc').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location : $scope.wingloce.location,
                        wing : $scope.wingloce.wing.id
                    };
                    $http.put('/winglocs/' + $scope.wingloce.id, obj)
                        .success(function (result) {

                            $('#editWingLoc').modal('hide');
                            loadWingLocs();

                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteWingLoc = function (wingloc) {
            $('#deleteWingLoc').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/winglocs/' +  wingloc.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.winglocs.forEach(function (g, i) {
                            if (g.id == wingloc.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.winglocs.splice(index, 1);

                        }
                        $('#deleteWingLoc').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteWingLoc').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteWingLoc').modal('hide');
            };
        };
    });


