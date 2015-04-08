(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsPanelHeader';

    /**
     * @ngdoc directive
     * @name ls-panel-header
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-panel>' display a panel's header.
     *
     * @usage
     * <hljs lang="html">
     * <ls-panel-header title="panel foo">
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
            template: '<header class="header">' +
                '<h2>{{::title}}</h2>' +
                '<div data-ng-transclude></div>' +
                '</header>',
            link: link
        };

        function link(scope, element, attrs) {
            scope.title = attrs.title;

        }
    }
})(angular);
