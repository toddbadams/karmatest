(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsProjectSummary';

    /**
     * @ngdoc directive
     * @name lsTile
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-project-summary>' display a readonly project summary.
     *
     * @usage
     * <hljs lang="html">
     * <ls-tile>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = ['$window'];

    function directive($window) {
        return {
            restrict: 'E',
            template: '<md-item-content>'+
            '<div class="ls-date">{{::item.date | date}}</div>'+
            '<div class="ls-code">{{::item.code}}</div>'+
            '<div class="ls-name">{{::item.name}}</div>'+
            '</md-item-content>'
        };


    }
})(angular);
