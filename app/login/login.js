'use strict';

angular.module('myApp.login', ['ngRoute'])

        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm'
                });


            }])

        .controller('LoginCtrl', ["$rootScope", "$scope", "$http", "$location", "$cookies","userService", function ($rootScope, $scope, $http, $location, $cookies, userService) {

                $scope.credentials = {};
                $scope.login = function () {

                    userService.login($scope.credentials.username, $scope.credentials.password).then(function (data) {
                        if ($rootScope.authenticated) {
                            userService.getToken().then(function (data) {
                                if (data.token) {
                                    $location.path('/');
                                } else {
                                    alert('unable to get token');
                                }

                            });
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

