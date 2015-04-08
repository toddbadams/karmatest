(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsExpense
     * @restrict E
     *
     * @description
     * Displays and edits a expense
     *
     */
    angular.module('ls').directive('lsExpense', directive);
    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            require: 'ngModel',
            template: '<div>' +
                '<ls-view-expense ng-if="isViewVisible"></ls-view-expense>' +
                '<ls-edit-expense ng-if="isEditVisible"></ls-edit-expense>' +
                '</div>',
            link: link
        };

        function link(scope, element, attrs, ngModel) {
            scope.ngModel = ngModel;
            scope.isViewVisible = true;
            scope.isEditVisible = false;
            window.scope = scope;
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsViewExpense
     * @restrict E
     *
     * @description
     * Displays a expense
     *
     */
    angular.module('ls').directive('lsViewExpense', viewDirective);
    directive.$inject = ['$mdSidenav', '$mdDialog', 'lsDateService'];

    function viewDirective($mdSidenav, $mdDialog, lsDateService) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: '/src/expenses/expense/view_expense.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the expense model
            var _expense = scope.ngModel.$modelValue;
            scope.openMenu = openMenu;
            scope.editExpense = editExpense;
            scope.showDeleteConfirm = showDeleteConfirm;
            scope.updating = false;

            /**
             * edit this expense
             */
            function editExpense() {
                $mdSidenav('right').close();
                scope.$parent.isViewVisible = false;
                scope.$parent.isEditVisible = true;
            }

            /**
             * delete this expense
             */
            function showDeleteConfirm(ev) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this expense?')
                    .content(_expense.description)
                    .ariaLabel('delete this expense?')
                    .ok('Please do')
                    .cancel('Cancel')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(deleteExpense);

                function deleteExpense() {
                    scope.updating = true;
                    _expense.deleteAsync();
                }
            }

            function openMenu() {
                $mdSidenav('right').toggle();
            }
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsEditExpense
     * @restrict E
     *
     * @description
     * Edits a expense
     */
    angular.module('ls').directive('lsEditExpense', editDirective);
    directive.$inject = [];

    function editDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            templateUrl: '/src/expenses/expense/edit_expense.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the expense model
            var _expense = scope.ngModel.$modelValue;


            scope.saveEditExpense = function() {
                scope.updating = true;
                _expense.updateDescriptionAsync()
                    .then(function() {
                        scope.updating = false;
                        scope.$parent.isViewVisible = true;
                        scope.$parent.isEditVisible = false;
                    });
            };

            scope.cancelEditExpense = function() {
                _expense.unsetDescription();
                scope.$parent.isViewVisible = true;
                scope.$parent.isEditVisible = false;
            };
        }
    }
})();
