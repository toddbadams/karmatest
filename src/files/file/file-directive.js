(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ls.directive:lsFile
     * @restrict E
     *
     * @description
     * Displays and edits a file
     *
     */
    angular.module('ls').directive('lsFile', directive);
    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            require: 'ngModel',
            template: '<div>' +
                '<ls-view-file ng-if="isViewVisible"></ls-view-file>' +
                '<ls-edit-file ng-if="isEditVisible"></ls-edit-file>' +
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
     * @name ls.directive:lsViewFile
     * @restrict E
     *
     * @description
     * Displays a file
     *
     */
    angular.module('ls').directive('lsViewFile', viewDirective);
    directive.$inject = ['$mdSidenav', '$mdDialog', 'lsDateService'];

    function viewDirective($mdSidenav, $mdDialog, lsDateService) {
        return {
            restrict: 'E',
            scope: false,
            templateUrl: '/src/files/file/view_file.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the file model
            var _file = scope.ngModel.$modelValue;
            scope.openMenu = openMenu;
            scope.editFile = editFile;
            scope.showDeleteConfirm = showDeleteConfirm;
            scope.updating = false;

            /**
             * edit this file
             */
            function editFile() {
                $mdSidenav('right').close();
                scope.$parent.isViewVisible = false;
                scope.$parent.isEditVisible = true;
            }

            /**
             * delete this file
             */
            function showDeleteConfirm(ev) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete this file?')
                    .content(_file.description)
                    .ariaLabel('delete this file?')
                    .ok('Please do')
                    .cancel('Cancel')
                    .targetEvent(ev);

                $mdDialog.show(confirm).then(deleteFile);

                function deleteFile() {
                    scope.updating = true;
                    _file.deleteAsync();
                }
            }

            function openMenu() {
                $mdSidenav('right').toggle();
            }
        }
    }

    /**
     * @ngdoc directive
     * @name ls.directive:lsEditFile
     * @restrict E
     *
     * @description
     * Edits a file
     */
    angular.module('ls').directive('lsEditFile', editDirective);
    directive.$inject = [];

    function editDirective() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            templateUrl: '/src/files/file/edit_file.html',
            link: link
        };

        function link(scope, element, attrs) {
            // the file model
            var _file = scope.ngModel.$modelValue;


            scope.saveEditFile = function() {
                scope.updating = true;
                _file.updateDescriptionAsync()
                    .then(function() {
                        scope.updating = false;
                        scope.$parent.isViewVisible = true;
                        scope.$parent.isEditVisible = false;
                    });
            };

            scope.cancelEditFile = function() {
                _file.unsetDescription();
                scope.$parent.isViewVisible = true;
                scope.$parent.isEditVisible = false;
            };
        }
    }
})();
