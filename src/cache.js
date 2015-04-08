(function(angular) {
    'use strict';

    var
    // init to now  UNIX
        _selectedDate = 0,
        _selectedDateUnix = 0,
        _selectedProject = null,
        _selectedUser = null,
        _selectedAppt = null,
        _selectedAppts = null,
        _currentUser = null, // todo must have post sign in

        _projectHash = {},
        _appointmentHash = {},
        _usersHash = {},

        _api = null;

    /**
     * @ngdoc factory
     * @name lsCache
     * @module ls
     *
     * @description
     * A cache to store models during application lifecycle
     *
     */
    angular.module('ls')

    .service('lsCache', lsCacheService)
        .directive('lsAppointments', lsApptsDirective)
        .directive('lsSelectAppointment', lsSelectAppointmentDirective)
        .directive('lsSelectedDate', lsSelectedDateDirective)
        .directive('lsColorTask', lsColorTaskDirective);


    /**
     * Does an object with id exist in the hash table?
     * @param  {string} id   id of object to check
     * @param  {object} hash hash table to check
     * @return {boolean}     true if exists
     */
    function exists(id, hash) {
        return hash[id] !== undefined;
    }

    /**
     * remove an object from cache
     * @param  {object} obj   the object to remove
     * @param  {string} id    id of object to remove
     * @param  {object} hash  hash table to check
     * @param  {Array} cache array of objects
     */
    function remove(obj, id, hash, cache) {
        if (!exists(obj, hash)) return;
        cache.splice(hash[id], 1);
    }

    /**
     * add an object to cache
     * @param  {object} obj   the object to add
     * @param  {string} id    id of object to remove
     * @param  {object} hash  hash table to check
     * @param  {Array} cache array of objects
     */
    function add(obj, id, hash, cache) {
        remove(id, hash, cache);
        hash[id] = cache.length;
        cache.push(obj);
    }

    lsCacheService.$inject = ['lsTasksApi', 'lsFakeFactory'];

    function lsCacheService(lsTasksApi, lsFakeFactory) {

        // todo add some logic to pick correct service
        // make this a config run at app startup
        _api = lsFakeFactory;

        return _api;
    }

    function lsApptsDirective() {
        return {
            link: function(scope, element, attrs) {
                // place an array on the scope
                scope.appts = _selectedAppts;

                // plance on object on the scope for the currently selected appt
                scope.appt = _selectedAppt;
                // add a method on the scope to select an appointment
                scope.selectAppt = function(id) {
                    selectAppt(id);
                };
            }
        };
    }

    function lsSelectedDateDirective() {
        return {
            link: function(scope, element, attrs) {
                // place an array on the scope
                scope.selectedDate = _selectedDate;
                scope.selectedDateUnix = _selectedDateUnix;

                // add a method on the scope to select a date/time
                scope.selectDate = function(date) {
                    _selectedDate = date;
                    _selectedDateUnix = moment(date).unix();
                };

                // add a method on the scope to select a date/time
                scope.selectDateUnix = function(unix) {
                    _selectedDate = moment.unix(unix);
                    _selectedDateUnix = unix;
                };
            }
        };
    }

    function lsSelectAppointmentDirective() {
        return {
            link: function(scope, element, attrs) {
                elem.bind('click', function(ev) {
                    ev.stopPropagation();
                    _selectedAppt = _appointmentHash[attrs.lsSelectAppointment];
                });
            }
        };
    }

    function lsColorTaskDirective() {
        return {
            link: function(scope, element, attrs) {
                elem.bind('click', function(ev) {
                    ev.stopPropagation();
                    var _color = attrs.lsSelectColor,
                        _task = attrs.lsColorTask;

                    _api.tasks.colorAsync(_task.id, _color)
                        .then(success);

                    function success(data) {
                        _task.setComplete(data.date, data.by);
                    }
                });
            }
        };
    }


})(angular);
