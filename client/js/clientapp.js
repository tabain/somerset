var app = angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'toaster', 'CustomFilter', 'daterangepicker']);

app.constant('errors', errors);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });

    var USER_ROLES = {
        admin: 'admin',
        frontdesk: 'frontdesk',
        guest: 'guest',
        all: '*'
    };
    $routeProvider
        .when('/',  {
            templateUrl: '/views/cli-guest.html',
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        }).when('/guest',  {
            templateUrl: '/views/guest.html',
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        }).when('/welcome',  {
            templateUrl: '/views/welcome.html',
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        }).when('/login', {
            templateUrl: '/views/login.html',
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        }).when('/manage/admin', {
            templateUrl: '/views/manageAdmin.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage/wing', {
            templateUrl: '/views/manageWing.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage', {
            templateUrl: '/views/manage.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage/wingLoc', {
            templateUrl: '/views/manageWingLoc.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage/room', {
            templateUrl: '/views/manageRoom.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage/org', {
            templateUrl: '/views/manageOrg.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/manage/member', {
            templateUrl: '/views/manageMember.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).when('/404', {
            templateUrl: '/views/404.html',
            data: {
                authorizedRoles: [USER_ROLES.all]
            }
        }).otherwise({redirectTo: '/404'});

    //$httpProvider.interceptors.push('processErrorHttpInterceptor');

}]);

angular.module('app').config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post.Accept = 'application/json, text/javascript';
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

angular.module('app').run(function ($rootScope, $location, $http, Auth) {
    $rootScope.editguest = {};
    $rootScope.frontCrash = false;
    var getLocations = function(){
        $http
            .get('/locations')
            .success(function(locs){
                $rootScope.validLocations1 = [];
                $rootScope.validLocations = locs;
                searchValidLocations.forEach(function(doc, i){
                    if (doc.name === 'Spitalfields') {
                        locs.forEach(function(doc2){
                            if(doc2.name === 'Spitalfields'){
                                doc.value = doc2.id;
                                $rootScope.validLocations1.push(doc);
                            }

                        });
                    }else if(doc.name === 'Notting Hill'){
                        locs.forEach(function(doc2){
                            if(doc2.name === 'Notting Hill'){
                                doc.value = doc2.id;
                                $rootScope.validLocations1.push(doc);
                            }

                        });

                    }else if(doc.name === 'King\'s Cross' || doc.name === 'Kings Cross'  ){
                        locs.forEach(function(doc2){
                            if(doc2.name === 'King\'s Cross' || doc2.name === 'Kings Cross'){
                                doc.value = doc2.id;
                                $rootScope.validLocations1.push(doc);
                            }

                        });

                    }else if(doc.name === 'All'){
                        $rootScope.validLocations1.push(doc);
                    }

                });
            })
            .error(function(err){
                console.log(err);
            });
    };
    getLocations();
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        Auth.isAuthorized(next.data.authorizedRoles).then(function (isAuthorized) {
            //console.log('is Auth resolved');
            if (!isAuthorized)
                $location.path('/login');
        }, function (err) {
            //console.log('is Auth resolved in err');
            //console.log(err);
            $location.path('/login');
        });
    });


});

angular.module('app').controller('Guest',
    function ($scope, $rootScope, $resource, $location, $window, toaster, errors, $timeout) {
        $scope.sendpro = true;
        var Guest = $resource('/guests/:id', {id: '@id'}, {
            checkin: {method: 'POST', params: {}, responseType: 'json'}
        }, {/*empty options*/});
        $scope.guest = {};
        $scope.guest.location = $window.localStorage.getItem('guest_defaultLocation');
        if ($scope.guest.location == "undefined" || $scope.guest.location == "null" || $scope.guest.location === null) $scope.guest.location = 'Spitalfields';

        $scope.$watch('guest.location', function () {
            $window.localStorage.setItem('guest_defaultLocation', $scope.guest.location);
        });

        $scope.validTypes = types;
        $scope.guest.type = $scope.validTypes[0];
        $scope.validLocations = locations;
        $scope.lastLocation = 'Spitalfields';
        $scope.defaultType = $scope.validTypes[0];
        //$scope.phonePattern = /^([0-9]{3,4})?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/;
        $scope.phonePattern = /^[\+](?:[0-9] ?){6,14}[0-9]$/;
        $scope.namePattern = /^[a-zA-Z0-9 .'-]+ [a-zA-Z0-9 .'-]+$/;
        $scope.guest.sendPromotions = true;
        $scope.guest.plus18 = true;

        //$timeout(function(){
            if($rootScope.returningGuest){
                $rootScope.returningGuest = false;
                $scope.guest = angular.copy($rootScope.guest);
                //$scope.guest.phone = $scope.guest.phone.substring(1,$scope.guest.phone.length);

                $scope.returningGuest = true;
                $timeout(function(){
                    $('#ph').focus();
                    $( '#nameinput' ).focus();
                },100);

            }
        //},5000);


        showError = function (err) {
            if (!err)
                toaster.error(errors.UNKNOWN);
            else if (err.status == 403)
                toaster.error(errors.UNAUTHORIZED);
            else if (err.status == 400)
                toaster.error(errors.BAD);
            else
                toaster.error(errors.UNKNOWN);
        };

        $scope.submitForm = function (isValid) {
            if (isValid) {
                $scope.guest.plus18 = !$scope.guest.under18;
                if($scope.guest.phone.charAt(0)!='+') $scope.guest.phone = '+'+$scope.guest.phone;
                new Guest($scope.guest).$save(function (data, headers) {
                    $(".modal-backdrop");
                    $('#addGuest').modal('hide');

                    // TODO: When Success Reset Form
                    // TODO: Post Success
                    $rootScope.lastGuest = data;
                    $location.path('/welcome');

                }, function (err) {
                    // TODO: Create Error Translator on Server and add helpful errors here
                    showError(err);
                });
            } else {

                if (!$scope.$$childHead) {
                    toaster.error(errors.RELOAD);
                } else {
                    $scope.$$childHead.guestForm.name.$pristine = false;
                    $scope.$$childHead.guestForm.residentName.$pristine = false;
                    $scope.$$childHead.guestForm.email.$pristine = false;
                    $scope.$$childHead.guestForm.phone.$pristine = false;
                    if ($scope.$$childHead.guestForm.name.$invalid) {
                        toaster.error(errors.BAD_NAME);
                    } else if ($scope.$$childHead.guestForm.email.$invalid) {
                        toaster.error(errors.BAD_RESIDENT);
                    } else if ($scope.$$childHead.guestForm.phone.$invalid) {
                        toaster.error(errors.BAD_PHONE);
                    } else if ($scope.$$childHead.guestForm.residentName.$invalid) {
                        toaster.error(errors.BAD_EMAIL);
                    } else {
                        toaster.error(errors.BAD);
                    }
                }
            }

        };
    });


angular.module('app').controller('Welcome',
    function ($scope, $rootScope, $location) {
        //$scope.locationImage="";


        var timer;

        function startTimer() {
            timer = setTimeout(function () {
                window.open("/#!/", "_self");

            }, 60000);
        }
        startTimer();

        function stopTimer() {
            clearTimeout(timer);
        }

        $scope.checkin = function () {
            stopTimer();
            window.open("/#!/", "_self");
        };
        $scope.guest = $rootScope.lastGuest;
        $rootScope.validLocations.forEach(function(doc){
            if (doc.id ==  $scope.guest.locationId) $scope.guest.location = doc.name;
        });

        var userlocation = $scope.guest.location;
        if (userlocation === "Spitalfields") {
            $scope.locationImage = "/imgs/spitalfields-empty.png";
        }
        else if (userlocation === "Notting Hill") {
            $scope.locationImage = "/imgs/nottinghill-empty.png";
        }
        else if (userlocation === "Kings Cross") {
            $scope.locationImage = "/imgs/kingscross-empty.png";
        }


    });

angular.module('CustomFilter', []).
    filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        };
    });

angular.module('app').controller('AdminLogin',
    function ($scope, $rootScope, $resource, $location, toaster, Auth) {

        $scope.submitForm = function (isValid) {

            if (isValid) {
                Auth
                    .login($scope.admin.email, $scope.admin.password)
                    .then(function (data) {
                        if ($rootScope.currentUser.role == 'frontdesk' && $rootScope.currentUser.role == 'admin'){
                            $location.path('/manage');
                        }else if($rootScope.currentUser.role == 'admin'){
                            $location.path('/manage');
                        }else {
                            $location.path('/login');
                        }

                    }, function (err) {
                        // TODO: Create Error Translator on Server and add helpful errors here
                        if (err.status == 401) {
                            toaster.error(errors.WRONG_LOGIN);
                        } else {
                            toaster.error(errors.UNKNOWN);
                        }

                    });
            }

        };
    });

