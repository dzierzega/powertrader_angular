'use strict';
angular.module('myApp.register', ['ngRoute', 'ngMessages'])
        .run(function (formlyConfig) {

            /*
             ngModelAttrs stuff
             */
            formlyConfig.setWrapper({
                name: 'loader',
                template: [
                    '<formly-transclude></formly-transclude>',
                    '<span class="glyphicon glyphicon-refresh loader" ng-show="to.loading"></span>'
                ].join(' ')
            });
            formlyConfig.setType({
                name: 'input-loader',
                extends: 'input',
                wrapper: ['loader']
            });

            formlyConfig.setType([
                {
                    name: 'input',
                    templateUrl: 'input-template.html'
                },
                {
                    name: 'checkbox',
                    templateUrl: 'checkbox-template.html'
                }
            ]);
            formlyConfig.setWrapper([
                {
                    template: [
                        '<div class="formly-template-wrapper form-group"',
                        'ng-class="{\'has-error\': options.validation.errorExistsAndShouldBeVisible}">',
                        '<label for="{{::id}}">{{options.templateOptions.label}} {{options.templateOptions.required ? \'*\' : \'\'}}</label>',
                        '<formly-transclude></formly-transclude>',
                        '<div class="validation alert-danger"',
                        'ng-if="options.validation.errorExistsAndShouldBeVisible"',
                        'ng-messages="options.formControl.$error">',
                        '<div ng-messages-include="validation.html"></div>',
                        '<div ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">',
                        '{{message(options.formControl.$viewValue, options.formControl.$modelValue, this)}}',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(' '),
                    types: 'input'
                },
                {
                    template: [
                        '<div class="checkbox formly-template-wrapper-for-checkboxes form-group">',
                        '<label for="{{::id}}">',
                        '<formly-transclude></formly-transclude>',
                        '</label>',
                        '</div>'
                    ].join(' '),
                    types: 'checkbox'
                },
                {
                    template: '<formly-transclude></formly-transclude><div my-messages="options"></div>',
                    types: ['input-loader']
                }
            ]);
            var ngModelAttrs = {};
            function camelize(string) {
                string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
                // Ensure 1st char is always lowercase
                return string.replace(/^([A-Z])/, function (match, chr) {
                    return chr ? chr.toLowerCase() : '';
                });
            }

            /*
             timepicker
             */

            ngModelAttrs = {};
            // attributes
            angular.forEach([
                'meridians',
                'readonly-input',
                'mousewheel',
                'arrowkeys'
            ], function (attr) {
                ngModelAttrs[camelize(attr)] = {attribute: attr};
            });
            // bindings
            angular.forEach([
                'hour-step',
                'minute-step',
                'show-meridian'
            ], function (binding) {
                ngModelAttrs[camelize(binding)] = {bound: binding};
            });
            formlyConfig.setType({
                name: 'timepicker',
                template: '<uib-timepicker ng-model="model[options.key]"></uib-timepicker>',
                wrapper: ['bootstrapLabel', 'bootstrapHasError'],
                defaultOptions: {
                    ngModelAttrs: ngModelAttrs,
                    templateOptions: {
                        datepickerOptions: {}
                    }
                }
            });
        })
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/register', {
                    templateUrl: 'register/register.html',
                    controller: 'RegisterCtrl',
                    controllerAs: 'vm'
                });
            }])

        .controller('RegisterCtrl', ['$http', '$timeout', '$q', function ($http, $timeout, $q) {
                var vm = this;
                vm.exitValidation = function () {
                    if (vm.model.password === vm.model.passwordConfirm) {
                        return true;
                    } else {

                    }
                    return false;
                };
                vm.user = {};
                vm.finishWizard = finishWizard;
                // note, these field types will need to be
                // pre-defined. See the pre-built and custom templates
                // http://docs.angular-formly.com/v6.4.0/docs/custom-templates
                vm.userFields =
                        {
                            step1: [{
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-4",
                                            key: 'name',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'text',
                                                label: 'First Name',
                                                placeholder: 'Enter First Name',
                                                required: true
                                            }
                                        }, {
                                            className: "col-md-4",
                                            key: 'surname',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'text',
                                                label: 'Last Name',
                                                placeholder: 'Enter Last Name',
                                                required: true
                                            }
                                        },{
                                            className: "col-md-4",
                                            key: 'username',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'text',
                                                label: 'Username',
                                                placeholder: 'Enter Username',
                                                required: true
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        }]

                                },
                                {
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'email',
                                            type: 'input',
                                            ngModelElAttrs: {
                                                usernameValidator:""
                                            },
                                            templateOptions: {
                                                type: 'email',
                                                label: 'Email address',
                                                placeholder: 'Enter email',
                                                required: true,
                                                onKeydown: function (value, options) {
                                                    options.validation.show = false;
                                                },
                                                onBlur: function (value, options) {
                                                    options.validation.show = null;
                                                }
                                            },
//                                            asyncValidators: {
//                                                uniqueUsername: {
//                                                    expression: function ($viewValue, $modelValue, vm) {
//                                                        vm.options.templateOptions.loading = true;
//                                                        var value = $modelValue || $viewValue;
//
//                                                        return $timeout($http({
//                                                            method: 'GET',
//                                                            url: 'http://localhost:8080/user/find/' + value
//                                                        }).
//                                                                then(function (response) {
//                                                                    if (response.data === true) {
//                                                                        return false;
//                                                                    } else {
//                                                                        return true;
//                                                                    }
//
//                                                                }), 1000);
//                                                    },
//                                                    message: '"This email is already taken."'
//                                                }}

                                        }, {
                                            className: "col-md-6",
                                            key: "userType",
                                            type: "select",
                                            templateOptions: {
                                                label: "User Type",
                                                required: true,
                                                options: [
                                                    {
                                                        name: "Customer",
                                                        value: "customer"
                                                    },
                                                    {
                                                        name: "Company",
                                                        value: "company"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        }]
                                },
                                {
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'password',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'password',
                                                label: 'Password',
                                                placeholder: 'Password',
                                                required: true,
                                                //  pattern: /some_crazyPattern/,
                                                //  patternValidationMessage: '"Needs to match " + options.templateOptions.pattern'
                                            },
                                            validators: {
                                                passwordConfirm: {
                                                    expression: function (viewValue, modelValue, vm) {
                                                        vm.form[vm.form.$name + '_input_passwordConfirm_2'].$validate();
                                                      //  vm.form.formly_1_input_passwordConfirm_2.$validate();
                                                        return true;
                                                    },
                                                    message: '"Password and password confirmation must be the same!"'
                                                }
                                            }

                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'passwordConfirm',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'password',
                                                label: 'Password Confirmation',
                                                placeholder: 'Password Confirmation',
                                                required: true,
                                                //pattern: "([0-9A-F]{2}[:-]){5}([0-9A-F]{2})"
                                            },
                                            validators: {
                                                passwordConfirm: {
                                                    expression: function (viewValue, modelValue, vm) {
                                                        var value = modelValue || viewValue;
                                                        if (vm.form[vm.form.$name + '_input_password_1'] && vm.form[vm.form.$name + '_input_password_1'].$viewValue === value) {
                                                            return true;
                                                        } else {
                                                            return false;
                                                        }
                                                    },
                                                    message: '"Password and password confirmation must be the same!"'
                                                }
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        },
                                    ],
                                }],
                            step2: [{
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-4",
                                            key: 'powerAmount',
                                            ngModelAttrs: {
                                                customAttrVal: {
                                                    attribute: "step"
                                                }
                                            },
                                            type: 'input',
                                            templateOptions: {
                                                type: 'number',
                                                label: 'How much power do you need?',
                                                placeholder: 'Power Amount',
                                                required: true,
                                                customAttrVal: "any"
                                            }
                                        },
                                        {
                                            key: "unit",
                                            className: "col-md-2",
                                            type: "select",
                                            templateOptions: {
                                                label: "Unit",
                                                required: true,
                                                options: [
                                                    {
                                                        name: "kWh",
                                                        value: "kwh"
                                                    },
                                                    {
                                                        name: "GWh",
                                                        value: "gwh"
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            key: "from",
                                            className: "col-md-3",
                                            type: "timepicker",
                                            templateOptions: {
                                                label: "Highest consumption from:"
                                            }
                                        },
                                        {
                                            key: "to",
                                            className: "col-md-3",
                                            type: "timepicker",
                                            templateOptions: {
                                                label: "Highest consumption to:"
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        },
                                    ],
                                    hideExpression: "model.userType!='customer'"
                                },
                                {
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'nip',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'text',
                                                label: 'Nip',
                                                placeholder: 'nip',
                                                required: true,
                                            }
                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'krs',
                                            type: 'input',
                                            templateOptions: {
                                                type: 'text',
                                                label: 'KRS',
                                                placeholder: 'KRS',
                                                required: true
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        },
                                    ],
                                    hideExpression: "model.userType!='company'"
                                },
                                {
                                    fieldGroup: [
                                        {
                                            template: "<div class='row'>"
                                        },
                                        {
                                            className: "col-md-6",
                                            key: 'checked',
                                            type: 'checkbox',
                                            templateOptions: {
                                                label: 'I agree to the terms & conditions',
                                                required: true
                                            }
                                        },
                                        {
                                            template: "</div>"
                                        },
                                    ]
                                }]
                        };
                vm.onSubmit = function (user) {
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/user/',
                        data: user
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        alert(response);
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        alert(response);
                    });
                }
                function finishWizard() {
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/user/',
                        data: vm.model
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        alert(response);
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        alert(response);
                    });
                    // alert(JSON.stringify(vm.model), null, 2);
                }
                ;
            }
        ]).directive('usernamevalidator', function($http, $q) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.email = function(modelValue, viewValue) {
                return $http({
                    method: 'GET',
                    url: 'http://localhost:8080/user/find/' + viewValue
                }).then(
                    function(response) {
                        if (response.data) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };
});;

