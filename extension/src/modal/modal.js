angular.module('modal', [])

.controller('ModalCtrl', function() {

    // TODO

})

.service('modal', function($body, $q) {
    return function(config) {
        var deferred = $q.defer();

        // TODO implement modal

        return deferred.promise;
    };
});
