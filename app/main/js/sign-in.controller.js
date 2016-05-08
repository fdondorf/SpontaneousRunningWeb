angular.module('app.main')
    .controller('SignInCntl', function ($scope, $sce, $location, appContext, signIn) {
        'use strict';
        signIn($scope, function () {
            
            console.log("SignInCntl signIn called!");
            
            appContext.getCurrentUser().then(function (currentUser) {
                $scope.$close();
                $location.url(currentUser.getHomeDialogPath());
            });
        });
       
    });