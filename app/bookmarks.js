angular.module('bookmarks', [])

.directive('faviconLink', [function() {
    return {
        scope: { url: '=faviconLink' },
        link: function(scope, element, attrs) {
            var anchor = angular.element('<a/>')[0];
            anchor.href = scope.url;
            scope.faviconUrl = anchor.protocol + anchor.host + '/favicon.ico';
        },
        template: '<img ng-src="{{ faviconUrl }}" width="16" height="16"/>'
    };
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
    
    this.click = function() {

    };

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

.controller('BookmarksCtrl', ['BookmarksBar', '$scope', function(BookmarksBar, $scope) {
    $scope.bookmarksBar = {};
    BookmarksBar.then(function(bookmarksBar) {
        console.log('got bookmarksBar', bookmarksBar);
        console.log('got bookmarksBar.children', bookmarksBar.children);
        $scope.bookmarksBar = bookmarksBar;
    });
}])

.factory('BookmarksBar', ['$q', function($q) {
    var deferred = $q.defer();
    chrome.bookmarks.getSubTree('1', function(subtree) {
        console.log('got subtree', subtree);
        deferred.resolve(subtree[0]);
    });
    return deferred.promise;
}]);
