/**
 * @ngdoc directive
 * @name lsProjectExport
 * @module ls.projects
 *
 * @restrict A
 *
 * @description
 * The `ls-project-export` attribute to place export of a project functionality on a dom element.
 *
 * @usage
 * <hljs lang="html">
 * <button ls-project-export data-ng-model="projectId"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectExport', lsProjectExportDirective);

lsProjectExportDirective.$inject = [];
function lsProjectExportDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: lsProjectExportDirectiveLink
    };


    function lsProjectExportDirectiveLink(scope, element, attrs, ngModel) {
        // todo: pass the projectId on element click to project service for export
    }
}
