'use strict';

angular.module('myApp.login', ['ngRoute'])

        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm'
                });


            }])

        .controller('LoginCtrl', ["$rootScope", "$scope", "$http", "$location", "$cookies", "LoginService", function ($rootScope, $scope, $http, $location, $cookies, LoginService) {
                // co musi byc wysylane:
                // authorization - credidentiale
                // X-Auth-Token - z endpointa /token
                //X-XSRF-TOKEN - to co dostajesz z serwera
//                var authenticate = function (credentials, callback) {
//                    $rootScope.headers.Authorization = "Basic "
//                                + btoa(credentials.username + ":" + credentials.password);
//                    var headers = credentials ? {Authorization: "Basic "
//                                + btoa(credentials.username + ":" + credentials.password)
//                    } : {};
//
//                    $http({
//                        method: 'GET',
//                        headers: $rootScope.headers,
//                        url: 'http://localhost:8080/token'
//                    }).success(function (data) {
//                        if (data.token) {      
//                                $rootScope.authenticated = true;
//                                $rootScope.headers['X-Auth-Token'] = data.token;
//                        } else {
//                            $rootScope.authenticated = false;
//                        }
//                        //callback && callback();
//                    }).error(function () {
//                        $rootScope.authenticated = false;
//                        callback && callback();
//                    });
//
//                }


                $scope.credentials = {};
//                 authenticate();
                $scope.login = function ($cookies) {
                     LoginService.login($scope.credentials.username, $scope.credentials.password,$cookies).then(function (data) {
                         console.log(data);
                     });
//                    authenticate($scope.credentials, function () {
//                        if ($rootScope.authenticated) {
//                            $location.path("/");
//                            $scope.error = false;
//                        } else {
//                            $location.path("/login");
//                            $scope.error = true;
//                        }
//                    });
                };


                $scope.logout = function () {
                    $http.post('logout', {}).success(function () {
                        $rootScope.authenticated = false;
                        $location.path("/");
                    }).error(function (data) {
                        $rootScope.authenticated = false;
                    });
                }
            }]).factory('LoginService', function ($q, $http,$rootScope) {
    var login = function (username, password) {
        var defered = $q.defer();
        $rootScope.headers.Authorization = "Basic "
                + btoa(username + ":" + password);
        $http({
            method: 'GET',
            headers: $rootScope.headers,
            url: 'http://localhost:8080/token'
        }).success(function (data, status, headers, config) {
            $rootScope.headers["X-Auth-Token"] = data.token;
            delete $rootScope.headers.Authorization;
            $http({
                method:'POST',
                headers:$rootScope.headers,
                url: 'http://localhost:8080/offer/'
            }).success(function(data){
                console.log(data);
            }).error(function(data){
                 console.log(data);
            });
            defered.resolve(data);
        }).error(function (data, status, headers, config) {
            defered.reject(data);
        });
        return defered.promise;
    };
    return {
        login: login
    };
});
;

