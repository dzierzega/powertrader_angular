'use strict';

angular.module('myApp.offers', ['ngRoute'])

        .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
                $routeProvider.when('/offers', {
                    templateUrl: 'offers/offers.html',
                    controller: 'OffersCtrl',
                    controllerAs: 'vm'
                });
                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
            }])

        .controller('OffersCtrl', ["$http","$rootScope", function ($http,$rootScope) {
                $http({
                    method: 'GET',
                     url: 'http://localhost:8080/offer/',
                     headers: $rootScope.headers
                }).then(function successCallback(response) {
                    alert(response.data);
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    alert(response);
                });
            }]);

