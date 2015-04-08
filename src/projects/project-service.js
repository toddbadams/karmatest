(function (angular) {
    'use strict';

    var _serviceId = 'lsProjects';
    /**
     * @ngdoc factory
     * @name lsProjects
     * @module ls
     *
     * @description
     * Web api interface and business logic for projects.
     *
     */
    angular.module('ls')
        .factory(_serviceId, projectService);

    projectService.$inject = ['lsApi'];
    function projectService(api) {
        var
            // web api to projects
            _projectsApi = api.projects(),
            // number of projects to display per row
            _projectPerRow = 4,
            // project page view model
            _projectPageVm = {
                selected: null,
                title: 'Projects',
                projects: api.emptyPage()
            },
            // returned service 
            _service = {
                projectSelectHandler: projectSelectHandler,
                projectsPage: projectsPage
            };

        function activate() {
            //inital start/limit  todo move to provider
            _projectPageVm.projects.start = 0;
            _projectPageVm.projects.limit = 10;

            _projectsApi.page(_projectPageVm.projects)
               .then(success);

            function success(data) {
                _projectPageVm.projects = pagedToRows(data, _projectPerRow);
            }
        }

        function pagedToRows(page, perRow) {
            var _i, _j, _l = page.list.length;

            page.rows = [];
            for (_i = 0; _i < _l; _i += perRow) {
                var _row = [];
                for (_j = 0; _j < perRow && _i+_j<_l; _j += 1) {
                    _row.push(page.list[_i+_j]);
                }
                page.rows.push(_row);
            }
            return page;
        }

        function projectSelectHandler(id) {
            _projectsApi.single(id)
                .then(success);

            function success(data) {
                _projectPageVm.selected = data;
            }
        }

        function projectsPage() {
            return _projectPageVm;
        }

        activate();

        return _service;
    }
})(angular);
