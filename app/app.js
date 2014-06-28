
angular.module('maxout', ['percentage']).config(function(){

});

angular.module('maxout').controller('MainController', ['$scope', 'PortfolioService', function($scope, PortfolioService){

    $scope.accounts = PortfolioService.loadPortfolio() || [];

    $scope.addAccount = function(){
        $scope.accounts.push({
            title: $scope.titleText,
            balance: $scope.balanceText,
            apr: $scope.aprText,
            compoundPeriod: $scope.compoundPeriod
        });

        PortfolioService.savePortfolio($scope.accounts);
    };

}]);
