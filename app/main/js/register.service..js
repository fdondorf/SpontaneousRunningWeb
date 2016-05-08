angular.module('app.main')
    .factory('register', function (registerRestService, globalSpinner) {
        'use strict';
        
        return function ($scope, registrationSuccessCallback) {
         
           
           $scope.regUser = {
               registeredUser: 'Testuser 1',
               getUser: function () {
                   return this.registeredUser;
               }
           };
           
            $scope.errorMessage = {
                text: '',
                hasOne: function () {
                    return this.text ? true : false;
                },
                clear: function () {
                    this.text = '';
                }
            };

            $scope.validationReg = {
                firstnameNotProvided: function () {
                    return ($scope.registerForm.firstname.$dirty || this.forceShowingValidationErrors) &&
                        $scope.registerForm.firstname.$error.required;
                },
                lastnameNotProvided: function () {
                    console.log("Lastname dirty: " + $scope.registerForm.lastname.$dirty);
                    return ($scope.registerForm.lastname.$dirty || this.forceShowingValidationErrors) &&
                        $scope.registerForm.lastname.$error.required;
                },
                newUserNameNotProvided: function () {
                    return ($scope.registerForm.userName.$dirty || this.forceShowingValidationErrors) &&
                        $scope.registerForm.userName.$error.required;
                },
                newPasswordNotProvided: function () {
                    return ($scope.registerForm.password.$dirty || this.forceShowingValidationErrors) &&
                        $scope.registerForm.password.$error.required;
                },
                emailNotProvided: function () {
                    return ($scope.registerForm.email.$dirty || this.forceShowingValidationErrors) &&
                        $scope.registerForm.email.$error.required;
                },
                forceShowingValidationErrors: false
            };
            
            $scope.register = function() {
                console.log("Register Service: " + JSON.stringify($scope.user));

                var addErrorMessageAndClearForm = function (message) {
                    $scope.errorMessage.text = message;
                    $scope.user = {};
                    $scope.validationReg.forceShowingValidationErrors = false;
                    $scope.registerForm.$setPristine();
                };
                
                if ($scope.registerForm.$invalid) {
                    $scope.validationReg.forceShowingValidationErrors = true;
                } else {
                    globalSpinner.decorateCallOfFunctionReturningPromise(function () {
                        return registerRestService.registerUser($scope, $scope.user);
                    }).then(function () {
                        registrationSuccessCallback();
                    }, function () {
                        addErrorMessageAndClearForm('Registration failed. Please try again!');
                    });
                }
            }
            
        };
    });

