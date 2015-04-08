(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsNav';

    /**
     * @ngdoc directive
     * @name lsNav
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-nav>' display an item as a nav with optional edit/delete actions.
     *
     * @usage
     * <hljs lang="html">
     * <ls-nav>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = ['settings', 'lsMenuModelFactory'];

    function directive(settings, lsMenuModelFactory) {
        return {
            restrict: 'E',
            templateUrl: '/src/common/nav/nav.html',
            controller: controller
        };


        function controller($scope) {
            // get the routes, create the main menu, and place on scope
            $scope.main = lsMenuModelFactory.createFromRoute(settings.routes, 'main');
        }
    }
})(angular);
