angular.module('app', [
    'ui.router',
    'age',
    'counter',
    'dob-form',
])

.config(['$stateProvider', function($stateProvider) {
        $stateProvider
        .state('counter', {
            template: '<div counter></div>'
        })
        .state('dob-form', {
            template: '<div dob-form></div>'
        });
    }
])

.run(['$state', 'age', function($state, age) {
    if(age.hasDob()) {
        $state.go('counter');
    } else {
        $state.go('dob-form');
    }
}]);
