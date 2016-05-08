angular.module('app.main').factory('registerRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/registerManagement/v1';

    return {

        // Registers a user
        registerUser: function ($scope, user) {
            console.log("RegisterRestService: Register user: " + JSON.stringify(user));

            $http.get('main/js/registeredUser.json').then(function(regResponse) {
                $scope.regUser = regResponse.data;
                console.log("RegisterRestService: Scope.RegUser" + JSON.stringify($scope.regUser));
            });
            
            return $http.get('main/js/registeredUser.json');
        } 
    };
});
