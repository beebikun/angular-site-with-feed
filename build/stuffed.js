/*! stuffed 2014-09-14 */
'use strict';

angular.module('app', [
    'appServices',
    'appDirectives',
    'ngRoute',
    'ngResource',
    'ngAnimate'
]);



;'use strict';

function MasterController($scope) {
    $scope.feedCls = ''

    $scope.$on('setFeedCls', function(e, val){
        $scope.feedCls = val ? 'showDetail' : ''
    });
}
;'use strict';

function templateCreator(templateClass, templateItem, templateDetail, header){
    return '<div class="api ' + templateClass + '" ng-show="showElem">' +
                '<h3 class="api-header" ng-click="selectApi()">' + header + '</h3>' +
                '<ul class="api-items">' +
                    '<li ng-repeat="item in data" ng-click="$emit(onFn.setActive, item)" class="animate-appears">' +
                        templateItem +
                    '</li>' +
                '</ul>'+
                '<div class="api-detail animate-from-right" ng-show="activeItem" ng-style="apiDetailStyle">' +
                    '<div class="api-closeDetail"><span ng-click="closeDetail()">X</span></div>' +
                    templateDetail +
                '</div>' +
            '<div>'
}

function choice(arr){
    var i = Math.floor( Math.random()*arr.length );
    return arr[i]
}
var tags = ['coffee', 'cute', 'dilbert', 'cat', 'kitty', 'futurama', 'programming', 'book', 'food', 'fortran77', 'math', 'adventuretime', 'warhammer', 'catsplosion', 'linux', 'mlp', 'art', 'dwarf', 'cosmos', 'mario', 'heroes', 'tes', 'fallout', 'game', 'pokemon', 'funcy', 'soup', 'foot', 'hand', 'glass', 'tennis', 'grass', 'ball', 'sport', 'puppy', 'horse', 'blues', 'jazz', 'reggae', 'cartoon', 'tardis', 'corgi', 'flower', 'nature', 'flcl', 'robot']
var tagSettings = {min: 1, step: 2, }



var APIfeedScopeDecorators = function(scope, element, $rootScope){
    this.scope = scope
    this.element = element
    this.rootScope = $rootScope
}

APIfeedScopeDecorators.prototype.mainDecorator = function() {
    var scope = this.scope, element = this.element, $rootScope = this.rootScope;
    var onFn = {
            setActive: 'setActive',
            hideOther: 'hideOther',
            setFeedCls: 'setFeedCls',
            showAll: 'showAll',
        }
    var doc = document.documentElement, body = document.body;
    var header = document.querySelector('header'), headerStyle = header.currentStyle || window.getComputedStyle(header), headerH = header.offsetHeight + parseInt(headerStyle.marginBottom) + parseInt(headerStyle.marginTop) - 5;
    scope.showElem = true
    scope.onFn = onFn
    scope.apiDetailStyle = new Object;

    scope.$on(scope.onFn.setActive, function(e, item){
        var scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0) - headerH;
        var top = (scrollTop > 0) ? scrollTop : 0
        scope.apiDetailStyle.top = top + 'px'
        scope.activeItem = item
        scope.selectApi()
    });
    scope.$on(scope.onFn.hideOther, function(e, id){
        if(id != scope.$id) scope.hide()
    });
    scope.$on(scope.onFn.showAll, function(e, id){
        scope.show()
    });

    scope.selectApi = function(){
        $rootScope.$broadcast(scope.onFn.hideOther, scope.$id);
        scope.$emit(scope.onFn.setFeedCls, true)
    }

    scope.hide = function(){
        scope.showElem = false
        scope.activeItem = undefined
    }

    scope.show = function(){
        scope.showElem = true
    }


    scope.closeDetail = function(){
        scope.activeItem = undefined
        scope.$emit(scope.onFn.setFeedCls, false)
        $rootScope.$broadcast(scope.onFn.showAll);
    }
};

 APIfeedScopeDecorators.prototype.tagableDecorator = function(service) {
    var scope = this.scope, element = this.element, $rootScope = this.rootScope;

    scope.onFn.removeTag = 'removeTag';

    scope.tag = choice(tags)

    scope.$watch('tag', function(val, oldval){
        if( val && val.length > tagSettings.min){
            get()
        }
    });

    function get(){
        service.get(function(data){
            scope.data = data;
            var w = element[0].offsetWidth;
            scope.apiDetailStyle = {left: w + 'px', maxWidth: window.innerWidth - w - 100 + 'px'}
        }, scope.tag)
    }

    scope.addTag = function(e){
        var key = e.keyCode || e.which;
        if(key == 13){
            service.getActiveTags(scope.activeItem).push(scope.newTag);
            scope.newTag = ''
            var input = e.srcElement || e.target;
            input.blur()
        }
    }

    scope.$on(scope.onFn.removeTag, function(e, tag){
        var tags = service.getActiveTags(scope.activeItem);
        var index = tags.indexOf(tag);
        if (index > -1) {
            tags.splice(index, 1);
        }

    });
};



