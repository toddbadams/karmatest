(function() {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsAppointmentDetail';

    /**
     * @ngdoc directive
     * @name lsAppointmentDetail
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The `<ls-appointment-detail>` directive displays a overview of the users' appointments
     */
    angular.module(_moduleId)
        .directive(_directiveId, directive);

    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/src/appointments/appointment_detail/appointment_detail.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the detail is the first child element
            var _el = element[0].children[0];

            _el.style.height = (window.outerHeight - 260) + 'px';

            window.onresize = function() {
                _el.style.height = (window.outerHeight - 260) + 'px';
            };
        }
    }
})();
