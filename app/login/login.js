'use strict';

angular.module('myApp.login', ['ngRoute'])

        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm'
                });
                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            }])

        .controller('LoginCtrl', ["$rootScope", "$scope", "$http", "$location", function ($rootScope, $scope, $http, $location) {

                var authenticate = function (credentials, callback) {

                    var headers = credentials ? {Authorization: "Basic "
                                + btoa(credentials.username + ":" + credentials.password)
                    } : {};

                    $http({
                        method: 'GET',
                        headers: headers,
                        url: 'http://localhost:8080/login/'
                    }).success(function (data) {
                        if (data.name) {
                            $rootScope.authenticated = true;
                            $http({
                                method: 'GET',
                                url: 'http://localhost:8080/offer/1',
                                headers: headers,                                
                            }).success(function (response) {
                                $http({
                                    method: 'GET',
                                    url: 'http://localhost:8080/offer/',
                                    headers: headers
//                                    headers: {
//                                        'X-Auth-Token': response.token
//                                    }
                                }).success(function(response){
                                    alert(response);
                                }).error(function(response){
                                   alert(response); 
                                });
                                $rootScope.token = response.token;
                            }).error(function (response) {
                                alert('unable to get token');
                            });
                        } else {
                            $rootScope.authenticated = false;
                        }
                        //callback && callback();
                    }).error(function () {
                        $rootScope.authenticated = false;
                        callback && callback();
                    });

                }

                authenticate();
                $scope.credentials = {};
                $scope.login = function () {
                    authenticate($scope.credentials, function () {
                        if ($rootScope.authenticated) {
                            $location.path("/");
                            $scope.error = false;
                        } else {
                            $location.path("/login");
                            $scope.error = true;
                        }
                    });
                };


                $scope.logout = function () {
                    $http.post('logout', {}).success(function () {
                        $rootScope.authenticated = false;
                        $location.path("/");
                    }).error(function (data) {
                        $rootScope.authenticated = false;
                    });
                }
            }]);
