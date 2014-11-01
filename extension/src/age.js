angular.module('age', [])

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
