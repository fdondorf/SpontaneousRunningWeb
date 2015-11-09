angular.module('app.track-mgmt').controller('TrackDetailsCntl',
    function ($scope, $sce, trackDetails, tracks, globalSpinner, positionStateNotification) {
        
        'use strict';
        
        $scope.model = {};
        //$scope.model.selectedActivityType = allOffers.length ? allOffers[0] : undefined;
        
        $scope.track = trackDetails;
        //$scope.allActivityTypes = allOffers;
		//var allOffersFiltered = allOffers.filter(function (offer) {
		//	return offer.id === $scope.special.offerId;
		//});
        //$scope.selectedOffer = allOffersFiltered.length > 0 ? allOffersFiltered[0] : null;

        
        $scope.submit = function () {
            globalSpinner.decorateCallOfFunctionReturningPromise(function () {
				console.log("Saving track: " + JSON.stringify($scope.track));
                //$scope.special.activePeriod.endingDay = $scope.special.activePeriod.endingDay;
                //$scope.special.activePeriod.startingDay = $scope.special.activePeriod.startingDay;
                return tracks.saveTrack($scope.track);
            }).then(function () {
                $scope.$close();
            });
        };
        
		//$scope.selectActivityType = function (item, model) {
		//	$scope.selectedActivityType = item;
		//	$scope.sp.offerId = item.id;
		//};
       
        $scope.trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
        };

        // form container to access forms added in parent scopes
        $scope.forms = {};
    });
