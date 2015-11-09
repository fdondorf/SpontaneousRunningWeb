angular.module('app.offer-mgmt')
    // SpecialSearchCntl definition
    // The definition contains:
    // - controller name as a first parameter
    // - controller constructor function with dependencies as a function parameters (injection of angular $scope object, UI Bootstrap $modal and
    // other OASP services)
    // For more details regarding controller concept and assigning model and behavior to $scope object, please check:
    // https://docs.angularjs.org/guide/controller
    .controller('SpecialSearchCntl', function ($scope, $modal, offers, paginatedSpecialsList) {
        'use strict';
        
        // Internal controller function returning the selected row in the specials table.
        // In general - if function should not be exposed outside (like for example $scope functions called in the html template)
        // they should be defined as variables with var keyword usage.
        var selectedSpecial = function () {
            return $scope.selectedItems && $scope.selectedItems.length ? $scope.selectedItems[0] : undefined;
        };
        
         // creating model - assigning data to $scope object. Data may come from different sources:
        // calculated by the controller logic / simple assignments / data from injected services
        $scope.selectedItems = [];
        $scope.maxSize = 5;
        $scope.totalItems = paginatedSpecialsList.pagination.total;
        $scope.numPerPage = paginatedSpecialsList.pagination.size;
        $scope.currentPage = paginatedSpecialsList.pagination.page;

        $scope.gridOptions = {
            data: paginatedSpecialsList.result
        };

        // function used in pagination - it loads tables when the table page is changed
        $scope.reloadSpecials = function () {
            // calling service tables.getPaginatedTables function
            // The function fetches data from server (it creates http.get request).
            // The response handling (in case of success) is placed in the function wrapped in the 'then' object - the lines of code placed in there
            // will be executed when the successful response from server comes back.
            // The response is passed as a parameter of this function ('res' object).
            // For more info regarding running functions asynchronously please check: https://docs.angularjs.org/api/ng/service/$q
            offers.getPaginatedSpecials($scope.currentPage, $scope.numPerPage).then(function (res) {
                // These lines are executed only after successful server response.
                paginatedSpecialsList = res;
                $scope.gridOptions.data = paginatedSpecialsList.result;
            });
        };
        
        // $scope function definition for calling modal dialog for special edition. 
        // The function is indirectly called in the special-search.html -
        // the function call is hidden behind the buttonBar directive.
        $scope.openEditDialog = function (specialRow) {
            // modal dialog call
            // The modal dialog configuration is provided by the object passed as a parameter of $modal.open function.
            // The object indicates:
            // - modal dialog url
            // - controller for modal dialog
            // - members that will be resolved and passed to the controller as locals; it is equivalent of the resolve property for AngularJS routes
            // For more details regarding $modal service please see https://angular-ui.github.io/bootstrap/#/modal
            $modal.open({
                templateUrl: 'offer-mgmt/html/special-details.html',
                controller: 'SpecialDetailsCntl',
                resolve: {
                    allOffers: function () {
					return offers
						.loadAllOffers()
						.then(function (response) {
							console.log("All Offers: " + JSON.stringify(response));
							return response;
						  }
						);
				    },
                    
                    specialDetails: function () {
					if (specialRow) {
						var loadedSpecial = offers.loadSpecial(specialRow.id);
						return loadedSpecial;
					} else {
						// create
						return {
							"name": null,
							"offerId": null,
							"specialPrice": null,
							"activePeriod": {
								startingDay : null,
								startingHour : null,
								endingDay : null,
								endingHour : null
							}
						}
					   }
				    }
	 
                }
            }).result.finally(function () {
                $scope.reloadSpecials();
            });
        };
        
        // button definitions for managing tables (5 buttons under the html table on the table-search dialog)
        // The button definitions are passed into buttonBar directive (<button-bar button-defs="buttonDefs"></button-bar> in the html template).
        // The button bar directive is defined in the button-bar.directive.js file.
        // The html template of the directive is defined in the button-bar.html file.
        // In general <button-bar> html tag will be replaced in the table-search.html by the code of button-bar.html template.
        // Clicking on the buttons will run the functions specified below.
        // For more info regarding directives, please check: https://docs.angularjs.org/guide/directive
        $scope.buttonDefs = [
            {
                label: 'Edit...',
                onClick: function () {
                    // opens update special dialog on edit button click
                    $scope.openEditDialog(selectedSpecial());
                },
                isActive: function () {
                    // makes button active when there is a table selected
                    return selectedSpecial();
                }
            },
            {
                label: 'Create...',
                onClick: function () {
                    // opens update special dialog on edit button click
                    $scope.openEditDialog(selectedSpecial());
                },
                isActive: function () {
                    // makes button active when there is a table selected
                    return true;
                }
            },
            {
                label: 'Delete...',
                onClick: function () {
                    // opens update special dialog on edit button click
                    $scope.openEditDialog(selectedSpecial());
                },
                isActive: function () {
                    // makes button active when there is a table selected
                    return selectedSpecial();
                }
            }
        ];
    });