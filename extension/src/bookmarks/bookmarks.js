angular.module('bookmarks', [])

.config(function($compileProvider) {
    // need to access chrome://favicon/ for favicon images
    // and access to chrome-extension://* for local images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome|chrome-extension):/);
})

.factory('KeyIndex', function() {
    return function(index) {
        return String.fromCharCode(48 + index);
    };
})

.directive('bookmark', function() {
    return {
        scope: { bookmark: '=' },
        templateUrl: 'src/bookmarks/bookmark.html',
        controller: 'BookmarkCtrl',
        controllerAs: 'ctrl',
    };
})

.controller('BookmarkCtrl', function($scope, $element, KeyIndex, Link, Dir) {
    if($scope.bookmark.url) {
        this.model = new Link($scope.bookmark);
        $element.attr('href', $scope.bookmark.url);
    } else {
        this.model = new Dir($scope.bookmark);
        $element.on('click', this.model.click.bind(this.model));
        $scope.$on('$destroy', function() { $element.off(); });
    }
    this.index = KeyIndex($scope.bookmark.index);
    $scope.$on('key:' + this.index, this.model.click.bind(this.model));
})

.factory('Link', function($window) {
    function Link(bookmark) { // must have bookmark.url
        this.bookmark = bookmark;
        this.iconUrl = 'chrome://favicon/' + bookmark.url;
    }
    Link.prototype.click = function() {
        $window.location = this.bookmark.url;
    };
    return Link;
})

.factory('Dir', function(Bookmarks, Tabs) {
    function Dir(bookmark) {
        this.bookmark = bookmark;
        this.iconUrl = 'img/dir-icon.png';
    }
    Dir.prototype.click = function() {
        // TODO make this navigate into folder
        // TODO add first to items to bookmarks list for:
        //  - up one level
        //  0 open all in tabs (this)
        // (note: could check event, first arg?, for middle click
        Bookmarks(this.bookmark.id).then(function(children){
            angular.forEach(children, function(bookmark) {
                if(bookmark.url) {
                    Tabs.create({ url: bookmark.url });
                }
            });
            Tabs.closeCurrent();
        });
    };
    return Dir;
})

.directive('bookmarks', function() {
    return {
        restrict: 'E',
        scope: { id: '=', hotKey: '=?' },
        templateUrl: 'src/bookmarks/bookmarks.html',
        controller: 'BookmarksCtrl',
        controllerAs: 'BookmarksCtrl',
    };
})

.controller('BookmarksCtrl', function(Bookmarks, $scope, $window) {
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
})

.factory('Bookmarks', function($q) {
    return function(id) {
        var deferred = $q.defer();
        chrome.bookmarks.getChildren(id, function(children) {
            deferred.resolve(children);
        });
        return deferred.promise;
    };
})

.service('Tabs', function($q) {
    this.closeCurrent = function() {
        chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
        });
    };
    this.create = function(options) {
        chrome.tabs.create(options);
    };
});
