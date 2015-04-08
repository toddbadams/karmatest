(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsAppointment
     * @module ls
     *
     * @restrict E
     *
     * @description
     * The `<ls-appointment>` directive displays a overview of the users' appointments
     *
     * @usage
     * <hljs lang="html">
     * <ls-appointments-overview/>
     * </hljs>
     */
    angular.module('ls')
      .directive('lsAppointment', directive);

    directive.$inject = [];
    function directive() {
        return {
            restrict: 'E',
            replace: true,
        scope: false,
            templateUrl: 'src/appts/appt/appointment.html',
            link: link
        };


        function link(scope, element, attrs, ngModel) {
            scope.selectedView = 0;
            scope.tasks = [            ];
            scope.notes = [
                {
                    entered: 1418515200000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                },
                {
                    entered: 1418515200000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                },
                {
                    entered: 1418688000000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                },
                {
                    entered: 1418688000000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                },
                {
                    entered: 1418515200000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                },
                {
                    entered: 1418515200000,
                    note: '512 chacter notoe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eleifend accumsan nulla, quis tincidunt urna ullamcorper et. Nulla nec nulla lacus. Sed sem nibh, finibus interdum vulputate eu, molestie non purus. Interdums et malesuada fames ac antedolor est,  ipsum primis in faucibus. Nunc varius rutrum euismod. Integer dignissim, ipsum vel lacinia placerat, tortor enim imperdiet velit, eu feugiat eu feugiat leo lectus et arcu. Morbi dolor est, porttitor nec neque quis, ultricies rutrums.'
                }
            ];
        }
    }
})();
