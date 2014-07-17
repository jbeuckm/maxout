angular.module('maxout').factory('portfolioService', function() {

    var data = [];
    var added = [];
    var removed = [];

    function addItem(item, skipSave) {
        added.push(item);
        data.push(item);
        if (!skipSave) {
            savePortfolio();
        }
    }

    function removeItem(index) {
//        var index = items.indexOf(item);
        var item = data[index];
        if (index >= 0) {
            removed.push(item);
            data.splice(index, 1);
        }
        savePortfolio();
    }

    function loadPortfolio() {
        var accounts = JSON.parse(localStorage.getItem('accounts'));
        if (!accounts) {
            accounts = [];
        }
        for (var i= 0, l=accounts.length; i<l; i++) {
            addItem(accounts[i], true);
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
