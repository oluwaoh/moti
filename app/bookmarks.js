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
