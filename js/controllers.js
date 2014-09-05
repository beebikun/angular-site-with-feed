'use strict';

angular.module('app', [
    'appServices',
    'appDirectives',
    'ngRoute',
    'ngResource'
]);
/*angular.module('app', ['ngRoute']);
angular.module('app',['ngResource']);*/
//angular.module('app',['ngAnimate']);


function MasterController($scope, instagramService) {
    $scope.feedCls = ''

    $scope.$on('setFeedCls', function(e, val){
        $scope.feedCls = val ? 'showDetail' : ''
    });

}