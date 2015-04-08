(function(angular) {
    'use strict';

    /**
     * @ngdoc factory
     * @name lsUserActionCache
     * @module ls
     *
     * @description
     * A cache to store user action models during application lifecycle
     *
     */
    angular.module('ls')
        .factory('lsUserActionCache', factory);

    factory.$inject = [];

    function factory() {
        var _service = {
                getUserAction: getUserAction,
                setUserActions: setUserActions
            },
            _userActionsHash = {};

        /**
         * Get a single user action from cache
         * @param  {string} key a unique string key describing the user action
         * @return {UserAction}     a UserAction
         */
        function getUserAction(key) {
            return _userActionsHash[key];
        }

        /**
         * store passed user actions in cache
         * @param {UserAction} arr an array of UserAction
         */
        function setUserActions(arr) {
            var _i, _l = arr.length;
            for (_i = 0; _i < _l; _i += 1) {
                _userActionsHash[arr[_i].key] = arr[_i];
            }
        }

        return _service;
    }
})(angular);
