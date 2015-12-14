'use strict';
angular.module('myApp.register', ['ngRoute'])
        .run(function (formlyConfig) {

            /*
             ngModelAttrs stuff
             */

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

        .controller('RegisterCtrl', ["$http", function ($http) {
                var vm = this;
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
                                        className: "col-md-6",
                                        key: 'name',
                                        type: 'input',
                                        templateOptions: {
                                            type: 'text',
                                            label: 'First Name',
                                            placeholder: 'Enter First Name',
                                            required: true
                                        }
                                    }, {
                                        className: "col-md-6",
                                        key: 'surname',
                                        type: 'input',
                                        templateOptions: {
                                            type: 'text',
                                            label: 'Last Name',
                                            placeholder: 'Enter Last Name',
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
                                        templateOptions: {
                                            type: 'email',
                                            label: 'Email address',
                                            placeholder: 'Enter email',
                                            required: true
                                        }
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
                                            required: true
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
                                            required: true
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
                                hideExpression:"model.userType!='customer'"
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
                                hideExpression:"model.userType!='company'"
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
                    alert(JSON.stringify(vm.model), null, 2);
                };
            }
        ]);

