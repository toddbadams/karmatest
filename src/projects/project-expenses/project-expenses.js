/**
 * @ngdoc directive
 * @name lsProjectExpenses
 * @module ls.projects
 *
 * @restrict E
 *
 * @description
 * The `<ls-project-expenses>` directive displays and edits a set of expenses for a project.
 *   Expenses are always associated with an appointment, however appointments are associated
 *   with a project, so they can be aggregated under a project.
 *
 *   The expenses model is a Paged of type AppointmentExpense
 *
 * @usage
 * <hljs lang="html">
 * <ls-project-expenses data-ng-model="expenses"/>
 * </hljs>
 */
angular.module('ls')
  .directive('lsProjectExpenses', lsProjectExpensesDirective);

lsProjectExpensesDirective.$inject = [];
function lsProjectExpensesDirective() {
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        templateUrl: '/js/app/projects/project-expenses/project-expenses.html',
        link: lsProjectExpensesDirectiveLink
    };


    function lsProjectExpensesDirectiveLink(scope, element, attrs, ngModel) {
        // todo: For each expense - edit, delete, view

        // todo: Add a expense
    }
}
