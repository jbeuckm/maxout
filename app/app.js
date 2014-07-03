
angular.module('maxout', ['percentage', 'angularMoment']).config(function(){

});

angular.module('maxout').controller('MainController', ['$scope', 'PortfolioService', function($scope, PortfolioService){

    $scope.accounts = PortfolioService.loadPortfolio() || [];
//    $scope.accounts = [];

    $scope.addAccount = function(){
        $scope.accounts.push({
            title: $scope.titleText,
            balance: parseFloat($scope.balanceText),
            apr: parseFloat($scope.aprText),
            compoundPeriod: parseFloat($scope.compoundPeriod),
            transferPeriod: parseFloat($scope.transferPeriod),
            transferAmount: parseFloat($scope.transferAmount)
        });

        PortfolioService.savePortfolio($scope.accounts);
    };

    $scope.removeAccount = function(index) {
        $scope.accounts.splice(index, 1);
        PortfolioService.savePortfolio($scope.accounts);
    };

}]);
