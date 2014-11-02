angular.module('bookmarks', [])

.config(function($compileProvider) {
    // need to access chrome://favicon/ for favicon images
    // and access to chrome-extension://* for local images
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|chrome|chrome-extension):/);
})

.factory('KeyIndex', function() {
    return function(index) {
        return String.fromCharCode(47 + index);
    };
})

.directive('bookmark', function() {
    return {
        scope: { bookmark: '=', index: '=' },
        templateUrl: 'src/bookmarks/bookmark.html',
        controller: 'BookmarkCtrl',
        controllerAs: 'ctrl',
    };
})

.controller('BookmarkCtrl', function($scope, $element, KeyIndex, $injector) {
    var bookmark = $scope.bookmark;
    if(bookmark.url) {
        this.model = new ($injector.get('Link'))(bookmark);
        $element.attr('href', bookmark.url);
    } else {
        if(angular.isString(bookmark.model) && $injector.has(bookmark.model)) {
            this.model = new ($injector.get(bookmark.model))(bookmark);
        } else {
            this.model = new ($injector.get('Dir'))(bookmark);
        }
        $element.on('click', this.model.click.bind(this.model));
        $scope.$on('$destroy', function() { $element.off(); });
    }
    this.index = KeyIndex($scope.index);
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

.factory('Dir', function($rootScope) { // Bookmarks, Tabs) {
    function Dir(bookmark) {
        this.bookmark = bookmark;
        this.iconUrl = 'img/dir-icon.png';
    }
    Dir.prototype.click = function() {
        $rootScope.$broadcast('bookmarks', this.bookmark.id);
        // TODO allow middle click, right click on dir to open all
        // could check event, first arg?, for middle click
        // Bookmarks(this.bookmark.id).then(function(children){
        //     angular.forEach(children, function(bookmark) {
        //         if(bookmark.url) {
        //             Tabs.create({ url: bookmark.url });
        //         }
        //     });
        //     Tabs.closeCurrent();
        // });
    };
    return Dir;
})

.factory('UpOneLevel', function(Bookmarks, $rootScope) {
    function UpOneLevel(bookmark) {
        this.iconUrl = 'img/up-one-level-icon.png';
        this.bookmark = { title: 'up one' };
        this.currentId = bookmark.currentId;
    }
    UpOneLevel.prototype.click = function() {
        Bookmarks.get(this.currentId).then(function(current) {
            $rootScope.$broadcast('bookmarks', current.parentId);
        });
    };
    return UpOneLevel;
})

.factory('OpenAll', function(Tabs, $rootScope) {
    function OpenAll(bookmark) {
        this.iconUrl = 'img/open-all-icon.png';
        this.bookmark = { title: 'open all' };
        this.bookmarks = bookmark.bookmarks;
    }
    OpenAll.prototype.click = function() {
        angular.forEach(this.bookmarks, function(bookmark) {
            if(bookmark.url) {
                Tabs.create({ url: bookmark.url });
            }
        });
        Tabs.closeCurrent();
    };
    return OpenAll;
})

.directive('bookmarks', function() {
    return {
        restrict: 'E',
        scope: { id: '=' },
        templateUrl: 'src/bookmarks/bookmarks.html',
        controller: 'BookmarksCtrl',
        controllerAs: 'ctrl',
    };
})

.controller('BookmarksCtrl', function(Bookmarks, $scope, $window) {
    var ctrl = this;
    function load(id) {
        ctrl.id = id;
        Bookmarks.getChildren(id).then(function(bookmarks) {
            ctrl.bookmarks = [];
            if(id !== '0') {
                ctrl.bookmarks.push({ model: 'UpOneLevel', currentId: id });
            }
            if(hasLink(bookmarks)) {
                ctrl.bookmarks.push({ model: 'OpenAll', bookmarks: bookmarks });
            }
            ctrl.bookmarks = ctrl.bookmarks.concat(bookmarks);
        });
    }
    load($scope.id);
    $scope.$on('bookmarks', function(event, id) { load(id); });
    angular.element($window).on('keypress', function(event) {
        $scope.$broadcast('key:'+String.fromCharCode(event.charCode));
    });
    $scope.$on('$destroy', function() { angular.element($window).off(); });
    function hasLink(bookmarks) {
        for(var i = 0; i < bookmarks.length; i++) {
            if(bookmarks[i].url) {
                return true;
            }
        }
        return false;
    }
})

.service('Bookmarks', function($q) {
    this.getChildren = function(id) {
        var deferred = $q.defer();
        chrome.bookmarks.getChildren(id, function(children) {
            deferred.resolve(children);
        });
        return deferred.promise;
    };
    this.get= function(id) {
        var deferred = $q.defer();
        chrome.bookmarks.get(id, function(bookmark) {
            deferred.resolve(bookmark[0]);
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
