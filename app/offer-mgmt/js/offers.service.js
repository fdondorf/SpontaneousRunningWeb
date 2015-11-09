angular.module('app.offer-mgmt').factory('offers', function (offerManagementRestService) {
    'use strict';
    
    // variables that won't be exposed outside
    var paginatedSpecials = {};
        
    return {
        loadAllOffers: function () {
            return offerManagementRestService.getAllOffers().then(function (response) {
                return response.data;
            });
        },
        loadSpecial: function (id) {
            return offerManagementRestService.getSpecial(id).then(function (response) {
                return response.data;
            });
        },
        saveSpecial: function (special) {
            return offerManagementRestService.saveSpecial(special).then(function (response) {
                return response.data;
            });
        },
        loadAllProducts: function () {
            return offerManagementRestService.getAllProducts().then(function (response) {
                return response.data;
            });
        },
        // fetches specials including pagination
        getPaginatedSpecials: function (pagenumber, pagesize) {
            return offerManagementRestService.getPaginatedSpecials(pagenumber, pagesize).then(function (response) {
                angular.copy(response.data, paginatedSpecials);
                return paginatedSpecials;
            });
        }
    };
});
