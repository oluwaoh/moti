angular.module('app', [
    'ui.router',
    'age',
    'counter',
    'dob-form',
])

.config(function($stateProvider) {
    $stateProvider
    .state('counter', {
        template: '<div counter></div>'
    })
    .state('dob-form', {
        template: '<div dob-form></div>'
    });
})

.run(function($state, age) {
    if(age.hasDob()) {
        $state.go('counter');
    } else {
        $state.go('dob-form');
    }
});
