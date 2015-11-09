angular.module('app.track-mgmt')
    // TrackSearchCntl definition
    // The definition contains:
    // - controller name as a first parameter
    // - controller constructor function with dependencies as a function parameters (injection of angular $scope object, UI Bootstrap $modal and
    // other OASP services)
    // For more details regarding controller concept and assigning model and behavior to $scope object, please check:
    // https://docs.angularjs.org/guide/controller
    .controller('TrackSearchCntl', function ($scope, $modal, tracks, paginatedTracksList) {
        'use strict';
        
        // Internal controller function returning the selected row in the tracks table.
        // In general - if function should not be exposed outside (like for example $scope functions called in the html template)
        // they should be defined as variables with var keyword usage.
        var selectedTrack = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };
        
         // creating model - assigning data to $scope object. Data may come from different sources:
        // calculated by the controller logic / simple assignments / data from injected services
        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedTracksList.pagination.total;
        $scope.numPerPage = paginatedTracksList.pagination.size;
        $scope.currentPage = paginatedTracksList.pagination.page;

        $scope.gridOptions = {
            data: paginatedTracksList.result
        };

        // function used in pagination - it loads tracks when the tracks page is changed
        $scope.reloadTracks = function () {
            // calling service tracks.getPaginatedTables function
            // The function fetches data from server (it creates http.get request).
            // The response handling (in case of success) is placed in the function wrapped in the 'then' object - 
            // the lines of code placed in there will be executed when the successful response from server comes back.
            // The response is passed as a parameter of this function ('res' object).
            // For more info regarding running functions asynchronously please check: https://docs.angularjs.org/api/ng/service/$q
            tracks.getPaginatedTracks($scope.currentPage, $scope.numPerPage).then(function (res) {
                // These lines are executed only after successful server response.
                paginatedTracksList = res;
                $scope.gridOptions.data = paginatedTracksList.result;
            });
        };
        
        // $scope function definition for calling modal dialog for track edition. 
        // The function is indirectly called in the track-search.html -
        // the function call is hidden behind the buttonBar directive.
        $scope.openEditDialog = function (trackRow) {
            // modal dialog call
            // The modal dialog configuration is provided by the object passed as a parameter of $modal.open function.
            // The object indicates:
            // - modal dialog url
            // - controller for modal dialog
            // - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
            // For more details regarding $modal service please see https://angular-ui.github.io/bootstrap/#/modal
            $modal.open({
                templateUrl: 'track-mgmt/html/track-details.html',
                controller: 'TrackDetailsCntl',
                resolve: {
                    trackDetails: function () {
					if (trackRow) {
						var loadedTrack = tracks.loadTrack(trackRow.id);
						return loadedTrack;
					} else {
						// create
						return {
							"name": null,
							"totalDistance": null,
							"totalDuration": null
						}
					   }
				    }
	 
                }
            }).result.finally(function () {
                $scope.reloadTracks();
            });
        };
        
        // $scope function definition for calling modal dialog for track deletion. 
        // The function is indirectly called in the track-search.html -
        // the function call is hidden behind the buttonBar directive.
        $scope.openDeleteDialog = function (trackRow) {
            // modal dialog call
            // The modal dialog configuration is provided by the object passed as a parameter of $modal.open function.
            // The object indicates:
            // - modal dialog url
            // - controller for modal dialog
            // - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
            // For more details regarding $modal service please see https://angular-ui.github.io/bootstrap/#/modal
            $modal.open({
                templateUrl: 'track-mgmt/html/track-delete.html',
                controller: 'TrackDeleteCntl',
                resolve: {
                    trackDetails: function () {
                        if (trackRow) {
                            var loadedTrack = tracks.loadTrack(trackRow.id);
                            return loadedTrack;
                        }
                    }
                }
            }).result.finally(function () {
                $scope.reloadTracks();
            });
        };
        
        // button definitions for managing tracks (5 buttons under the html table on the track-search dialog)
        // The button definitions are passed into buttonBar directive (<button-bar button-defs="buttonDefs"></button-bar> in the html template).
        // The button bar directive is defined in the button-bar.directive.js file.
        // The html template of the directive is defined in the button-bar.html file.
        // In general <button-bar> html tag will be replaced in the track-search.html by the code of button-bar.html template.
        // Clicking on the buttons will run the functions specified below.
        // For more info regarding directives, please check: https://docs.angularjs.org/guide/directive
        $scope.buttonDefs = [
            {
                label: 'Edit...',
                onClick: function () {
                    // opens update special dialog on edit button click
                    $scope.openEditDialog(selectedTrack());
                },
                isActive: function () {
                    // makes button active when there is a track selected
                    return selectedTrack();
                }
            },
            {
                label: 'Create manually...',
                onClick: function () {
                    // opens update track dialog on edit button click
                    $scope.openEditDialog(selectedTrack());
                },
                isActive: function () {
                    // makes button active when there is no track selected
                    return selectedTrack() === undefined;
                }
            },
            {
                label: 'Delete...',
                onClick: function () {
                    // opens update track dialog on edit button click
                    $scope.openDeleteDialog(selectedTrack());
                },
                isActive: function () {
                    // makes button active when there is a track selected
                    return selectedTrack();
                }
            }
        ];
    });