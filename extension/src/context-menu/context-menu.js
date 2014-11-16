angular.module('context-menu', [])

.directive('contextMenu', function() {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function($scope, $element, $window) {
            function open(event) {
                event.preventDefault();
                $element.addClass('show');
                $element.css({
                    top: event.pageY + 'px',
                    left: event.pageX + 'px',
                });
            }
            function close() {
                $element.removeClass('show');
            }
            $element.parent().on('contextmenu', open);
            angular.element($window).on('click', close);

            $scope.$on('$destroy', function() {
                $element.parent().off('contextmenu', open);
                angular.element($window).off('click', close);
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
