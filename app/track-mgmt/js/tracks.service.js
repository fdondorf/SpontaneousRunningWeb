angular.module('app.track-mgmt').factory('tracks', function (trackManagementRestService) {
    'use strict';
    
    // variables that won't be exposed outside
    var paginatedTracks = {};
        
    return {
        loadTrack: function (id) {
            return trackManagementRestService.getTrack(id).then(function (response) {
                return response.data;
            });
        },
        saveTrack: function (track) {
            return trackManagementRestService.saveTrack(track).then(function (response) {
                return response.data;
            });
        },
        deleteTrack: function (id) {
            return trackManagementRestService.deleteTrack(id).then(function (response) {
                return response.data;
            });
        },
        // fetches tracks including pagination
        getPaginatedTracks: function (pagenumber, pagesize) {
            return trackManagementRestService.getPaginatedTracks(pagenumber, pagesize).then(function (response) {
                angular.copy(response.data, paginatedTracks);
                return paginatedTracks;
            });
        }
    };
});
