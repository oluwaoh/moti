angular.module('context-menu', [])

.directive('contextMenu', function() {
    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function($scope, $element, $window, $rootScope) {
            function open(event) {
                /* TODO for effiency delay transclusion on content until open
                 * is called. Will require link function */
                $rootScope.$emit('contextmenu');
                event.preventDefault();
                $element.addClass('show');
                $element.css({
                    top: Math.min(event.clientY, getMaxYPos()) + 'px',
                    left: event.clientX + 'px',
                });
            }
            function close() {
                $element.removeClass('show');
            }
            $element.parent().on('contextmenu', open);
            angular.element($window).on('click', close);
            $rootScope.$on('contextmenu', close);

            $scope.$on('$destroy', function() {
                $element.parent().off('contextmenu', open);
                angular.element($window).off('click', close);
            });

            function getMaxYPos() {
                return $window.innerHeight - $element[0].offsetHeight;
            }
        }
    };
})

.directive('contextMenuItem', function() {
    return {
        restrict: 'E',
        require: '^contextMenu',
        scope: { handler: '&' },
        transclude: true,
        template: '<div ng-click="ctrl.click($event)"><ng-transclude/></div>',
        controller: function($scope) {
            this.click = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.handler();
                $scope.$emit('contextmenu');
            };
        },
        controllerAs: 'ctrl'
    };
});
