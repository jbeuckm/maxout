importScripts('../../bower_components/moment/moment.js');
importScripts('BalanceCalculator.js');


/**
 * Worker thread computes balances for each account.
 */
self.addEventListener('message', function(e) {

    calculateBalances(e.data);

}, false);

function calculateBalances(accounts) {

    var calculators = {};
    var data = [];
    for (var i= 0, l=accounts.length; i<l; i++) {
        var account = accounts[i];
        calculators[account.title] = new BalanceCalculator(account);

        var datum = {
            name: account.title,
            accountType: account.accountType,
            values: calculators[account.title].calculateBalancesUntil(moment().add('years', 15))
        };

        var firstDate = datum.values[0].date;
        var lastDate = datum.values[datum.values.length-1].date;
        datum.dateRange = [firstDate, lastDate];

        data.push(datum);
    }

    self.postMessage(data);
}


