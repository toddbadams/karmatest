(function(angular) {
    'use strict';

    var _lsDateService;

    /**
     * @ngdoc service
     * @name ls.service:lsTaskModel
     *
     * @description
     * Creates a task models from objects.
     *
     */
    angular.module('ls.tasks.models',[])
    .factory('lsTaskModel', factory);

    factory.$inject = ['lsModelsBase', 'lsDateService'];

    function factory(lsModelsBase, lsDateService) {
        var _service = {
            create: create,
            createArrayFromApi: createArrayFromApi
        };

        _lsDateService = lsDateService;

        /**
         * convert incomming data from API to an array of Task
         * @param  {Array} arr array of objects
         * @return {Array}     array of Task
         */
        function createArrayFromApi(arr, updateMethods) {
            return lsModelsBase.createModelArray(arr, createModelFromApi, updateMethods);
        }

        /**
         * convert incomming data from API to an appointment task model
         * @param  {object} data      incomming data from API
         * @return {Task}      an appointment task model
         */
        function createModelFromApi(data, updateMethods) {
            var _m = new Task();

            _m.id = data.id;
            _m.appointmentId = data.appointmentId;
            _m.description = data.description;
            _m.editDescription = _m.description;
            _m.entered = data.entered;
            _m.enteredBy = data.enteredBy;
            _m.completed = data.completed ? data.completed : false;
            _m.completedBy = data.completedBy ? data.completedBy : null;
            updateStatus(_m);
            return _m;
        }


        function create(appointmentId, entered, enteredBy, description, updateMethods) {
            return createModelFromApi({
                id: null,
                appointmentId: appointmentId,
                description: description,
                entered: entered,
                enteredBy: enteredBy
            }, updateMethods);
        }


        return _service;
    }

    function Task() {
        // id - GUID
        this.id = '';

        // appointmentId - GUID of the parent appointment
        this.appointmentId = 0;

        // description - A 512 character text describing the task
        this.description = '';

        // editDescription - stores the description while editing
        this.editDescription = '';

        // entered - A Unix time stamp when task was added
        this.entered = 0;

        // enteredBy - the full name of the user who entered the task
        this.enteredBy = '';

        // completedDate - A Unix timestamp when complete (null if not complete)
        this.completedDate = null;

        // completed - true if task is complete
        this.completed = false;

        //completedBy - the full name of the user who completed the task
        this.completedBy = '';

        // status  - a status message “entered {enter date} by {entered user},
        //           completed on {complete date } by {complete date}”
        this.status = '';
    }

    Task.prototype.setComplete = function(date, by) {
        var _self = this;
        _self.completedDate = date;
        _self.completedBy = by;
        _self.completed = true;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setIncomplete = function() {
        var _self = this;
        _self.completedDate = null;
        _self.completedBy = null;
        _self.completed = false;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setDescription = function() {
        var _self = this;
        _self.description = _self.editDescription;
        updateStatus(_self);
        return this;
    };

    Task.prototype.setColor = function(color) {
        var _self = this;
        _self.color = 'ls-background-' + color;
        updateStatus(_self);
        return this;
    };

    Task.prototype.unsetDescription = function() {
        var _self = this;
        _self.editDescription = _self.description;
        updateStatus(_self);
        return this;
    };

    function updateStatus(task) {
        task.status = 'entered on ' +
            _lsDateService.formattedDate(task.entered) +
            ' by ' +
            task.enteredBy;
        if (task.completedDate) {
            task.status += ', completed on ' +
                _lsDateService.formattedDate(task.completedDate) +
                ' by ' +
                task.completedBy;
        }
    }
})(angular);
