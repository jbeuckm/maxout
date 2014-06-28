
function BalanceCalculator(account, depositAmount, depositPeriod) {
    this.balance = parseFloat(account.balance);
    this.apr = parseFloat(account.apr);
    this.compoundPeriod = parseFloat(account.compoundPeriod);

    this.depositAmount = parseFloat(depositAmount);
    this.depositPeriod = parseFloat(depositPeriod);
}

BalanceCalculator.prototype.getDataUntil = function(endDate) {

    var balances = [];

    var now = moment();
    while (now.isBefore(endDate)) {

        if ( (this.balance <= 0) && ((this.balance+this.depositAmount) >= 0) ) {
            console.log("debt paid "+now.format('YY-MMM-D'));
            balances.push({
                date: now.format('YY-MMM-D'),
                balance: 0
            });
            return balances;
        }

        this.balance += this.depositAmount;

        balances.push({
            date: ""+now.format('YY-MMM-D'),
            balance: this.balance
        });

        now.add('days', this.depositPeriod);
    }

    return balances;
};
