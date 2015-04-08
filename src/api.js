(function(angular) {
    'use strict';

    /**
     * @ngdoc service
     * @name lsApi
     * @module ls
     *
     * @description
     * Web api interface.
     *
     */
    angular.module('ls')
        .factory('lsApi', lsApi);

    lsApi.$inject = ['Restangular'];

    function lsApi(restangular, lsTasksApi) {
        var _service = {
                tasks : lsTasksApi
        };

        // todo add token filtering for api

        return _service;
    }

})(angular);
