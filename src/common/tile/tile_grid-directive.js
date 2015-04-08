(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsTileGrid';

    /**
     * @ngdoc directive
     * @name lsTileGrid
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-tile-grid>' display a grid of tiles.
     *
     * @usage
     * <hljs lang="html">
     * <ls-tile-grid>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = ['lsTileService'];

    function directive(lsTileService) {
        return {
            restrict: 'E',
            compile: lsTileService.compile
        };
    }
})(angular);
