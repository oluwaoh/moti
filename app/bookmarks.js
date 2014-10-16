angular.module('bookmarks', [])

.config(['$compileProvider', function($compileProvider) {
    // need to access chrome://favicon/ for favicon images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome):/);
}])

.factory('KeyIndex', function() {
    return function(index) {
        return String.fromCharCode(48 + index);
    };
})

.directive('bookmarkLink', [function() {
    return { /* bookmark object must have url */
        restrict: 'E',
        scope: { bookmark: '=', hotKey: '=?' },
        templateUrl: 'app/bookmark-link.html',
        controller: 'BookmarkLinkCtrl',
    };
}])

.controller('BookmarkLinkCtrl', [
    '$window', '$scope', 'KeyIndex', function($window, $scope, KeyIndex) {
    if($scope.hotKey) {
        $scope.index = KeyIndex($scope.bookmark.index);
        $scope.$on('key:'+$scope.index, function() {
            $window.location = $scope.bookmark.url;
        });
    }
}])

.directive('bookmarkDir', [function() {
    return { /* bookmark object must be folder */
        restrict: 'E',
        scope: { bookmark: '=', hotKey: '=?' },
        templateUrl: 'app/bookmark-dir.html',
        controller: 'BookmarkDirCtrl',
        controllerAs: 'BookmarkDirCtrl',
    };
}])

.controller('BookmarkDirCtrl', [
    '$scope', 'Bookmarks', 'Tabs', 'KeyIndex',
    function($scope, Bookmarks, Tabs, KeyIndex) {
        var ctrl = this;
        ctrl.click = function() {
            ctrl.showChildren = !ctrl.showChildren;
        };

        if($scope.hotKey) {
            $scope.index = KeyIndex($scope.bookmark.index);
            $scope.$on('key:'+$scope.index, function() {
                Bookmarks($scope.bookmark.id).then(function(children){
                    angular.forEach(children, function(bookmark) {
                        if(bookmark.url) {
                            Tabs.create({ url: bookmark.url });
                        }
                    });
                    Tabs.closeCurrent();
                });
            });
        }
    }
])

.directive('bookmarks', [function() {
    return {
        restrict: 'E',
        scope: { id: '=', hotKey: '=?' },
        templateUrl: 'app/bookmarks.html',
        controller: 'BookmarksCtrl',
        controllerAs: 'BookmarksCtrl',
    };
}])

.controller('BookmarksCtrl', [
    'Bookmarks', '$scope', '$window',
    function(Bookmarks, $scope, $window) {
        var ctrl = this;
        ctrl.bookmarksBar = {};
        Bookmarks($scope.id).then(function(bookmarksBar) {
            ctrl.bookmarksBar = bookmarksBar;
        });

        if($scope.hotKey) {
            angular.element($window).on('keypress', keypress);

            $scope.$on('$destroy', function() {
                angular.element($window).off('keypress', keypress);
            });
        }

        function keypress(event) {
            $scope.$broadcast('key:'+String.fromCharCode(event.charCode));
        }
    }
])

.factory('Bookmarks', ['$q', function($q) {
    return function(id) {
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
