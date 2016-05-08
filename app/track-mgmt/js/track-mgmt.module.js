
/*
 app.track-mgmt module definition
 For details regarding angular.module() syntax please check: https://docs.angularjs.org/api/ng/function/angular.module
 The definition contains:
 - the name of the module (app.track-mgmt) as a first parameter
 - array of dependencies to other angular modules as a second parameter
 - optional configuration function as a third parameter. The Angular provider $routeProvider and OASP provider oaspTranslationProvider are injected
 into configuration function.
 */
angular.module('app.track-mgmt', ['ngRoute', 'app.track-mgmt', 'app.main', 'app.tableMgmt.templates'], 
    function ($routeProvider, oaspTranslationProvider) {
    
    'use strict';
    
    // calling method of the oaspTranslationProvider in order to enable i18n support in the whole module
    oaspTranslationProvider.enableTranslationForModule('track-mgmt');
    
    // adding a new route definition for the given url postfix
    // Basically if there will be successful path match then a new dialog will be opened with:
    // - template indicated by templateUrl property
    // - controller indicated by the controller property
    // - dependencies injected into controller indicated by the resolve property ({Object.<string, function>=} map)
    // For details regarding AngularJS $routeProvider please check: https://docs.angularjs.org/api/ngRoute/provider/$routeProvider.
    $routeProvider.when('/track-mgmt/track-search', {
        templateUrl: 'track-mgmt/html/track-search.html',
        controller: 'TrackSearchCntl',
        resolve: {
            // Please notice that the TrackSearchCntl has paginatedTrackList injected.
            // Before loading the dialog, the function defined below will be called.
            // The function is defined in the tracks service (please see tracks service defined in the tracks.service.js file).
            // The function will load the tracks data before dialog is loaded. Later on the data is used by the TrackSearchCntl.
            
            paginatedTracksList: ['tracks', function (tracks) {
                return tracks.getPaginatedTracks(1, 4).then(function (paginatedTracksList) {
                    return paginatedTracksList;
                });
            }]
        }
    });
}).directive('panel', function() {
    return {
        restrict:'E',
        scope: {
            items: '=',
            user: '=',
            index: '='
        },
        templateUrl:'track-mgmt/html/trackPanel1.html'
    }
});

