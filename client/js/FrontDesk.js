angular.module('app').controller('FrontDest',
    function ($scope, $http, $interval, toaster, $rootScope, $location, $resource, $window, $timeout) {
        $scope.visits = [];
        $scope.loadingVisits = false;
        $scope.wing = $rootScope.currentUser.wing;
        $scope.vaildwings=[{name: 'All', value: null}];
        $scope.isadmin = false;
        $scope.ids={};
        if ($rootScope.currentUser.role === 'admin') {$scope.wing= $scope.vaildwings[0].value;$scope.isadmin=true;}
        $scope.wings=[];

        loadWings = function(){
            $http.get('/wings')
                .success(function (data, headers){
                    if (data) {
                        $scope.wings = data;
                        $scope.wings.forEach(function(d){

                            if ($scope.wing === d.id){
                                $scope.frontdesk = d.name;
                            }
                            if(d){
                                var obj = {
                                    name: d.name,
                                    value: d.id
                                }
                                $scope.vaildwings.push(obj);
                            }

                        });
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();
        $scope.print = function () {
            window.print();
        };
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/;//[a-zA-Z.]+ [a-zA-Z.]+
        $scope.date = {
            startDate: moment().startOf('day').toDate(),
            endDate: moment().endOf('day').toDate()
        };
        $scope.$watch('date', function () {

            $scope.forceLoadVisits();
        }); $scope.$watch('wing', function () {

            $scope.forceLoadVisits();
        });
        var loadEndTime = 0;
        loadVisits = function () {

            //if (getTime() - loadEndTime < 60000) return;
            if ($scope.loadingVisits) return;
            $scope.loadingVisits = true;

            var url = '/visits';
            if ($scope.date){
                url +='?startdate=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
                '&enddate=' + moment($scope.date.endDate).format("YYYY-MM-DD");
            };
            if( $scope.wing )   url+='&wing='+ $scope.wing;


            $http.get(url,{cache: false})
                .success(function (data, headers) {
                    $scope.visits = data;
                    $scope.loadingVisits = false;
                    loadEndTime = getTime();
                })
                .error(function (err) {
                    $scope.loadingVisits = false;
                    loadEndTime = getTime();
                    showError(err);
                });
        };

        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else if (err.status == 400)
                toaster.error(errors.BAD);
            else if (err.code == 404)
                toaster.error(err.message);
            //else
            //toaster.error(errors.UNKNOWN);
        };

        getTime = function () {
            return new Date().getTime();
        };
        

        
        $scope.reloadPage = function () {
            window.location.reload();
        };

        loadVisits();
        var interval = $interval(loadVisits, 10 * 1000);
        var pageRefresh = $interval($scope.reloadPage, 3 * 60 * 60 * 1000);



       


        $scope.forceLoadVisits = function () {
            $scope.visits=[];
            loadEndTime = getTime() - 600000;
            loadVisits();
        };

        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
            $interval.cancel(pageRefresh);
        });


        $scope.checkInOrCheckOut = function (visit) {
            if (visit.checkedIn && visit.checkedOut) {
                //TODO: throw error in toaster
            } else if (!visit.checkedIn) {
                $scope.permission({id: visit.id, checkIn: true , visitorId: visit.visitor.id});
            } else if (visit.checkedIn && !visit.checkedOut) {
                $scope.permission({id: visit.id, checkOut: true , VisitorId: visit.visitor.id});
            }

            $scope.ids[visit.id] = false;

        };
        $scope.permission = function (visit) {
            $http.put('/visits/' + visit.id, visit)
                .success(function (result) {
                    $scope.forceLoadVisits();
                })
                .error(function (err) {
                    showError(err);
                });
        };



        $scope.reports = function () {
            var url_report = '/reports';
            if ($scope.date){
                url_report += '?startdate=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
                '&enddate=' + moment($scope.date.endDate).format("YYYY-MM-DD");
            }
            return url_report;
        };

    });



