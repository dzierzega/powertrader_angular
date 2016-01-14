'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'formly',
    'formlyBootstrap',
    'ui.bootstrap',
    'mgo-angular-wizard',
    'myApp.responseService',
    'myApp.userService',
    'myApp.home',
    'myApp.login',
    'myApp.register',
    'myApp.view2',
    'myApp.offers'
]).
        config(['$routeProvider', '$httpProvider', '$cookiesProvider', function ($routeProvider, $httpProvider, $cookies) {
                $routeProvider.otherwise({redirectTo: '/home'});
//  $httpProvider.defaults.xsrfCookieName = '_csrf';
//  $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
                $httpProvider.defaults.withCredentials = true;
                $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
                $httpProvider.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
                $httpProvider.defaults.xsrfCookieName = "XSRF-TOKEN";
            }]).run(function ($rootScope, $http, $cookies, responseService) {
    $rootScope.headers = {};
    $rootScope.error = {};
    if ($cookies.get('XSRF-TOKEN')) {
       // document.cookie = "XSRF-TOKEN=; expires=" + new Date(0).toUTCString() + "; path=/;"
    }
    $http.defaults.transformRequest.push(function (data, headers) {
        if ($cookies.get('XSRF-TOKEN')) {
         //   document.cookie = "XSRF-TOKEN=; expires=" + new Date(0).toUTCString() + "; path=/;";
        }
        
        return data;
    });
    $http.defaults.transformResponse.push(function (data, headers) {

        if (data && data.status) {
            responseService.handleResponse(data.status);
        }
if ($cookies.get('XSRF-TOKEN')) {
            $rootScope.headers["X-XSRF-TOKEN"] = $cookies.get('XSRF-TOKEN');
//            $http.defaults.headers.common["X-XSRF-TOKEN"]= $cookies.get('XSRF-TOKEN');
//            headers()['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');
        }
        return data;
    });
});
