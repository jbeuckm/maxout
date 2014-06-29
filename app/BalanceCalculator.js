
function BalanceCalculator(account, depositAmount, depositPeriod) {
    this.balance = parseFloat(account.balance);
    this.apr = parseFloat(account.apr);
    this.compoundPeriod = parseFloat(account.compoundPeriod);

    this.depositAmount = parseFloat(depositAmount);
    this.depositPeriod = parseFloat(depositPeriod);
}

/**
 * Calculate balance changes for now until the given end date.
 * @param endDate
 */
BalanceCalculator.prototype.getDataUntil = function(endDate) {

    var events = this.generateEvents(endDate);

    console.log(events);

};


/**
 * Build the list of deposits and compound events
 * @param endDate
 */
BalanceCalculator.prototype.generateEvents = function(endDate) {
    var deposits = [], compounds = [], t = moment();

    while (t.isBefore(endDate)) {
        deposits.push({
            date: t.format('X'),
            type: 'deposit',
            amount: this.depositAmount
        });
        t.add('days', this.depositPeriod);
    }

    t = moment();
    while (t.isBefore(endDate)) {
        compounds.push({
            date: t.format('X'),
            type: 'compound',
            apr: this.apr
        });
        t.add('days', this.compoundPeriod);
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
