angular.module('maxout').factory('portfolioService', function($http) {

    var data = [];
    var added = [];
    var removed = [];

    function addItem(item) {
        added.push(item);
        data.push(item);
    }

    function removeItem(item) {
        var index = items.indexOf(item);
        if (index >= 0) {
            removed.push(item);
            data.splice(index, 1);
        }
    }

    function loadPortfolio() {
        var accounts = JSON.parse(localStorage.getItem('accounts'));
        for (var i= 0, l=accounts.length; i<l; i++) {
            addItem(accounts[i]);
        }
    }
    function savePortfolio() {
        localStorage.setItem('accounts', JSON.stringify(data));
    }

    return {
        save: savePortfolio,
        load: loadPortfolio,

        addItem: addItem,
        removeItem: removeItem,

        accounts: data,
        added: added,
        removed: removed
    };

});
