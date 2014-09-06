'use strict';

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

