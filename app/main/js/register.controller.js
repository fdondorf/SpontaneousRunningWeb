angular.module('app.main')
    .controller('RegisterCntl', function ($scope, $sce, globalSpinner, positionStateNotification, register, $location,  $window, REGISTER_SUCCESS_DLG_PATH) {
        
        'use strict';
        
        register($scope, function () {
            
            console.log("Registered user: " + JSON.stringify(register.registeredUser));
            
            console.log("Navigate To: " + REGISTER_SUCCESS_DLG_PATH) ;
            $location.path(REGISTER_SUCCESS_DLG_PATH);
            $window.location.href = $location.absUrl();
        })      
});
