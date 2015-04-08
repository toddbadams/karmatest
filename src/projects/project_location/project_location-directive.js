(function() {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsProjectLocation';

    /**
     * @ngdoc directive
     * @name lsAppointment
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The `<ls-project-location>` directive displays
     *
     * @usage
     * <hljs lang="html">
     * <ls-appointments-overview/>
     * </hljs>
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);


    directive.$inject = ['lsMap'];

    function directive(lsMap) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            // require: 'ngModel',
            templateUrl: '/src/projects/project_location/project_location.html',
            link: link
        };


        function link(scope, element, attrs, ngModel) {
            var el = document.getElementById('project-location-map'),
                _map = lsMap.initialize(el, 42.086817, -71.397054, 15, 'Fred Flinstone', '27 School St. <br/> Franklin, MA 02038');
        }
    }
})();
