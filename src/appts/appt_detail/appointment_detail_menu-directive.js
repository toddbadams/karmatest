﻿(function () {
    'use strict';

    var _moduleId = 'ls',
        _directiveId = 'lsAppointmentDetailMenu';

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
            templateUrl: '/src/appointments/appointment_detail/appointment_detail_menu.html'
        };
    }
})();
