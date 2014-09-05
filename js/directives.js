'use strict';

function templateCreator(templateClass, templateItem, templateDetail, header){
    return '<div class="api ' + templateClass + '" ng-show="showElem">' +
                '<h3 class="api-header">' + header + '</h3>' +
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

function scopeDecorator(scope, element, $rootScope, $window){
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
        console.log(top)
        scope.apiDetailStyle.top = top + 'px'
        scope.activeItem = item
        $rootScope.$broadcast(scope.onFn.hideOther, scope.$id);
        scope.$emit(scope.onFn.setFeedCls, true)
    });
    scope.$on(scope.onFn.hideOther, function(e, id){
        if(id != scope.$id) scope.hide()
    });
    scope.$on(scope.onFn.showAll, function(e, id){
        scope.show()
    });

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

    return scope
}

function choice(arr){
    var i = Math.floor( Math.random()*arr.length );
    return arr[i]
}


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
                                '</div>'
                             '</div>'
        var templateHeader = 'Instagram: <input type="text" placeholder="Enter a tag" ng-model="tag" >'
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            template: templateCreator('instagram', templateItem, templateDetail, templateHeader),
            link: function(scope, element, attrs){
                scope = scopeDecorator(scope, element, $rootScope)
                scope.onFn.removeTag = 'removeTag';

                var tagSettings = {min: 1, step: 2, }
                var tags = ['coffee', 'cute', 'dilbert', 'cat', 'kitty', 'futurama', 'programming', 'book', 'food', 'fortran77', 'math', 'adventuretime', 'warhammer', 'catsplosion', 'linux', 'mlp', 'art', 'dwarf', 'cosmos', 'mario', 'heroes', 'tes', 'fallout', 'game', 'pokemon', 'funcy', 'soup', 'foot', 'hand', 'glass', 'tennis', 'grass', 'ball', 'sport', 'puppy', 'horse', 'blues', 'jazz', 'reggae', 'cartoon', 'tardis', 'corgi', 'flower', 'nature', 'flcl', 'robot']
                scope.tag = choice(tags)

                scope.$watch('tag', function(val, oldval){
                    if( val && val.length > tagSettings.min){
                        get()
                    }
                });

                function get(){
                    instagramService.get(function(data){
                        scope.data = data
                        var w = element[0].offsetWidth;
                        scope.apiDetailStyle = {left: w + 'px', maxWidth: window.innerWidth - w - 100 + 'px'}
                    }, scope.tag)
                }

                scope.addTag = function(e){
                    var key = e.keyCode || e.which;
                    if(key == 13){
                        scope.activeItem.tags.push(scope.newTag);
                        scope.newTag = ''
                        var input = e.srcElement || e.target;
                        input.blur()
                    }
                }

                scope.$on(scope.onFn.removeTag, function(e, tag){
                    var index = scope.activeItem.tags.indexOf(tag);
                    if (index > -1) {
                        scope.activeItem.tags.splice(index, 1);
                    }

                })
            }
        }
    })