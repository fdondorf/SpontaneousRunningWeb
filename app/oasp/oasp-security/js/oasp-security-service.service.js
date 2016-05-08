angular.module('oasp.oaspSecurity')
    .provider('oaspSecurityService', function () {
        'use strict';
        var config = {
            securityRestServiceName: 'securityRestService',
            appContextServiceName: 'appContext'
        };

        return {
             
            setSecurityRestServiceName: function (securityRestServiceName) {
                config.securityRestServiceName = securityRestServiceName || config.securityRestServiceName;
            },
            setAppContextServiceName: function (appContextServiceName) {
                config.appContextServiceName = appContextServiceName || config.appContextServiceName;
            },
            $get: function ($injector, $http, $q, $rootScope) {
                var currentCsrfProtection = {
                        set: function (headerName, token) {
                            this.headerName = headerName;
                            this.token = token;
                        },
                        invalidate: function () {
                            this.headerName = undefined;
                            this.token = undefined;
                        }
                    },
                    currentCsrfProtectionWrapper = (function () {
                        return {
                            hasToken: function () {
                                return currentCsrfProtection.headerName && currentCsrfProtection.token ? true : false;
                            },
                            getHeaderName: function () {
                                return currentCsrfProtection.headerName;
                            },
                            getToken: function () {
                                return currentCsrfProtection.token;
                            }
                        };
                    }()),
                    currentUserProfileHandler = (function () {
                        var currentUserProfile,
                            profileBeingInitialized = false,
                            deferredUserProfileRetrieval;

                        return {
                            initializationStarts: function () {
                                profileBeingInitialized = true;
                                deferredUserProfileRetrieval = $q.defer();
                            },
                            initializationSucceeded: function (newUserProfile) {
                                currentUserProfile = newUserProfile;
                                profileBeingInitialized = false;
                                deferredUserProfileRetrieval.resolve(currentUserProfile);
                                deferredUserProfileRetrieval = undefined;
                            },
                            initializationFailed: function () {
                                currentUserProfile = undefined;
                                profileBeingInitialized = false;
                                deferredUserProfileRetrieval.resolve(currentUserProfile);
                                deferredUserProfileRetrieval = undefined;
                            },
                            userLoggedOff: function () {
                                currentUserProfile = undefined;
                            },
                            getProfile: function () {
                                return profileBeingInitialized ? deferredUserProfileRetrieval.promise : $q.when(currentUserProfile);
                            }
                        };
                    }()),
                    getSecurityRestService = function () {
                        return $injector.get(config.securityRestServiceName);
                    },
                    getAppContextService = function () {
                        return $injector.get(config.appContextServiceName);
                    },
                    enableCsrfProtection = function () {
                        return getSecurityRestService().getCsrfToken()
                            .then(function (response) {
                                var csrfProtection = response.data;
                                // from now on a CSRF token will be added to all HTTP requests
                                $http.defaults.headers.common[csrfProtection.headerName] = csrfProtection.token;
                                currentCsrfProtection.set(csrfProtection.headerName, csrfProtection.token);
                                return csrfProtection;
                            }, function () {
                                return $q.reject('Requesting a CSRF token failed');
                            });
                    };

                return {
                    watchLoginChange: function() {

                        var _self = this;
                        
                        FB.Event.subscribe('auth.authResponseChange', function(res) {
                        
                            console.log("Status: " + res.status);
                            
                            if (res.status === 'connected') {
                            
                                /* 
                                The user is already logged, 
                                is possible retrieve his personal info
                                */
                               var promise = _self.getUserInfoSocial();
                               promise.then(function(userInfo) {
                                    console.log("UserInfoFB: " + JSON.stringify(userInfo));
                                    //_self.logIn(userInfo.email, userInfo.id);
                               }, function(reason) {
                                    alert('Failed: ' + reason);
                               }, function(update) {
                                    alert('Got notification: ' + update);
                               });

                                /*
                                This is also the point where you should create a 
                                session for the current user.
                                For this purpose you can use the data inside the 
                                res.authResponse object.
                                */
                                // _self.logInSocial();
                            } 
                            else {
                        
                                /*
                                The user is not logged to the app, or into Facebook:
                                destroy the session on the server.
                                */
                            }
                        });
                    },
                    getUserInfoSocial: function() {
                        var deferred = $q.defer();
                        FB.api('/me', {
                            fields: 'id, name, first_name, last_name, email'
                        }, function(response) {
                            if (!response || response.error) {
                                deferred.reject('Error occured');
                            } else {
                                deferred.resolve(response);
                            }
                        });
                        return deferred.promise;
                    },
                    getUserInfo: function() {
        
                        var _self = this;
                        
                        FB.api('/me',  function(res) {
                        
                            console.log("Me:" + JSON.stringify(res));
                            $rootScope.$apply(function() { 
                                $rootScope.user = _self.user = res;
                                console.log("Me:" + JSON.stringify(res));
                            });
                        
                        });
                    },
                    logInFBOld: function() {
        
                        var _self = this;
                        
                        FB.login(function(res) {
                            if (res.authResponse) {
                                console.log("Hello! Login to FB successful!");
                                _self.getUserInfoSocial();
                            }
                            else {
                                console.log("Login to FB not successful!");
                            }
                        
                        }, {scope: 'id, name, first_name, last_name, email'});
                    },
                    signInFB: function() {
      
                        FB.login(function(response) {
                            if (response.authResponse) {
                                console.log('Welcome!  Fetching your information.... ');
                                FB.api('/me', function(response) {
                                    console.log('Good to see you, ' + response.name + '.');
                                });
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                            }
                        });  
                    },
                    logout: function() {
        
                        var _self = this;
                        
                        FB.logout(function(response) {
                
                            $rootScope.$apply(function() { 
                                $rootScope.user = _self.user = {}; 
                                console.log('Good bye: Response ' + response + '.');
                            }); 
                        
                        });
                    },
                    logoutDeferred: function() {
                      var deferred = $q.defer();
                       FB.logout(function(response) {
                            if (!response || response.error) {
                                deferred.reject('Error during logout occured');
                            } else {
                                deferred.resolve(response);
                            }
                        });
                        return deferred.promise;  
                    },
                    logInFB: function (username, password) {
                        var logInDeferred = $q.defer();
                        currentUserProfileHandler.initializationStarts();
                        
                         FB.login(function(response) {
                            if (response.authResponse) {
                                console.log('Welcome!  Fetching your information.... ');
                                FB.api('/me', {
                                    fields: 'id, name, first_name, last_name, email'
                                }, function(response) {
                                    console.log('Good to see you, ' + response.name + ', ' + response.email + ", " + response.id);
                                     getSecurityRestService().login(response.email, response.id)
                                        .then(function () {
                                            $q.all([
                                                getSecurityRestService().getCurrentUser(),
                                                enableCsrfProtection()
                                            ]).then(function (allResults) {
                                                var userProfile = allResults[0].data;
                                                currentUserProfileHandler.initializationSucceeded(userProfile);
                                                getAppContextService().onLoggingIn(userProfile);
                                                logInDeferred.resolve();
                                            }, function (reject) {
                                                currentUserProfileHandler.initializationFailed();
                                                logInDeferred.reject(reject);
                                            });
                                        }, function () {
                                            currentUserProfileHandler.initializationFailed();
                                            logInDeferred.reject('Authentication failed');
                                        });
                                });
                            } else {
                                console.log('User cancelled login or did not fully authorize.');
                                currentUserProfileHandler.initializationFailed();
                                logInDeferred.reject('Authentication failed');
                            }
                        }); 
                       
                        return logInDeferred.promise;
                    },
                    logIn: function (username, password) {
                        var logInDeferred = $q.defer();
                        currentUserProfileHandler.initializationStarts();
                        getSecurityRestService().login(username, password)
                            .then(function () {
                                $q.all([
                                    getSecurityRestService().getCurrentUser(),
                                    enableCsrfProtection()
                                ]).then(function (allResults) {
                                    var userProfile = allResults[0].data;
                                    currentUserProfileHandler.initializationSucceeded(userProfile);
                                    getAppContextService().onLoggingIn(userProfile);
                                    logInDeferred.resolve();
                                }, function (reject) {
                                    currentUserProfileHandler.initializationFailed();
                                    logInDeferred.reject(reject);
                                });
                            }, function () {
                                currentUserProfileHandler.initializationFailed();
                                logInDeferred.reject('Authentication failed');
                            });
                        return logInDeferred.promise;
                    },
                    logOff: function () {
                        
                        var _self = this;
                        
                        _self.logout();
                        return getSecurityRestService().logout()
                            .then(function () {
                                currentCsrfProtection.invalidate();
                                currentUserProfileHandler.userLoggedOff();
                                getAppContextService().onLoggingOff();
                            })
                    },
                    checkIfUserIsLoggedInAndIfSoReinitializeAppContext: function () {
                        currentUserProfileHandler.initializationStarts();
                        getSecurityRestService().getCurrentUser()
                            .then(function (response) {
                                var userProfile = response.data;
                                enableCsrfProtection().then(function () {
                                    currentUserProfileHandler.initializationSucceeded(userProfile);
                                    getAppContextService().onLoggingIn(userProfile);
                                }, function () {
                                    currentUserProfileHandler.initializationFailed();
                                });
                            }, function () {
                                currentUserProfileHandler.initializationFailed();
                            });
                    },
                    getCurrentCsrfToken: function () {
                        return currentCsrfProtectionWrapper;
                    },
                    getCurrentUserProfile: function () {
                        return currentUserProfileHandler.getProfile();
                    }
                };
            }
        };
    });