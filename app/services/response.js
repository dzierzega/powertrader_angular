var module = angular.module('myApp.responseService', []);

module.service('responseService', function ($location) {
    this.handleResponse = function (status) {
        switch (status) {
            case 200:
                break;
            case 403:   //forbidden
                $location.path('/');
                break;
            case 400:
                break;
        }

    }
});