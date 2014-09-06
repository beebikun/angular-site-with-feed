'use strict';

function MasterController($scope) {
    $scope.feedCls = ''

    $scope.$on('setFeedCls', function(e, val){
        $scope.feedCls = val ? 'showDetail' : ''
    });
}
