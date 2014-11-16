angular.module('context-menu', [])

.directive('contextMenu', function() {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function($scope, $element, $window) {
            angular.element($window).on('click', function() {
                $element.removeClass('show');
            });
            $element.parent().on('contextmenu', function(event) {
                event.preventDefault();
                $element.addClass('show');
                $element.css({
                    top: event.pageY + 'px',
                    left: event.pageX + 'px',
                });
            });
            $scope.$on('$destroy', function() {
                $element.parent().off();
                angular.element($window).off();
            });
        }
    };
})

.directive('contextMenuItem', function() {
    return {
        restrict: 'E',
        scope: { handler: '&' },
        transclude: true,
        template: '<div ng-transclude></div>',
        link: function(scope, element) {
            element.on('click', function(event) {
                scope.handler();
                event.preventDefault();
            });
        }
    };
});
