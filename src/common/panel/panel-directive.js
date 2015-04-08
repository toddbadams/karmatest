(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsPanel';

    /**
     * @ngdoc directive
     * @name ls-panel
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-panel>' display a panel.
     *
     * @usage
     * <hljs lang="html">
     * <ls-panel>
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
            template: '<div class="ls-panel" data-ng-transclude></div>'
        };
    }
})(angular);
