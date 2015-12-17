angular.module('app').controller('ManageMembers',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {

        $scope.wings= [];
        $scope.winglocs = [];
        $scope.member ={};
        $scope.members =[];
        $scope.orgs =[];
        $scope.rooms=[];
        $scope.membere ={};
        $scope.locDisabled = true;
        $scope.roomDisabled = true;
        $scope.orgDisabled = true;
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;


        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.wings = data;

                        $scope.member.wing = $scope.wings[0];
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadMembers = function(){
            $http.get('/members')
                .success(function (data, headers){
                    if (data) {
                        $scope.members = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();
        loadMembers();
        $scope.$watch('member.wing', function(){
            $scope.locDisabled = true;
                if ($scope.member.wing === undefined || !$scope.member.wing){

                }
                else{loadwingbyloc($scope.member);}


        });
        $scope.$watch('membere.wing', function(){
            $scope.locDisabled = true;

                if ($scope.membere.wing === undefined || !$scope.membere.wing){

                }
                else{loadwingbyloc($scope.membere);}


        });


        $scope.$watch('member.location', function(){
            $scope.roomDisabled = true;
            if ($scope.member.location === undefined || !$scope.member.location){

            }
            else{loadlocbyroom($scope.member);}


        });
        $scope.$watch('member.room', function(){
            $scope.roomDisabled = true;
            if ($scope.member.room === undefined || !$scope.member.room){

            }
            else{loadroombyorg($scope.member);}


        });$scope.$watch('membere.room', function(){
            $scope.roomDisabled = true;
            if ($scope.membere.room === undefined || !$scope.membere.room){

            }
            else{loadroombyorg($scope.membere);}


        });
        $scope.$watch('membere.location', function(){
            $scope.locDisabled = true;

            if ($scope.membere.location === undefined || !$scope.membere.location){

            }
            else{loadlocbyroom($scope.membere);}


        });
        $scope.$watch('membere', function(){
            loadwingbyloc($scope.membere);
            loadlocbyroom($scope.membere);
            loadroombyorg($scope.membere);
        });
        $scope.$watch('winglocs', function(){

            if ($scope.membere.location){
                $scope.winglocs.forEach(function(d){
                    if (d.id === $scope.membere.location.id){
                        $scope.membere.location = d;
                    }
                });
            }
            if ($scope.winglocs.length > 0){
                $scope.locDisabled = false;
            }
        });
        $scope.$watch('rooms', function(){
            $scope.orgDisabled = true;
            if ($scope.membere.room){
                $scope.rooms.forEach(function(d){
                    if (d.id === $scope.membere.room.id){
                        $scope.membere.room = d;
                    }
                });
            }
            if ($scope.rooms.length > 0){
                $scope.orgDisabled = false;

            }
        });
        $scope.$watch('orgs', function(){

            if ($scope.membere.organisation){
                $scope.orgs.forEach(function(d){
                    if (d.id === $scope.membere.organisation.id){
                        $scope.membere.organisation = d;
                    }
                });
            }
            if ($scope.orgs.length > 0){
                $scope.orgDisabled = false;
            }
        });

        loadwingbyloc = function(member){

          $http
              .get("/winglocs/" + member.wing.id)
              .success(function (data){
                  $scope.winglocs = data;
                  if ($scope.winglocs == 0) $scope.winglocs =[];


              })
              .error(function(err){
                  $scope.winglocs =[];
                  showError(err);
              });
        };

        loadlocbyroom = function(member){
            $scope.rooms =[];
            $http
                .get("/rooms/" + member.location.id)
                .success(function (data){
                    $scope.rooms = data;
                    if ($scope.rooms == 0) $scope.rooms =[];
                })
                .error(function(err){
                    $scope.rooms =[];
                    showError(err);
                });
        };
        loadroombyorg = function(member){
            $scope.orgs =[];
            $http
                .get("/orgs/" + member.room.id)
                .success(function (data){
                    $scope.orgs = data;
                    if ($scope.orgs == 0) $scope.orgs =[];
                })
                .error(function(err){
                    $scope.orgs =[];
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

        $('#addMember').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;

        });


        $scope.addMember = function () {
            $('#addMember').modal('show');
            var Member= $resource('/members/:id', {id: '@id'}, {
                checkin: {method: 'POST', params: {}, responseType: 'json'}
            }, {/*empty options*/});

            $scope.submitForm = function (isValid) {

                if (isValid) {
                    var obj = {
                        location: $scope.member.location.id,
                        organisation: $scope.member.organisation.id,
                        wing: $scope.member.wing.id,
                        room: $scope.member.room.id,
                        name: $scope.member.name,
                        age: $scope.member.age,
                        phone: $scope.member.phone,
                        ext: $scope.member.ext,
                        mobile: $scope.member.mobile,
                        email: $scope.member.email
                    };
                    new Member(obj).$save(function (data, headers) {
                        $(".modal-backdrop").hide();
                        $('#addMember').modal('hide');
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
                        $scope.orgs.forEach(function(d){
                            if (d.id == data.organisation){
                                data.organisation = d;
                            }
                        });
                        $scope.members.push(data);
                        $scope.member={};
                        $scope.$$childHead.memberForm.wing = false;
                        $scope.$$childHead.memberForm.name = false;
                        $scope.$$childHead.memberForm.age = false;
                        $scope.$$childHead.memberForm.phone = false;
                        $scope.$$childHead.memberForm.email = false;
                        $scope.$$childHead.memberForm.organistaion = false;
                        $scope.$$childHead.memberForm.room = false;
                        $scope.$$childHead.memberForm.location = false;

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editMember = function (membere) {
            loadwingbyloc(membere);
            loadlocbyroom(membere);
            loadroombyorg(membere);
            $rootScope.editMember= membere;

            $scope.membere = angular.copy(membere);

            //$scope.membere.wing = membere.wing;
            //$scope.membere.organisation = membere.organisation;
            //$scope.orgs.forEach(function(d){
            //    if (d.id === $scope.membere.organisation.id ){
            //        $scope.membere.organisation = d;
            //
            //    }
            //});
            $scope.wings.forEach(function(d){
                if (d.id === $scope.membere.wing.id ){
                    $scope.membere.wing = d;

                }
            });


            $('#editMember').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location: $scope.membere.location.id,
                        organisation: $scope.membere.organisation.id,
                        wing: $scope.membere.wing.id,
                        room: $scope.membere.room.id,
                        name: $scope.membere.name,
                        age: $scope.membere.age,
                        phone: $scope.membere.phone,
                        ext: $scope.membere.ext,
                        mobile: $scope.membere.mobile,
                        email: $scope.membere.email
                    };
                    $http.put('/members/' + $scope.membere.id, obj)
                        .success(function (result) {

                            $('#editMember').modal('hide');
                            loadMembers();

                        })
                        .error(function (err) {
                            showError(err);
                        });
                }

            };
        };

        $scope.deleteMember = function (member) {
            $('#deleteMember').modal('show');
            $scope.confirmDeleted = function () {
                $http.delete('/members/' +  member.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.members.forEach(function (g, i) {
                            if (g.id == member.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.members.splice(index, 1);

                        }
                        $('#deleteMember').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteMember').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteMember').modal('hide');
            };
        };
    });



