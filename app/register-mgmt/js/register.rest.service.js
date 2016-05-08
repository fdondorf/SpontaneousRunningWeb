angular.module('app.register-mgmt').factory('registerRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/registerManagement/v1';

    return {

        // Registers a user
        registerUser: function (user) {
            console.log("Register user: " + JSON.stringify(user));
            return;
            //return $http.post(servicePath + '/register/', user);
        } 
    };
});
