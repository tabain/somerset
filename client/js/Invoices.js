angular.module('app').controller('Invoices',
    function ($scope, $http, $interval, toaster, $rootScope, $resource, $window, $location) {
        $( "html" ).removeClass( "background-client" );
        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else
                toaster.error(errors.UNKNOWN);
        };
        $scope.statuses=['unpaid','paid','collection', 'other'];
        $scope.invoices = [];
        $scope.contracts =[];
        $scope.contract={};
        $scope.invoice={};
        list = function(){
            $http.get('/invoices')
                .success(function (data, headers){
                    if (data) {
                        $scope.invoices = data;
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        list();
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
         function getMonth(c){
             $scope.allMonthsInPeriod =[];
             $scope.invoice = c;
             var startDateString = c.contract.start;
             var endDateString = c.contract.end;
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

             });
             $scope.invoice.vat = (20/100) * c.contract.monthlyRent;
             $scope.invoice.total = $scope.invoice.vat + c.contract.monthlyRent;
             $scope.invoice.issueDate = new Date();
             $scope.invoice.dueDate =new Date(new moment($scope.invoice.issueDate).add(10, 'days'));
             $scope.invoice.status =$scope.statuses[0];
        };

        $scope.$watch('contract',function(){
            $scope.invoice.contract = $scope.contract;
            getMonth($scope.invoice);
        });$scope.$watch('allMonthsInPeriod',function(){
            if ($scope.invoice.period){
                $scope.allMonthsInPeriod.forEach(function(d){
                    if ($scope.invoice.period === d) $scope.invoice.period = d;
                });
            }
        });

        $scope.take = function(){
            $scope.create = 'Create';

            $('#generate').modal('show');

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
                        list();

                    })
                    .error(function(err){
                        console.log(err)
                    })
            }
            $scope.cancel = function () {
                $('#generate').modal('hide');
            };
        };
        $scope.delete = function (invoice) {

            $('#delete').modal('show');
            $scope.invoice = invoice;
            $scope.confirmDeleted = function () {
                $http.delete('/invoices/' +  invoice.id, {})
                    .success(function (result) {
                        var index = -1;
                        $scope.invoices.forEach(function (g, i) {
                            if (g.id == invoice.id) {
                                index = i;
                            }
                        });
                        if (index >= 0) {
                            $scope.invoices.splice(index, 1);

                        }
                        $('#delete').modal('hide');
                    })
                    .error(function (err) {
                        $('#delete').modal('hide');
                        showError(err);
                    });

            };

            $scope.cancel = function () {
                $('#deleteContract').modal('hide');
            };
        };
        $scope.edit = function (invoice) {
            $scope.create = 'Edit';
            getMonth(invoice);
            $scope.contracts.forEach(function(d){
              if (invoice.contract.id === d.id) {
                  $scope.contract = d;
              }
            });
            $scope.allMonthsInPeriod.forEach(function(d){
              if (invoice.period=== d) {
                  $scope.invoice.period = d;
              }
            });
            $('#generate').modal('show');
            $scope.generate = function(){
                var g = {
                    contract: $scope.contract.id,
                    //issueDate: $scope.invoice.issueDate,
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
                    .put('/invoices'+invoice.id,g)
                    .success(function(data){
                        console.log(data);
                        $('#generate').modal('hide');
                        list();

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



