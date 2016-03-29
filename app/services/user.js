var module = angular.module('myApp.userService', []);

module.service('userService', function ($q, $rootScope, $location, $http,$cookies) {
    this.login = function (username, password) {
        var defered = $q.defer();
        $rootScope.headers.Authorization = "Basic "
                + btoa(username + ":" + password);
        $http({
            method: 'GET',
            headers: $rootScope.headers,
            url: 'http://localhost:8080/login'
        }).success(function (data, status, headers, config) {
            $rootScope.error.status = false;
            $rootScope.authenticated = true;
            $rootScope.user = data;
            $cookies.put('userDetails',JSON.stringify(data));
            defered.resolve(data);

        }).error(function (data, status, headers, config) {
            $rootScope.error.status = true;
            if (status == 401) {
                $rootScope.error.message = "Sorry, you entered an invalid username and password combination";
            }
            defered.reject(data);
        });
        return defered.promise;
    };

    this.getToken = function () {
        var defered = $q.defer();
        $http({
            method: 'GET',
            headers: $rootScope.headers,
            url: 'http://localhost:8080/token'
        }).success(function (response) {
            $rootScope.headers["X-Auth-Token"] = response.token;
            $cookies.put('token',response.token);
            delete $rootScope.headers.Authorization;
            $http({
                method: 'GET',
                headers: $rootScope.headers,
                url: 'http://localhost:8080/token'
            }); // GET XSRF-TOKEN FOR AUTHENTICATED X-AUTH-TOKEN
            defered.resolve(response);
        }).error(function (response) {
            defered.reject(response);
        });
        return defered.promise;
    };

    this.logout = function () {
        $http({
            method: 'POST',
            headers: $rootScope.headers,
            url: 'http://localhost:8080/logout'
        }).success(function () {
            $rootScope.authenticated = false;
            $rootScope.headers = {};
            $location.path("/");
            $cookies.remove('token');
            $cookies.remove('userDetails');
        }).error(function (data) {
            $rootScope.authenticated = false;
            $rootScope.headers = {};
        });
    }
    
    this.getXsrfToken = function(){
        $http({
            method: 'GET',
            url: 'http://localhost:8080/xtoken'
        }).success(function () {
        }).error(function (data) {
        });
    };
    
    this.register = function (user) {
        var defered = $q.defer();
        $http({
             method: 'POST',
                        url: 'http://localhost:8080/user/',
                        data: user,
                        headers: $rootScope.headers
        }).success(function (data, status, headers, config) {

            defered.resolve(data);

        }).error(function (data, status, headers, config) {
            alert(data.message);
            defered.reject(data);
        });
        return defered.promise;
    };

});