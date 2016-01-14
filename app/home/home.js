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
.controller('homeCtrl', ["$rootScope", "$scope", "$http","$location","userService", function ($rootScope, $scope, $http,$location,userService) {
        $scope.logout = function () {
            userService.logout();
        }
       
    }]);
