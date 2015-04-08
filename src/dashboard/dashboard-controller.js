(function (angular) {
    'use strict';

    /**
 * @ngdoc module
 * @name ls.pages.dashboard
 * @description
 * metric module
 *
 *  displays the current user's dashboard page
 *
 *
 */

    angular.module('ls')
        .controller('lsdashboard', controller);

    controller.$inject = ['$scope', 'lsAppointmentsService'];

    function controller($scope, appointmentsService) {
        var vm = this;
        // todo move to appointmentsService
        vm.overview = {
            start: 0,
            limit: 0,
            total: 3,
            flexWidth: 33,
            list: [
                {
                    title: 'Today',
                    value: '-'
                },
                {
                    title: 'This week',
                    value: '-'
                },
                {
                    title: 'This month',
                    value: '-'
                }
            ]
        };

        activate();

        function activate() {
            // get appointment overview
            appointmentsService.getOverviewAsync()
                .then(success);

            function success(data) {
                vm.overview = data;
            }

        }

    }

})(angular);