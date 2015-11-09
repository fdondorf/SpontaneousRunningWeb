angular.module('app.track-mgmt').controller('TrackDeleteCntl',
    function ($scope, $sce, trackDetails, tracks, globalSpinner, positionStateNotification) {
        
        'use strict';
        
        $scope.model = {}; 
        $scope.track = trackDetails;
        
        $scope.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
				console.log("Delete track: " + JSON.stringify($scope.track));
                return tracks.deleteTrack($scope.track.id);
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