angular.module('appDirectives', [])
    .directive('instagram', function(instagramService, $rootScope) {
        var templateItem = '<img ng-src="{{item.images.thumbnail.url}}">'
        var templateDetail = '<div>' +
                                '<img ng-src="{{activeItem.images.standard_resolution.url}}">' +
                                '<div class="photo-tag-area">' +
                                    '<span ng-repeat="tag in activeItem.tags">' +
                                        '{{tag}}' +
                                        '<span ng-click="$emit(onFn.removeTag, tag)"> X </span>' +
                                    '</span>' +
                                    '<input type="text" placeholder="  +" ng-model="newTag" ng-keydown="addTag($event)">' +
                                '</div>'+
                             '</div>'
        var templateHeader = 'Instagram: <input type="text" placeholder="Enter a tag" ng-model="tag" >'
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            template: templateCreator('instagram', templateItem, templateDetail, templateHeader),
            link: function(scope, element, attrs){
                var decorators = new APIfeedScopeDecorators(scope, element, $rootScope)
                decorators.mainDecorator()
                instagramService.getActiveTags = function(item){return item.tags}
                decorators.tagableDecorator(instagramService)
            }
        }
    })
    .directive('tumblr', function(tumblrService, $rootScope) {
        var templateItem = '<img ng-src="{{getThumbPhotoUrl(item)}}">'
        var templateDetail = '<div>' +
                                '<img ng-src="{{activeItem.photos[0].original_size.url}}">' +
                                '<div class="photo-tag-area">' +
                                    '<span ng-repeat="tag in activeItem.tags">' +
                                        '{{tag}}' +
                                        '<span ng-click="$emit(onFn.removeTag, tag)"> X </span>' +
                                    '</span>' +
                                    '<input type="text" placeholder="  +" ng-model="newTag" ng-keydown="addTag($event)">' +
                                '</div>'+
                             '</div>'
        var templateHeader = 'Tumblr: <input type="text" placeholder="Enter a tag" ng-model="tag" >'
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            template: templateCreator('instagram', templateItem, templateDetail, templateHeader),
            link: function(scope, element, attrs){
                var decorators = new APIfeedScopeDecorators(scope, element, $rootScope)
                decorators.mainDecorator()
                tumblrService.getActiveTags = function(item){return item.tags}
                decorators.tagableDecorator(tumblrService)

                scope.getThumbPhotoUrl = function(item){
                    if(!item.photos || !item.photos.length) return ''
                    var pic = item.photos[0].alt_sizes.filter(function(p){return p.width == 75})
                    return pic.length > 0 ? pic[0].url : ''
                }
            }
        }
    });'use strict';

var appServices = angular.module('appServices', []);


appServices.factory('instagramService', function($http){
    var id = 'd1a7f15414c44db38dd9f59938fcfd58';
    var secret = '53dea990566e48b7b5ffddf00fb44333';
    var is_recent = true
    return {
        get: function(callback, tag){
            var endPoint = "https://api.instagram.com/v1/" + (tag ? 'tags/' + tag + '/' : '') + "media/"+ (is_recent ? 'recent' : 'popular') + "?client_id=" + id + "&callback=JSON_CALLBACK";
            $http.jsonp(endPoint).success(function(response){
                callback(response.data);
            });
        }
    }

});

appServices.factory('tumblrService', function($http){
    var key = 'fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
    return {
        get: function(callback, tag){
            var endPoint = "http://api.tumblr.com/v2/tagged?tag=" + tag + "&api_key=" + key + "&callback=JSON_CALLBACK";
            $http.jsonp(endPoint).success(function(response){
                callback(response.response.filter(function(item){return item.type == "photo"}));
            });
        }
    }

});

