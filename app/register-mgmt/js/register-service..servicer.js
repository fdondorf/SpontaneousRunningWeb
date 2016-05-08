angular.module('app.register-mgmt').factory('registerService', function (registerRestService) {
    'use strict';
      
    return {
        register: function (user) {
            
            console.log("RegisterService called: " + JSON.stringify(user));
            return registerRestService.registerUser(user).then(function (response) {
                return response.data;
            });
        }
    };
});
