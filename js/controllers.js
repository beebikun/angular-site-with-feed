'use strict';

function MasterController($scope, instagramService) {
    $scope.feedCls = ''

    $scope.$on('setFeedCls', function(e, val){
        $scope.feedCls = val ? 'showDetail' : ''
    });


}