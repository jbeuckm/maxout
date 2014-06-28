
function BalanceCalculator(account, depositAmount, depositPeriod) {
    this.principal = parseFloat(account.balance);
    this.apr = parseFloat(account.apr);
    this.compoundPeriod = parseFloat(account.compoundPeriod);

    this.depositAmount = parseFloat(depositAmount);
    this.depositPeriod = parseFloat(depositPeriod);
}

BalanceCalculator.prototype.getDataUntil = function(endDate) {

    var balances = [];

    var now = moment();
    while (now.isBefore(endDate)) {

        this.principal += this.depositAmount;

        balances.push({
            date: ""+now.format('YY-MMM-D'),
            balance: this.principal
        });

        now.add('days', this.depositPeriod);
    }

    return balances;
};
