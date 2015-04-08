(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ls.service:lsNoteModel
     *
     * @description
     * Creates a note models from objects.
     *
     */
    angular.module('ls').factory('lsNoteModel', factory);
    factory.$inject = ['$timeout', 'lsModelsBase', 'lsDateService'];

    function factory($timeout, lsModelsBase, lsDateService) {
        var _service = {
            create: create,
            createArrayFromApi: createArrayFromApi
        };

        /**
         * convert incomming data from API to an array of Note
         * @param  {Array} arr array of objects
         * @return {Array}     array of Note
         */
        function createArrayFromApi(arr, updateMethods) {
            return lsModelsBase.createModelArray(arr, createModelFromApi, updateMethods);
        }


        /**
         * convert incomming data from API to an appointment note model
         * @param  {object} data      incomming data from API
         * @return {Note}      an appointment note model
         */
        function createModelFromApi(data, updateMethods) {
            var _m = new Note();

            _m.id = data.id;
            _m.appointmentId = data.appointmentId;
            _m.note = data.note;
            _m.editNote = _m.note;
            _m.entered = data.entered;
            _m.enteredBy = data.enteredBy;
            _m.status = 'entered on ' + moment.unix(_m.entered).format('MMM D YYYY') + ' by ' + _m.enteredBy;
            _m.updateNoteAsync = function(note) {
                return updateMethods.updateNoteAsync(_m, note);
            };
            _m.deleteAsync = function() {
                return updateMethods.deleteAsync(_m.id);
            };
            _m.colorRedAsync = function() {
                return updateMethods.colorRedAsync(_m);
            };
            _m.colorGreenAsync = function() {
                return updateMethods.colorGreenAsync(_m);
            };
            _m.colorBlueAsync = function() {
                return updateMethods.colorBlueAsync(_m);
            };
            return _m;
        }


        function create(appointmentId, entered, enteredBy, note, updateMethods) {
            return createModelFromApi({
                id: null,
                appointmentId: appointmentId,
                note: note,
                entered: entered,
                enteredBy: enteredBy
            }, updateMethods);
        }

        function Note() {
            // id - GUID
            this.id = '';

            // appointmentId - GUID of the parent appointment
            this.appointmentId = 0;

            // note - A 512 character not describing the note
            this.note = '';

            // editNote - stores the note while editing
            this.editNote = '';

            // entered - A Unix time stamp when note was added
            this.entered = 0;

            // enteredBy - the full name of the user who entered the note
            this.enteredBy = '';

            // status  - a status message “entered {enter date} by {entered user},
            //           completed on {complete date } by {complete date}”
            this.status = '';

            // async method to update this note's note
            this.updateNoteAsync = null;

            // async method to delete this note
            this.deleteAsync = null;
        }

        Note.prototype.setNote = function() {
            var _self = this;
            _self.note = _self.editNote;
            updateStatus(_self);
            return this;
        };

        Note.prototype.setColor = function(color) {
            var _self = this;
            _self.note = _self.editNote;
            _self.color = 'ls-background-' + color;
            updateStatus(_self);
            return this;
        };

        Note.prototype.unsetNote = function() {
            var _self = this;
            _self.editNote = _self.note;
            updateStatus(_self);
            return this;
        };

        function updateStatus(note) {
            note.status = 'entered on ' +
                lsDateService.formattedDate(note.entered) +
                ' by ' +
                note.enteredBy;
        }

        return _service;
    }
})(angular);
