angular.module('counter', [ 'age', 'bookmarks' ])

.directive('counter', function() {
    return {
        templateUrl: 'src/counter/counter.html',
        controllerAs: 'counter',
        controller: ['age', '$interval', function(age, $interval) {
            this.age = age.getAge();
            $interval(setAge.bind(this, age), 100);
        }]
    };
    function setAge(age) {
        this.age = age.getAge();
    }
});
