(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsMenu';

    /**
     * @ngdoc directive
     * @name lsMenu
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-menu>' display an item as a menu with optional edit/delete actions.
     *
     * @usage
     * <hljs lang="html">
     * <ls-menu>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            transclude: true,
            template: '<ul class="ls-menu" data-ng-transclude>' +
                '</ul>',
            link: link
        };
        function link(scope, element, attrs, ngModelController) {
            window.menu = scope;

        }
    }
})(angular);

            window.menuitems = [];
