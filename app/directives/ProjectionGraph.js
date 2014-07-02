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

            var margin, width, height, parseDate, formatPercent, x, y, color, xAxis, yAxis, area, stack, svg

            scope.$watch('accounts', function(){
                if (scope.accounts) {
                    scope.balances = getData(scope.accounts);
                    drawData(scope.balances);
                }
            });

            setup();


            function setup() {
                margin = {
                        top: 20, right: 100, bottom: 30, left: 100};
                    width = 960 - margin.left - margin.right;
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

                var accountNames = newData.map(function(d){ return d.name; });

                color.domain(accountNames);
/*
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                });
*/
                console.log(newData);
                accounts = newData;

                x.domain(d3.extent(data, function(d) { return d.date; }));
                y.domain(d3.extent(data, function(d) { return d.balance; }));

                var account = svg.selectAll(".account")
                    .data(accounts)
                    .enter().append("g")
                    .attr("class", "account");

                account.append("path")
                    .attr("class", "area")
                    .attr("d", function(d) { return area(d.values); })
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

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

            }
var newData;
            function getData(accounts) {

                var calculators = {};
                newData = [];
                for (var i= 0, l=accounts.length; i<l; i++) {
                    var account = accounts[i];
                    calculators[account.title] = new BalanceCalculator(account, 500, 30);

                    newData[i] = {
                        name: account.title,
                        values: calculators[account.title].getDataUntil(moment().add('years', 5))
                    };
                }

                return newData[0].values;
                return calculators[accounts[0].title].getDataUntil(moment().add('years', 5));
            }

        }
    };

}]);


