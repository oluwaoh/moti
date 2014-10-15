angular.module('bookmarks', [])

.config(['$compileProvider', function($compileProvider) {
    // need to access chrome://favicon/ for favicon images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome):/);
}])

.directive('bookmark', [function() {
    return {
        scope: { bookmark: '=' },
        templateUrl: 'app/bookmark.html',
        controller: 'BookmarkCtrl',
        controllerAs: 'BookmarkCtrl',
    };
}])

.controller('BookmarkCtrl', ['$window', '$scope', function($window, $scope) {
    var ctrl = this;
    ctrl.click = function() {
        if($scope.bookmark.url) {
            $window.location = $scope.bookmark.url;
        } else {
            // TODO navigate into folder
            // TODO open all bookmarks in folder
        }
    };

    $scope.$on('keydown:'+$scope.bookmark.index, ctrl.click);
}])

.directive('bookmarks', [function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/bookmarks.html',
        controller: 'BookmarksCtrl',
        controllerAs: 'BookmarksCtrl',
        bindToController: true,
    };
}])

.controller('BookmarksCtrl', [
    'BookmarksBar', '$scope', '$window',
    function(BookmarksBar, $scope, $window) {
        var ctrl = this;
        ctrl.bookmarksBar = {};
        BookmarksBar.then(function(bookmarksBar) {
            ctrl.bookmarksBar = bookmarksBar;
        });

        function keydown(event) {
            $scope.$broadcast('keydown:'+(event.which - 48));
        }

        angular.element($window).on('keydown', keydown);

        $scope.$on('$destroy', function() {
            angular.element($window).off('keydown', keydown);
        });
    }
])

.factory('BookmarksBar', ['$q', function($q) {
    var deferred = $q.defer();
    chrome.bookmarks.getSubTree('1', function(subtree) {
        deferred.resolve(subtree[0]);
    });
    return deferred.promise;
}]);
