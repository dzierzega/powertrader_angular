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
  'myApp.home',
  'myApp.login',
  'myApp.register',
  'myApp.view2',
  'myApp.offers'
]).
config(['$routeProvider','$httpProvider', function($routeProvider,$httpProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
  $httpProvider.defaults.xsrfCookieName = '_csrf';
  $httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
  $httpProvider.defaults.withCredentials = true;
}]).run(function($rootScope) {
    $rootScope.headers = {};
});
