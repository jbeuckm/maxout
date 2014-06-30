
function BalanceCalculator(account, depositAmount, depositPeriod) {
    this.balance = parseFloat(account.balance);
    this.apr = parseFloat(account.apr);
    this.compoundPeriod = parseFloat(account.compoundPeriod);

    this.transferAmount = parseFloat(depositAmount);
    this.transferPeriod = parseFloat(depositPeriod);
}

/**
 * Calculate balance changes for now until the given end date.
 * @param endDate
 */
BalanceCalculator.prototype.getDataUntil = function(endDate) {

    var events = this.generateEvents(endDate);

    var balances = [];

    var averageBalanceAccumulator = [];
    var lastAverageBalanceDate = moment();

    for (var i= 0, l=events.length; i<l; i++) {
        var event = events[i];
        switch (event.type) {

            case "transfer":

                // keep track of days at previous balance
                var duration = event.date.diff(lastAverageBalanceDate, 'days');
                if (duration > 0) {
                    averageBalanceAccumulator.push({
                        days: duration,
                        balance: this.balance
                    });
                    lastAverageBalanceDate = event.date;
                }

                this.balance += event.amount;
                this.recordBalance(balances, event.date, this.balance);

                break;

            case "compound":

                // keep track of days at previous balance
                var duration = event.date.diff(lastAverageBalanceDate, 'days');
                if (duration > 0) {
                    averageBalanceAccumulator.push({
                        days: duration,
                        balance: this.balance
                    });
                    lastAverageBalanceDate = event.date;
                }

                var averageBalance = this.calculateAverageBalance(averageBalanceAccumulator);
                averageBalanceAccumulator = [];

                break;
        }
    }

    return balances;
};

BalanceCalculator.prototype.calculateAverageBalance = function(vals) {
    console.log(vals);
};

BalanceCalculator.prototype.recordBalance = function(balances, date, balance) {
    balances.push({
        balance: balance,
        date: date.format('YY-MMM-D')
    });
};

/**
 * Build the list of deposits and compound events
 * @param endDate
 */
BalanceCalculator.prototype.generateEvents = function(endDate) {
    var deposits = [], compounds = [], t = moment();

    while (t.isBefore(endDate)) {
        t.add('days', this.transferPeriod);
        deposits.push({
            date: t.clone(),
            type: 'transfer',
            amount: this.transferAmount
        });
    }

    t = moment();
    while (t.isBefore(endDate)) {
        t.add('days', this.compoundPeriod);
        compounds.push({
            date: t.clone(),
            type: 'compound',
            apr: this.apr
        });
    }

    function compareDates(a, b) {
        if (a.date < b.date) {
            return -1;
        }
        else if (a.date == b.date) {
            return 0;
        }
        else {
            return 1;
        }
    }

    return this.mergeEventLists(deposits, compounds, compareDates);
};


/**
 * Mergesort
 *
 * @param left
 * @param right
 * @param compareFunction
 * @return {Array}
 */
BalanceCalculator.prototype.mergeEventLists = function(left, right, compareFunction) {

    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < left.length && ir < right.length){
        if (compareFunction(left[il], right[ir]) <= 0){
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
};
