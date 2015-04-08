(function (angular) {
    'use strict';

    var _directiveId = 'lsProjectSelect';

    /**
 * @ngdoc directive
 * @name lsProjectSelect
 * @module ls
 *
 * @restrict A
 *
 * @description
 * The `ls-project-select` attribute to select a single project from within a list. 
 * This displays the project details...
 * 
 * @usage
 * <hljs lang="html">
 * <button ls-project-select />
 * </hljs>
 */
    angular.module('ls')
        .directive(_directiveId, lsProjectAddDirective);

    lsProjectAddDirective.$inject = ['lsProjects'];
    function lsProjectAddDirective(projectService) {

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            element[0].onclick = function() {
                projectService.projectSelectHandler(attrs[_directiveId]);
            };
        }
    }
})(angular);
