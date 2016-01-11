'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider','$httpProvider', function ($routeProvider,$httpProvider){
  $routeProvider.when('/home', {
                    templateUrl: 'home/home.html',
                    controller: 'homeCtrl',
                    controllerAs: 'vm'
                });
                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}])
.controller('homeCtrl', ["$rootScope", "$scope", "$http","$location", function ($rootScope, $scope, $http,$location) {
        $scope.logout = function () {
             $http({
                        method: 'GET',
                        headers: $rootScope.headers,
                        url: 'http://localhost:8080/logout'
                    }).success(function () {
                $rootScope.authenticated = false;
                $rootScope.headers = {};
                $location.path("/");
            }).error(function (data) {
                $rootScope.authenticated = false;
                $rootScope.headers = {};
            });
        }
    }]);
