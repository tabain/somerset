angular.module('app').controller('ManageMembers',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );

        $scope.member ={};
        $scope.members =[];
        $scope.orgs =[];
        $scope.membere ={};
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;


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
        loadMembers();
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
                        location: $scope.member.organisation.location.id,
                        organisation: $scope.member.organisation.id,
                        wing: $scope.member.organisation.wing.id,
                        room: $scope.member.organisation.room.id,
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
                        loadMembers();


                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        showError(err);

                    });
                }

            };
        };


        $scope.editMember = function (membere) {

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
            $scope.orgs.forEach(function(d){
                if (d.id === $scope.membere.organisation.id ){
                    $scope.membere.organisation = d;

                }
            });


            $('#editMember').modal('show');
            $scope.submitForm = function (isValid) {
                if (isValid) {
                    var obj = {
                        location: $scope.membere.organisation.location.id,
                        organisation: $scope.membere.organisation.id,
                        wing: $scope.membere.organisation.wing.id,
                        room: $scope.membere.organisation.room.id,
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
            $scope.memberDeleted = member;
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
                        $scope.memberDeleted = {};
                    })
                    .error(function (err) {
                        $('#deleteMember').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $scope.memberDeleted = {};
                $('#deleteMember').modal('hide');
            };
        };
    });



