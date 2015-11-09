angular.module('app.track-mgmt').factory('trackManagementRestService', function ($http, currentContextPath) {
    'use strict';

    var servicePath = currentContextPath.get() + 'services/rest/trackmanagement/v1';

    return {

        // Saves a track
        saveTrack: function (track) {
            return $http.post(servicePath + '/track/', track);
        },
        // gets the list of tracks with pagination support
        getPaginatedTracks: function (pagenumber, pagesize) {
                var trackSearchCriteria = {
                    pagination: {
                        size: pagesize,
                        page: pagenumber,
                        total: true
                    }
                };
                return $http.post(servicePath + '/track/search', trackSearchCriteria);
        },
        // load a track with the given id
        getTrack: function (id) {
            return $http.get(servicePath + '/track/' + id)
        },
        // delete the track with the given id
        deleteTrack: function (id) {
            return $http.delete(servicePath + '/track/' + id)
        }  
    };
});
