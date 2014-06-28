
angular.module('maxout', ['percentage']).config(function(){

});

angular.module('maxout').controller('MainController', ['$scope', function($scope){

    $scope.accounts = [
        {
            title: "savings",
            balance: 100,
            rate:.07,
            compound_period: 1
        },
        {
            title: "loan",
            balance: -100,
            rate:.0375,
            compound_period: 30
        }
    ];

    $scope.addAccount = function(){

    };

}]);
