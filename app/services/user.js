var module = angular.module('myApp.userService', []);

module.service('userService', function ($q, $rootScope, $location, $http) {
    this.login = function (username, password) {
        var defered = $q.defer();
        $rootScope.headers.Authorization = "Basic "
                + btoa(username + ":" + password);
        $http({
            method: 'GET',
            headers: $rootScope.headers,
            url: 'http://localhost:8080/login'
        }).success(function (data, status, headers, config) {
            $rootScope.authenticated = true;
            $rootScope.user = {};
            $rootScope.user.username = data.name;
            defered.resolve(data);

        }).error(function (data, status, headers, config) {
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
            delete $rootScope.headers.Authorization;
            defered.resolve(response);
            $http({
                method: 'GET',
                headers: $rootScope.headers,
                url: 'http://localhost:8080/token'
            }); // this http is for refreshing the xsrf-token after authorization
        }).error(function (resposne) {
            defered.reject(response);
        });
        return defered.promise;
    }
});