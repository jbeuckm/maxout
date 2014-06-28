
angular.module('maxout', ['percentage']).config(function(){

});

angular.module('maxout').controller('MainController', ['$scope', function($scope){

    $scope.accounts = [
        {
            title: "savings",
            balance: 100,
            apr:.07,
            compoundPeriod: 1
        },
        {
            title: "loan",
            balance: -100,
            apr:.0375,
            compoundPeriod: 30
        }
    ];

    $scope.addAccount = function(){
        $scope.accounts.push({
            title: $scope.titleText,
            balance: $scope.balanceText,
            apr: $scope.aprText,
            compoundPeriod: $scope.compoundPeriod
        });
    };

}]);
