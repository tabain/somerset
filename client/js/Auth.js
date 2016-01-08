app.factory("Auth", function ($http, $q, $rootScope) {
    var user;

    var initialization;
    $( "html" ).removeClass( "background-client" );
    function init() {
        initialization = $q.defer();
        $http.get('/me')
            .success(function (data, headers) {
                user = data;
                $rootScope.currentUser = user;
                initialization.resolve(user);
            })
            .error(function (err) {
                initialization.reject(err);
            });
    }

    init();

    function login(email, password) {
        var deferred = $q.defer();

        $http.post("/login", {
            email: email,
            password: password
        }).then(function (result) {
            user = result.data;
            $rootScope.currentUser = user;
            //$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            deferred.resolve(user.data);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function isAuthorized(authorizedRoles) {
        var deferred = $q.defer();
        var promiseCompleted = false;

        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }

        if (authorizedRoles.indexOf('*') !== -1) {
            deferred.resolve(true);
            return deferred.promise;
        }

        deferred.promise.then(function (data) {
            //console.log(data);
            promiseCompleted = true;
        }, function (err) {
            //console.log(err);
            promiseCompleted = true;
        });

        if (user) {
            deferred.resolve(user &&
            authorizedRoles.indexOf(user.role) !== -1);
            return deferred.promise;
        }

        initialization.promise.then(function (user) {

            //console.log('initialization promise received');
            if (promiseCompleted) return;

            deferred.resolve(user &&
            authorizedRoles.indexOf(user.role) !== -1);
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    function isLoggedIn() {
        return user ? true : false;
    }

    function logout() {
        var deferred = $q.defer();

        $http({
            method: "POST",
            url: '/logout'
        }).then(function (result) {
            //$window.sessionStorage["userInfo"] = null;
            user = null;
            $rootScope.currentUser = user;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getUserInfo() {
        return user;
    }

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo,
        isLoggedIn: isLoggedIn,
        isAuthorized: isAuthorized
    };
});