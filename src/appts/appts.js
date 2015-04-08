(function(angular) {
    'use strict';
    var

        _apptStatus = ['hold', 'scheduled', 'onroute', 'inprogress', 'completed', 'paused'],

        // https://www.npmjs.com/package/gulp-remove-code
        // removeIf(production)
        _fakeTitles = ['Weather on AMX',
            'Install door station',
            'Driveway snow melt',
            'Pool Camera',
            'Water Fountain',
            'Activate Satellite',
            'Keypad down',
            'Home Theater Remote',
            'Terminate wallplate',
            'Line 2 Not working',
            'Drapes in living room',
            'Add radio stations',
        ],
        fakeTitle = function() {
            return _fakeTitles[chance.integer({
                min: 0,
                max: _fakeTitles.length - 1
            })];
        },
        _fakeDayProfile = [
            [{
                hour: 8,
                min: 0,
                length: 10800
            }],
            [{
                hour: 9,
                min: 0,
                length: 14400
            }],
            [{
                hour: 8,
                min: 0,
                length: 3600
            }, {
                hour: 11,
                min: 30,
                length: 7200
            }],
            [{
                hour: 8,
                min: 0,
                length: 7200
            }, {
                hour: 13,
                min: 30,
                length: 10800
            }]
        ],
        fakeDayProfile = function() {
            return _fakeDayProfile[chance.integer({
                min: 0,
                max: _fakeDayProfile.length - 1
            })];
        },
        // create an array of fake appointment objects
        fakeAppointments = function(date) {
            var _i = moment.unix(date),
                _results = [],
                _dow = _i.day();
            if (_dow > 0 && _dow < 7) {
                // get day profile
                var _d = fakeDayProfile(),
                    _j, _l = _d.length;
                for (_j = 0; _j < _l; _j += 1) {
                    _results.push(fakeAppointment(_i, _d[_j].hour, _d[_j].min, _d[_j].length));
                }
            }
            return _results;
        },
        // create a single fake appointment object
        fakeAppointment = function(date, hour, min, length) {
            return {
                id: chance.guid(),
                title: fakeTitle(),
                start: date.hour(hour).minute(min).unix(),
                length: length,
                shortUrl: 'apt.lincedge.com/' + chance.string({
                    length: 6
                }),
                projectId: chance.guid(),
                status: _apptStatus[chance.integer({
                    min: 0,
                    max: _apptStatus.length - 1
                })]
            };
        },
        //endRemoveIf(production)
        //

        /**
         * convert incomming data from API to an appointment model
         * @param  {object} data      incomming data from API
         * @return {Appointment}      an appointment model
         */
        appointmentModelFromObject = function(data) {
            var _project,
                _m = new Appointment();

            _m.id = data.id;
            _m.title = data.title;
            _m.shortUrl = data.shortUrl;
            _m.projectId = data.projectId;

            // set start and length (also formats)
            _m.setLength(data.length);
            _m.setStart(data.start);

            _m.status = data.status;

            // get the project from cache
            _project = lsCache.getProjectById(_m.projectId);
            if (_project) {
                _m.projectCode = _project.code;
                _m.projectTitle = _project.title;
                _m.addressFormatted = _project.addressFormatted();
                _m.latitude = _project.latitude;
                _m.longitude = _project.longitude;
                _m.contactNameFormmatted = _project.contactNameFormmatted();
            }
            return _m;
        };


    angular.module('ls')

    .constant('lsAppointmentConfig', {
        periodDay: 0,
        periodWeek: 1,
        periodMonth: 1,
        useFakes: true
    })

    .factory('lsAppts', lsApptsFactory)

   // .directive('appointments', lsApptsDirective)

    .controller('lsappointments', apptsController);




    /**
     * @ngdoc factory
     * @name lsApptCache
     * @module ls
     *
     * @description
     * A cache for appointments.
     *
     */
    lsApptsFactory.$inject = ['$q', 'lsAppointmentConfig'];

    function lsApptsFactory($q, lsAppointmentConfig) {
        var _service = {
            getApptsAsync: getApptsAsync,
        };

        function getApptsAsync(projectId, userId, date) {
            if (lsAppointmentConfig.useFakes) {
                return asPromise($q, fakeAppointments(date));
            }
        }
        return _service;
    }

    apptsController.$inject = ['$scope', 'lsAppts', 'lsDateService'];

    function apptsController($scope, lsAppts, lsDateService) {
        var _self = this;

        activate();

        function activate() {

            // appointments page is for current user only
            // so get userId from user service
            _self.userId = 'f0d8368d-85e2-54fb-73c4-2d60374295e3';

            // set date to now
            _self.selectedDate = new Date();
            _self.opened = false;
            _self.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                _self.opened = true;
            };

            // array of appointments for date
            _self.appts = [];

            // get initial appointments
            getAppointments();

            // watch for changes in the selected Date
            $scope.$watch(function() {
                return _self.selectedDate;
            }, function() {
                getAppointments();
            });

            window.foo = _self;
        }

        // get appointments for a  given date
        function getAppointments() {
            // all projects so set projectId to null
            lsAppts.getApptsAsync(null, _self.userId, _self.selectedDate)
                .then(success);

            function success(data) {
                _self.appts = data;
            }
        }
    }

    /**
     * A set of filters to apply in getting appointments from
     * a data source, such as web api
     */
    function AppointmentFilters() {
        // period  0-day, 1-week, 2-month
        //          over what period for returned appointments
        this.period = 0;

        // date LsDate - the selected date
        this.date = lsDateService.lsDate();

        // projectId - OPTIONAL.  the selected project
        //              if null, then all projects
        //              if not null, then only appts in the project
        this.projectId = null;

        // userId - Optional    the selected user
        //              if null, then all users (used on group scheduling)
        //              if not null, then only appts for the user
        this.userId = null;

        // todo: perhaps a groupId to indicate a group of users.

        return this;
    }


    function Appointment() {
        // id - GUID
        this.id = '';

        //title - The appointment's title 140 characters
        this.title = '';

        //start  -  A Unix timestamp (seconds since the Unix Epoch)
        this.start = 0;

        //length - Length of the appointment in seconds
        this.length = 0;

        //shortUrl - used to send the appointment to someone as a URL
        //this will be an unauthorized page
        this.shortUrl = '';

        //projectId - A GUID of the parent project
        this.projectId = 0;

        //projectCode - A code used by the user to identify the project
        this.projectCode = '';

        // projectTitle - The projects' title
        this.projectTitle = '';

        // addressFormatted - A string formatted version of the site address
        this.addressFormatted = '';

        // latitude - The location's latitude
        this.latitude = 0;

        // longitude - The location's longitude
        this.longitude = 0;

        // contactNameFormmatted - A string formatted version of the site contact full name
        this.contactNameFormmatted = '';

        //next - the next chronological appointment
        this.next = null;

        // prev - the previous chronological appointment
        this.prev = null;

        // selected - indicates if the appointment is the selected appointment (shown on screen)
        this.selected = false;

        // status - a text status
        this.status = 'hold';
    }

    /**
     * Set the start date of the appointment
     * @param {Number} start Unix date/time
     */
    Appointment.prototype.setStart = function(start) {
        this.start = start;
        this.formmattedDay = moment.unix(start).format(_apptStartDayFormat);
        this.formmattedTime = moment.unix(start).format(_apptStartTimeFormat);
    };

    /**
     * Set the length of the appointment
     * @param {Number} length length in seconds
     */
    Appointment.prototype.setLength = function(length) {
        this.length = length;
        this.formmattedLength = moment.duration(length, 'seconds').humanize();
    };

    /**
     * Returns true if the this appointment is in the range given
     * @param  {Number}  start Unix date/time
     * @param  {Number}  end   Unix date/time
     * @return {Boolean}       true if in range
     */
    Appointment.prototype.isInDateRange = function(start, end) {
        return this.start >= start && this.start <= end;
    };



    function asPromise($q, item) {
        var _q = $q.defer();
        _q.resolve(item);
        return _q.promise;
    }
})(angular);
