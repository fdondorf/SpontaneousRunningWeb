angular.module('app.track-mgmt').controller('TrackDetailsCntl',
    function ($scope, $sce, trackDetails, tracks, appContext, globalSpinner, positionStateNotification) {
        
        'use strict';
        
        $scope.model = {};

        $scope.track = trackDetails;
        
        $scope.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
				console.log("Saving track: " + JSON.stringify($scope.track));
                //appContext.get
                return tracks.saveTrack($scope.track);
            }).then(function () {
                $scope.$close();
            });
        };

        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };

        // form container to access forms added in parent scopes
        $scope.forms = {};
    });
