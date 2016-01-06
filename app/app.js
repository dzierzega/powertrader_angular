'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
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
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
