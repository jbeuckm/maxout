angular.module('maxout').directive('projectionGraph', ['listService', function () {

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
                x, y, color, xAxis, yAxis, area, invertedArea, stack,
                svg, xAxisGroup, yAxisGroup, loanSeries, investmentSeries, calculatedBalances = {};

            scope.$watch('accounts', function(newVal, oldVal){
                var oldCount = oldVal.length;
                var newCount = newVal.length;
                if (oldCount < newCount) {
                    for (var i= oldCount, l=newCount; i<l; i++) {
                        calculateBalances(newVal[i]);
                    }
                }
                else if (oldCount > newCount) {
                    calculatedBalances = {};
                    for (var i= 0, l=newCount; i<l; i++) {
                        calculateBalances(newVal[i]);
                    }
                }
            }, true);

            scope.$watch(scope.removeAccount, function(newVal, oldVal){
console.log("remove heard");
            });

            scope.$watch('accounts', function(newVal, oldVal){
                if (newVal) {

                    for (var i= 0, l=newVal.length; i<l; i++) {
                        (function(index){
                            scope.$watch('accounts['+index+']', function(nv2, ov2) {
                                console.log(index+" changed");
                                calculateBalances(newVal[index]);
                            }, true);
                        })(i);
                    }
                }
            });

            setup();


            function setup() {
                margin = { top: 20, right: 100, bottom: 30, left: 100 };
                    width = 1200 - margin.left - margin.right;
                    height = 500 - margin.top - margin.bottom;

                parseDate = d3.time.format('%y-%b-%d').parse;
                formatPercent = d3.format(".0%");

                x = d3.time.scale()
                    .range([0, width]);

                y = d3.scale.linear()
                    .range([height, 0]);

                color = d3.scale.category20();

                xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickFormat(function(d){
                        var date = new Date(d*1000);
                        return d3.time.format("%b/%Y")(date);
                    });

                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format("$,"));

                area = d3.svg.area()
                    .x(function(d) { return x(d.date); })
                    .y0(function(d) { return y(d.y0); })
                    .y1(function(d) { return y(d.y0 + d.y); });

                invertedArea = d3.svg.area()
                    .x(function(d) { return x(d.date); })
                    .y0(function(d) { return y(-d.y0); })
                    .y1(function(d) { return y(-d.y0 - d.y); });


                stack = d3.layout.stack()
                    .values(function(d) { return d.values; });

                svg = d3.select('#'+element[0].id)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                xAxisGroup = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                yAxisGroup = svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

            }


            function drawData(accounts) {

                if (!accounts) return;

                var accountNames = [];
                for (var i in accounts) {
                    var d = accounts[i];
                    accountNames.push(d.name);
                }

                color.domain(accountNames);


                var dateRanges = [];//data.map(function(d){ return d.dateRange[0]; });
                for (var i in accounts) {
                    var d = accounts[i];
                    dateRanges.push(d.dateRange[0]);
                    dateRanges.push(d.dateRange[1]);
                }

                console.log(d3.extent(dateRanges));
                x.domain(d3.extent(dateRanges));
                svg.select(".x.axis")
                    .transition()
                    .call(xAxis);

                var investments = [], loans = [];
                for (var i in accounts) {
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
                svg.select(".y.axis")
                    .transition()
                    .call(yAxis);

                if (loanSeries) {
                    loanSeries.remove();
                }
                loanSeries = drawSeries(loans, 'loan', true);
                if (investmentSeries) {
                    investmentSeries.remove();
                }
                investmentSeries = drawSeries(investments, 'investment');
            }

            function drawSeries(accounts, class_name, invert) {
                var account = svg.selectAll("."+class_name)
                    .data(accounts)
                    .enter().append("g")
                    .attr("class", class_name);

                account.append("path")
                    .attr("class", "area")
                    .attr("d", function(d) { return (invert)? invertedArea(d.values) : area(d.values); })
                    .style("fill", function(d) { return color(d.name); });

                account.append("text")
                    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) {
                        var xData = d.value.date;
                        var yData = d.value.y0 + d.value.y / 2;
                        if (invert) { yData *= -1; }
                        return "translate(" + x(xData) + "," + y(yData) + ")";
                    })
                    .attr("x", -6)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name; });

                return account;
            }

            scope.calculatorWorker = new Worker('app/workers/CalculatorWorker.js?v=' + Math.random());
            calculatedBalances = {};
            function calculateBalances(account) {
                scope.calculatorWorker.postMessage(account);
            }
            function handleWorkerMessage(e) {
                var result = e.data;
                calculatedBalances[result.account.id] = result;

                var accountIds = [];
                for (var i in calculatedBalances) {
                    accountIds.push(i);
                }

                drawData(calculatedBalances);
            }
            scope.calculatorWorker.addEventListener('message', handleWorkerMessage, false);


        }
    };

}]);


