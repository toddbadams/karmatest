/**
 * @ngdoc directive
 * @name lsProjectmarkasactive
 * @module ls.projects
 *
 * @restrict A
 *
 * @description
 * The `ls-project-markasactive` attribute places 'mark project as active' functionality on a dom element.
 *
 * @usage
 * <hljs lang="html">
 * <button ls-project-markasactive data-ng-model="projectId"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectMarkasactive', lsProjectMarkasactiveDirective);

lsProjectMarkasactiveDirective.$inject = [];
function lsProjectMarkasactiveDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: lsProjectMarkasactiveDirectiveLink
    };


    function lsProjectMarkasactiveDirectiveLink(scope, element, attrs, ngModel) {
        // todo: pass the projectId on element click to project service for markasactive method
    }
}
