angular.module('maxout').directive('projectionGraph', [function () {

    return {
        restrict: 'E',
//        require: "^ngModel",
        scope: {
            accounts: "=ngModel"
        },
        replace: 'true',
        template: '<svg id="graph"></svg>',
        link: function (scope, element, attributes) {

            var margin, width, height, parseDate, formatPercent,
                x, y, color, xAxis, yAxis, area, stack, svg;

            scope.$watch('accounts', function(){
                console.log('accounts changed');
                if (scope.accounts) {
                    scope.balanceData = calculateBalances(scope.accounts);
                    drawData(scope.balanceData);
                }
            });

            setup();


            function setup() {
                margin = {
                        top: 20, right: 100, bottom: 30, left: 100};
                    width = 960 - margin.left - margin.right;
                    height = 300 - margin.top - margin.bottom;

                parseDate = d3.time.format('%y-%b-%d').parse;
                formatPercent = d3.format(".0%");

                x = d3.time.scale()
                    .range([0, width]);

                y = d3.scale.linear()
                    .range([height, 0]);

                color = d3.scale.category20();

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                area = d3.svg.area()
                    .x(function(d) { return x(d.date); })
                    .y0(function(d) { return y(d.y0); })
                    .y1(function(d) { return y(d.y0 + d.y); });

                stack = d3.layout.stack()
                    .values(function(d) { return d.values; });

                svg = d3.select('#'+element[0].id)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }


            function drawData(data) {

                if (!data) return;

                var accountNames = data.map(function(d){ return d.name; });

                color.domain(accountNames);

                var accounts = data;

                var dateRanges = data.map(function(d){ return d.dateRange[0]; });
                dateRanges = dateRanges.concat(data.map(function(d){ return d.dateRange[1]; }));
                x.domain(d3.extent(dateRanges));

                var investments = [], loans = [];
                for (var i= 0, l=accounts.length; i<l; i++) {
                    var account = accounts[i];

                    switch (account.accountType) {
                        case 'investment':
                            investments.push(account);
                            break;
                        case 'loan':
                            loans.push(account);
                            break;
                    }
                }
                var min = 0, max = 0;

                if (loans.length > 0) {
                    stack(loans);
                    var lastLoan = loans[loans.length-1];
                    var firstValue = lastLoan.values[0];
                    min = firstValue.y0 + firstValue.y;
                }

                if (investments.length > 0) {
                    stack(investments);
                    var lastInvestment = investments[investments.length-1];
                    var lastValue = lastInvestment.values[lastInvestment.values.length-1];
                    max = lastValue.y0 + lastValue.y;
                }
                y.domain([-min, max]);

                drawSeries(loans, 'loan', true);
                drawSeries(investments, 'investment');

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);
            }

            function drawSeries(accounts, class_name, invert) {
                var account = svg.selectAll("."+class_name)
                    .data(accounts)
                    .enter().append("g")
                    .attr("class", class_name);

                function getValues(d) {
                    if (invert) {
                        return d.values.map(function(d){d.y *= -1; return d;});
                    }
                    else {
                        return d.values;
                    }
                }

                account.append("path")
                    .attr("class", "area")
                    .attr("d", function(d) { return area(getValues(d)); })
                    .style("fill", function(d) { return color(d.name); });

                account.append("text")
                    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) {
                        var xData = d.value.date;
                        var yData = d.value.y0 + d.value.y / 2;
                        return "translate(" + x(xData) + "," + y(yData) + ")";
                    })
                    .attr("x", -6)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; });

            }

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
                    datum.dateRange = d3.extent(datum.values, function(d) {
                        return d.date;
                    });
                    datum.balanceRange = d3.extent(datum.values, function(d) {
                        return d.balance;
                    });
                    data.push(datum);
                }

                return data;

            }

        }
    };

}]);


