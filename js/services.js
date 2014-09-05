'use strict';

var appServices = angular.module('appServices', []);

/*appServices.factory('apiService')*/

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

