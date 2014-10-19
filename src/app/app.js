angular.module('app', [
    'age',
    'counter',
    'dob-form',
])

.directive('app', [function() {
    return {
        restrict: 'E',
        templateUrl: 'src/app/app.html',
        controllerAs: 'app',
        controller: ['age', function(age) {
            this.hasDob = age.hasDob;
        }]
    };
}]);
