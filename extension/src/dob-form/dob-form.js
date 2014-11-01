angular.module('dob-form', ['age'])

.directive('dobForm', function() {
    return {
        templateUrl: 'src/dob-form/dob-form.html',
        controllerAs: 'ctrl',
        controller: function($state, age) {
            var ctrl = this;
            ctrl.form = {};
            ctrl.submit = function() {
                age.save(ctrl.form.dob);
                $state.go('counter');
            };
        }
    };
});
