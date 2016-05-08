angular.module('app.main')
    .controller('AppCntl', function (SIGN_IN_DLG_PATH, REGISTER_DLG_PATH, $scope, $location, $window, $modal, appContext, oaspSecurityService,
    globalSpinner) {
    'use strict';

    appContext.getCurrentUser().then(function (currentUser) {
        $scope.currentUser = currentUser;
    });

    $scope.logOff = function () {
        var goToSignInDialogFullyReloadingApp = function () {
            $location.path(SIGN_IN_DLG_PATH);
            $window.location.href = $location.absUrl();
            $window.location.reload();
        };
        globalSpinner.decorateCallOfFunctionReturningPromise(function () {
            return oaspSecurityService.logOff();
        }).then(function () {
            goToSignInDialogFullyReloadingApp();
        });
    };
      
    $scope.register = function () {
        
        console.log("App.Controller: Register() called!");
        
        var goToRegisterDialog = function () {
            $location.path(REGISTER_DLG_PATH);
            $window.location.href = $location.absUrl();
        };
        
        goToRegisterDialog();
    };

    // $scope function definition for calling modal dialog for login. 
    // The function is indirectly called in the track-search.html -
    // the function call is hidden behind the buttonBar directive.
    $scope.openSignInDialog = function (user) {
        // modal dialog call
        // The modal dialog configuration is provided by the object passed as a parameter of $modal.open function.
        // The object indicates:
        // - modal dialog url
        // - controller for modal dialog
        // - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
        // For more details regarding $modal service please see https://angular-ui.github.io/bootstrap/#/modal
        $modal.open({
            templateUrl: 'main/html/sign-in-dialog.html',
            controller: 'SignInCntl'
        }).result.finally(function () {
           ;
        });
    };
});