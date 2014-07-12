
angular.module('maxout').controller('MainController', ['$scope', 'PortfolioService', function($scope, PortfolioService){

    $scope.accounts = PortfolioService.loadPortfolio() || [];

    $scope.compoundPeriod = 30;
    $scope.transferPeriod = 30;

    $scope.guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    $scope.addAccount = function(){
        $scope.accounts.push({
            id: $scope.guid(),
            accountType: $scope.accountType,
            title: $scope.titleText,
            balance: parseFloat($scope.balanceText),
            apr: parseFloat($scope.aprText) / 100,
            compoundPeriod: parseFloat($scope.compoundPeriod),
            transferPeriod: parseFloat($scope.transferPeriod),
            transferAmount: parseFloat($scope.transferAmount)
        });
    };

    // save after any and every change in the accounts array
    $scope.$watch('accounts', function(){
        PortfolioService.savePortfolio($scope.accounts);
    }, true);

    $scope.removeAccount = function(index) {
        return $scope.accounts.splice(index, 1);
    };

}]);
