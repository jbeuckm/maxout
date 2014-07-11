importScripts('../../bower_components/moment/moment.js');
importScripts('BalanceCalculator.js');


/**
 * Worker thread computes balances for each account.
 */
self.addEventListener('message', function(e) {

    calculateBalance(e.data);

}, false);

function calculateBalance(account) {

    var calculator = new BalanceCalculator(account);

    var values = calculator.calculateBalancesUntil(moment().add('years', 15));

    var firstDate = values[0].date;
    var lastDate = values[values.length-1].date;

    self.postMessage({
        account: account,
        name: account.title,
        accountType: account.accountType,
        values: values,
        dateRange: [firstDate, lastDate]
    });
}


