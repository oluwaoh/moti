angular.module('context-menu', [])

.directive('contextMenu', function() {
    return {
        restrict: 'E',
        scope: {},
        controller: function($element, $window) {
            function close() {
                // TODO
            }
        }
    };
})

.directive('contextMenuItem', function() {
    return {
        restrict: 'E',
        require: 'contextMenu',
        scope: { name: '@', handler: '&' },

    };
});
