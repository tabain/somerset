angular.module('app').controller('Contracts',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location, $timeout) {
        $( "html" ).removeClass( "background-client" );
        $scope.owners = [];
        $scope.statuses=['unpaid','paid','collection', 'other'];
        $scope.allMonthsInPeriod = [];
        $scope.winglocs = [];
        $scope.contract ={};
        $scope.contracts =[];
        $scope.orgs =[];
        $scope.rooms=[];
        $scope.contractE ={};
        $scope.locDisabled = true;
        $scope.roomDisabled = true;
        $scope.orgDisabled = true;
        $scope.emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;

        $scope.contract.date = {
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate()
        };
        loadContracts = function(){
            $http.get('/contracts')
                .success(function (data, headers){
                    if (data) {
                        $scope.contracts = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };

        loadContracts();

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
        $scope.$watch('contract.propOwner', function(){
            $scope.roomDisabled = true;
            if ($scope.contract.propOwner === undefined || !$scope.contract.propOwner){

            }
            else{loadlocbyroom($scope.contract.propOwner);}


        });
        $scope.$watch('contractE.propOwner', function(){
            $scope.roomDisabled = true;
            if ($scope.contractE.propOwner === undefined || !$scope.contractE.propOwner){

            }
            else{loadlocbyroom($scope.contractE.propOwner);}


        });
        $scope.$watch('contract.room', function(){
            $scope.roomDisabled = true;
            if ($scope.contract.room === undefined || !$scope.contract.room){

            }
            else{loadroombyorg($scope.contract);}


        });
        $scope.$watch('contractE.room', function(){
            $scope.roomDisabled = true;
            if ($scope.contractE.room === undefined || !$scope.contractE.room){

            }
            else{loadroombyorg($scope.contractE);}


        });

        $scope.$watch('contractE', function(){

            loadlocbyroom($scope.contractE);
            loadroombyorg($scope.contractE);
        });

        $scope.$watch('rooms', function(){
            $scope.orgDisabled = true;
            if ($scope.contractE.room){
                $scope.rooms.forEach(function(d){
                    if (d.id === $scope.contractE.room.id){
                        $scope.contractE.room = d;
                    }
                });
            }
            if ($scope.rooms.length > 0){
                $scope.orgDisabled = false;

            }
        });
        $scope.$watch('orgs', function(){

            if ($scope.contractE.organisation){
                $scope.orgs.forEach(function(d){
                    if (d.id === $scope.contractE.organisation.id){
                        $scope.contractE.organisation = d;
                    }
                });
            }
            if ($scope.orgs.length > 0){
                $scope.orgDisabled = false;
            }
        });



        loadlocbyroom = function(c){
            if (!c.location) return;
            $scope.rooms =[];
            $http
                .get("/rooms/" + c.location.id)
                .success(function (data){
                    $scope.rooms = data;
                    if ($scope.rooms == 0) $scope.rooms =[];
                })
                .error(function(err){
                    $scope.rooms =[];
                    showError(err);
                });
        };
        loadroombyorg = function(c){
            if (!c.room) return;
            $scope.orgs =[];
            $http
                .get("/orgs/" + c.room.id)
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

        $('#addContract').on('shown.bs.modal', function () {
            $scope.modalshowhide = true;

        });

        var Contract= $resource('/contracts/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});
        $scope.addContract = function () {
            $('#addContract').modal('show');



        };
        $scope.submitForm1 = function (isValid) {

            if (isValid) {
                var obj = {
                    propOwner: $scope.contract.propOwner.id,
                    organisation: $scope.contract.organisation.id,
                    room: $scope.contract.room.id,
                    contract: $scope.contract.contract,
                    notes: $scope.contract.notes,
                    start: $scope.contract.date.startDate,
                    end: $scope.contract.date.endDate,
                    monthlyRent: $scope.contract.monthlyRent

                };
                new Contract(obj).$save(function (data, headers) {
                    $(".modal-backdrop").hide();
                    $('#addContract').modal('hide');
                    // TODO: Post Success


                    loadContracts();
                    $scope.contract={};


                }, function (err) {
                    // TODO: Create Error Translator on Server and add helpful errors here
                    showError(err);

                });
            }

        };

        $scope.editContract = function (contractE) {
            $rootScope.editContract= contractE;
            $scope.contractE = angular.copy(contractE);
            $scope.contractE.date = {
                startDate: new Date($scope.contractE.start),
                endDate: new Date($scope.contractE.end)

            }
            loadlocbyroom(contractE);
            loadroombyorg(contractE);
            $scope.owners.forEach(function(d){
                if ( $scope.contractE.propOwner.id === d.id) return  $scope.contractE.propOwner = d;
            })
            $scope.orgs.forEach(function(d){
                if ( $scope.contractE.organisation.id === d.id) return  $scope.contractE.organisation = d;
            })
            $scope.rooms.forEach(function(d){
                if ( $scope.contractE.room.id === d.id) return  $scope.contractE.room = d;
            })

            $('#editContract').modal('show');

        };
        $scope.submitForm = function (isValid) {
            if (isValid) {
                var obj = {
                    propOwner: $scope.contractE.propOwner.id,
                    organisation: $scope.contractE.organisation.id,
                    room: $scope.contractE.room.id,
                    contract: $scope.contractE.contract,
                    notes: $scope.contractE.notes,
                    start: $scope.contractE.date.startDate,
                    end: $scope.contractE.date.endDate,
                    monthlyRent: $scope.contractE.date.monthlyRent
                };
                $http.put('/contracts/' + $scope.contractE.id, obj)
                    .success(function (result) {

                        $('#editContract').modal('hide');
                        loadContracts();

                    })
                    .error(function (err) {
                        showError(err);
                    });
            }

        };
        $scope.deleteContract = function (contract) {

            $('#deleteContract').modal('show');
            $scope.contractD = contract;
            $scope.confirmDeleted = function () {
                $http.delete('/contracts/' +  contract.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.contracts.forEach(function (g, i) {
                            if (g.id == contract.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.contracts.splice(index, 1);

                        }
                        $('#deleteContract').modal('hide');
                    })
                    .error(function (err) {
                        $('#deleteContract').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteContract').modal('hide');
            };
        };
        $('#generate').on('hide.bs.modal', function () {
            $scope.modalshowhide = true;
            $scope.allMonthsInPeriod = [];
        });
        $scope.getInvoice = function(c){
            $('#generate').modal('show');
            $scope.invoice = c;
            var startDateString = c.start;
            var endDateString = c.end;
            var startDate = moment(startDateString, "YYYY-M-DD");
            var endDate = moment(endDateString, "YYYY-M-DD").endOf("month");



            while (startDate.isBefore(endDate)) {
                $scope.allMonthsInPeriod.push(startDate.format("YYYY-MM"));
                startDate = startDate.add(1, "month");
            };
            $scope.allMonthsInPeriod.forEach(function(d, i){
                var index = -1;
                if ($scope.allMonthsInPeriod[0] === d){
                    index = i ;

                    if (index >= 0) {
                        $scope.allMonthsInPeriod.splice(index, 1);

                    }

                }

            })
            $scope.invoice.vat = (20/100) * $scope.invoice.monthlyRent;
            $scope.invoice.total = $scope.invoice.vat + $scope.invoice.monthlyRent;
            $scope.invoice.issueDate = new Date();
            $scope.invoice.dueDate =new Date(new moment($scope.invoice.issueDate).add(10, 'days'));
            $scope.invoice.status =$scope.statuses[0];

            $scope.generate = function(){
                var g = {
                    contract: $scope.invoice.id,
                    issueDate: $scope.invoice.issueDate,
                    period: $scope.invoice.period,
                    dueDate:$scope.invoice.dueDate,
                    monthlyRent:$scope.invoice.monthlyRent,
                    vat:$scope.invoice.vat,
                    total:$scope.invoice.total,
                    organisation:$scope.invoice.organisation.id,
                    propOwner:$scope.invoice.propOwner.id,
                    room:$scope.invoice.room.id,
                    status:$scope.invoice.status


                };
                $http
                    .post('/invoices',g)
                    .success(function(data){
                        console.log(data);
                        $('#generate').modal('hide');

                        $timeout(function(){
                            $location.path('/manage/invoices');
                        }, 300);

                    })
                    .error(function(err){
                        console.log(err)
                    })
            }
            $scope.cancel = function () {
                $('#generate').modal('hide');
            };
        };
    });



