(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name lsTasksApi
     * @module ls
     *
     * @description
     * Web api interface for tasks.
     *
     */
    angular.module('ls')
        .factory('lsTasksApi', lsTasksApi);

    lsTasksApi.$inject = ['Restangular'];

    function lsTasksApi(restangular) {
        var _service = {
                getAsync: getAsync,
                createAsync : createAsync,
                markCompleteAsync: markCompleteAsync,
                markIncompleteAsync: markIncompleteAsync,
                updateNoteAsync: updateNoteAsync,
                deleteAsync: deleteAsync,
                colorAsync: colorAsync
        };

        function getAsync(filters) {
            return restangular.one('tasks').get(filters);
        }

        function createAsync(task) {
            return restangular.one('tasks').customPOST(task);
        }

        function markCompleteAsync(id, timestamp) {
            return restangular.one('tasks',id).customPUT({completed: timestamp});
        }

        function markIncompleteAsync(id) {
             return restangular.one('tasks',id).customPUT({completed: null});
        }

        function updateDescriptionAsync(id, description) {
             return restangular.one('tasks',id).customPUT({description: description});
        }

        function deleteAsync(id) {
             return restangular.one('tasks',id).remove();
        }

        function colorAsync(id, color) {
            return restangular.one('tasks',id).customPUT({color: color});
        }


        return _service;
    }

})(angular);
