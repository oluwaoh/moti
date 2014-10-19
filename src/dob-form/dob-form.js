angular.module('dob-form', ['age'])

.directive('dobForm', function() {
    return {
        templateUrl: 'src/dob-form/dob-form.html',
        controller: ['$scope', 'age', function($scope, age) {
            $scope.form = {};
            $scope.submit = function() {
                age.save($scope.form.dob);
            };
        }]
    };
});

