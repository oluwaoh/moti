angular.module('context-menu', [])

.directive('contextMenu', function() {
    return {
        restrict: 'E',
        scope: {},
    };
})

.directive('contextMenuItem', function() {
    return {
        restrict: 'E',
        scope: { name: '@', handler: '&' },
    };
});
