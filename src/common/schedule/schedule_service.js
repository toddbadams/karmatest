(function(angular, moment) {
    'use strict';

    var _moduleId = 'ls',
        _serviceId = 'lsScheduleService';

    /**
     * @ngdoc factory
     * @name lsScheduleService
     * @module ls
     *
     * @description
     * A service for schedule functionality
     *
     */
    angular.module(_moduleId)
        .factory(_serviceId, factory);

    factory.$inject = ['$window'];

    function factory($window) {
        var _service = {
                compileDay: compileDay,
                linkDay: linkDay
            },

            _svgNS = 'http://www.w3.org/2000/svg';

        /**
         * edit the dom element for a schedule day element
         * @param  {Element} element The DOM element to alter
         * @param  {Array} attrs   An array of attributes on the DOM element
         * @return {function}         A link function which links the scope (namespace) to an element
         */
        function compileDay(element, attrs) {
            var _el = element[0],
                _w = _el.offsetWidth,
                _h = _el.offsetHeight,
                _svg = document.createElementNS(_svgNS, 'svg');

            //_svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            //_svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            _svg.setAttributeNS(null, 'width', _w + 'px');
            _svg.setAttributeNS(null, 'height', 380 + 'px');
            _el.classList.add('ls-schedule-day');
            _el.appendChild(_svg);



            return linkDay;
        }

        // _g.appendChild(drawHour(25, _w, 0, '08:00 am'));

        function linkDay(scope, element, attrs) {
            var _el = element[0],
                _svg = _el.children[0],
                _appointments = getFromParentScope(scope, attrs.appointments);

            _svg.appendChild(drawDay(_appointments, _el.offsetWidth, 25));


            // redraw window resize;
            $window.onresize = function() {
                _svg.innerHTML = '';
                _svg.setAttributeNS(null, 'width', _el.offsetWidth + 'px');
                _svg.setAttributeNS(null, 'height', _el.offsetHeight + 'px');
                _svg.appendChild(drawDay(_appointments, _el.offsetWidth, 25));
            };
        }

        function drawDay(appointments, width, lineHeight) {
            var _range = getAppointmentStartRange(appointments),
                _i = _range.min,
                _j = 0,
                _l = appointments.length,
                _g = document.createElementNS(_svgNS, 'g'),
                _hours = [],
                _ymin = 0,
                _ymax = Number.MIN_VALUE,
                _tmin = _range.min,
                _tmax = Number.MIN_VALUE;

            // draw the hours
            while (_i < _range.max) {
                var label = moment.unix(_i).format('h:mm a');
                _g.appendChild(drawHour(lineHeight, width, lineHeight * _j, label));
                _ymax = lineHeight * _j;
                _j += 2;
                _tmax = _i;
                _i += 3600;
            }

            // draw the appointments
            for (_i = 0; _i < _l; _i += 1) {
                var _s = linearScale(appointments[_i].start, _tmin, _tmax, _ymin, _ymax),
                    _le = Math.floor(2 * lineHeight * appointments[_i].length / 3600);

                _g.appendChild(drawAppointment(lineHeight, width, _s, _le, appointments[_i].isSelected));
            }
            return _g;
        }

        function getAppointmentStartRange(arr) {
            var _i, _l = arr.length,
                _min = Number.MAX_VALUE,
                _max = Number.MIN_VALUE,
                _hour = 3600;

            for (_i = 0; _i < _l; _i += 1) {
                if (arr[_i].start + arr[_i].length > _max) _max = arr[_i].start + arr[_i].length;
                if (arr[_i].start < _min) _min = arr[_i].start;
            }
            // less one hour, then floor to nearest hour
            _min = Math.floor((_min - _hour) / _hour) * _hour;
            // up one hour, then ceil to nearest hour
            _max = _max + _hour;
            return {
                min: _min,
                max: _max
            };
        }

        function placeAttributes(from, to) {
            var _i, _l = from.attributes.length;
            for (_i = 0; _i < _l; _i += 1) {
                to.setAttributeNS(null, from.attributes[_i].name, from.attributes[_i].value);
            }
        }

        /**
         * Draw a single hour
         * <g x="0" y="250">
         *   <text x="0" y="23">09:00 am</text>
         *   <line class="ls-hour" x1="0" y1="25" x2="240" y2="25" />
         *   <line class="ls-halfhour" x1="0" y1="100" x2="240" y2="50" />
         * </g>
         *
         * @return {[type]} [description]
         */
        function drawHour(lineHeight, width, y, label) {
            var _g = document.createElementNS(_svgNS, 'g'),
                _text = document.createElementNS(_svgNS, 'text'),
                _hour = document.createElementNS(_svgNS, 'line'),
                _halfHour = document.createElementNS(_svgNS, 'line');

            _text.setAttributeNS(null, 'x', 2);
            _text.setAttributeNS(null, 'y', lineHeight - 2);
            _text.innerHTML = label;

            _hour.classList.add('ls-hour');
            _hour.setAttributeNS(null, 'x1', 0);
            _hour.setAttributeNS(null, 'y1', lineHeight);
            _hour.setAttributeNS(null, 'x2', width - 1);
            _hour.setAttributeNS(null, 'y2', lineHeight);

            _halfHour.classList.add('ls-halfhour');
            _halfHour.setAttributeNS(null, 'x1', 0);
            _halfHour.setAttributeNS(null, 'y1', 2 * lineHeight);
            _halfHour.setAttributeNS(null, 'x2', width - 1);
            _halfHour.setAttributeNS(null, 'y2', 2 * lineHeight);

            _g.setAttribute('transform', 'translate(0,' + y + ')');

            _g.appendChild(_text);
            _g.appendChild(_hour);
            _g.appendChild(_halfHour);

            return _g;
        }

        /**
         * Draw a single appointment
         * <g>
         *   <rect class="ls-appointment-current" x="0" y="75" width="239" height="100" />
         *   <circle class="ls-appointment-start" cx="128" cy="75" r="12"></circle>
         *   <circle class="ls-appointment-end" cx="128" cy="175" r="12"> </circle>
         * </g>
         * @param  {Number}  lineHeight hieght in pixels between 1/2 hour increments
         * @param  {Number}  width      width in pixels of the schedule
         * @param  {Number}  start      start (y) in pixles of the appointment
         * @param  {Number}  length     length (y) in pixels of the appointment
         * @param  {Boolean} isSelected true if the appointment is currently selected
         * @return {Element}            DOM element
         */
        function drawAppointment(lineHeight, width, start, length, isSelected) {
            var _g = document.createElementNS(_svgNS, 'g'),
                _rect = document.createElementNS(_svgNS, 'rect');

            _rect.classList.add('ls-appointment' + (isSelected ? '-current' : ''));
            _rect.setAttributeNS(null, 'x', 0);
            _rect.setAttributeNS(null, 'y', 0);
            _rect.setAttributeNS(null, 'width', width);
            _rect.setAttributeNS(null, 'height', length);

            if (isSelected) {
                var _c1 = document.createElementNS(_svgNS, 'circle'),
                    _c2 = document.createElementNS(_svgNS, 'circle');

                _c1.classList.add('ls-appointment-start');
                _c1.setAttributeNS(null, 'cx', Math.floor(width / 2));
                _c1.setAttributeNS(null, 'cy', 0);
                _c1.setAttributeNS(null, 'r', 10);
                _g.appendChild(_c1);

                _c2.classList.add('ls-appointment-start');
                _c2.setAttributeNS(null, 'cx', Math.floor(width / 2));
                _c2.setAttributeNS(null, 'cy', length);
                _c2.setAttributeNS(null, 'r', 10);
                _g.appendChild(_c2);

            }


            _g.setAttribute('transform', 'translate(0,' + start + ')');
            _g.appendChild(_rect);
            return _g;
        }

        function linearScale(value, oldMin, oldMax, newMin, newMax) {
                return (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
            }
            /**
             * gets an object on a namespace
             * @param  {object} namespace the namespace to look for the object
             * @param  {string} name   the property name of the object
             * @return {object]}             the object found
             */
        function getFromParentScope(namespace, name) {
            var _arr = name.split('.'),
                _i, _l = _arr.length,
                _result = namespace;
            for (_i = 0; _i < _l; _i += 1) {
                _result = _result[_arr[_i]];
            }
            return _result;
        }

        return _service;
    }
})(angular, moment);
