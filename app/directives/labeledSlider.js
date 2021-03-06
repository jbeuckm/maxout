
angular.module('maxout').directive('labeledSlider', function(){
    return {
        restrict: 'E',
        require: "^ngModel",
        scope: {
            min: "@",
            max: "@",
            step: "@",
            label: "@",
            value: "=ngModel"
        },
        link: function(scope, element, attributes) {

            scope.min = attributes.min;
            scope.max = attributes.max;
            scope.step = attributes.step;

            scope.$watch('value', function(val, old){
                scope.value = parseFloat(val);
            });

            scope.label = element[0].innerText;
        },
        templateUrl: 'app/directives/labeledSlider.html'
    }
});

