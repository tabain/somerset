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
        }).when('/frontdesk', {
            templateUrl: '/views/frontdesk.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.frontdesk]
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
        $( "html" ).removeClass( "background-client" );
        $scope.submitForm = function (isValid) {

            if (isValid) {
                Auth
                    .login($scope.admin.email, $scope.admin.password)
                    .then(function (data) {
                        if ($rootScope.currentUser.role == 'frontdesk'){
                            $location.path('/frontdesk');
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

