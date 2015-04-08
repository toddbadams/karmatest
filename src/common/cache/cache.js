(function(angular) {
    'use strict';

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
        .factory('lsCache', factory);

    factory.$inject = [];

    function factory() {
        var _service = {
                addProjects: addProjects,
                getProjects: getProjects,
                getProjectById: getProjectById,
                addAppointments: addAppointments,
                addAppointment: addAppointment,
                getAppointments: getAppointments,
                getAppointmentById: getAppointmentById,
                getUser: getUser,
                getUserAction: getUserAction,
                setUserActions: setUserActions
            },
            _projects = [],
            _projectHash = {},
            _appointments = [],
            _appointmentHash = {},
            _user = {
                locale: 'usaec',
                clientId: '1234'
            },
            _userActionsHash = {};

        function getUser() {
            return _user;
        }

        function getUserAction(key) {
            return _userActionsHash[key];
        }

        function setUserActions(arr){
            var _i, _l = arr.length;
            for (_i = 0; _i < _l; _i += 1) {
                _userActionsHash(arr[_i]);
            }
        }

        /**
         * get all appointments
         * @return {Appointment} an array of appointments
         */
        function getAppointments() {
            return _appointments;
        }

        /**
         * Get a specific appointment by Id
         * @param  {string} id id of the appointment
         * @return {Appointment}    the appointment
         */
        function getAppointmentById(id) {
            return _appointments[_appointmentHash[id]];
        }

        /**
         * Add an array of appointments into cache
         * @param {Appointment} arr an array of appointments
         */
        function addAppointments(arr) {
            var _i, _l = arr.length;
            for (_i = 0; _i < _l; _i += 1) {
                addAppointment(arr[_i]);
            }
        }


        /**
         * Add an array of appointments into cache
         * @param {Appointment} arr an array of appointments
         */
        function addAppointment(model) {
            add(model, model.id, _appointmentHash, _appointments);
        }


        /**
         * Add an array of projects into cache
         * @param {Project} arr an array of projects
         */
        function addProjects(arr) {
            var _i, _l = arr.length;
            for (_i = 0; _i < _l; _i += 1) {
                add(arr[_i], arr[_i].id, _projectHash, _projects);
            }
            // todo:merge any existing projects with incomming
            _projects.splice(arr);
        }

        /**
         * get all projects
         * @return {Project} an array of projects
         */
        function getProjects() {
            return _projects;
        }

        /**
         * Get a specific project by Id
         * @param  {string} id id of the project
         * @return {Project}    the project
         */
        function getProjectById(id) {
            return _projects[_projectHash[id]];
        }

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

        return _service;
    }
})(angular);
