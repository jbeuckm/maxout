
angular.module('maxout').controller('MainController', ['$scope', 'portfolioService', function($scope, portfolioService){

    portfolioService.load();

    $scope.accounts = portfolioService.accounts;
    $scope.addedAccounts = portfolioService.added;
    $scope.removedAccounts = portfolioService.removed;
    $scope.savePortfolio = portfolioService.save;

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
        var account = {
            id: $scope.guid(),
            accountType: $scope.accountType,
            title: $scope.titleText,
            balance: parseFloat($scope.balanceText),
            apr: parseFloat($scope.aprText) / 100,
            compoundPeriod: parseFloat($scope.compoundPeriod),
            transferPeriod: parseFloat($scope.transferPeriod),
            transferAmount: parseFloat($scope.transferAmount)
        };

        portfolioService.addItem(account);
    };

    $scope.removeAccount = function(index) {
        portfolioService.removeItem(index);
    };

}]);
