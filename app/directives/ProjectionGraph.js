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
                    console.log(scope.accounts);
                    scope.balances = getData(scope.accounts);

                    console.log(scope.balances);
                    drawData(scope.balances);
                }
            });

            setup();


            function setup() {
                margin = {
                        top: 20, right: 20, bottom: 30, left: 50};
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

                color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
                data.forEach(function(d) {
                    d.date = parseDate(d.date);
                });

                var browsers = stack(color.domain().map(function(name) {
                    return {
                        name: name,
                        values: data.map(function(d) {
                            return {date: d.date, y: d[name] };
                        })
                    };
                }));

                x.domain(d3.extent(data, function(d) { return d.date; }));
                y.domain(d3.extent(data, function(d) { return d.balance; }));

                var browser = svg.selectAll(".browser")
                    .data(browsers)
                    .enter().append("g")
                    .attr("class", "browser");

                browser.append("path")
                    .attr("class", "area")
                    .attr("d", function(d) { return area(d.values); })
                    .style("fill", function(d) { return color(d.name); });

                browser.append("text")
                    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y / 2) + ")"; })
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

            function getData(accounts) {

                var calculators = {};
                for (var i= 0, l=accounts.length; i<l; i++) {
                    var account = accounts[i];
                    calculators[account.title] = new BalanceCalculator(account, 500, 30);
                }

                return calculators[accounts[0].title].getDataUntil(moment().add('years', 5));

                return [
                    {"date":"11-Oct-13","IE":"41.62","Chrome":"22.36","Firefox":"25.58","Safari":"9.13","Opera":"1.22"},
                    {"date":"11-Oct-14","IE":"41.95","Chrome":"22.15","Firefox":"25.78","Safari":"8.79","Opera":"1.25"},
                    {"date":"11-Oct-15","IE":"37.64","Chrome":"24.77","Firefox":"25.96","Safari":"10.16","Opera":"1.39"},
                    {"date":"11-Oct-16","IE":"37.27","Chrome":"24.65","Firefox":"25.98","Safari":"10.59","Opera":"1.44"},
                    {"date":"11-Oct-17","IE":"42.74","Chrome":"21.87","Firefox":"25.01","Safari":"9.12","Opera":"1.17"},
                    {"date":"11-Oct-18","IE":"42.14","Chrome":"22.22","Firefox":"25.26","Safari":"9.1","Opera":"1.19"},
                    {"date":"11-Oct-19","IE":"41.92","Chrome":"22.42","Firefox":"25.3","Safari":"9.07","Opera":"1.21"},
                    {"date":"11-Oct-20","IE":"42.41","Chrome":"22.08","Firefox":"25.28","Safari":"8.94","Opera":"1.18"},
                    {"date":"11-Oct-21","IE":"42.74","Chrome":"22.23","Firefox":"25.19","Safari":"8.5","Opera":"1.25"},
                    {"date":"11-Oct-22","IE":"36.95","Chrome":"25.45","Firefox":"26.03","Safari":"10.06","Opera":"1.42"},
                    {"date":"11-Oct-23","IE":"37.52","Chrome":"24.73","Firefox":"25.79","Safari":"10.46","Opera":"1.43"},
                    {"date":"11-Oct-24","IE":"42.69","Chrome":"22.14","Firefox":"24.95","Safari":"8.98","Opera":"1.15"},
                    {"date":"11-Oct-25","IE":"42.31","Chrome":"22.26","Firefox":"25.1","Safari":"9.04","Opera":"1.2"},
                    {"date":"11-Oct-26","IE":"42.22","Chrome":"22.28","Firefox":"25.17","Safari":"9.08","Opera":"1.16"},
                    {"date":"11-Oct-27","IE":"42.62","Chrome":"22.36","Firefox":"24.98","Safari":"8.8","Opera":"1.15"},
                    {"date":"11-Oct-28","IE":"42.76","Chrome":"22.36","Firefox":"25.05","Safari":"8.55","Opera":"1.19"},
                    {"date":"11-Oct-29","IE":"38.92","Chrome":"24.36","Firefox":"25.34","Safari":"9.99","Opera":"1.3"},
                    {"date":"11-Oct-30","IE":"38.06","Chrome":"24.58","Firefox":"25.63","Safari":"10.26","Opera":"1.39"},
                    {"date":"11-Oct-31","IE":"42.1","Chrome":"22.45","Firefox":"25.18","Safari":"8.97","Opera":"1.2"}
                    ];
            }

        }
    };

}]);


