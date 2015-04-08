/**
 * @ngdoc directive
 * @name lsProjectDescription
 * @module ls.projects
 *
 * @restrict E
 *
 * @description
 * The `<ls-project-descriptions>` directive displays and edits a descriptions for a project.
 *   Description are limited to 2000 characters of plain text.
 *
 *   The descriptions model is a string
 *
 * @usage
 * <hljs lang="html">
 * <ls-project-descriptions data-ng-model="description"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectDescription', lsProjectDescriptionDirective);

lsProjectDescriptionDirective.$inject = [];
function lsProjectDescriptionDirective() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: '/js/app/projects/project-descriptions/project-descriptions.html',
        link: lsProjectDescriptionDirectiveLink
    };

    function lsProjectDescriptionDirectiveLink(scope, element, attrs, ngModel) {
        // todo: edit and view

        // todo: cancel and save buttons (link save button to the project service, update description method)
    }
}
