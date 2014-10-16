angular.module('bookmarks', [])

.config(['$compileProvider', function($compileProvider) {
    // need to access chrome://favicon/ for favicon images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome):/);
}])

.directive('bookmark', [function() {
    /* TODO maybe break this into two directive one for links and one for directories */
    return {
        scope: { bookmark: '=' },
        templateUrl: 'app/bookmark.html',
        controller: 'BookmarkCtrl',
        controllerAs: 'BookmarkCtrl',
        link: function(scope, element) {
            if(scope.bookmark.url) {
                element.attr('href', scope.bookmark.url);
            }
        }
    };
}])

.controller('BookmarkCtrl', [
    '$window', '$scope', 'Bookmarks', 'Tabs',
    function($window, $scope, Bookmarks, Tabs) {
        var ctrl = this;
        ctrl.click = function() {
            if($scope.bookmark.url) {
                $window.location = $scope.bookmark.url;
            } else {
                Bookmarks.getChildren($scope.bookmark.id)
                .then(function(children){
                    angular.forEach(children, function(bookmark) {
                        if(bookmark.url) {
                            Tabs.create({
                                url: bookmark.url,
                                selected: false
                            });
                        }
                    });

                    Tabs.closeCurrent();
                });
            }
        };

        $scope.$on('keydown:'+$scope.bookmark.index, ctrl.click);
    }
])

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

.factory('BookmarksBar', ['Bookmarks', function(Bookmarks) {
    return Bookmarks.getSubTree('1');
}])

.service('Bookmarks', ['$q', function($q) {

    this.getSubTree = function(id) {
        var deferred = $q.defer();
        chrome.bookmarks.getSubTree(id, function(subtree) {
            deferred.resolve(subtree[0]); // skip root
        });
        return deferred.promise;
    };

    this.getChildren = function(id) {
        var deferred = $q.defer();
        chrome.bookmarks.getChildren(id, function(children) {
            deferred.resolve(children);
        });
        return deferred.promise;
    };
}])

.service('Tabs', ['$q', function($q) {

    this.closeCurrent = function() {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    };

    this.create = function(options) {
        chrome.tabs.create(options);
    };
}]);
