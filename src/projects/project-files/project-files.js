/**
 * @ngdoc directive
 * @name lsProjectFiles
 * @module ls.projects
 *
 * @restrict E
 *
 * @description
 * The `<ls-project-files>` directive displays and edits a set of files for a project.
 *   Files are always associated with an appointment, however appointments are associated
 *   with a project, so they can be aggregated under a project.
 *
 *   The files model is a Paged of type AppointmentFile
 *
 * @usage
 * <hljs lang="html">
 * <ls-project-files data-ng-model="files"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectFiles', lsProjectFilesDirective);


lsProjectFilesDirective.$inject = [];
function lsProjectFilesDirective() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: '/js/app/projects/project-files/project-files.html',
        link: lsProjectFilesDirectiveLink
    };


    function lsProjectFilesDirectiveLink(scope, element, attrs, ngModel) {

        // todo: For each file - edit, delete, view

        // todo: Add a file
    }
}
