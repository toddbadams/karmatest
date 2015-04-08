(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name lsProjectsThisWeek
     * @module ls.appointments.overview
     *
     * @restrict E
     *
     * @description
     * The `<ls-projects-this-week>` directive displays a overview of the users' appointments
     *
     * @usage
     * <hljs lang="html">
     * <ls-appointments-overview/>
     * </hljs>
     */
    angular.module('ls')
      .directive('lsProjectsThisWeek', lsMetricDirective);


    lsMetricDirective.$inject = ['ls.core.pubsub'];
    function lsMetricDirective(pubsub) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            require: 'ngModel',
            templateUrl: '/js/app/appointments/appointments-overview/appointments-overview.html',
            link: lsMetricDirectiveLink
        };


        function lsMetricDirectiveLink(scope, element, attrs, ngModel) {
        }
    }
})();
