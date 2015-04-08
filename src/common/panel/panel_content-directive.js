(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsPanelContent';

    /**
     * @ngdoc directive
     * @name ls-panel-content
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-panel>' display a panel's content.
     *
     * @usage
     * <hljs lang="html">
     * <ls-panel-content title="panel foo">
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="ls-content" data-ng-transclude></div>'
        };
    }
})(angular);
