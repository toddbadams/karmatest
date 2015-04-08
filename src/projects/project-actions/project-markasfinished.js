/**
 * @ngdoc directive
 * @name lsProjectmarkasfinished
 * @module ls.projects
 *
 * @restrict A
 *
 * @description
 * The `ls-project-markasfinished` attribute places 'mark project as finished' functionality on a dom element.
 *
 * @usage
 * <hljs lang="html">
 * <button ls-project-markasfinished data-ng-model="projectId"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectMarkasfinished', lsProjectMarkasfinishedDirective);

lsProjectMarkasfinishedDirective.$inject = [];
function lsProjectMarkasfinishedDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: lsProjectMarkasfinishedDirectiveLink
    };


    function lsProjectMarkasfinishedDirectiveLink(scope, element, attrs, ngModel) {
        // todo: pass the projectId on element click to project service for markasfinished method
    }
}
