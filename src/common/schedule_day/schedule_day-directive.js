(function(angular) {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsScheduleDay';

    /**
     * @ngdoc directive
     * @name lsScheduleDay
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The '<ls-schedule-day>' display a day schedule.
     *
     * @usage
     * <hljs lang="html">
     * <ls-schedule-day>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = ['lsScheduleService'];

    function directive(lsScheduleService) {
        return {
            restrict: 'E',
            scope: true,
            compile: lsScheduleService.compileDay
        };
    }
})(angular);
