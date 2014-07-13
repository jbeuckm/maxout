angular.module('maxout').factory('listService', function ($http) {

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

    return {
        addItem: addItem,
        removeItem: removeItem,
        list: {
            items: data,
            added: added,
            removed: removed
        }
    };

});
