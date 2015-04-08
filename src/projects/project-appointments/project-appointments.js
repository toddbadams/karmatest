/**
 * @ngdoc directive
 * @name lsProjectAppointments
 * @module ls.projects
 *
 * @restrict E
 *
 * @description
 * The `<ls-project-appointments>` directive displays and edits a set of appointments for a project.
 *
 *   The appointments model is a Paged of type Appointment
 *
 * @usage
 * <hljs lang="html">
 * <ls-project-appointments data-ng-model="appointments"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectAppointments', lsProjectAppointmentsDirective);


lsProjectAppointmentsDirective.$inject = [];
function lsProjectAppointmentsDirective() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: '/js/app/projects/project-appointments/project-appointments.html',
        link: lsProjectAppointmentsDirectiveLink
    };


    function lsProjectAppointmentsDirectiveLink(scope, element, attrs, ngModel) {

        // todo: For each appointment - edit, delete, view
        // todo: define business rules around deleting an appointment.

        // todo: Add an appointment
    }
}
