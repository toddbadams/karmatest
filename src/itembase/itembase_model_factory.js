(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ls.service:lsItemBaseModel
     *
     * @description
     * Creates a itemBase models from objects.
     *
     */
    angular.module('ls').factory('lsItemBaseModel', factory);
    factory.$inject = ['lsDateService'];

    function factory(lsDateService) {
        var _service = {
            create: create
        };

        function ItemBase() {
            // id - GUID
            this.id = '';

            // appointmentId - GUID of the parent appointment
            this.appointmentId = 0;

            // note - A 512 character not describing the itemBase
            this.note = '';

            // editNote - stores the note while editing
            this.editNote = '';

            // entered - A Unix time stamp when itemBase was added
            this.entered = 0;

            // enteredBy - the full name of the user who entered the itemBase
            this.enteredBy = '';

            // status  - a status message “entered {enter date} by {entered user},
            //           completed on {complete date } by {complete date}”
            this.status = '';

            // async method to delete this itemBase
            this.deleteAsync = null;
        }

        ItemBase.prototype.setColor = function(color) {
            var _self = this;
            _self.note = _self.editNote;
            _self.color = 'ls-background-' + color;
            updateStatus(_self);
            return this;
        };

        function updateStatus(itemBase) {
            itemBase.status = 'entered on ' +
                lsDateService.formattedDate(itemBase.entered) +
                ' by ' +
                itemBase.enteredBy;
        }


        /**
         * convert incomming data from API to an appointment itemBase model
         * @param  {object} data      incomming data from API
         * @return {ItemBase}      an appointment itemBase model
         */
        function create(data, updateMethods) {
            var _m = new ItemBase();

            _m.id = data.id;
            _m.appointmentId = data.appointmentId;
            _m.note = data.note;
            _m.editNote = _m.note;
            _m.entered = data.entered;
            _m.enteredBy = data.enteredBy;
            _m.completed = data.completed ? data.completed : null;
            _m.completedBy = data.completedBy;
            _m.status = 'entered on ' + moment.unix(_m.entered).format('MMM D YYYY') + ' by ' + _m.enteredBy;
            _m.deleteAsync = function() {
                return updateMethods.deleteAsync(_m.id);
            };
            _m.colorAsync = function(color) {
                return updateMethods.colorAsync(_m, color);
            };
            return _m;
        }

        return _service;
    }
})(angular);
