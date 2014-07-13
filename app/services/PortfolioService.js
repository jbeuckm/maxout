angular.module('maxout').factory('portfolioService', function($http) {

    return {
        loadPortfolio: function() {
            return JSON.parse(localStorage.getItem('accounts'));
        },

        savePortfolio: function(accounts) {
            localStorage.setItem('accounts', JSON.stringify(accounts));
        }
    };

});
