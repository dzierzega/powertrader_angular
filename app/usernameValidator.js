'use strict';
angular.module('myApp.usernameValidator',['ngRoute']).directive('usernameValidator', function($http, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.username = function(modelValue, viewValue) {
                return $http.post('/username-check', {username: viewValue}).then(
                    function(response) {
                        if (!response.data.validUsername) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };
});