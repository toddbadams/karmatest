/**
 * @ngdoc directive
 * @name lsProjectTasks
 * @module ls.projects
 *
 * @restrict E
 *
 * @description
 * The `<ls-project-tasks>` directive displays and edits a set of tasks for a project.
 *   Tasks are always associated with an appointment, however appointments are associated
 *   with a project, so they can be aggregated under a project.
 *
 *   The tasks model is a Paged of type AppointmentTask
 *
 * @usage
 * <hljs lang="html">
 * <ls-project-tasks data-ng-model="tasks"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectTasks', lsProjectTasksDirective);

lsProjectTasksDirective.$inject = [];
function lsProjectTasksDirective() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: '/js/app/projects/project-tasks/project-tasks.html',
        link: lsProjectTasksDirectiveLink
    };


    function lsProjectTasksDirectiveLink(scope, element, attrs, ngModel) {
        // todo: For each task - edit, delete, view

        // todo: Add a task
    }
}
