angular.module('app', [])

.controller('AppCtrl', ['$scope', 'age', function($scope, age) {
    $scope.app = {};
    $scope.app.hasDob = age.hasDob();
}])

.directive('dob', [function() { // directive to input date of birth
    return {
        templateUrl: 'app/dob.html',
        controller: ['$scope', 'age', function($scope, age) {
            $scope.form = {};
            $scope.submit = function() {
                age.save($scope.form.dob);
                $scope.app.hasDob = true;
            };
        }]
    };
}])

.directive('age', [function() { // directive to display age
    return {
        templateUrl: 'app/age.html',
        controllerAs: 'ctrl',
        controller: ['age', '$interval', function(age, $interval) {
            this.age = age.getAge();
            $interval(setAge.bind(this, age), 100);
        }]
    };
    function setAge(age) {
        this.age = age.getAge();
    }
}])

.service('age', [function() {

    if(localStorage.dob) {
        this.dob = new Date(parseInt(localStorage.dob));
    }

    this.hasDob = function() {
        return !!this.dob;
    };
    this.getAge = function() {
        var now = new Date();
        var duration = now - this.dob;
        var years = duration / 31556900000;

        var majorMinor = years.toFixed(9).toString().split('.');

        return {
            year:         majorMinor[0],
            milliseconds: majorMinor[1]
        };
    };
    this.save = function(dob) { // must be valid string for Date
        this.dob = new Date(dob);
        localStorage.dob = this.dob.getTime();
    };
}]);

