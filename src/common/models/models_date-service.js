(function(angular, moment) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsDateService';

    /**
     * @ngdoc factory
     * @name lsDateService
     * @module ls
     *
     * @description
     * Mangages all date related functionality.
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = [];

    function factory() {
        var _service = {
                dateZero: function() {
                    return _dateZero;
                },
                formattedDate: formattedDate,
                firstDayOfMonth: firstDayOfMonth,
                lastDayOfMonth: lastDayOfMonth,
                firstDayOfWeek: firstDayOfWeek,
                lastDayOfWeek: lastDayOfWeek,
                now: now
            },

            // http://en.wikipedia.org/wiki/Date_and_time_notation_in_the_United_States
            //  todo: move to an API service
            _monthLabelFormat = 'MMM YYYY',
            _dateFormat = 'MMM D, YYYY', //basic civilian format
            _dayOfMonthFormat = 'Do',
            _apptStartDayFormat = 'dd',
            _apptStartTimeFormat = 'h:mm a',

            // unix date zero
            _dateZero = '1/1/1970';

        function now() {
            return moment().unix();
        }

        function formattedDate(unix) {
            return moment.unix(unix).format(_dateFormat);
        }

        function firstDayOfMonth(unix) {
            return moment.unix(unix).startOf('month').unix();
        }

        function lastDayOfMonth(unix) {
            return moment.unix(unix).endOf('month').unix();
        }

        function firstDayOfWeek(unix) {
            return moment.unix(unix).startOf('week').unix();
        }

        function lastDayOfWeek(unix) {
            return moment.unix(unix).endOf('week').unix();
        }



        return _service;
    }
})(angular, moment);
