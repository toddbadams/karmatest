(function(angular, chance) {
    'use strict';

    /**
     * @ngdoc service
     * @name lsUserActionsService
     * @module ls
     *
     * @description
     * Web api interface for user actions.
     *
     */
    angular.module('ls')
        .factory('lsUserActionsService', service);

    service.$inject = ['lsUserActionModel', 'lsUserActionCache'];

    function service(lsUserActionModel, cache) {
        var _service = {
                getUserAction: getUserAction
            },
            _updateMethods = {
                updateAsync: null
            },
            // todo: get this array from web service
            _actions = [{
                key: 'taskItemDelete',
                hasPermission: true,
                label: 'delete',
                tooltip: 'delete this task'
            }, {
                key: 'taskItemEdit',
                hasPermission: true,
                label: 'edit',
                tooltip: 'edit this task'
            }, {
                key: 'taskItemRed',
                hasPermission: true,
                label: 'red',
                tooltip: 'color this task red',
                cssClass: 'ls-red'
            }, {
                key: 'taskItemGreen',
                hasPermission: true,
                label: 'green',
                tooltip: 'color this task green',
                cssClass: 'ls-green'
            }, {
                key: 'taskItemBlue',
                hasPermission: true,
                label: 'blue',
                tooltip: 'color this task blue',
                cssClass: 'ls-blue'
            }, {
                key: 'noteItemDelete',
                hasPermission: true,
                label: 'delete',
                tooltip: 'delete this note'
            }, {
                key: 'noteItemEdit',
                hasPermission: true,
                label: 'edit',
                tooltip: 'edit this note'
            }, {
                key: 'noteItemRed',
                hasPermission: true,
                label: 'red',
                tooltip: 'color this note red'
            }, {
                key: 'noteItemGreen',
                hasPermission: true,
                label: 'green',
                tooltip: 'color this note green'
            }, {
                key: 'noteItemBlue',
                hasPermission: true,
                label: 'blue',
                tooltip: 'color this note blue'
            },];

        activate();

        function getUserAction(key) {
            return cache.getUserAction(key);
        }

        function activate() {
            var _arr = lsUserActionModel.createArrayFromApi(_actions);
            cache.setUserActions(_arr);
        }

        return _service;
    }
})(angular, chance);
