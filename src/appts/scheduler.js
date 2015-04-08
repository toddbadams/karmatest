(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsTasks
     * @restrict E
     *
     * @description
     * Displays and edits a set of tasks
     *
     */
    angular.module('ls')

    .directive('lsScheduler', horzDayDirective)
        .directive('lsSchedulerV', vertDayDirective);

    horzDayDirective.$inject = [];

    function horzDayDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                mode: '=?',
                direction: '=?',
                date: '=?'
            },
            require: '?^ngModel',
            templateUrl: '/src/appts/scheduler_day_horizontal.html',
            link: link
        };

        function link(scope, element, attrs, ngModelCtrl) {
            var _dayEl = element[0].children[0].children[1];
            scope.hours = createHours();
            scope.quarters = createQuarters();
            scope.move = function(i) {
                var _v = getValueFromPixels(_dayEl.style.left) + 80 * i * -1;
                if (_v > 0) _v = 0;
                _dayEl.style.left = setPixels(_v);

            };
            scope.appt = null;

            scope.selectQuarterHour = function(q) {
                if (q.appt) scope.appt = q.appt;
            };

            scope.getStatusCss = function(appt) {
                if (appt) {
                    return 'ls-' + appt.status;
                }
                return '';
            };

            // Specify how UI should be updated
            ngModelCtrl.$render = function() {
                var appts = ngModelCtrl.$viewValue,
                    _i, _l = appts.length;
                for (_i = 0; _i < _l; _i += 1) {
                    clearQuartersCss(scope.quarters);
                    setApptCss(scope.quarters, appts[_i]);
                }
            };

        }
    }

    function getValueFromPixels(txt) {
        var _s = txt.replace('px', '');
        return _s.length === 0 ? 0 : parseInt(_s);
    }

    function setPixels(i) {
        return i + 'px';
    }

    function vertDayDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                mode: '=?',
                direction: '=?',
                date: '=?'
            },
            require: '?^ngModel',
            templateUrl: '/src/appts/scheduler_day_verticle.html',
            link: link
        };

        function link(scope, element, attrs, ngModelCtrl) {
            scope.hours = createHours();
            scope.quarters = createQuarters();
            scope.move = function(i) {
                var f = 12;
            };

            // Specify how UI should be updated
            ngModelCtrl.$render = function() {
                var appts = ngModelCtrl.$viewValue,
                    _i, _l = appts.length;
                for (_i = 0; _i < _l; _i += 1) {
                    clearQuartersCss(scope.quarters);
                    setApptCss(scope.quarters, appts[_i]);
                }
            };

        }
    }

    function createHours() {
        return [
            '12 am', '1 am', '2 am', '3 am', '4 am',
            '5 am', '6 am', '7 am', '8 am', '9 am',
            '10 am', '11 am', '12 pm', '1 pm', '2 pm',
            '3 pm', '4 pm', '5 pm', '6 pm', '7 pm',
            '8 pm', '9 pm', '10 pm', '11 pm'
        ];
    }

    function createQuarters() {
        var _i, _l = 96,
            _results = [];
        for (_i = 0; _i < _l; _i += 1) {
            var isHour = Math.floor(_i / 4) === _i / 4,
                isHalfHour = Math.floor(_i / 2) == _i / 2 && !isHour,
                _css = isHour ?
                'ls-hour' :
                isHalfHour ?
                'ls-halfhour' :
                '';


            _results.push({
                label: isHour ? getTimeLabel(_i) : '',
                tooltip: getTimeLabel(_i),
                css: _css
            });
        }
        return _results;
    }

    function getTimeLabel(i) {
        var _hour = Math.floor(i / 4),
            _min = Math.floor((i - _hour * 4)) * 15,
            _m = _hour > 11 ? 'pm' : 'am';

        if (_hour > 11) _hour -= 12;

        if (_hour === 0) _hour = 12;

        if (_min === 0) _min = '00';

        return _hour + ':' + _min + _m;
    }

    function clearQuartersCss(qrts) {
        var _i, _l = qrts.length;
        for (_i = 0; _i < _l; _i += 1) {
            qrts[_i].css = '';
            qrts[_i].apptId = null;
            qrts[_i].appt = null;
        }
    }

    function setApptCss(qrts, appt) {
        // moement get time of day
        var _d = moment.unix(appt.start),
            _hour = _d.hour(),
            _minute = Math.floor(_d.minute() / 15),
            _start = _hour * 4 + _minute,
            // length is given in seconds
            _end = _start + Math.floor(appt.length / (60 * 15)),
            _i;
        for (_i = _start; _i <= _end; _i += 1) {
            qrts[_i].css = 'ls-appt';
            qrts[_i].apptId = appt.id;
            qrts[_i].appt = appt;
        }

    }


})();
