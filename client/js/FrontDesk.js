angular.module('app').controller('FrontDest',
    function ($scope, $http, $interval, toaster, $rootScope, $location, $resource, $window, $timeout) {
        $scope.visits = [];
        $scope.loadingVisits = false;
        $scope.wing = $rootScope.currentUser.wing;
        if ($rootScope.currentUser.role === 'admin') $scope.wing= null;
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

                        });
                    }
                })
                .error(function(err){
                    showError(err);
                });
        };
        loadWings();

        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+/;//[a-zA-Z.]+ [a-zA-Z.]+
       

        var loadEndTime = 0;
        loadVisits = function () {

            //if (getTime() - loadEndTime < 60000) return;
            if ($scope.loadingVisits) return;
            $scope.loadingVisits = true;

            var url = '/visits';
            if( $scope.wing )   url+='?wing='+ $scope.wing


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

        //
        //
        //$scope.reports = function () {
        //    var url_report = '/reports';
        //    if ($scope.date){
        //        url_report += '?startdate=' + moment($scope.date.startDate).format("YYYY-MM-DD") +
        //        '&enddate=' + moment($scope.date.endDate).format("YYYY-MM-DD");
        //    }
        //    if ($scope.residentName && !$scope.name)
        //    {
        //        var rnamme = decodeURIComponent($scope.residentName);
        //        url_report += '?residentName=' + rnamme;
        //    }
        //
        //    if ($scope.name && !$scope.residentName)
        //    {
        //        var nname = decodeURIComponent($scope.name);
        //        url_report += '?name=' + nname;
        //    }
        //    if ($scope.residentName && $scope.name){
        //        var nname = decodeURIComponent($scope.name);
        //        var rnamme = decodeURIComponent($scope.residentName);
        //        url_report += '?name=' + nname + '&residentName=' + rnamme;
        //    }
        //    return url_report;
        //};

    });



