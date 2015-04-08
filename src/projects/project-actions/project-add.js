/**
 * @ngdoc directive
 * @name lsProjectAdd
 * @module ls.projects
 *
 * @restrict A
 *
 * @description
 * The `ls-project-add` attribute to place 'add a project' functionality on a dom element.
 *
 * @usage
 * <hljs lang="html">
 * <button ls-project-add />
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectAdd', lsProjectAddDirective);

lsProjectAddDirective.$inject = [];
function lsProjectAddDirective() {
    return {
        restrict: 'A',
        link: lsProjectAddDirectiveLink
    };


    function lsProjectAddDirectiveLink(scope, element, attrs, ngModel) {
        // todo: run the project service add method
    }
}
