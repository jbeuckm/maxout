/**
 * Find balance data over time for a given account.
 *
 * @param account
 * @constructor
 */
function BalanceCalculator(account) {

    this.title = account.title;
    this.accountType = account.accountType;
    this.complete = false;

    this.balance = account.balance;
    this.apr = account.apr;
    this.compoundPeriod = account.compoundPeriod;

    this.transferAmount = account.transferAmount;
    this.transferPeriod = account.transferPeriod;
}

/**
 * Calculate balance changes for now until the given end date.
 * @param endDate
 */
BalanceCalculator.prototype.calculateBalancesUntil = function(endDate) {

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

                if (this.complete) {
                    this.recordBalance(balances, event.date, 0);
                }
                else if (this.testZeroCrossing(this.balance, event.amount)) {
                    this.recordBalance(balances, event.date, 0);
                    this.complete = true;
                }
                else {
                    this.balance += event.amount;
                    this.recordBalance(balances, event.date, this.balance);
                }
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

                var bal = this.calculateAverageBalance(averageBalanceAccumulator);
                averageBalanceAccumulator = [];

                var yearFraction = bal.duration / 365;

                this.balance += yearFraction * event.apr * bal.average;
                this.recordBalance(balances, event.date, this.balance);

                break;
        }
    }

    return balances;
};

BalanceCalculator.prototype.testZeroCrossing = function(balance, amount) {
    if (balance >= 0 && (balance + amount) <= 0) {
        return true;
    }
    else if (balance <= 0 && (balance + amount) >= 0) {
        return true;
    }
    return false;
};

/**
 * Find recent average balance in order to apply interest
 *
 * @param values
 * @return {Object}
 */
BalanceCalculator.prototype.calculateAverageBalance = function(values) {
    var totalBalance= 0, totalDuration=0;
    for (var i= 0, l=values.length; i<l; i++) {
        var value = values[i];
        totalBalance += value.days * value.balance;
        totalDuration += value.days;
    }
    return {
        average: totalBalance / totalDuration,
        duration: totalDuration
    };
};

/**
 * Add a datum to the given working array.
 *
 * @param balances
 * @param date
 * @param balance
 */
BalanceCalculator.prototype.recordBalance = function(balances, date, balance) {
    var data = {
        date: date,
        balance: balance,
        y: balance
    };

    balances.push(data);
};

/**
 * Get appropriate balance increment for event type.
 *
 * @return {*}
 */
BalanceCalculator.prototype.getTransferEventAmount = function() {
    switch (this.accountType) {
        case 'loan':
            return -this.transferAmount;
        case 'investment':
            return this.transferAmount;
    }
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
            amount: this.getTransferEventAmount()
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
