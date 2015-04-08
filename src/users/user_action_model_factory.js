(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name ls.service:lsUserActionModel
     *
     * @description
     * Creates a task models from objects.
     *
     */
    angular.module('ls').factory('lsUserActionModel', factory);
    factory.$inject = ['lsModelsBase'];

    function factory(lsModelsBase) {
        var _service = {
            createArrayFromApi: createArrayFromApi
        };

        /**
         * convert incomming data from API to an array of UserAction
         * @param  {Array} arr array of objects
         * @return {Array}     array of UserAction
         */
        function createArrayFromApi(arr, updateMethods) {
            return lsModelsBase.createModelArray(arr, createModelFromApi, updateMethods);
        }

        /**
         * convert incomming data from API to an appointment task model
         * @param  {object} data      incomming data from API
         * @return {UserAction}      an appointment task model
         */
        function createModelFromApi(data, updateMethods) {
            var _m = new UserAction();

            _m.key = data.key;
            _m.hasPermission = data.hasPermission;
            _m.label = data.label;
            _m.tooltip = _m.tooltip;
            _m.updateAsync = function(note) {
                return updateMethods.updateNoteAsync(_m, note);
            };
            return _m;
        }

        function UserAction() {
            // key - a unique string key describing the user action
            this.key = '';

            // hasPermission - a boolean value, true indicates user has permission
            this.hasPermission = true;

            // label - the button label
            this.label = '';

            // tooltip - the button tooltip
            this.tooltip = '';
        }

        return _service;
    }
})(angular);
